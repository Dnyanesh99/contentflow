import { z } from "zod";
import ivm from "isolated-vm";

const CustomCodeSchema = z.object({
  code: z.string().default("function transform(input) { return input; }"),
});

export const handleCustomCode = async (
  nodeData: Record<string, unknown>,
  context: Record<string, unknown>,
) => {
  console.log("[DAG] Executing Custom.Code action");

  const parseResult = CustomCodeSchema.safeParse(nodeData || {});
  if (!parseResult.success) {
    throw new Error(
      `Custom node configuration error: ${parseResult.error.message}`,
    );
  }

  const { code } = parseResult.data;

  try {
    const isolate = new ivm.Isolate({ memoryLimit: 128 });
    const ivmContext = await isolate.createContext();

    const userFunc = await ivmContext.eval(`(${code})`, { reference: true });

    if (userFunc.typeof !== "function") {
      userFunc.release();
      isolate.dispose();
      throw new Error("Custom code must define a function.");
    }

    const result = await userFunc.apply(
      undefined,
      [new ivm.ExternalCopy(context).copyInto()],
      {
        result: { copy: true, promise: true },
        timeout: 5000,
      },
    );

    userFunc.release();
    ivmContext.release();
    isolate.dispose();

    console.log(`[DAG] Custom.Code completed successfully`);

    return {
      result,
      output: result,
    };
  } catch (err: any) {
    throw new Error(`Custom Logic Error: ${err.message || String(err)}`, { cause: err });
  }
};

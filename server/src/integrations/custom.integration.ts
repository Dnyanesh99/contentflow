import { z } from "zod";
import vm from "vm";

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
    const script = new vm.Script(`(${code})`);
    const userFunc = script.runInNewContext({}, { timeout: 5000 });

    if (typeof userFunc !== "function") {
      throw new Error("Custom code must define a function.");
    }

    const result = await userFunc(context);

    console.log(`[DAG] Custom.Code completed successfully`);

    return {
      result,
      output: result,
    };
  } catch (err: any) {
    throw new Error(`Custom Logic Error: ${err.message || String(err)}`, { cause: err });
  }
};

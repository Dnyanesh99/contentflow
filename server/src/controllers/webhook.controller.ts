import { Request, Response, NextFunction } from "express";
import { randomUUID } from "crypto";
import { enqueueWorkflowJob } from "../queue/producer.js";
import { ContentfulPayloadSchema } from "../schemas/webhook.schema.js";

export const createWebhookController = () => {
  const handleContentfulWebhook = async (
    req: Request,
    res: Response,
    next: NextFunction,
  ): Promise<void> => {
    try {
      const correlation_id = randomUUID();

      const topic =
        (req.headers["x-contentful-topic"] as string) ||
        "ContentManagement.Entry.publish";
      const action = topic.split(".").pop() || "publish";

      const payloadResult = ContentfulPayloadSchema.safeParse(req.body);
      const contentType = payloadResult.success
        ? payloadResult.data.sys?.contentType?.sys?.id || ""
        : "";

      await enqueueWorkflowJob(req.body, correlation_id, action, contentType);

      res.status(202).json({
        message: "Accepted",
        correlation_id,
      });
    } catch (error) {
      next(error);
    }
  };

  return {
    handleContentfulWebhook,
  };
};

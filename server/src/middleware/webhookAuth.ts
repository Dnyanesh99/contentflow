import { Request, Response, NextFunction } from "express";
import { createHmac, timingSafeEqual } from "crypto";
import { ENV } from "../config/env.js";

/**
 * Middleware to authenticate incoming webhooks.
 * First checks for Contentful Signed Webhook signature 'x-contentful-signature'
 * using CONTENTFUL_SIGNING_SECRET. If signature is absent or secret is not configured,
 * it falls back to token header check using CONTENTFLOW_WEBHOOK_SECRET.
 */
export const verifyWebhookSecret = (
  req: Request,
  res: Response,
  next: NextFunction,
): void => {
  const signingSecret = ENV.CONTENTFUL_SIGNING_SECRET;
  const signatureHeader = req.headers["x-contentful-signature"] as string;

  if (signingSecret && signatureHeader) {
    const rawBody = (req as { rawBody?: string }).rawBody || "";
    const hmac = createHmac("sha256", signingSecret);
    hmac.update(rawBody);
    const computedSignature = hmac.digest("hex");

    const signatureBuffer = Buffer.from(signatureHeader);
    const computedBuffer = Buffer.from(computedSignature);

    if (
      signatureBuffer.length !== computedBuffer.length ||
      !timingSafeEqual(signatureBuffer, computedBuffer)
    ) {
      console.warn("[Webhook Auth] Cryptographic signature mismatch");
      res
        .status(401)
        .json({ error: "Unauthorized: Invalid Contentful Webhook Signature" });
      return;
    }

    return next();
  }

  const tokenSecret = ENV.CONTENTFLOW_WEBHOOK_SECRET;

  if (!tokenSecret) {
    if (ENV.NODE_ENV === "production") {
      console.error(
        "[Webhook Auth] Rejecting request: Webhook security is not configured in production environment.",
      );
      res
        .status(401)
        .json({ error: "Unauthorized: Webhook security is not configured" });
      return;
    }
    console.warn(
      "[Webhook Auth] WARNING: Webhook security is bypassed because no secrets are configured.",
    );
    return next();
  }

  const clientSecret = (req.headers["x-contentflow-secret"] ||
    req.headers["x-contentful-secret"]) as string;

  if (!clientSecret || typeof clientSecret !== "string") {
    res
      .status(401)
      .json({ error: "Unauthorized: Invalid webhook secret token" });
    return;
  }

  const clientBuffer = Buffer.from(clientSecret);
  const tokenBuffer = Buffer.from(tokenSecret);

  if (
    clientBuffer.length !== tokenBuffer.length ||
    !timingSafeEqual(clientBuffer, tokenBuffer)
  ) {
    res
      .status(401)
      .json({ error: "Unauthorized: Invalid webhook secret token" });
    return;
  }

  next();
};

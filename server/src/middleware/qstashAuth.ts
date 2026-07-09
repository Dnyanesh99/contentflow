import { Request, Response, NextFunction } from 'express';
import { Receiver } from '@upstash/qstash';
import { ENV } from '../config/env.js';

const receiver = new Receiver({
  currentSigningKey: ENV.QSTASH_CURRENT_SIGNING_KEY || '',
  nextSigningKey: ENV.QSTASH_NEXT_SIGNING_KEY || '',
});

export const verifyQStashSignature = async (
  req: Request & { rawBody?: string },
  res: Response,
  next: NextFunction
): Promise<void> => {
  if (ENV.NODE_ENV === 'development') {
    return next();
  }

  const signature = req.headers['upstash-signature'] as string;
  if (!signature) {
    res.status(401).json({ error: 'Missing upstash-signature header' });
    return;
  }
  
  if (!req.rawBody) {
    res.status(400).json({ error: 'Raw body is required for signature verification' });
    return;
  }

  try {
    const isValid = await receiver.verify({
      signature,
      body: req.rawBody,
      url: `${ENV.VERCEL_URL ? `https://${ENV.VERCEL_URL}` : ''}${req.originalUrl}`
    });

    if (!isValid) {
      res.status(401).json({ error: 'Invalid QStash signature' });
      return;
    }
    
    next();
  } catch (error) {
    console.error('[QStash] Signature verification failed:', error);
    res.status(401).json({ error: 'Signature verification failed' });
    return;
  }
};

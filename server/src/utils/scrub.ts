/**
 * Recursively scrubs PII (Personally Identifiable Information) and secrets
 * from objects before saving them to logs.
 */
export const scrubPII = (val: any): any => {
  if (val === null || val === undefined) {
    return val;
  }

  if (Array.isArray(val)) {
    return val.map(scrubPII);
  }

  if (typeof val === 'object') {
    const scrubbed: Record<string, any> = {};
    const sensitiveKeys = [
      'email', 'phone', 'password', 'address', 'token', 'secret',
      'key', 'auth', 'authorization', 'signature', 'apikey', 'api_key'
    ];

    for (const k of Object.keys(val)) {
      const lowerKey = k.toLowerCase();
      const isSensitive = sensitiveKeys.some(sk => lowerKey.includes(sk));

      if (isSensitive) {
        scrubbed[k] = '[SCRUBBED]';
      } else {
        scrubbed[k] = scrubPII(val[k]);
      }
    }
    return scrubbed;
  }

  return val;
};

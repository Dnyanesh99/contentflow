/**
 * Resolves path template strings like {{fields.title}} or {{OpenAI.Translate.translatedText}}
 * from the execution context.
 */
export const resolveTemplate = (template: string, context: Record<string, any>): string => {
  return template.replace(/\{\{([^}]+)\}\}/g, (match, path) => {
    const parts = path.trim().split('.');
    let current: any = context;
    for (const part of parts) {
      if (current === null || current === undefined) {
        return match;
      }
      current = current[part];
    }
    return current !== undefined && current !== null ? String(current) : match;
  });
};

import { z } from 'zod';
import { resolveTemplate } from '../utils/templateResolver';
import { ENV } from '../config/env';
import { CONSTANTS } from '../config/constants';

const ContentfulNodeDataSchema = z.object({
  entryId: z.string().default('{{sys.id}}'),
  field: z.string().default('title'),
  locale: z.string().default('es-ES'),
  value: z.string().default(''),
});

export const handleContentfulWriteBack = async (nodeData: Record<string, unknown>, context: Record<string, any>) => {
  console.log('[DAG] Executing Contentful.WriteBack action');
  
  const parseResult = ContentfulNodeDataSchema.safeParse(nodeData || {});
  if (!parseResult.success) {
    throw new Error(`Invalid node configuration: ${parseResult.error.message}`);
  }
  
  const { entryId: entryIdTemplate, field, locale, value: valueTemplate } = parseResult.data;

  const entryId = resolveTemplate(entryIdTemplate, context);
  const value = resolveTemplate(valueTemplate, context);

  const spaceId = context?.sys?.space?.sys?.id;
  const environmentId = context?.sys?.environment?.sys?.id || 'master';
  const accessToken = ENV.CONTENTFUL_ACCESS_TOKEN;

  console.log(`[DAG] Writing back to Contentful: Entry ${entryId}, Field ${field}, Locale ${locale}, Value: "${value}"`);

  if (!spaceId) {
    throw new Error('Contentful Space ID not found in webhook payload context.');
  }

  if (!accessToken) {
    if (ENV.NODE_ENV === 'production') {
      throw new Error('Contentful CMA Access Token is missing in environment variables. Cannot perform write-back.');
    }
    
    console.warn('[DAG] WARNING: CONTENTFUL_ACCESS_TOKEN is missing. Falling back to Mock Contentful WriteBack in non-production environment.');
    await new Promise((resolve) => setTimeout(resolve, 600));
    console.log('[DAG] Mock Contentful WriteBack completed successfully');
    
    return {
      result: { success: true, updatedField: field, value },
      output: { success: true, updatedField: field, locale, value },
    };
  }

  const getUrl = `${CONSTANTS.CONTENTFUL_CMA_BASE_URL}/spaces/${spaceId}/environments/${environmentId}/entries/${entryId}`;
  const getRes = await fetch(getUrl, {
    headers: {
      'Authorization': `Bearer ${accessToken}`,
    },
  });
  if (!getRes.ok) {
    throw new Error(`Contentful get entry failed with status: ${getRes.status}`);
  }
  const entry = await getRes.json();

  if (!entry.fields[field]) {
    entry.fields[field] = {};
  }
  entry.fields[field][locale] = value;

  const version = getRes.headers.get('ETag') || entry.sys.version;
  const putRes = await fetch(getUrl, {
    method: 'PUT',
    headers: {
      'Authorization': `Bearer ${accessToken}`,
      'Content-Type': CONSTANTS.CONTENTFUL_MANAGEMENT_CONTENT_TYPE,
      'X-Contentful-Version': String(version).replace(/"/g, ''),
    },
    body: JSON.stringify({ fields: entry.fields }),
  });

  if (!putRes.ok) {
    const errorText = await putRes.text();
    console.error(`[DAG] Contentful update failed. Status: ${putRes.status}, Error:`, errorText);
    throw new Error(`Contentful update entry failed with status: ${putRes.status}. Details: ${errorText}`);
  }
  console.log('[DAG] Contentful update completed successfully via CMA');

  return {
    result: { success: true, updatedField: field, value },
    output: { success: true, updatedField: field, locale, value },
  };
};

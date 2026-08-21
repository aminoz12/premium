import { SITE_URL } from './site';

export const INDEXNOW_API_KEY = 'watchworldcup2026indexnowkey';
export const INDEXNOW_ENDPOINT = 'https://api.indexnow.org/indexnow';

export async function submitUrlsToIndexNow(urls: string[]): Promise<{ success: boolean; status: number; message: string }> {
  try {
    const payload = {
      host: 'watchworldcup.us',
      key: INDEXNOW_API_KEY,
      keyLocation: `${SITE_URL}/${INDEXNOW_API_KEY}.txt`,
      urlList: urls.map((url) => (url.startsWith('http') ? url : `${SITE_URL}${url.startsWith('/') ? url : `/${url}`}`)),
    };

    const response = await fetch(INDEXNOW_ENDPOINT, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json; charset=utf-8',
      },
      body: JSON.stringify(payload),
    });

    if (response.status === 200 || response.status === 202) {
      return { success: true, status: response.status, message: 'URLs submitted to IndexNow for Bing & Yandex instant indexing.' };
    }

    return { success: false, status: response.status, message: `IndexNow API returned HTTP ${response.status}` };
  } catch (error) {
    return { success: false, status: 500, message: error instanceof Error ? error.message : 'Unknown IndexNow error' };
  }
}

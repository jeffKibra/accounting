import { URLSearchParams } from 'url';

/**
 * @param {URLSearchParams} searchParams
 */
export default function getSearchParams(searchParams: URLSearchParams) {
  const params: Record<string, string> = {};

  for (const [key, value] of searchParams.entries()) {
    console.log({ key, value });
    params[key] = value;
  }

  return params;
}

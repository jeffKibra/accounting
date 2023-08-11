import { URLSearchParams } from 'url';

/**
 * @param {URLSearchParams} searchParams
 */
export default function getSearchParams(searchParams) {
  const params = {};

  for (const [key, value] of searchParams.entries()) {
    console.log({ key, value });
    params[key] = value;
  }

  return params;
}

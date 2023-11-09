import { getIdToken } from 'firebase/auth';
import { auth } from '../firebase';

async function getUserIdToken() {
  const user = auth.currentUser;

  if (!user) {
    throw new Error('User not Logged in!');
  }

  const idToken = await getIdToken(user);

  return idToken;
}

export default async function customFetch(options: RequestInit) {
  const idToken = await getUserIdToken();
  //
  // https://cyan-good-calf.cyclic.app
  // http://localhost:5000
  const response = await fetch(
    'https://cyan-good-calf.cyclic.app/graphql',
    {
      ...options,
      headers: {
        Authorization: 'Bearer ' + idToken,
        //   Authorization: 'Bearer ',
        ...options.headers,
      },
    }
  );
  //   console.log({ response });

  const responseClone = response.clone();
  await checkForErrors(responseClone);

  return response;
}

async function checkForErrors(response: Response) {
  const errorMessage = await getErrorMessage(response.clone());
  //   console.log({ errorMessage });

  if (!response.ok) {
    const { status, statusText } = response;
    throw new Error(`Fetch Error: ${statusText}(${status}) - ${errorMessage}`);
  }
}

async function getErrorMessage(response: Response) {
  let message = '';

  const textResponse = await getTextBody(response);
  message = textResponse;

  const jsonResponse = await getJSONBody(response);
  //   console.log({ textResponse, jsonResponse });

  if (jsonResponse) {
    if (typeof jsonResponse === 'string') {
      message = jsonResponse;
    } else {
      const jsonErrors = jsonResponse?.errors;
      const jsonError = jsonResponse?.error as Record<string, unknown>;

      if (jsonErrors) {
        message = combineErrors(jsonErrors);
      } else if (jsonError) {
        message = jsonError?.message as string;
      }
    }
  }

  //   console.log({ message });

  return message;
}

function combineErrors(errors: { message: string }[] | unknown) {
  if (!Array.isArray(errors)) {
    return '';
  }

  return errors.map(error => error?.message || '').join('\n\r');
}

async function getJSONBody(resp: Response) {
  let body: Record<string, unknown> | string = '';

  try {
    const response = resp.clone();
    body = await response.json();
  } catch (error) {
    console.warn('error generating json body from response:', error);
  }

  return body;
}

async function getTextBody(resp: Response) {
  let body: string = '';
  try {
    const response = resp.clone();
    body = await response.text();
  } catch (error) {
    console.warn('Error generating text body from response: ', error);
  }

  return body;
}

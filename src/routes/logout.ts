import cookie from 'cookie';
import type { LogoutOptions } from "$lib/utils/types";
import type { RequestHandler } from "@sveltejs/kit";

const revokeURL = 'https://api.twitter.com/2/oauth2/revoke';

export const GET:RequestHandler = async (event) => {
  const params: LogoutOptions = {
    'client_id': import.meta.env.DEV ? import.meta.env.VITE_TWITTER_OAUTH_CLIENT_ID as string : process.env.TWITTER_OAUTH_CLIENT_ID!,
    'token':  cookie.parse(event.request.headers.get('cookie') || '').token,
    'token_type_hint': 'access_token'
  }

  const revokeToken = async() => {
    // One liner to transform json into application/x-www-form-urlencoded payload.
    const formBody = Object.keys(params).map(key => encodeURIComponent(key) + '=' + encodeURIComponent(params[key as keyof LogoutOptions])).join('&');
    return fetch(revokeURL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: formBody
    })
  };

  // Once user "logout" make these null => handled in hooks.ts
  event.locals.user = null
  event.locals.token = null;

  await revokeToken();

  return {
    status: 302,
    headers: {
      location: '/'
    }
  }
};
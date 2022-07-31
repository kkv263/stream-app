import type { RefreshTokenOptions } from "$lib/utils/types";

const tokenURL = 'https://api.twitter.com/2/oauth2/token';

export const getRefreshToken = async(refresh_token:string) => {
  const params: RefreshTokenOptions = {
    'client_id': import.meta.env.DEV ? import.meta.env.VITE_TWITTER_OAUTH_CLIENT_ID as string : process.env.TWITTER_OAUTH_CLIENT_ID!,
    'refresh_token': refresh_token,
    'grant_type': 'refresh_token'
  }

  // One liner to transform json into application/x-www-form-urlencoded payload.
  const formBody = Object.keys(params).map(key => encodeURIComponent(key) + '=' + encodeURIComponent(params[key as keyof RefreshTokenOptions])).join('&');
  return fetch(tokenURL, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded',
    },
    body: formBody
  })
};

/* 
Example of acces token
{
  token_type: 'bearer',
  expires_in: 7200,
  access_token: 'XXXXXXXXXXX',
  scope: 'tweet.write users.read tweet.read offline.access',
  refresh_token: 'XXXXXXXXXXXXX'
}
-------
Example of Twitter expired token
{
  title: 'Unauthorized',
  type: 'about:blank',
  status: 401,
  detail: 'Unauthorized'
}
*/
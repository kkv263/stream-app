import type { RefreshTokenOptions } from "$lib/types/auth";

/**
 * @description Call this function whenever there is potential for an access token to be expired from making an API call.
 * @param refresh_token Refresh token stored usually in HTTPonly cookie
 * @param platform (ex. twitter/twitch etc)
 * @returns a response with a new access token and refresh token. 
 */
export const getRefreshToken = async(refresh_token:string, platform:string) => {
  let endpoint = '/oauth2/token';
  switch(platform) {
    case 'twitter': 
      endpoint = 'https://api.twitter.com/2' + endpoint; break;
    case 'twitch':
      endpoint = 'https://id.twitch.tv/' + endpoint; break;
  }

  const twitterParams = {
    'client_id': import.meta.env.DEV ? import.meta.env.VITE_TWITTER_OAUTH_CLIENT_ID as string : process.env.TWITTER_OAUTH_CLIENT_ID!,
  }

  const twitchParams = {
    'client_id': import.meta.env.DEV ? import.meta.env.VITE_TWITCH_CLIENT_ID as string : process.env.TWITCH_CLIENT_ID!,
    'client_secret': import.meta.env.DEV ? import.meta.env.VITE_TWITCH_CLIENT_SECRET as string : process.env.TWITCH_CLIENT_SECRET!,
  }

  const params: RefreshTokenOptions = {
    'refresh_token': refresh_token,
    'grant_type': 'refresh_token',
    ...(platform === 'twitter') && twitterParams,
    ...(platform === 'twitch') && twitchParams
  }

  // One liner to transform json into application/x-www-form-urlencoded payload.
  const formBody = Object.entries(params).flatMap(([key,val]) => val ? `${encodeURIComponent(key)}=${encodeURIComponent(params[key as keyof RefreshTokenOptions]!)}` : []).join('&');
  return fetch(endpoint, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded',
    },
    body: formBody
  })
};

/**
 * @description Get's username using platform API. Mainly used to store user session.
 * @param token Access token to make the API call
 * @param platform (ex. twitter/twitch etc)
 * @returns the username of the user from the platform
 */
export const getUser = async(token:string, platform: string, params:string='') => {
  let endpoint = '';
  switch(platform) {
    case 'twitter': 
      endpoint = `https://api.twitter.com/2/users/me?${params}`; break;
    case 'twitch':
      endpoint = 'https://api.twitch.tv/helix/users'; break;
  }

  return fetch(endpoint, {
    method: 'GET',
    headers: {
      'Authorization': `Bearer ${token}`,
      'Accept': 'application/json',
      ...(platform === 'twitch') && {'Client-Id' : import.meta.env.DEV ? import.meta.env.VITE_TWITCH_CLIENT_ID as string : process.env.TWITCH_CLIENT_ID!}
    }
  }).then(res => res.json())
  .then(data => {
    if (platform === 'twitter') {
      return data?.data;
    }
    else if (platform === 'twitch') {
      return data?.data[0];
    }
  });
};

/**
 * @description Some cookies are appended with null/undefined are unused; filter those cookies out.
 * @param cookieString the original cookie string before parsing.
 * @returns a cookie string ready to be parsed.
 */
export const filterNullCookieString = (cookieString:string|null) => cookieString?.split(';').filter(name => !name.includes('undefined') &&  !name.includes('null') ).join(';')

/* 
Example of access token
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
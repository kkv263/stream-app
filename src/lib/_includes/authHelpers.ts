import type { RefreshTokenOptions } from "$lib/types/auth";

/**
 * @description Call this function whenever there is potential for an access token to be expired from making an API call.
 * @param refresh_token Refresh token stored usually in HTTPonly cookie
 * @param platform (ex. twitter/twitch etc)
 * @returns a response with a new access token and refresh token. 
 */
export const getRefreshToken = async(refresh_token:string, platform:string) => {
  const endpoints: {[platform: string]: string}  = {
    'discord' :  'https://discord.com/api/oauth2/token',
    'twitter': 'https://api.twitter.com/2/oauth2/token',
    'twitch': 'https://id.twitch.tv/oauth2/token'
  };

  const endpoint = endpoints[platform];

  const discordParams = {
    'client_id': import.meta.env.DEV ? import.meta.env.VITE_DISCORD_CLIENT_ID as string : process.env.DISCORD_CLIENT_ID!,
    'client_secret': import.meta.env.DEV ? import.meta.env.VITE_DISCORD_CLIENT_SECRET as string : process.env.DISCORD_CLIENT_SECRET!,
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
    ...(platform === 'discord') && discordParams,
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
 * @returns user data from API
 */
const callUserAPI = async(token:string, platform:string, params:string) => {
  const endpoints: {[platform: string]: string}  = {
    'discord' :  'https://discord.com/api/users/@me',
    'twitter': `https://api.twitter.com/2/users/me?${params}`,
    'twitch': 'https://api.twitch.tv/helix/users'
  };

  const endpoint = endpoints[platform];

  return fetch(endpoint, {
    method: 'GET',
    headers: {
      'Authorization': `Bearer ${token}`,
      'Accept': 'application/json',
      ...(platform === 'twitch') && {'Client-Id' : import.meta.env.DEV ? import.meta.env.VITE_TWITCH_CLIENT_ID as string : process.env.TWITCH_CLIENT_ID!}
    }
  });
};

/**
 * @description Get's username using platform API. Mainly used to store user session. 
 * Also refreshs token if access token is invalid
 * @param token Access token to make the API call
 * @param refresh_token Refresh token
 * @param platform (ex. twitter/twitch etc)
 * @param params extra query params for API call
 * @returns the user data from platform
 */
export const getUser = async(token:string, refresh_token:string, platform: string, params:string='') => {
  let userResponse = await callUserAPI(token, platform, params);
  let refreshTokenResponse = null;

  if (userResponse.status === 401) {
    refreshTokenResponse = await getRefreshToken(refresh_token, platform).then(res => res.json());
    userResponse = await callUserAPI(token, platform, params);
  }

  const userdata = await userResponse.json();

  return { 
    userdata,
    ...(refreshTokenResponse) && {tokens: {access_token: refreshTokenResponse.access_token, refresh_token: refreshTokenResponse.refresh_token}}
  }
};

/**
 * @description Some cookies are appended with null/undefined are unused; filter those cookies out.
 * @param cookieString the original cookie string before parsing.
 * @returns a cookie string ready to be parsed.
 */
export const filterNullCookieString = (cookieString:string|null) => cookieString?.split(';').filter(name => !name.includes('undefined') &&  !name.includes('null') ).join(';')

// TODO: Twitter platform / Discord
export const validateToken = (token: string, platform: string = "twitch") => {
  const endpoints: {[platform: string]: string}  = {
    'discord' :  'https://discord.com/api/oauth2/@me',
    'twitter': ``,
    'twitch': 'https://id.twitch.tv/oauth2/validate'
  };

  const endpoint = endpoints[platform];

  return fetch(endpoint, {
    method: 'GET',
    headers: {
      'Authorization': `Bearer ${token}`,
      'Accept': 'application/json',
      ...(platform === 'twitch') && {'Client-Id' : import.meta.env.DEV ? import.meta.env.VITE_TWITCH_CLIENT_ID as string : process.env.TWITCH_CLIENT_ID!}
    }
  });
}

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
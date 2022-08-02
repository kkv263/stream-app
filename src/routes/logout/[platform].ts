import cookie from 'cookie';
import type { LogoutOptions } from "$lib/utils/types";
import type { RequestHandler } from "@sveltejs/kit";

export const GET:RequestHandler = async (event) => {
  let endpoint = 'oauth2/revoke';
  const platform = event.params.platform;
  switch(platform) {
    case 'twitter': 
      endpoint = 'https://api.twitter.com/2/' + endpoint; break;
    case 'twitch':
      endpoint = 'https://id.twitch.tv/' + endpoint; break;
  }

  const twitterParams = {
    'client_id': import.meta.env.DEV ? import.meta.env.VITE_TWITTER_OAUTH_CLIENT_ID as string : process.env.TWITTER_OAUTH_CLIENT_ID!,
    'token_type_hint': 'access_token',
  }

  const twitchParams = {
    'client_id': import.meta.env.DEV ? import.meta.env.VITE_TWITCH_CLIENT_ID as string : process.env.TWITCH_CLIENT_ID!,
  }

  const params: LogoutOptions = {
    'token':  (<Record<string,any>>cookie.parse(event.request.headers.get('cookie') || ''))[`${platform}token`],
    ...(platform === 'twitter') && twitterParams,
    ...(platform === 'twitch') && twitchParams
  }

  const revokeToken = async() => {
    // One liner to transform json into application/x-www-form-urlencoded payload.
    const formBody = Object.entries(params).flatMap(([key,val]) => val ? `${encodeURIComponent(key)}=${encodeURIComponent(params[key as keyof LogoutOptions]!)}` : []).join('&');

    return fetch(endpoint, {
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
  event.locals.platform = null;

  await revokeToken();

  return {
    status: 302,
    headers: {
      location: '/',
      'set-cookie': `${cookie.serialize(`${platform}refresh`, '')}; path=/; HttpOnly`,
    }
  }
};
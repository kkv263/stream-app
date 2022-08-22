import cookie from 'cookie';
import type { LogoutOptions } from "$lib/types/auth";
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
  event.locals[`${platform}tokens`] = { access_token: null, refresh_token: null }

  await revokeToken();

  const headers = new Headers();
  const platforms = ['twitter', 'twitch']
  headers.append('location', '/');
  
  platforms.forEach(item => {
    headers.append('set-cookie', cookie.serialize(`${item}refresh`, item === platform ? 'revoked' : event.locals[`${item}tokens`]?.refresh_token, {
      path: '/', 
      httpOnly: true, 
      ...(item === platform) && {expires: new Date(1970, 1, 1, 0, 0, 0, 0)}
    }));
    headers.append('set-cookie', cookie.serialize(`${item}token`, item === platform ? 'revoked' : event.locals[`${item}tokens`]?.access_token, {
      path: '/', 
      httpOnly: true, 
      ...(item === platform) && {expires: new Date(1970, 1, 1, 0, 0, 0, 0)}
    }));
  });

  return new Response('', { status: 302, headers });
};
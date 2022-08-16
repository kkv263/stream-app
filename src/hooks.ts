import cookie from 'cookie';
import type { Handle, GetSession } from "@sveltejs/kit";
import { filterNullCookieString } from '$lib/_includes/authHelpers';

// https://kit.svelte.dev/docs/hooks
export const handle:Handle = async({event, resolve}) => {
  const preparsedCookies = event.request.headers.get('cookie');
  const cookies = Object.assign({user: null}, cookie.parse(filterNullCookieString(preparsedCookies) || ''));
  event.locals.platform = cookies.platform;
  event.locals[`${cookies.platform}user`] = (<Record<string,any>>cookies)[`${cookies.platform}user`];
  event.locals[`${cookies.platform}id`] = (<Record<string,any>>cookies)[`${cookies.platform}id`];
  event.locals[`${cookies.platform}token`] = (<Record<string,any>>cookies)[`${cookies.platform}token`];
  
  const response = await resolve(event);

  const platform = event.locals.platform;
  const setCookies = {
    'user':  cookie.serialize(`${platform}user`, `${event.locals[`${platform}user`] || ''}`, {path: '/', httpOnly: true}),
    'user_id':  cookie.serialize(`${platform}id`, `${event.locals[`${platform}id`] || ''}`, {path: '/', httpOnly: true}),
    'token':  cookie.serialize(`${platform}token`, `${event.locals[`${platform}token`] || ''}`, {path: '/', httpOnly: true}),
    'platform':  cookie.serialize(`platform`, `${platform || ''}`, {path: '/', httpOnly: true}),
  }

  // Set all necessary cookies depending on route
  // This could mean setting them to null too
  Object.values(setCookies).forEach(cookie => {
    response.headers.append('set-cookie', cookie);
  });
  return response;
}

export const getSession: GetSession = async(event) => {
  return {
    ...(event.locals.platform === 'twitter') && {twitteruser: event.locals[`${event.locals.platform}user`]},
    ...(event.locals.platform === 'twitch') && {twitchuser: event.locals[`${event.locals.platform}user`]},
  }
} 
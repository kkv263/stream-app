import cookie from 'cookie';
import type { Handle } from "@sveltejs/kit";
import { filterNullCookieString } from '$lib/_includes/authHelpers';

// https://kit.svelte.dev/docs/hooks
export const handle:Handle = async({event, resolve}) => {
  const preparsedCookies = event.request.headers.get('cookie');
  const cookies = cookie.parse(filterNullCookieString(preparsedCookies) || '');

  const platforms = ['twitter', 'twitch'];

  platforms.forEach(platform => {
    if (cookies[`${platform}token`]) {
      event.locals[`${platform}tokens`] = {
        access_token: cookies[`${platform}token`],
        refresh_token: cookies[`${platform}refresh`]
      }; 
    }
  });

  const response = await resolve(event);

  interface SetCookieData {
    [platform:string]: string;
  }

  const setCookies:SetCookieData = {}

  platforms.forEach(platform => {
    setCookies[`${platform}token`] = cookie.serialize(`${platform}token`, `${event.locals[`${platform}tokens`]?.access_token || ''}`, {path: '/', httpOnly: true})
    setCookies[`${platform}refresh`] = cookie.serialize(`${platform}refresh`, `${event.locals[`${platform}tokens`]?.refresh_token || ''}`, {path: '/', httpOnly: true})
  });

  // Set all necessary cookies depending on route
  // This could mean setting them to empty string too
  Object.values(setCookies).forEach(cookie => {
    response.headers.append('set-cookie', <string>cookie);
  });
  return response;
}
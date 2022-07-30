import cookie from 'cookie';
import type { Handle, GetSession } from "@sveltejs/kit";

// https://kit.svelte.dev/docs/hooks

export const handle:Handle = async({event, resolve}) => {
  const cookies = Object.assign({user: null}, cookie.parse(event.request.headers.get('cookie') || ''));
  event.locals.user = cookies.user
  const response = await resolve(event);

  const setCookies = {
    'user': `user=${event.locals.user || ''}; path=/; HttpOnly`,
    'token': `twttoken=${event.locals.token || ''}; path=/; HttpOnly`
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
    user: event.locals.user
  }
} 
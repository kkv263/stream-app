import cookie from 'cookie';
import type { Handle, GetSession } from "@sveltejs/kit";

export const handle:Handle = async({event, resolve}) => {
  const cookies = cookie.parse(event.request.headers.get('cookie') || '');

  event.locals.user = cookies.user

  const response = await resolve(event);

  // Because we redirect to homepage we set path to '/'
  response.headers.set('set-cookie', `user=${event.locals.user || ''}; path=/; HttpOnly`);
  return response;
}

export const getSession: GetSession = async(event) => {
  return {
    user: event.locals.user
  }
} 
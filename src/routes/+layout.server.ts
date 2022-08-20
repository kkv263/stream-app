import cookie from 'cookie';
import { filterNullCookieString } from '$lib/_includes/authHelpers';

export const load = async(event:any) => {
  const preparsedCookies = event.request.headers.get('cookie');
  const cookies = Object.assign({user: null}, cookie.parse(filterNullCookieString(preparsedCookies) || ''));

  return {
   twitteruser: cookies.twitteruser,
   twitchuser: cookies.twitchuser,
  }
}
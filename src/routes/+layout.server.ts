import cookie from 'cookie';
import { getUser } from '$lib/_includes/authHelpers'
import { filterNullCookieString } from '$lib/_includes/authHelpers';
import type { ServerLoad } from '@sveltejs/kit';

export const load:ServerLoad = async({locals, request}) => {
  const preparsedCookies = request.headers.get('cookie');
  const cookies = cookie.parse(filterNullCookieString(preparsedCookies) || '');
  const platforms = ['twitter', 'twitch'];
  const userData:any = {};
  
  const setUser = async(platform: string) => {
    if (cookies[`${platform}token`] != '') {
      const userResponse = await getUser(cookies[`${platform}token`], cookies[`${platform}refresh`], platform);
      const userdata = platform === 'twitter' ? userResponse.userdata?.data : userResponse.userdata?.data?.[0];
      if (userResponse?.tokens) {
        locals[`${platform}tokens`] = userResponse.tokens;
      }
      return userdata
    } 
  }

  for (let platform of platforms) {
    userData[`${platform}user`] = await setUser(platform);
  }

  return userData
}
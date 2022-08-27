
import cookie from 'cookie';
import { getRefreshToken, filterNullCookieString, validateToken } from '$lib/_includes/authHelpers';
import type { RequestHandler } from "@sveltejs/kit";

const getRandomStream = (token:string, id:string, lang:string) => {
  const endpoint = `https://api.twitch.tv/helix/streams?game_id=${id}&language=${lang}&first=100`;
  return fetch(endpoint, {
    method: 'GET',
    headers: {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json',
      'Client-Id' : import.meta.env.DEV ? import.meta.env.VITE_TWITCH_CLIENT_ID as string : process.env.TWITCH_CLIENT_ID!
    },
  })
}

export const POST: RequestHandler = async({locals, request}) => {
  const preparsedCookies = request.headers.get('cookie');
  const cookies = cookie.parse(filterNullCookieString(preparsedCookies) || '');
  let refreshTokenResponse = null;
  let token = cookies.twitchtoken;
  const body = await request.json();

  // Check if Access token expired -> unauthorized. 
  let validate = await validateToken(cookies.twitchtoken, 'twitch');

  if (validate.status === 401) {
    refreshTokenResponse = await getRefreshToken(cookies.twitchrefresh, 'twitch').then(res => res.json());
    token = locals.twitchtoken = refreshTokenResponse.access_token
    locals.twitchrefresh = refreshTokenResponse.refresh_token
  }
  const channel = await getRandomStream(token, body.game_id, body.lang);
  const channelJSON = await channel.json()

  const randomStream = channelJSON.data[Math.floor(Math.random() * 100)];

  return new Response(JSON.stringify(randomStream), {
    status: 201,
  })
};
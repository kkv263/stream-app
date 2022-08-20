
import cookie from 'cookie';
import { getRefreshToken } from '$lib/_includes/authHelpers';
import { filterNullCookieString } from '$lib/_includes/authHelpers';
import type { RequestHandler } from "@sveltejs/kit";

const getChannelInfo = (token:string, id:string) => {
  const endpoint = `https://api.twitch.tv/helix/channels?broadcaster_id=${id}`;
  return fetch(endpoint, {
    method: 'GET',
    headers: {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json',
      'Client-Id' : import.meta.env.DEV ? import.meta.env.VITE_TWITCH_CLIENT_ID as string : process.env.TWITCH_CLIENT_ID!
    },
  })
}

export const GET: RequestHandler = async(event) => {
  const preparsedCookies = event.request.headers.get('cookie');
  const cookies = cookie.parse(filterNullCookieString(preparsedCookies) || '');
  const id = cookies.twitchid;
  let refreshTokenResponse = null;
  let channel = await getChannelInfo(cookies.twitchtoken, id)

  // Access token expired -> unauthorized. 
  // TODO: Refactor this to be reusuable.
  if (channel.status === 401) {
    refreshTokenResponse = await getRefreshToken(cookies.twitchrefresh, 'twitch').then(res => res.json());
    channel = await getChannelInfo(refreshTokenResponse.access_token, id)
    event.locals.twitchtoken = refreshTokenResponse.access_token
    event.locals.twitchrefresh = refreshTokenResponse.refresh_token
  }

  const channelJSON = await channel.json()

  return new Response(JSON.stringify(channelJSON), {
    status: 201,
  })
};
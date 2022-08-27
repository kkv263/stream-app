
import cookie from 'cookie';
import { getRefreshToken, filterNullCookieString, validateToken } from '$lib/_includes/authHelpers';
import type { RequestHandler } from "@sveltejs/kit";

const getUsers = (token:string, id:string) => {
  const endpoint = `https://api.twitch.tv/helix/users?${id}`;
  return fetch(endpoint, {
    method: 'GET',
    headers: {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json',
      'Client-Id' : import.meta.env.DEV ? import.meta.env.VITE_TWITCH_CLIENT_ID as string : process.env.TWITCH_CLIENT_ID!
    },
  })
}

const getStreams = (token:string, id:string) => {
  const endpoint = `https://api.twitch.tv/helix/streams?user${id}`;
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

  let channel = await getUsers(token, '&id=' + body.user_ids.join('&id='))
  let streams = await getStreams(token, '&user_id=' + body.user_ids.join('&user_id='))

  const channelJSON = await channel.json();
  const streamsJSON = await streams.json();

  const dedupedArray = [...new Set([...channelJSON.data.map((e:any) => e.id), ...streamsJSON.data.map((e:any) => e.user_id)])];

  const raidData = dedupedArray.map(e => ({
    ...channelJSON.data.find((o:any) => o.id === e),
    ...streamsJSON.data.find((o:any) => o.user_id === e)
  }));

  // console.log(raidData);

  return new Response(JSON.stringify(raidData), {
    status: 201,
  })
};
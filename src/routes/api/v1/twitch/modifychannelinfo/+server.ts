
import cookie from 'cookie';
import { getRefreshToken } from '$lib/_includes/authHelpers';
import { filterNullCookieString } from '$lib/_includes/authHelpers';
import { get } from 'svelte/store'
import { twitchUser } from '$lib/stores/twitchSessionStore';
import type { RequestHandler } from "@sveltejs/kit";

const modChannelInfo = async(token:string, id:string, body:any) => {
  if (body.game_id) {
    const games = await getGames(token, body.game_id);
    if (games.status === 401) {
      return games;
    }
    const gamesJSON = await games.json();
    body.game_id = gamesJSON.data[0].id;
  }
  
  
  const endpoint = `https://api.twitch.tv/helix/channels?broadcaster_id=${id}`;
  return fetch(endpoint, {
    method: 'PATCH',
    headers: {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json',
      'Client-Id' : import.meta.env.DEV ? import.meta.env.VITE_TWITCH_CLIENT_ID as string : process.env.TWITCH_CLIENT_ID!
    },
    body: JSON.stringify(body)
  })
}

const getGames = (token:string, game:string) => {
  const endpoint = `https://api.twitch.tv/helix/games?name=${game}`;
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
  const id = get(twitchUser).id;
  const body = await request.json();
  let refreshTokenResponse = null;
  let channel = await modChannelInfo(cookies.twitchtoken, id, body)

  // Access token expired -> unauthorized. 
  // TODO: Refactor this to be reusuable.
  if (channel.status === 401) {
    refreshTokenResponse = await getRefreshToken(cookies.twitchrefresh, 'twitch').then(res => res.json());
    channel = await modChannelInfo(refreshTokenResponse.access_token, id, body)
    locals.twitchtoken = refreshTokenResponse.access_token
    locals.twitchrefresh = refreshTokenResponse.refresh_token
  }

  return new Response(undefined, {
    status: 204,
  })
};
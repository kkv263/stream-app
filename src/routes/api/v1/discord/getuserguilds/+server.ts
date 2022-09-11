
import cookie from 'cookie';
import { getRefreshToken } from '$lib/_includes/authHelpers';
import { filterNullCookieString } from '$lib/_includes/authHelpers';
import { get } from 'svelte/store'
import { discordUser } from '$lib/stores/discordSessionStore';
import type { RequestHandler } from "@sveltejs/kit";

const getGuildsInfo = (token:string, id:string) => {
  const endpoint = `https://discord.com/api/users/@me/guilds`;
  return fetch(endpoint, {
    method: 'GET',
    headers: {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json',
    },
  })
}

export const GET: RequestHandler = async(event) => {
  const preparsedCookies = event.request.headers.get('cookie');
  const cookies = cookie.parse(filterNullCookieString(preparsedCookies) || '');
  const id = get(discordUser).id;
  let refreshTokenResponse = null;
  let channel = await getGuildsInfo(cookies.discordtoken, id)

  // Access token expired -> unauthorized. 
  // TODO: Refactor this to be reusuable.
  if (channel.status === 401) {
    refreshTokenResponse = await getRefreshToken(cookies.discordrefresh, 'discord').then(res => res.json());
    channel = await getGuildsInfo(refreshTokenResponse.access_token, id)
    event.locals.discordtoken = refreshTokenResponse.access_token
    event.locals.discordrefresh = refreshTokenResponse.refresh_token
  }

  const guildsJSON = await channel.json()

  return new Response(JSON.stringify(guildsJSON), {
    status: 201,
  })
};
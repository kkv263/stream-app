
import cookie from 'cookie';
import { get } from 'svelte/store'
import { twitterUser } from '$lib/stores/twitterSessionStore';
import { getRefreshToken } from '$lib/_includes/authHelpers';
import { filterNullCookieString } from '$lib/_includes/authHelpers';
import type { RequestHandler } from "@sveltejs/kit";

const getTweets = (token:string, id:string) => {
  const endpoint = `https://api.twitter.com/2/users/${id}/tweets?tweet.fields=created_at,public_metrics,referenced_tweets`;
  return fetch(endpoint, {
    method: 'GET',
    headers: {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json',
    },
  })
}

export const GET: RequestHandler = async({locals, request}) => {
  const preparsedCookies = request.headers.get('cookie');
  const cookies = cookie.parse(filterNullCookieString(preparsedCookies) || '');
  const id = get(twitterUser).id;
  let refreshTokenResponse = null;
  let tweet = await getTweets(cookies.twittertoken, id)

  // Access token expired -> unauthorized. 
  if (tweet.status === 401) {
    refreshTokenResponse = await getRefreshToken(cookies.twitterrefresh, 'twitter').then(res => res.json());
    tweet = await getTweets(refreshTokenResponse.access_token, id)
    locals.twittertoken = refreshTokenResponse.access_token
    locals.twitterrefresh = refreshTokenResponse.refresh_token
  }

  const tweetJSON = await tweet.json()

  return new Response(JSON.stringify(tweetJSON), {
    status: 201,
  })
};
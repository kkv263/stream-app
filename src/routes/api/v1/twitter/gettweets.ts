
import cookie from 'cookie';
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

export const GET: RequestHandler = async(events) => {
  const preparsedCookies = events.request.headers.get('cookie');
  const cookies = cookie.parse(filterNullCookieString(preparsedCookies) || '');
  const id = cookies.twitterid;
  let refreshTokenResponse = null;
  let tweet = await getTweets(cookies.twittertoken, id)

  // Access token expired -> unauthorized. 
  if (tweet.status === 401) {
    refreshTokenResponse = await getRefreshToken(cookies.twitterrefresh, 'twitter').then(res => res.json());
    tweet = await getTweets(refreshTokenResponse.access_token, id)
  }

  const tweetJSON = await tweet.json()

  return {
    status: 201,
    headers: {
      ...(refreshTokenResponse) && {'set-cookie': [
        cookie.serialize(`twittertoken`, refreshTokenResponse.access_token, {path: '/', httpOnly: true}),
        cookie.serialize(`twitterrefresh`, refreshTokenResponse.refresh_token, {path: '/', httpOnly: true}),
      ]}
    },
    body: JSON.stringify(tweetJSON)
  }
};
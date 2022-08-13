
import cookie from 'cookie';
import { getRefreshToken } from '$lib/utils/authHelpers';
import { filterNullCookieString } from '$lib/utils/authHelpers';
import type { RequestHandler } from "@sveltejs/kit";
import type { TweetProfileUpdateOptions } from '$lib/components/types/twitter';

const writeTweet = (token:string, body:TweetProfileUpdateOptions) => {
  // Migrate to v2 once there is a endpoint 
  // https://developer.twitter.com/en/docs/twitter-api/migrate/twitter-api-endpoint-map
  const endpoint = 'https://api.twitter.com/1.1/account/update_profile.json';
  return fetch(endpoint, {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${token}`,
      'Accept': 'application/json',
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(body)
  })
}

export const POST: RequestHandler = async({request}) => {
  const preparsedCookies = request.headers.get('cookie');
  const cookies = cookie.parse(filterNullCookieString(preparsedCookies) || '');
  const body = await request.json();
  let refreshTokenResponse = null;
  let tweet = await writeTweet(cookies.twittertoken, body)

  // Access token expired -> unauthorized. 
  if (tweet.status === 401) {
    refreshTokenResponse = await getRefreshToken(cookies.twitterrefresh, 'twitter').then(res => res.json());
    tweet = await writeTweet(refreshTokenResponse.access_token, body)
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
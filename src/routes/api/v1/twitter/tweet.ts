
import cookie from 'cookie';
import { getRefreshToken } from '$lib/_includes/authHelpers';
import { filterNullCookieString } from '$lib/_includes/authHelpers';
import type { RequestHandler } from "@sveltejs/kit";
import type { TweetPostOptions } from '$lib/types/twitter';


const writeTweet = (token:string, body:TweetPostOptions) => {
  const endpoint = 'https://api.twitter.com/2/tweets';
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
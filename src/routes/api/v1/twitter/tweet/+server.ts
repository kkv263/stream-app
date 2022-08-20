
import cookie from 'cookie';
import { getRefreshToken } from '$lib/_includes/authHelpers';
import { filterNullCookieString } from '$lib/_includes/authHelpers';
import type { RequestHandler } from "@sveltejs/kit";
import type { TweetPostOptions } from '$lib/types/twitter';


const postTweet = async(token:string, body:TweetPostOptions) => {
  const endpoint = 'https://api.twitter.com/2/tweets';
  return fetch(endpoint, {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(body)
  });
}

export const POST: RequestHandler = async({locals, request}) => {
  const preparsedCookies = request.headers.get('cookie');
  const cookies = cookie.parse(filterNullCookieString(preparsedCookies) || '');
  const body = await request.json();
  let refreshTokenResponse = null;
  let tweet = await postTweet(cookies.twittertoken, body)

  // Access token expired -> unauthorized. 
  if (tweet.status === 401) {
    refreshTokenResponse = await getRefreshToken(cookies.twitterrefresh, 'twitter').then(res => res.json());
    tweet = await postTweet(refreshTokenResponse.access_token, body)
    locals.twittertoken = refreshTokenResponse.access_token
    locals.twitterrefresh = refreshTokenResponse.refresh_token
  }

	// TODO Doesn't return text and id -- do we really need it though?
  // This line breaks
  // const tweetJSON = await tweet.json();

  return new Response(undefined)

  // return new Response(JSON.stringify(tweetJSON), {
  //   status: 201
  // })
};
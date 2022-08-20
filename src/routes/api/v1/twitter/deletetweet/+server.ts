
import cookie from 'cookie';
import { getRefreshToken } from '$lib/_includes/authHelpers';
import { filterNullCookieString } from '$lib/_includes/authHelpers';
import type { RequestHandler } from "@sveltejs/kit";


const deleteTweet = (token:string, id:any) => {
  const endpoint = `https://api.twitter.com/2/tweets/${id}`;
  return fetch(endpoint, {
    method: 'DELETE',
    headers: {
      'Authorization': `Bearer ${token}`,
      'Accept': 'application/json',
      'Content-Type': 'application/json',
    },
  })
}

export const POST: RequestHandler = async({locals, request}) => {
  const preparsedCookies = request.headers.get('cookie');
  const cookies = cookie.parse(filterNullCookieString(preparsedCookies) || '');
  const id = await request.json();
  let refreshTokenResponse = null;
  let tweet = await deleteTweet(cookies.twittertoken, id.id)

  // Access token expired -> unauthorized. 
  if (tweet.status === 401) {
    refreshTokenResponse = await getRefreshToken(cookies.twitterrefresh, 'twitter').then(res => res.json());
    tweet = await deleteTweet(refreshTokenResponse.access_token, id.id)
    locals.twittertoken = refreshTokenResponse.access_token
    locals.twitterrefresh = refreshTokenResponse.refresh_token
  }

  const tweetJSON = await tweet.json()

  return new Response(JSON.stringify(tweetJSON), {
    status: 201,
  })
};
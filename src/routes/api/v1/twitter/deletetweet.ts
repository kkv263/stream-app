
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

export const POST: RequestHandler = async({request}) => {
  const preparsedCookies = request.headers.get('cookie');
  const cookies = cookie.parse(filterNullCookieString(preparsedCookies) || '');
  const id = await request.json();
  let refreshTokenResponse = null;
  let tweet = await deleteTweet(cookies.twittertoken, id.id)

  // Access token expired -> unauthorized. 
  if (tweet.status === 401) {
    refreshTokenResponse = await getRefreshToken(cookies.twitterrefresh, 'twitter').then(res => res.json());
    tweet = await deleteTweet(refreshTokenResponse.access_token, id.id)
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
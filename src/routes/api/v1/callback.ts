import { get } from 'svelte/store';
import { oauth_verifiers } from '$lib/utils/sessionStore';
import type { RequestEvent } from "@sveltejs/kit";
import type { CallBackOptions } from '$lib/utils/types';

const tokenURL = 'https://api.twitter.com/2/oauth2/token';
const verifyObject = get(oauth_verifiers);
const params: CallBackOptions = {
  'client_id': import.meta.env.VITE_TWITTER_OAUTH_CLIENT_ID as string,
  'redirect_uri' :'http://127.0.0.1:5173/api/v1/callback',
  'grant_type': 'authorization_code',
  'code_verifier': verifyObject.code_verifier,
  'state': verifyObject.state
}

export const GET = async(event:RequestEvent) => {
    const state = event.url.searchParams.get('state');
    // States don't match (vulnerable to attack)
    if (state != params.state) {throw Error("States do not match, aborting");}
    const token = await getToken();
    // const write = await writeTweet(token);
    return {
      body: {}
    }
};

const getToken = () => {
  // One liner to transform json into application/x-www-form-urlencoded payload.
  const formBody = Object.keys(params).map(key => encodeURIComponent(key) + '=' + encodeURIComponent(params[key as keyof CallBackOptions])).join('&');

  return fetch(tokenURL, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded',
    },
    body: formBody
  }).then(res => res.json())
  .then(res => res.access_token)
};

// const writeTweet = (token:any) => {
//   return fetch('https://api.twitter.com/2/tweets', {
//     method: 'POST',
//     headers: {
//       "Authorization": `Bearer ${token}`,
//       'Content-Type': 'application/json',
//       "Accept" : "application/json"
//     },
//     body: JSON.stringify({'text': 'Hello World!'})
//   })
// };
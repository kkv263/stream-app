import type { RequestEvent } from "@sveltejs/kit";

const tokenURL = 'https://api.twitter.com/2/oauth2/token';

// You will need to pass in the Content-Type of application/x-www-form-urlencoded via a header.  
// Additionally, you should have in your request: code, grant_type, client_id and redirect_uri, and the code_verifier.

interface callBackOptions {
  client_id: string,
  redirect_uri: string,
  grant_type: string,
  code_verifier: string, 
  code: string,
}

const params: callBackOptions = {
  'client_id': import.meta.env.VITE_TWITTER_OAUTH_CLIENT_ID as string,
  'redirect_uri' :'http://127.0.0.1:5173/v1/callback',
  'grant_type': 'authorization_code',
  'code_verifier': 'challenge',
  'code' : ''
}

export const GET = async(event:RequestEvent) => {
    // const state = event.url.searchParams.get('state');
    const token = await getToken();
    // const write = await writeTweet(token);
    return {
      body: {}
    }
};

const getToken = () => {
  // One liner to transform json into application/x-www-form-urlencoded payload.
  const formBody = Object.keys(params).map(key => encodeURIComponent(key) + '=' + encodeURIComponent(params[key as keyof callBackOptions])).join('&');

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
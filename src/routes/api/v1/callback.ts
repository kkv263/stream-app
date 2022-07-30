import { get } from 'svelte/store';
import { oauth_verifiers } from '$lib/utils/sessionStore';
import type { RequestHandler } from "@sveltejs/kit";
import type { CallBackOptions } from '$lib/utils/types';

const tokenURL = 'https://api.twitter.com/2/oauth2/token';
const verifyObject = get(oauth_verifiers);
const params: CallBackOptions = {
  'client_id': import.meta.env.VITE_TWITTER_OAUTH_CLIENT_ID as string,
  'redirect_uri' :'http://127.0.0.1:5173/api/v1/callback',
  'grant_type': 'authorization_code',
  'code_verifier': verifyObject.code_verifier,
  'state': verifyObject.state,
  'code': ''
}

export const GET: RequestHandler = async(event) => {
    const state = event.url.searchParams.get('state');
    params.code = event.url.searchParams.get('code')!;
    // States don't match (vulnerable to attack)
    if (state != params.state) {throw Error("States do not match, aborting");}
    const token = await getToken();
    const user = await getUser(token);
    event.locals.user = user?.data.name
    // Redirect to homepage for now. 
    return {
      status: 302,
      headers: {
        location: '/'
      }
    }
};

const getToken = async() => {
  // One liner to transform json into application/x-www-form-urlencoded payload.
  const formBody = Object.keys(params).map(key => encodeURIComponent(key) + '=' + encodeURIComponent(params[key as keyof CallBackOptions])).join('&');
  return fetch(tokenURL, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded',
    },
    body: formBody
  }).then(res => res.json())
  .then(res => res.access_token);
};

const getUser = async(token:string) => {
  return fetch('https://api.twitter.com/2/users/me', {
    method: 'GET',
    headers: {
      "Authorization": `Bearer ${token}`,
      'Accept': 'application/json',
    }
  }).then(res => res.json());
};
import { get } from 'svelte/store';
import cryptoRandomString from 'crypto-random-string';
import crypto from 'crypto';
import { oauth_verifiers } from '$lib/stores/sessionStore';
import type { RedirectOptions, OAuthVerifiers } from '$lib/utils/types';
import type { RequestHandler } from "@sveltejs/kit";

const base64URLEncode = (str:Buffer) => {
  return str.toString('base64').replace(/\+/g, '-').replace(/\//g, '_').replace(/=/g, '');
}

const sha256 = (buffer:any) => {
  return crypto.createHash('sha256').update(buffer).digest();
}


// Ask for OAuth token from twitter.
export const GET:RequestHandler = async (event) => {
  // Create verifier and challenge in SHA256
  const verifier = cryptoRandomString({length:128, type:'alphanumeric'});
  const challenge = base64URLEncode(sha256(verifier));
  const state = cryptoRandomString({length: 15, type: 'distinguishable'});

  let endpoint = '/oauth2/authorize'
  switch(event.params.platform) {
    case 'twitter': 
      endpoint = 'https://twitter.com/i' + endpoint; break;
    case 'twitch':
      endpoint = 'https://id.twitch.tv' + endpoint; break;
  }

  const twitterParams = {
    'client_id': import.meta.env.DEV ? import.meta.env.VITE_TWITTER_OAUTH_CLIENT_ID as string : process.env.TWITTER_OAUTH_CLIENT_ID!,
    'scope': "tweet.read%20users.read%20tweet.write%20offline.access",
    'code_challenge': challenge,
    'code_challenge_method': 'S256',
    'code_verifier': verifier,
    'redirect_uri' :`http://127.0.0.1:5173/callback/twitter`,
  }

  const twitchParams = {
    'client_id': import.meta.env.DEV ? import.meta.env.VITE_TWITCH_CLIENT_ID as string : process.env.TWITCH_CLIENT_ID!,
    'scope': ['channel:manage:broadcast'].map(scope => encodeURIComponent(scope)).join(''),
    'force_verify': true, //Default is false, set true if need to reauthorize
    'redirect_uri' :`http://localhost:5173/callback/twitch`,
  }

  const params: RedirectOptions = {
    'state': state,
    'response_type': 'code',
    ...(event.params.platform === 'twitter') && twitterParams,
    ...(event.params.platform === 'twitch') && twitchParams
  }

  if (event.url.searchParams.get('state')) {
      return { status: 302, headers: { location: '/'}
    }
  }
  // Subscribe and set value then unsubscribe
  const unsub = oauth_verifiers.subscribe(data => {<OAuthVerifiers>{state: data.state, code_verifier:data.code_verifier}});
  oauth_verifiers.set(<OAuthVerifiers>{state: params.state, code_verifier: params.code_verifier});
  unsub();

  const locationURL = `${endpoint}?${Object.entries(params).flatMap(([key,val]) => val ? `${key}=${params[key as keyof RedirectOptions]}` : []).join('&')}`;
  
  return {
    status: 302,
    headers: {
      location: locationURL
    }
  }
};
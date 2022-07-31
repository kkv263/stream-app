import cryptoRandomString from 'crypto-random-string';
import crypto from 'crypto';
import { oauth_verifiers } from '$lib/utils/sessionStore';
import type { RedirectOptions, OAuthVerifiers } from '$lib/utils/types';
import type { RequestHandler } from "@sveltejs/kit";

const base64URLEncode = (str:Buffer) => {
  return str.toString('base64').replace(/\+/g, '-').replace(/\//g, '_').replace(/=/g, '');
}

const sha256 = (buffer:any) => {
  return crypto.createHash('sha256').update(buffer).digest();
}


// Create verifier and challenge in SHA256
const endpoint = 'https://twitter.com/i/oauth2/authorize'
const verifier = cryptoRandomString({length:128, type:'alphanumeric'});
const challenge = base64URLEncode(sha256(verifier));

const params: RedirectOptions = {
  'client_id': import.meta.env.DEV ? import.meta.env.VITE_TWITTER_OAUTH_CLIENT_ID as string : process.env.TWITTER_OAUTH_CLIENT_ID!,
  'redirect_uri' :'http://127.0.0.1:5173/api/v1/callback',
  'scope': "tweet.read%20users.read%20tweet.write%20offline.access",
  'state': cryptoRandomString({length: 15, type: 'distinguishable'}),
  'code_challenge': challenge,
  'challenge_method': 'S256',
  'code_verifier': verifier
}

// Ask for OAuth token from twitter.
export const GET:RequestHandler = async (event) => {
  if (event.url.searchParams.get('state')) {
      return { status: 302, headers: { location: '/'}
    }
  }
  // Subscribe and set value then unsubscribe
  const unsub = oauth_verifiers.subscribe(data => {<OAuthVerifiers>{state: data.state, code_verifier:data.code_verifier}});
  oauth_verifiers.set(<OAuthVerifiers>{state: params.state, code_verifier: params.code_verifier});
  unsub();
  return {
    status: 302,
    headers: {
      location: `${endpoint}?response_type=code&client_id=${params.client_id}&redirect_uri=${params.redirect_uri}&scope=${params.scope}&state=${params.state}&code_challenge=${params.code_challenge}&code_challenge_method=${params.challenge_method}`
    }
  }
};
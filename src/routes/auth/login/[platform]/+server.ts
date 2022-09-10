import cryptoRandomString from 'crypto-random-string';
import { sha256, base64URLEncode } from '$lib/_includes/generalHelpers';
import { oauth_verifiers, setSessions} from '$lib/stores/oauthVerifiersStore';
import type { RedirectOptions, OAuthVerifiers, Token } from '$lib/types/auth';
import type { RequestHandler } from "@sveltejs/kit";

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
    'redirect_uri' :`http://127.0.0.1:5173/auth/callback/twitter`,
  }

  const twitchParams = {
    'client_id': import.meta.env.DEV ? import.meta.env.VITE_TWITCH_CLIENT_ID as string : process.env.TWITCH_CLIENT_ID!,
    'scope': ['channel:manage:broadcast'].map(scope => encodeURIComponent(scope)).join(''),
    'force_verify': true, //Default is false, set true if need to reauthorize
    'redirect_uri' :`http://localhost:5173/auth/callback/twitch`,
  }

  const params: RedirectOptions = {
    'state': state,
    'response_type': 'code',
    ...(event.params.platform === 'twitter') && twitterParams,
    ...(event.params.platform === 'twitch') && twitchParams
  }

  if (event.url.searchParams.get('state')) {
      return new Response(undefined, { status: 302, headers: { location: '/'} })
  }
  oauth_verifiers.set(<OAuthVerifiers>{state: params.state, code_verifier: params.code_verifier});

  setSessions(event.locals, false)

  const locationURL = `${endpoint}?${Object.entries(params).flatMap(([key,val]) => val ? `${key}=${params[key as keyof RedirectOptions]}` : []).join('&')}`;
  
  return new Response(undefined, {
    status: 302,
    headers: {
      location: locationURL
    }
  })
};
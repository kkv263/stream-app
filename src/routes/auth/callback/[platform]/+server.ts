import { get } from 'svelte/store';
import { oauth_verifiers, setSessions, sessions} from '$lib/stores/oauthVerifiersStore';
import type { CallBackOptions, OAuthVerifiers, Token } from '$lib/types/auth';
import type { RequestHandler } from '@sveltejs/kit';

export const GET: RequestHandler = async(event) => {
  const verifyObject = get(oauth_verifiers);
  let endpoint = 'oauth2/token';
  const platform = event.params.platform;
  switch(platform) {
    case 'twitter': 
      endpoint = 'https://api.twitter.com/2/' + endpoint; break;
    case 'twitch':
      endpoint = 'https://id.twitch.tv/' + endpoint; break;
  }

  const twitterParams = {
    'client_id': import.meta.env.DEV ? import.meta.env.VITE_TWITTER_OAUTH_CLIENT_ID as string : process.env.TWITTER_OAUTH_CLIENT_ID!,
    'redirect_uri' :'http://127.0.0.1:5173/auth/callback/twitter',
    'code_verifier': verifyObject.code_verifier,
  }

  const twitchParams = {
    'client_id': import.meta.env.DEV ? import.meta.env.VITE_TWITCH_CLIENT_ID as string : process.env.TWITCH_CLIENT_ID!,
    'client_secret': import.meta.env.DEV ? import.meta.env.VITE_TWITCH_CLIENT_SECRET as string : process.env.TWITCH_CLIENT_SECRET!,
    'redirect_uri' :`http://localhost:5173/auth/callback/twitch`,
  }

  const params: CallBackOptions = {
    'grant_type': 'authorization_code',
    'state': verifyObject.state,
    'code': event.url.searchParams.get('code')!,
    ...(platform === 'twitter') && twitterParams,
    ...(platform === 'twitch') && twitchParams
  }

  const getToken = async() => {
    // One liner to transform json into application/x-www-form-urlencoded payload.
    const formBody = Object.entries(params).flatMap(([key,val]) => val ? `${encodeURIComponent(key)}=${encodeURIComponent(params[key as keyof CallBackOptions]!)}` : []).join('&');
    return fetch(endpoint, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: formBody
    }).then(res => res.json())
    .then(res => res);
  };

  const state = event.url.searchParams.get('state');

  // States don't match (vulnerable to attack)
  if (state != params.state) {throw Error("States do not match, aborting");}

  const tokenResponse = await getToken();
  const { access_token, refresh_token } = tokenResponse

  Object.entries(sessions).forEach(([key, value]) => {
    const sessionValue = get(value);
    if (sessionValue) {
      event.locals[`${key}tokens`] = sessionValue
    }
  });

  event.locals[`${platform}tokens`] = { 
    access_token:access_token,
    refresh_token:refresh_token
  };

  oauth_verifiers.set(<OAuthVerifiers>{state: '', code_verifier: ''});

  setSessions(event.locals, true);

  // Redirect to homepage for now. 
  return new Response('', {
    status: 302,
    headers: {
      location: '/',
    }
  });
};
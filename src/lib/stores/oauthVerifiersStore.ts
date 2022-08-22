import { writable } from 'svelte/store'
import type { OAuthVerifiers, Token } from '$lib/types/auth';
export const oauth_verifiers = writable({state: '', code_verifier: ''} as OAuthVerifiers);
export const twitter_session = writable({access_token: '', refresh_token: ''} as Token);
export const twitch_session = writable({access_token: '', refresh_token: ''} as Token);

export const sessions = {twitter: twitter_session, twitch:twitch_session};

export const setSessions = (locals:any, reset:boolean) => {
  Object.entries(sessions).forEach(([key, value]) => {
    if (locals[`${key}tokens`]) {
      value.set(<Token>{access_token: reset ? '' : locals[`${key}tokens`]?.access_token, refresh_token: reset ? '' : locals[`${key}tokens`]?.refresh_token});
    }
  });
};
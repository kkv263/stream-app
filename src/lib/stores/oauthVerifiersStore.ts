import { writable } from 'svelte/store'
import type { OAuthVerifiers } from '$lib/types/auth';

export const oauth_verifiers = writable({state: '', code_verifier: ''} as OAuthVerifiers);
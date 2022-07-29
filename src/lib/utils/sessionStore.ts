import { writable } from 'svelte/store'
import type { User } from "@supabase/supabase-js";
import type { OAuthVerifiers } from '$lib/utils/types';

export const user = writable({} as User | null );
export const oauth_verifiers = writable({state: '', code_verifier: ''} as OAuthVerifiers);
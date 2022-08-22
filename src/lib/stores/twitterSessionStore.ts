import { writable } from 'svelte/store'
import type { TwitterUser } from '$lib/types/twitter';

export const twitterUser = writable({} as TwitterUser | undefined );
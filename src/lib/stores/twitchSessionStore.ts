import { writable } from 'svelte/store'
import type { TwitchUser } from '$lib/types/twitch';

export const twitchUser = writable({} as TwitchUser | undefined );
import { writable } from 'svelte/store'
import type { DiscordUser } from '$lib/types/discord';

export const discordUser = writable({} as DiscordUser | undefined );
/// <reference types="@sveltejs/kit" />

// See https://kit.svelte.dev/docs/types#app
// for information about these interfaces
// and what to do when importing types
declare namespace App {
	interface Locals {
		[locals:string],
		twitteruser?: string | null,
		twitterid?: string | null,
		twittertoken?: string | null,
		twitchuser?: string | null,
		twitchid?: string | null,
		twitchtoken?: string | null,
		platform: string | null
	}
	// interface Platform {}
	interface Session {
		twitteruser?: string | null,
		twitchuser?: string | null,
	}
	// interface Stuff {}
}

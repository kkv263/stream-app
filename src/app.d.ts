/// <reference types="@sveltejs/kit" />

// See https://kit.svelte.dev/docs/types#app
// for information about these interfaces
// and what to do when importing types
declare namespace App {
	interface Locals {
		[locals:string],
		discordtokens?:any,
		twittertokens?: any,
		twitchtokens?: any,
		platform: string | null
	}
	// interface Platform {}
	// interface PrivateEnv {}
  // interface PublicEnv {}
}

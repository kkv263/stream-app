<script lang="ts">
	import Section from "$lib/components/layout/Section.svelte";
	import TwitterLogo from "$lib/components/icons/TwitterLogo.svelte";
	import TwitterGetTweets from "./TwitterGetTweets.svelte";
	import TwitterPostTweet from "./TwitterPostTweet.svelte";
	import TwitterUpdateProfile from "./TwitterUpdateProfile.svelte";
	import { sideDrawerState } from "$lib/stores/sideDrawerStore";
	import { twitterUser } from '$lib/stores/twitterSessionStore'

	export let twtUser:string;
	let components = [TwitterPostTweet, TwitterGetTweets]
</script>

<Section>
	<h1>Hello world!</h1>

	<button type="button" class="twitter-button" on:click={() => sideDrawerState.set('twitter')}>
		<TwitterLogo width={'32px'} height={'32px'}/>
	</button>
  {#if twtUser}
  	<h2>Welcome @{twtUser}</h2>
		<div class="twitter-header">
			<div>@{$twitterUser?.username} {$twitterUser?.name}</div>
    	<a href='logout/twitter'>logout tweeter</a>
		</div>
		<div class="twitter-wrapper">
			{#each components as component, i}
				<div class="wrapper">
					<svelte:component this={component} />
				</div>
			{/each}
		</div>
  {:else}
		<h2>You are not logged in to twitter</h2>
    <a href='login/twitter' rel="external">authorize tweeter</a>
  {/if}
</Section>

<style lang="scss">

	.twitter-button {
		background-color: #1DA1F2;
		display: flex;
		align-items: center;
		display: flex;
		border: 0;
		border-radius: 8px;
		width: 64px;
		height: 64px;
		padding: 16px;
		cursor: pointer;
	}
	a {
		margin-bottom: 32px;
		display: inline-block;
	}
	.wrapper {
		display: flex;
		flex-direction: column;
		align-items: flex-start;
		gap: 16px;
		border-bottom: 10px solid slateblue;
		margin-bottom: 16px;
	}
</style>
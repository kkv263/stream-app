<script lang="ts">
	import Section from "$lib/components/layout/Section.svelte";
	import TwitterGetTweets from "./TwitterGetTweets.svelte";
	import TwitterPostTweet from "./TwitterPostTweet.svelte";
	import TwitterUpdateProfile from "./TwitterUpdateProfile.svelte";
	export let twtUser:string;
	let components = [TwitterPostTweet, TwitterUpdateProfile, TwitterGetTweets]
</script>

<Section>
	<h1>Hello world!</h1>
  {#if twtUser}
    <h2>Welcome {twtUser}</h2>
    <a href='logout/twitter'>logout tweeter</a>
		{#each components as component, i}
			<div class="wrapper">
				<svelte:component this={component} />
			</div>
		{/each}

  {:else}
		<h2>You are not logged in</h2>
    <a href='login/twitter' rel="external">authorize tweeter</a>
  {/if}
</Section>

<style lang="scss">
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
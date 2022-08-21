<script lang="ts">
	import Section from "$lib/components/layout/Section.svelte";
	import { sideDrawerState } from "$lib/stores/sideDrawerStore";
	import TwitchChannelInfo from "./TwitchChannelInfo.svelte";
	export let twitchUser:string;
</script>

<Section>
  <div class="wrapper">
  </div>
	<h1>Hello world!</h1>
  {#if twitchUser}
    <h2>Welcome {twitchUser}</h2>
    <a href='logout/twitch'>revoke twitch</a>

		<TwitchChannelInfo />
  {:else}
    <h2>You are not logged in to twitch</h2>
    <a href='login/twitch' rel="external">authorize twitch</a>
  {/if}
</Section>

<style lang="scss">
	.wrapper {
		display: flex;
		flex-direction: column;
		align-items: flex-start;
		gap: 16px;
		border-bottom: 10px solid slateblue;
		margin-bottom: 16px;
	}
</style>
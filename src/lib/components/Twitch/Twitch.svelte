<script lang="ts">
	import Section from "$lib/components/layout/Section.svelte";
	import { sideDrawerState } from "$lib/stores/sideDrawerStore";
	import TwitchChannelInfo from "./TwitchChannelInfo.svelte";
	import TwitchRaid from "./TwitchRaid.svelte";
	export let twitchUser:string;
</script>

<Section>
  <div class="wrapper">
  </div>
	<h1>Hello world!</h1>
  {#if twitchUser}
    <h2>Welcome {twitchUser}</h2>
    <a href='auth/logout/twitch'>revoke twitch</a>
		<TwitchChannelInfo />
		<TwitchRaid />
  {:else}
    <h2>You are not logged in to twitch</h2>
    <a href='auth/login/twitch' rel="external">authorize twitch</a>
  {/if}
</Section>

<style lang="scss">
</style>
<script lang="ts">
	import Section from "$lib/components/layout/Section.svelte";
	export let discordUser:string;
</script>

<Section>
  <div class="wrapper">
  </div>
	<h1>Hello world!</h1>
  {#if discordUser}
    <h2>Welcome {discordUser}</h2>
    <a href='auth/logout/discord'>revoke discord</a>
  {:else}
    <h2>You are not logged in to discord</h2>
    <a href='auth/login/discord' rel="external">authorize discord</a>
  {/if}
</Section>

<style lang="scss">
</style>
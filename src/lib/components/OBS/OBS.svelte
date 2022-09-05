<script lang="ts">
  import { setContext, onMount } from "svelte";
  import { sideDrawerState } from "$lib/stores/sideDrawerStore";
  import Section from "$lib/components/layout/Section.svelte";
  import ObsInput from "./OBSInput.svelte";
  import ObsScene from "./OBSScene.svelte";
  import ObsControl from "./OBSControl.svelte";
  import OBSWebSocket from 'obs-websocket-js';
  import { checkExistingSession, obsConnect, obsDisconnect, obsSession, obsConnected } from "$lib/stores/obsSessionStore";
  
  let localhost:string;
  let password:string;
  let existingOBSParams:any;
  // const obs:OBSWebSocket = new OBSWebSocket();
  // setContext('obs', obs);

  //TODO: add automatic reconnect to supabase
  let automaticReconnect = false;

  onMount(async () => {
    existingOBSParams = await checkExistingSession() ?? false;

    localhost = $obsSession.localhost
    password = $obsSession.password

    if (existingOBSParams && automaticReconnect) {
      obsConnect($obsSession.localhost, $obsSession.password)
    }
	});
</script>

<Section>
  <h1>Hello obs</h1>
  <button type="button" class="obs-wrapper" on:click={() => sideDrawerState.set('obs')}>
    <span>OBS</span>
  </button>
  {#if !$obsConnected}
    <input placeholder='127.0.0.1:PORT' type="text" bind:value={localhost} />
    <input placeholder="password" type="password" bind:value={password} />
    <button on:click={() => obsConnect(localhost, password)}>connect to obs</button>
  {:else}
    <button on:click={() => obsDisconnect()}>disconnect from obs</button>
    <!-- <ObsScene /> -->
    <!-- <ObsInput /> -->
    <!-- <ObsControl /> -->
  {/if}

</Section>

<style lang="scss">
  @import '../../../styles/vars.scss';
  .obs-wrapper {
		background-color: $off-black;
    color: #fff;
		display: flex;
		align-items: center;
    justify-content: center;
		display: flex;
		border: 0;
		border-radius: 8px;
		width: 96px;
		height: 96px;
		padding: 32px;
		cursor: pointer;
    line-height: 0;
  }
</style>
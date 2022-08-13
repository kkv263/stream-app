<script lang="ts">
  import { setContext } from "svelte";
  import { supabase } from "$lib/utils/supabaseClient";
  import OBSWebSocket from 'obs-websocket-js';
  import Section from "$lib/components/layout/Section.svelte";
  import ObsInput from "./OBSInput.svelte";
  
  const obs:OBSWebSocket = new OBSWebSocket();
  let localhost:string;
  let password:string;
  let loadedInputs:any = [];
  let connectedToObs:boolean = false;

  setContext('obs', obs)

  const loadOBSComponents = async () => {
    if(!connectedToObs) { return; }
    const { inputs }  = await obs.call('GetInputList');
    const loadInputs = [];

    for (const input of inputs) {
      const { inputVolumeDb } = await obs.call('GetInputVolume', {inputName: input.inputName!.toString()});
      const { inputMuted } = await obs.call('GetInputMute', {inputName: input.inputName!.toString()});
      loadInputs.push({
        name: input.inputName!.toString(),
        volume: inputVolumeDb.toFixed(1),
        muted: inputMuted
      })
    }

    return loadInputs;
  }

  const obsConnect = async() => {
    try {
      // TODO: Save pw and localhost stuff in supabase. If it fails, handle error and have user reconnectr to update
      // Localhost: 127.0.0.1
      const { obsWebSocketVersion, negotiatedRpcVersion } = await obs.connect(`ws://${localhost.trim()}`, password);
      console.log(`Connected to server ${obsWebSocketVersion} (using RPC ${negotiatedRpcVersion})`)
      connectedToObs = true;
      loadedInputs = await loadOBSComponents();
    } catch (error: any) {
      console.error('Failed to connect', error.code, error.message);
      alert(error.message);
    }
  }

  const obsDisconnect = async() => {
    await obs.disconnect();
    try {
      await obs.disconnect();
      connectedToObs = false;
      alert('disconnected from obs');
    } catch (error: any) {
      console.log(error)
    }
  }

  const obsToggleMute = async() => {
    const { inputMuted } = await obs.call('ToggleInputMute', {inputName: 'Mic/Aux'});
    console.log(inputMuted)
  }

</script>

<Section>
  <h1>Hello obs</h1>
  {#if !connectedToObs}
    <input placeholder="localhost" bind:value={localhost} />
    <input placeholder="password" bind:value={password} />
    <button on:click={obsConnect}>connect to obs</button>
  {:else}
    <button on:click={obsDisconnect}>disconnect from obs</button>
    <div class="wrapper">
      {#each loadedInputs as { name, volume, muted }, i}
        <ObsInput name={name} volume={volume}, muted={muted}/>
      {/each}
    </div>
  {/if}

</Section>

<style lang="scss">
  .wrapper {
    display: flex;
    flex-direction: column;
    align-items: flex-start;
  }
</style>
<script lang="ts">
  import { getContext } from 'svelte';
  import type OBSWebSocket from 'obs-websocket-js';

  export let name:string;
  export let volume:string;
  export let muted:boolean;
  let obs:OBSWebSocket = getContext('obs');

  const obsToggleMute = async() => {
    const { inputMuted } = await obs.call('ToggleInputMute', { inputName: name });
    muted = (inputMuted)
  }

  const obsHandleVolume = async () => {
    await obs.call('SetInputVolume', { inputName: name, inputVolumeDb: parseFloat(volume)})
  }
</script>

<!-- Definite inpplement settings for % on input -->

<span>input: {name}</span>
<span>vol: {volume}</span>
<input list="my-detents" step='.1' type="range" min="-100" max="0" bind:value={volume} on:change={obsHandleVolume}/>
<span>muted: {muted}</span>
<button on:click={obsToggleMute}>toggleMute</button>

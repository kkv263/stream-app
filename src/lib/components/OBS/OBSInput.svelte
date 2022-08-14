<script lang="ts">
  import { getContext, onMount } from 'svelte';
  import type OBSWebSocket from 'obs-websocket-js';

  export let name:string;
  let volume:string;
  let muted:boolean;
  let obs:OBSWebSocket = getContext('obs');

  onMount(async () => {
    // Load volume and muted status
    const { inputVolumeDb } = await obs.call('GetInputVolume', {inputName: name});
    const { inputMuted } = await obs.call('GetInputMute', {inputName: name});

    volume = inputVolumeDb.toFixed(1);
    muted = inputMuted;

    obs.on('InputMuteStateChanged', (e) => {
      if (name != e.inputName) { return; } 
      muted = e.inputMuted;
    })

    obs.on('InputVolumeChanged', (e) => {
      if (name != e.inputName) { return; } 
      volume = e.inputVolumeDb.toFixed(1);
    })
	});

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
<input list="my-detents" step='.1' type="range" min="-100" max="0" bind:value={volume} on:input={obsHandleVolume}/>
<span>muted: {muted}</span>
<button on:click={obsToggleMute}>toggleMute</button>

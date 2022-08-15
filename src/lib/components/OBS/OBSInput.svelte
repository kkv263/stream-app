<script lang="ts">
  import { getContext, onMount, onDestroy } from 'svelte';
  import type OBSWebSocket from 'obs-websocket-js';
  import type { ObsInputs } from '$lib/types/obs';

  let obs:OBSWebSocket = getContext('obs');
  let inputs:ObsInputs = {};

  onMount(async () => {
    inputs = await loadInputs();

    // Load volume and muted status
    obs.on('InputMuteStateChanged', (e) => inputs[e.inputName].muted = e.inputMuted);
    obs.on('InputVolumeChanged', (e) => inputs[e.inputName].volume = e.inputVolumeDb.toFixed(0));
    obs.on('InputVolumeMeters', (e) => {
      // console.log(e.inputs)
    });
	});

  onDestroy(() => {
    obs.off('InputMuteStateChanged', () => {});
    obs.off('InputVolumeChanged', () => {});
    obs.off('InputVolumeMeters', () => {});
	});

  const loadInputs = async() => {
    const specialInputs = await obs.call('GetSpecialInputs');
    let loadInputs:ObsInputs = {};

    for (const input of Object.values(specialInputs)) {
      if (!input) { continue; }
      const { inputVolumeDb } = await obs.call('GetInputVolume', {inputName: input});
      const { inputMuted } = await obs.call('GetInputMute', {inputName: input});
      loadInputs[input] = { volume: inputVolumeDb.toFixed(1), muted: inputMuted }
    }

    return loadInputs;
  }

  const obsToggleMute = async(name:string) => {
    const { inputMuted } = await obs.call('ToggleInputMute', { inputName: name });
    inputs[name].muted = inputMuted
  }

  const obsHandleVolume = async (name:string) => {
    await obs.call('SetInputVolume', { inputName: name, inputVolumeDb: parseFloat(inputs[name].volume)})
  }
</script>

<!-- Definite inpplement settings for % on input -->

{#each Object.entries(inputs) as [ name, values ] }
  <div>
    <span>input: {name}</span>
    <span>vol: {values.volume}</span>
    <input step='1' type="range" min="-100" max="0" bind:value={values.volume} on:input={()=>obsHandleVolume(name)}/>
    <span>muted: {values.muted}</span>
    <button on:click={()=>obsToggleMute(name)}>toggleMute</button>
  </div>
{/each}

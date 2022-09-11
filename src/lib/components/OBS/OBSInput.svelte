<script lang="ts">
  import { onDestroy } from 'svelte';
  import Block from '$lib/components/Grid/Block.svelte'
  import SpeakerMuted from '$lib/components/icons/SpeakerMuted.svelte';
  import SpeakerWave from '$lib/components/icons/SpeakerWave.svelte';
  import { obsSession, obsConnected } from "$lib/stores/obsSessionStore";
  import ConnectObs from '$lib/components/OBS/ConnectObs.svelte';
  import type { ObsInputs } from '$lib/types/obs';

  let inputs:ObsInputs = {};
  let inputsPromise: any = Promise.resolve([]);

  const muted: Record<string, any> = {
    true: SpeakerMuted,
    false: SpeakerWave,
  }

  onDestroy(() => {
    $obsSession.obs.off('InputMuteStateChanged', () => {});
    $obsSession.obs.off('InputVolumeChanged', () => {});
    $obsSession.obs.off('InputVolumeMeters', () => {});
	});

  const loadInputs = async() => {
    const specialInputs = await $obsSession.obs.call('GetSpecialInputs');
    let loadInputs:ObsInputs = {};

    for (const input of Object.values(specialInputs)) {
      if (!input) { continue; }
      const { inputVolumeDb } = await $obsSession.obs.call('GetInputVolume', {inputName: input});
      const { inputMuted } = await $obsSession.obs.call('GetInputMute', {inputName: input});
      loadInputs[input] = { volume: inputVolumeDb.toFixed(1), muted: inputMuted }
    }
    inputs = loadInputs;
    // Load volume and muted status
    $obsSession.obs.on('InputMuteStateChanged', (e) => inputs[e.inputName].muted = e.inputMuted);
    $obsSession.obs.on('InputVolumeChanged', (e) => inputs[e.inputName].volume = e.inputVolumeDb.toFixed(0));
    $obsSession.obs.on('InputVolumeMeters', (e) => {
      // console.log(e.inputs)
    });

  }

  const renderInputs = (node:HTMLDivElement) => {
    inputsPromise = loadInputs();
  }

  const obsToggleMute = async(name:string) => {
    const { inputMuted } = await $obsSession.obs.call('ToggleInputMute', { inputName: name });
    inputs[name].muted = inputMuted
  }

  const obsHandleVolume = async (name:string) => {
    await $obsSession.obs.call('SetInputVolume', { inputName: name, inputVolumeDb: parseFloat(inputs[name].volume)})
  }
</script>

<!-- Definite inpplement settings for % on input -->

<Block type="obs" on:dragtoggle on:deleteblock on:lockblock>
  <div class="obs-inputs">
    {#if $obsConnected}
    <div class="connect-wrapper" use:renderInputs> </div>
    {#await inputsPromise}
      <!-- TODO: Style waiting -->
      <span>waiting</span>
    {:then} 
      <h3>Inputs</h3>
      {#each Object.entries(inputs) as [ name, values ] }
        <div class="input">
          <div class="top">
            <div class="left">
              <span>{name}</span>
              <button data-muted={values.muted} type="button" on:click={()=>obsToggleMute(name)}>
                <svelte:component width="20px" height="20px" this={muted[inputs[name].muted.toString()]}/>
              </button>
            </div>
            <span class="vol"><span >{values.volume}</span><span>dB</span></span>
          </div>
          <input step='1' type="range" min="-100" max="0" bind:value={values.volume} on:input={()=>obsHandleVolume(name)}/>
        </div>
      {/each}
    {/await}
    {:else}
      <ConnectObs />
    {/if}
  </div>
</Block>

<style lang="scss">
  @import '../../../styles/vars.scss';
.obs-inputs {
  background-color: $off-black;
  color: #fff;
  max-height: 204px;
  overflow: auto;
  height: 100%;
}

.top {
  display:flex;
  justify-content: space-between;
  padding-bottom: 8px;
}

h3 {
  color: #fff;
  padding: 16px;
}

.left {
  display: flex;
  align-items: center;
  gap: 8px;

  button {
    background-color: transparent;
    color: #fff;
    border: 0;
    padding: 0;
    display: flex;
    align-items: center;
    cursor: pointer;
    &[data-muted=true] {
      color: $error-red;
    }

    &:hover,
    &:focus {
      opacity: .75;
    }
  }
}

.vol {
  display: flex;
  border-radius: 8px;
  gap: 4px;
}
.input {
  padding: 8px 16px;
  position: relative;
  transition: $transition;
  font-weight: bold;
  display: flex;
  flex-direction: column;
}
</style>
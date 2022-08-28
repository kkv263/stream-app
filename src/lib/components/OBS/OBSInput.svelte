<script lang="ts">
  import { getContext, onMount, onDestroy } from 'svelte';
  import OBSHeader from '$lib/components/OBS/OBSHeader.svelte';
  import Block from '$lib/components/Grid/Block.svelte'
  import SpeakerMuted from '$lib/components/icons/SpeakerMuted.svelte';
  import SpeakerWave from '$lib/components//icons/SpeakerWave.svelte';
  import type OBSWebSocket from 'obs-websocket-js';
  import type { ObsInputs } from '$lib/types/obs';

  let obs:OBSWebSocket = getContext('obs');
  let inputs:ObsInputs = {};

  const muted: Record<string, any> = {
    true: SpeakerMuted,
    false: SpeakerWave,
  }

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

<Block>
  <OBSHeader />
  <div class="obs-inputs">
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
  </div>
</Block>

<style lang="scss">
  @import '../../../styles/vars.scss';
.obs-inputs {
  background-color: $off-black;
  color: #fff;
  max-height: 192px;
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
  border-radius: 4px;
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
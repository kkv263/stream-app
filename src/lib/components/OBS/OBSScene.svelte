<script lang="ts">
  import { onDestroy } from 'svelte';
  import Block from '$lib/components/Grid/Block.svelte'
  import PlusCircle from '$lib/components/icons/PlusCircle.svelte';
  import { obsSession, obsConnected } from "$lib/stores/obsSessionStore";
  import ConnectObs from '$lib/components/OBS/ConnectObs.svelte';
  import type { ObsScenes } from '$lib/types/obs';

  let obsScenes:ObsScenes[] = [];
  let obsRefs:any = {};
  let activeSceneName:string;
  let previewSceneName:string;
  let createSceneName:string;
  let addActive:boolean = false;
  let inputError:any;
  let scenesPromise:any = Promise.resolve([]);

  onDestroy(() => {
    $obsSession.obs.off('CurrentProgramSceneChanged', () => {});
    $obsSession.obs.off('SceneCreated', () => {});
    $obsSession.obs.off('SceneRemoved', () => {});
	});

  const loadScenes = async() => {
    const { currentProgramSceneName, scenes, currentPreviewSceneName } = await $obsSession.obs.call('GetSceneList');
    const loadScenes = [];

    for (const input of Object.values(scenes).reverse()) {
      if (!input) { continue; }
      loadScenes.push({ name: <string>input.sceneName?.toString() });
    }

    obsScenes = loadScenes;
    activeSceneName = currentProgramSceneName ?? '';
    previewSceneName =  currentPreviewSceneName ?? '';

    $obsSession.obs.on('CurrentProgramSceneChanged', (e) => activeSceneName = e.sceneName);
    $obsSession.obs.on('SceneCreated', (e) => {
      obsScenes = [...obsScenes, { name: e.sceneName }];
     });
     $obsSession.obs.on('SceneRemoved', (e) => {
      for (let i = 0; i < obsScenes.length; i++) {
        if (obsScenes[i].name === e.sceneName) {
          obsScenes.splice(i, 1);
          obsScenes = obsScenes;
          return;
        }
      }
    });
  }

  const renderScenes = (node:HTMLDivElement) => {
    scenesPromise = loadScenes();
  }

  const toggleAdd = () => {
    createSceneName = '';
    addActive = !addActive
    inputError = null
  }

  const OBSChangeScene = async(name:string) => {
    if (name === activeSceneName) { return; }
    await obs.call('SetCurrentProgramScene', { sceneName: name })
  }

  const OBSRemoveScene = async(name:string, index:number) => {
    await obs.call('RemoveScene', { sceneName: name })
  }

  const OBSCreateScene = async() => {
    try {
      await obs.call('CreateScene', { sceneName: createSceneName })
    } catch (error) {
      inputError = (<string>error).toString().replace('Error: ', '');
      return;
    }
    createSceneName = '';
    addActive = false;
    inputError = null
  }
</script>

<Block type="obs" on:dragtoggle on:deleteblock on:lockblock>
  <div class="obs-scenes">
    {#if $obsConnected}
      <div use:renderScenes></div>
      {#await scenesPromise}
        <!-- TODO: Style waiting -->
        <span>waiting</span>
      {:then} 
      <div class="top">
        <div class="title">
          <h3>Scenes</h3>
          <div>Active: {activeSceneName}</div>
        </div>
        <div class="add-wrapper">
          {addActive ? 'Cancel' : 'Add'}
          <button data-active={addActive} class="add" type="button" on:click={toggleAdd}>
            <PlusCircle width="24px" height="24px"/>
          </button>
        </div>

      </div>
      <div data-active={addActive} class="input-container">
        <div data-error={!!inputError} class="input-wrapper">
          <input placeholder="Scene Name" type="text" bind:value={createSceneName} />
          <span class="error-span">{inputError ?? ''}</span>
          <button type="button" on:click={OBSCreateScene} >Create Scene</button>
        </div>
      </div>

      {#each obsScenes as {name}, i}
      <div bind:this={obsRefs[name]} data-active={name === activeSceneName} on:click={() => OBSChangeScene(name)} class="scene">
        <div>{name}</div>
        <button class="remove" on:click={() => OBSRemoveScene(name, i)} type="button">Remove</button>
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
  .obs-scenes {
    background-color: $off-black;
    color: #fff;
    overflow: auto;
    max-height: 204px;
    height: 100%;
  }

  .top {
    padding: 16px;
    display: flex;
    justify-content: space-between;
    align-items: center;
  }

  .title {
    div {
      font-size: 12px;
      opacity: .75;
    }
  }

  h3 {
    color: #fff;
    padding-bottom: 0;
  }

  button {
    background-color: $off-white;
    border: 0;
    cursor: pointer;
    font-size: 14px;
    transition: $transition;
  }

  .add-wrapper {
    display: flex;
    align-items: center;
    font-size: 14px;
    gap: 4px;
  }

  .add {
    background-color: transparent;
    color: $off-white;
    border: 0;
    display: flex;
    align-items: center;
    padding: 0;

    &:hover,
    &:focus {
      color: darken($off-white, 10%);
    } 

    &:global svg {
      transition: $transition;
    }

    &[data-active=true] {
      &:global svg {
        transform: rotate(-45deg);
      }
    }
  }
  
  .input-container {
    max-height: 0;
    opacity: 0;
    visibility: hidden;
    transition: $transition;

    &[data-active=true] {
      opacity: 1;
      max-height: 1000px;
      visibility: visible;
    }
  }

  .input-wrapper {
    display: flex;
    padding: 8px 16px;
    flex-direction: column;
    font-size: 13px;

    &[data-error=true] {
      input {
        border: 2px solid $error-red;
        background-color: lighten($error-red, 45%);
      }
    }

    span {
      padding-top: 4px;
      color: $error-red;
    }
    
    input {
      padding: 4px 8px;
      border-radius: 8px;
      border: 2px solid transparent;
    }

    button {
      margin-top: 8px;
      border-radius: 100px;
      padding: 4px 8px;
      align-self: flex-start;
      font-size: 13px;

      &:hover,
      &:focus {
        background-color: darken($off-white, 10%);
      } 
    }
  }

  .scene {
    padding: 8px 16px;
    position: relative;
    cursor: pointer;
    transition: $transition;
    font-weight: bold;

    div {
      padding-bottom: 8px;
    }

    &[data-active = 'true'] {
      background-color: $blue;

      &:after {
        content: 'Active';
        position: absolute;
        top: 4px;
        right: 4px;
        font-size: 12px;
        border: 1px solid #fff;
        padding: 2px 4px;
        border-radius: 8px;
      }
    }

    &:hover,
    &:focus {
      background-color: darken($blue, 10%);
    }

    .remove {
      background-color: $off-white;
      border-radius: 100px;
      padding: 2px 8px;
    }
  }
</style>
<script lang="ts">
  import { getContext, onDestroy, onMount } from 'svelte';
  import type OBSWebSocket from 'obs-websocket-js';
  import type { ObsScenes } from '$lib/types/obs';

  let obs:OBSWebSocket = getContext('obs');
  let obsScenes:ObsScenes[] = [];
  let activeSceneName:string;
  let createSceneName:string;

  onMount(async () => {
    const obsSceneParams = await loadScenes();
    obsScenes = obsSceneParams.scenes;
    activeSceneName = obsSceneParams.activeSceneName;

    obs.on('CurrentProgramSceneChanged', (e) => activeSceneName = e.sceneName);
    obs.on('SceneCreated', (e) => activeSceneName = e.sceneName);
    obs.on('SceneRemoved', (e) => {
      for (let i = 0; i < obsScenes.length; i++) {
        if (obsScenes[i].name === e.sceneName) {
          obsScenes.splice(i, 1);
          obsScenes = obsScenes;
          return;
        }
      }
    });
	});

  onDestroy(() => {
    obs.off('CurrentProgramSceneChanged', () => {});
    obs.off('SceneCreated', () => {});
    obs.off('SceneRemoved', () => {});
	});

  const loadScenes = async() => {
    const { currentProgramSceneName, scenes, currentPreviewSceneName } = await obs.call('GetSceneList');
    const loadScenes = [];

    for (const input of Object.values(scenes).reverse()) {
      if (!input) { continue; }
      loadScenes.push({ name: <string>input.sceneName?.toString() });
    }

    return { 
      'activeScenePreviewName': currentPreviewSceneName ?? '',
      'activeSceneName': currentProgramSceneName ?? '',
      'scenes': loadScenes  
    };
  }

  const OBSChangeScene = async(name:string) => {
    await obs.call('SetCurrentProgramScene', { sceneName: name })
  }

  const OBSRemoveScene = async(name:string, index:number) => {
    await obs.call('RemoveScene', { sceneName: name })
    obsScenes.splice(index, 1);
    obsScenes = obsScenes;
  }

  const OBSCreateScene = async() => {
    await obs.call('CreateScene', { sceneName: createSceneName })
    obsScenes = [...obsScenes, { name: createSceneName }];
  }
</script>

<div>
  <span>currentActiveScene: {activeSceneName}</span>
  <small></small>
  {#each obsScenes as {name}, i}
    <span>scene: {name}</span>
    <button on:click={() => OBSChangeScene(name)} type="button">change scene to {name}</button>
    <button on:click={() => OBSRemoveScene(name, i)} type="button">remove scene</button>
    <small></small>
  {/each}
  <input type="text" bind:value={createSceneName} />
  <button type="button" on:click={OBSCreateScene} >create scene</button>
</div>

<style lang="scss">
  div {
    display: flex;
    flex-direction: column;
    align-items: flex-start;
  }
  small {
    width: 100%;
    margin-bottom: 16px;
    border-bottom: 5px solid coral;
  }
</style>
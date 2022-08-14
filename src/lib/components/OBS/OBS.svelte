<script lang="ts">
  import { setContext, onMount } from "svelte";
  import { supabase } from "$lib/_includes/supabaseClient";
  import { validateWebsocketUrl } from "$lib/_includes/generalHelpers";
  import OBSWebSocket from 'obs-websocket-js';
  import Section from "$lib/components/layout/Section.svelte";
  import ObsInput from "./OBSInput.svelte";
  import ObsScene from "./OBSScene.svelte";
  
  const obs:OBSWebSocket = new OBSWebSocket();
  let localhost:string;
  let password:string;
  // TODO: types
  let loadedInputs:any = [];
  let loadedScenes:any = [];
  let connectedToObs:boolean = false;
  let existingOBSParams:boolean = false;
  let activeSceneName:string | undefined;
  let activeScenePreviewName:string | undefined;

  setContext('obs', obs)

  onMount(async () => {
    try {
      const user = supabase.auth.user();
      let { data, error, status } = await supabase
        .from('obs')
        .select('websocket_url, password')
        .eq('id', user?.id)
        .single();

      if (error && status !== 406) { throw error; }

      if (data) {
        localhost = data.websocket_url ?? '';
        password = data.password ?? '';

        if (localhost !== '' && password !== '') {
          existingOBSParams = true;
          obsConnect();
        }
      }

      // If there's no row, create a row.
      if (status === 406) {
        const { error } = await supabase
        .from('obs')
        .insert({ id: user?.id }, { returning: "minimal" });
        if (error) { throw error; }
      }
    } catch (error) {
      console.log(error);
    }
	});

  const loadOBSComponents = async () => {
    if(!connectedToObs) { return; }
    const specialInputs = await obs.call('GetSpecialInputs');
    const { currentProgramSceneName, scenes, currentPreviewSceneName } = await obs.call('GetSceneList');
    const loadInputs = [];
    const loadScenes = [];

    for (const input of Object.values(specialInputs)) {
      if (!input) { continue; }
      loadInputs.push({ name: input })
    }

    for (const input of Object.values(scenes)) {
      if (!input) { continue; }
      loadScenes.push({ name: input.sceneName, index: input.sceneIndex })
    }

    return { 
      'activeScenePreviewName': currentPreviewSceneName ?? '',
      'activeSceneName': currentProgramSceneName ?? '',
      'inputs': loadInputs, 
      'scenes': loadScenes  
    };
  }

  const obsConnect = async() => {
    try {
      // Localhost: 127.0.0.1:4455
      const { url, match } = validateWebsocketUrl(localhost.trim());
      if (localhost === '') {
        alert('localhost required')
        return;
      }
      if (!match) { 
        alert('local host format not valid');
        return; 
      }

      const user = supabase.auth.user();
      const { obsWebSocketVersion, negotiatedRpcVersion } = await obs.connect(url, password);
      console.log(`Connected to server ${obsWebSocketVersion} (using RPC ${negotiatedRpcVersion})`)

      if (!existingOBSParams) {
        let { error } = await supabase.from('obs').upsert({
          id: user?.id,
          websocket_url: url,
          password: password 
        }, { returning: "minimal" });
      }

      connectedToObs = true;
      const obsComponents = await loadOBSComponents();
      loadedInputs = obsComponents?.inputs;
      loadedScenes = obsComponents?.scenes;
      activeSceneName = obsComponents?.activeSceneName;
      activeScenePreviewName = obsComponents?.activeScenePreviewName;
      
      obs.on('CurrentProgramSceneChanged', (e) => activeSceneName = e.sceneName);
    } catch (error: any) {
      console.log(error);
      console.error('Failed to connect', error.code, error.message);
      alert(error.message);
    }
  }

  const obsDisconnect = async() => {
    await obs.disconnect();
    try {
      await obs.disconnect();
      connectedToObs = false;
      const user = supabase.auth.user();
      let { error } = await supabase.from('obs').upsert({
          id: user?.id,
          websocket_url: null,
          password: null 
        }, { returning: "minimal" });
      existingOBSParams = false;
      alert('disconnected from obs');
    } catch (error: any) {
      console.log(error)
    }
  }
</script>

<Section>
  <h1>Hello obs</h1>
  {#if !connectedToObs}
    <input placeholder='127.0.0.1:PORT' bind:value={localhost} />
    <input placeholder="password" bind:value={password} />
    <button on:click={obsConnect}>connect to obs</button>
  {:else}
    <button on:click={obsDisconnect}>disconnect from obs</button>
    <div class="wrapper">
      <span>currentActiveScene: {activeSceneName}</span>
      {#each loadedScenes as { name }, i}
        <ObsScene name={name}/>
      {/each}
      {#each loadedInputs as { name }, i}
        <ObsInput name={name}/>
      {/each}
    </div>
  {/if}

</Section>

<style lang="scss">
  .wrapper {
    display: flex;
    flex-direction: column;
    align-items: flex-start;
    gap: 32px;
  }
</style>
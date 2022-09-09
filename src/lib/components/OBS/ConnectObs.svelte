<script lang="ts">
  import { onMount } from "svelte";
  import Button from "$lib/components/_global/Button.svelte";
  import { checkExistingSession, obsConnect, obsSession } from "$lib/stores/obsSessionStore";
  let localhost:string;
  let password:string;
  let existingOBSParams:any;

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

<div class="login-header">
  <!-- <h2>Connect to OBS</h2> -->
  <!-- <Button type="button" color="primary">Connect</Button> -->
  <div class="input-wrapper">
    <input placeholder='127.0.0.1:PORT' type="text" bind:value={localhost} />
    <input placeholder="password" type="password" bind:value={password} />
  </div>

  <button on:click={() => obsConnect(localhost, password)}>Connect</button>
</div>

<style lang="scss">
    @import '../../../styles/vars.scss';
  .login-header {
    display: flex;
    align-items: center;
    justify-content: center;
    height: 100%;
    gap: 16px;
    h2 {
      padding-bottom: 16px;
      color: #fff;
    }
  }

  .input-wrapper {
    display: flex;
    flex-direction: column;
  }

  button {
    color: #fff;
    background-color: $pink;
    border: 0;
    border-radius: 4px;
    padding: 4px 8px;
  }

  input {
    border: 1px solid #777;
    border-radius: 8px;
    padding: 2px 8px;
    margin-bottom: 4px;
  }
</style>

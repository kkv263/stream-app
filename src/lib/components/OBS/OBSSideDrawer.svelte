<script lang="ts">
  import { getContext, onMount } from "svelte";
  import { supabase } from "$lib/_includes/supabaseClient";
  import { sideDrawerState } from "$lib/stores/sideDrawerStore";
  import OBSWebSocket from 'obs-websocket-js';
  import Section from "$lib/components/layout/Section.svelte";
  import TextInput from "$lib/components/_global/TextInput.svelte";
  import PasswordInput from "$lib/components/_global/PasswordInput.svelte";
  import InputWrapper from "$lib/components/_global/InputWrapper.svelte";
  import Button from "$lib/components/_global/Button.svelte";
  import ObsInput from "./OBSInput.svelte";
  import ObsScene from "./OBSScene.svelte";
  
  let localhost:string;
  let password:string;
  let connectedToObs:boolean = false;
</script>

<Section>
  <h2>OBS is currently disconnected</h2>
  {#if !connectedToObs}
    <form on:submit|preventDefault={() => {}}>
      <InputWrapper>
        <TextInput placeholder='127.0.0.1:PORT' name="host" bind:value={localhost} inputtype="url">Host</TextInput>
      </InputWrapper>
      <InputWrapper>
        <PasswordInput placeholder="Password" inputtype="password" name="password" bind:value={password} noerror>Password</PasswordInput>
      </InputWrapper>
      <Button type="submit" color="primary">Connect</Button>
    </form>
  {:else}
    <div></div>
  {/if}

</Section>

<style lang="scss">
  @import '../../../styles/vars.scss';
</style>
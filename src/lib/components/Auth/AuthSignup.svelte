<script lang="ts">
  import { authModalState } from "$lib/stores/authModalStore";
  import Twitch from "$lib/components/icons/Twitch.svelte";
  import Youtube from "$lib/components/icons/Youtube.svelte";
  import Button from "$lib/components/global/Button.svelte";
  import Input from "$lib/components/global/Input.svelte";
  import { createEventDispatcher } from 'svelte';
  import { fade, fly } from "svelte/transition";

  let loading: boolean = false;
  let email: string;
  let password: string;
  let error: boolean = true;

  const dispatchSignup = createEventDispatcher();

  const signInWithPlatform = (platform:string) => {
    dispatchSignup('auth', { platform: platform });
  }

  const handleInputError = (e: CustomEvent) => {
    error = e.detail.state;
  }

</script>

<div in:fade={{duration: 200, delay: 100}}>
  <h2 class="header">Sign up</h2>
  <p>Create an account with other platforms:</p>
  <div class="auth-form__header-icons">
    <Button on:click={() => signInWithPlatform('twitch')} square type="button" color="twitch">
      <Twitch height="24px" width="24px"/>
      <span class='icon__span'>Twitch</span>
    </Button>
    <Button on:click={() => signInWithPlatform('google')} square type="button" color="youtube">
      <Youtube height="24px" width="24px"/>
      <span class='icon__span'>YouTube</span>
    </Button>
  </div>
  <div class="auth-form__wrapper">
    <Input on:error={handleInputError} name="authEmail" type="email" placeholder="name@example.com" bind:value={email} required={true}>Email Address</Input>
    <Input on:error={handleInputError} name="authPassword" type="password" placeholder="Password" bind:value={password} required={true}>
      <span>Password</span>
    </Input>
  </div>
  <div class="auth-form__btn-wrapper"><Button full type="submit" color="primary" disabled={loading || error} arrow>{loading ? "loading" : "sign up"}</Button></div>
  <div class="auth-form__footer">
    <p>Already registered? <Button type="button" color="primary" link on:click={() => authModalState.set('login')}>Login to Potion</Button></p>
  </div>
</div>
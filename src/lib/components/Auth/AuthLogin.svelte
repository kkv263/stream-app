<script lang="ts">
  import { supabase } from "$lib/utils/supabaseClient";
  import { authModalState } from "$lib/stores/authModalStore";
  import Twitch from "$lib/components/icons/Twitch.svelte";
  import Youtube from "$lib/components/icons/Youtube.svelte";
  import Button from "$lib/components/global/Button.svelte";
  import Input from "$lib/components/global/Input.svelte";
  import { createEventDispatcher } from 'svelte';
  import { fade } from "svelte/transition";

  let loading: boolean = false;
  let email: string;
  let password: string;
  let error: boolean = true;

  const dispatchLogin = createEventDispatcher();

  const signInWithPlatform = (platform:string) => {
    dispatchLogin('auth', { platform: platform });
  }

  const handleLogin = async () => {
    try {
      loading = true;
      const { user, session, error } = await supabase.auth.signIn({ email, password });
      if (error) throw error;
    } catch (error: any) {
      console.log(error);
      alert(error.error_description || error.message);
    } finally {
      loading = false;
    }
  };

  const handleInputError = (e: CustomEvent) => {
    error = e.detail.state;
  }

</script>

<form on:submit|preventDefault={handleLogin} in:fade={{duration: 200, delay: 100}}>
  <header class="auth-form__header">
    <h2 class="header">Login</h2>
    <p>Login to your account to continue!</p>
  </header>
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
    <Input on:error={handleInputError} name="authEmail" type="email" placeholder="name@example.com" bind:value={email}>Email Address</Input>
    <Input on:error={handleInputError} name="authPassword" type="password" placeholder="Password" bind:value={password}>
      <span>Password</span>
      <button type="button" on:click={() => authModalState.set('forgot')} class="forgot">Forgot Password?</button>
    </Input>
  </div>
  <div class="auth-form__btn-wrapper">
    <Button full type="submit" color="primary" disabled={loading || error} arrow>{loading ? "loading" : "log in"}</Button>
  </div>
  <div class="auth-form__footer">
    <p>No account? <Button type="button" color="primary" link on:click={() => authModalState.set('signup')}>Sign up for Potion</Button></p>
  </div>
</form>

<style lang="scss">
  @import '../../../styles/vars.scss';
  .forgot {
    color: #777;
    background-color: transparent;
    border: 0;
    cursor: pointer;
    transition: $transition;

    &:hover,
    &:active,
    &:focus {
      color: $secondary;
    }
  }
</style>
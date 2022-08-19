<script lang="ts">
  import { supabase } from "$lib/_includes/supabaseClient";
  import { authModalState } from "$lib/stores/authModalStore";
  import Twitch from "$lib/components/icons/TwitchLogo.svelte";
  import Youtube from "$lib/components/icons/Youtube.svelte";
  import Button from "$lib/components/_global/Button.svelte";
  import InputWrapper from "$lib/components/_global/InputWrapper.svelte";
  import EmailInput from "$lib/components/_global/EmailInput.svelte";
  import PasswordInput from "$lib/components/_global/PasswordInput.svelte";
  import TextInput from "$lib/components/_global/TextInput.svelte";
  import DateInput from "$lib/components/_global/DateInput.svelte";
  import { createEventDispatcher } from 'svelte';
  import { fade } from "svelte/transition";

  let loading: boolean = false;
  let email: string;
  let password: string;
  let userName: string;
  let birthdate: string;
  let displayName: string;
  let error: boolean = true;
  let step: 1 | 2 | 3 = 1;

  const dispatchSignup = createEventDispatcher();

  const signInWithPlatform = (platform:string) => {
    dispatchSignup('auth', { platform: platform });
  }

  const handleSignup = async () => {
    try {
      loading = true;
      const { error } = await supabase.auth.signUp(
        { email, password },
        {
          data: { 
            username: userName, 
            display_name: displayName,
            birthdate: birthdate,
          }
        }
      );

      if (error) throw error;
    } catch (error: any) {
      alert(error.error_description || error.message);
    } finally {
      loading = false;
      step = 3;
    }
  };

  const handleInputError = (e: CustomEvent) => {
    error = e.detail.state;
  }
</script>

{#if step === 1 } 
  <form data-testid="auth-form__signup" on:submit|preventDefault={() => step = 2} in:fade={{duration: 200, delay: 100}}>
    <header class="auth-form__header">
      <h2 class="header">Sign up</h2>
      <p>Create an account with other platforms:</p>
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
      <InputWrapper>
        <EmailInput on:email_error={handleInputError} name="authEmail" inputtype="email" placeholder="name@example.com" bind:value={email}>Email Address</EmailInput>
      </InputWrapper>
      <InputWrapper>
        <PasswordInput on:password_error={handleInputError} name="authPassword" inputtype="authpassword" placeholder="Password" bind:value={password}>
          <span>Password</span>
        </PasswordInput>
      </InputWrapper>
    </div>
    <div class="auth-form__btn-wrapper">
      <Button full type="submit" color="primary" disabled={error} arrow>sign up</Button>
    </div>
    <div class="auth-form__footer">
      <p>Already registered? <Button type="button" color="primary" link on:click={() => authModalState.set('login')}>Login to Potion</Button></p>
    </div>
  </form>
{:else if step === 2} 
  <form on:submit|preventDefault={handleSignup} in:fade={{duration: 200, delay: 100}}>
    <header class="auth-form__header">
      <h2 class="header">Almost there!</h2>
      <p>Fill out the remaining fields to complete sign up</p>
    </header>
    <div class="auth-form__wrapper">

      <InputWrapper>      
        <TextInput on:text_error={handleInputError} name="authUsername" inputtype="name" noicon placeholder="Username" bind:value={userName} required={true}>Username</TextInput>
      </InputWrapper>
      <InputWrapper>
        <TextInput on:text_error={handleInputError} name="authDisplayname" inputtype="name" noicon placeholder="Display Name" bind:value={displayName} required={true}>Display Name</TextInput>
      </InputWrapper>
      <InputWrapper>
        <DateInput name="authBirthdate" placeholder="MM/DD/YYYY" bind:value={birthdate} required={true}>Birthdate</DateInput>
      </InputWrapper>
    </div>
    <div class="auth-form__btn-wrapper">
      <Button color="secondary" on:click={() => step = 1} type="button">back</Button>
      <Button full type="submit" color="primary" disabled={loading || error} arrow>{loading ? "loading" : "finish sign up"}</Button>
    </div>
  </form>

{:else if step === 3}
  <div in:fade={{duration: 200, delay: 100}}>
    <header class="auth-form__header">
      <h2 class="header">Verify your email!</h2>
      <p>Check your email and verify your email<br>to gain acccess to your Potion account </p>
    </header>
    <span class="temp">[image here]</span>
    <div class="auth-form__btn-wrapper">
      <Button on:click={() => authModalState.set('')} full type="button" color="primary">Close</Button>
    </div>
  </div>
{/if}

<style lang="scss">
  .auth-form__header {
    padding-bottom: 8px;
  }

  .temp {
    text-align: center;
    display: flex;
    justify-content: center;
    padding-bottom: 32px;
  }
</style>
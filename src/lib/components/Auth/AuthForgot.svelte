<script lang="ts">
  import { authModalState } from "$lib/stores/authModalStore";
  import { supabase } from "$lib/utils/supabaseClient";
  import Button from "$lib/components/global/Button.svelte";
  import Input from "$lib/components/global/Input.svelte";
  import { fade } from "svelte/transition";

  let loading: boolean = false;
  let email: string;
  let error: boolean = true;
  let sent: boolean = false;

  const forgotPassword = async() => {
    try {
      loading = true;
      const { data, error } = await supabase.auth.api.resetPasswordForEmail(email);
      if (error) throw error;
    } catch (error: any) {
      alert(error.error_description || error.message);
    } finally {
      loading = false;
      sent = true;
    }
  }

  const handleInputError = (e: CustomEvent) => {
    error = e.detail.state;
  }

</script>

{#if !sent}
<div in:fade={{duration: 200, delay: 100}}>
  <header class="auth-form__header">
    <h2 class="header">Forgot Password?</h2>
    <p>Enter your email address you used <br> to register your Potion account</p>
  </header>
  <div class="auth-form__wrapper">
    <Input on:error={handleInputError} name="authEmail" type="email" placeholder="name@example.com" bind:value={email}>Email Address</Input>
  </div>
  <div class="auth-form__btn-wrapper">
    <Button color="secondary" on:click={() => authModalState.set('login')} type="button">back</Button>
    <Button on:click={forgotPassword} full type="button" color="primary" disabled={loading || error} arrow>{loading ? "loading" : "send password reset email"}</Button>
  </div>
</div>
{:else if sent}
<div in:fade={{duration: 200, delay: 100}}>
  <header class="auth-form__header">
    <h2 class="header">Email sent!</h2>
    <p>Check your email for instructions on <br>how to reset your password for your Potion account </p>
  </header>
  <span class="temp">[image here]</span>
  <div class="auth-form__btn-wrapper">
    <Button on:click={() => authModalState.set('login')} full type="button" color="primary" arrow>Return to Login</Button>
  </div>
</div>
{/if}

<style lang="scss">
  .auth-form__header {
    padding-bottom: 16px;
  }

   .header {
    + p {
      padding-bottom: 32px;
    }
  }

  .auth-form__btn-wrapper {
    margin-bottom: 0;
  }

  // delete later
  .temp {
    text-align: center;
    display: flex;
    justify-content: center;
    padding-bottom: 32px;
  }
</style>
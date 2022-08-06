<script lang="ts">
  import { authModalState } from "$lib/stores/authModalStore";
  import { supabase } from "$lib/utils/supabaseClient";
  import Button from "$lib/components/global/Button.svelte";
  import Input from "$lib/components/global/Input.svelte";
  import ChevronLeft from "$lib/components/icons/ChevronLeft.svelte";
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

{#if sent === false}
<div in:fade={{duration: 200, delay: 100}}>
  <button on:click={() => authModalState.set('login')} type="button" class="back" >
    <ChevronLeft width="16px" height="16px"/>
    <span>Back</span>
  </button>
  <h2 class="header">Forgot Password?</h2>
  <p>Enter your email address you used <br> to register your Potion account</p>
  <div class="auth-form__wrapper">
    <Input on:error={handleInputError} name="authEmail" type="email" placeholder="name@example.com" bind:value={email}>Email Address</Input>
  </div>
  <div class="auth-form__btn-wrapper">
    <Button on:click={forgotPassword} full type="button" color="primary" disabled={loading || error} arrow>{loading ? "loading" : "send password reset email"}</Button>
  </div>
</div>
{:else if sent === true}
<div in:fade={{duration: 200, delay: 100}}>
  <h2 class="header">Email sent!</h2>
  <p>Check your email for instructions on <br>how to reset your password for your Potion account </p>
  <span class="temp">[image here]</span>
  <div class="auth-form__btn-wrapper">
    <Button on:click={() => authModalState.set('login')} full type="button" color="primary" arrow>Return to Login</Button>
  </div>
</div>
{/if}

<style lang="scss">
  @import '../../../styles/vars.scss';
  .back {
    position: absolute;
    top: 16px;
    left: 8px;
    display: flex;
    align-items: center;
    justify-content: center;
    background-color: transparent;
    border: 0;
    font-size: 16px;
    font-weight: bold;
    color: $secondary;
    cursor: pointer;
    transition: $transition;

    &:hover,
    &:active,
    &:focus {
      color: #777;
      span {
        box-shadow: 0 2px 1px -1px #777;
      }
    }
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
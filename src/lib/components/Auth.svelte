<script lang="ts">
  import { supabase } from "$lib/utils/supabaseClient";
  import Button from "$lib/components/global/Button.svelte";
  import Input from "$lib/components/global/Input.svelte";
  import { isauthModalOpen } from "$lib/stores/authModalStore";

  let loading: boolean = false;
  let email: string;
  let password: string;

  const handleSignup = async () => {
    try {
      loading = true;
      const { user, error } = await supabase.auth.signUp({ email, password });
      // twitch login
      // discord probably don't need it
      // const { user, session, error } = await supabase.auth.signIn({
      //   provider: 'twitch',
      // })
      if (error) throw error;
    } catch (error: any) {
      alert(error.error_description || error.message);
    } finally {
      loading = false;
    }
  };

  const handleLogin = async () => {
    try {
      loading = true;
      const { user, error } = await supabase.auth.signIn({ email, password });
      // twitch login
      // discord probably don't need it
      // const { user, session, error } = await supabase.auth.signIn({
      //   provider: 'twitch',
      // })
      if (error) throw error;
    } catch (error: any) {
      alert(error.error_description || error.message);
    } finally {
      loading = false;
    }
  };
</script>

<form on:submit|preventDefault={$isauthModalOpen === "signup" ? handleSignup : handleLogin} class="{$isauthModalOpen}">
  {#if $isauthModalOpen === 'signup'}
    <div class="col-6 form-widget">
      <h2 class="header">Sign up</h2>
      <p>Lets get you started with a new account!</p>
      <div class="auth-form__wrapper">
        <Input name="authEmail" type="email" placeholder="name@example.com" bind:value={email}>Email Address</Input>
        <Input name="authPassword" type="password" placeholder="Password" bind:value={password}>
          <span>Password</span>
        </Input>
      </div>
      <div class="auth-form__btn-wrapper"><Button type="submit" color="primary" disabled={loading} arrow>{loading ? "loading" : "sign up"}</Button></div>
      <p>Already registered? <Button type="button" color="primary" link on:click={() => isauthModalOpen.set('login')}>Login to Potion</Button></p>
    </div>
  {:else if $isauthModalOpen === 'login'}
  <div class="col-6 form-widget">
    <h2 class="header">Login</h2>
    <p>Login to your account to continue!</p>
    <div class="auth-form__wrapper">
      <Input name="authEmail" type="email" placeholder="name@example.com" bind:value={email}>Email Address</Input>
      <Input name="authPassword" type="password" placeholder="Password" bind:value={password}>
        <span>Password</span>
        <span class="forgot">Forgot Password?</span>
      </Input>
    </div>
    <div class="auth-form__btn-wrapper"><Button type="submit" color="primary" disabled={loading} arrow>{loading ? "loading" : "log in"}</Button></div>
    <p>No account? <Button type="button" color="primary" link on:click={() => isauthModalOpen.set('signup')}>Sign up for Potion</Button></p>
  </div>
  {/if}
  

</form>

<style lang="scss">
  .auth-form__wrapper {
    padding-bottom: 16px;
  }

  h2 {
    padding-top: 16px;
    padding-bottom: 8px;
    + p {
      padding-bottom: 32px;
      color: #777;
      font-size: 16px;
    }
  }

  .auth-form__btn-wrapper {
    margin-bottom: 16px;
    + p {
      font-size: 14px;
    }
  }

  span.forgot {
    color: #777;
  }
</style>
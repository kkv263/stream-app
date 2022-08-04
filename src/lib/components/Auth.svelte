<script lang="ts">
  import { supabase } from "$lib/utils/supabaseClient";
  import Button from "$lib/components/global/Button.svelte";
  import Input from "$lib/components/global/Input.svelte";

  let loading: boolean = false;
  let email: string;
  let password: string;

  const handleLogin = async () => {
    try {
      loading = true;
      const { user, error } = await supabase.auth.signUp({ email, password });
      // twitch login
      // discord probably don't need it
      // const { user, session, error } = await supabase.auth.signIn({
      //   provider: 'twitch',
      // })
      // console.log(user);
      // console.log(session);
      if (error) throw error;
    } catch (error: any) {
      alert(error.error_description || error.message);
    } finally {
      loading = false;
    }
  };
</script>

<form on:submit|preventDefault={handleLogin}>
  <div class="col-6 form-widget">
    <h2 class="header">Sign up</h2>
    <p>Let's set up a new account!</p>
    <div class="auth-form__wrapper">
      <Input name="authEmail" type="email" placeholder="name@example.com" bind:value={email}>Email Address</Input>
      <Input name="authPassword" type="password" placeholder="Password" bind:value={password}>Password</Input>
    </div>
    <div class="auth-form__btn-wrapper"><Button type="submit" color="primary" disabled={loading} arrow>{loading ? "loading" : "sign up"}</Button></div>
    <p>Already registered? <Button type="button" color="primary" link>Login to Potion</Button></p>
  </div>
</form>

<style lang="scss">
  .auth-form__wrapper {
    padding-bottom: 32px;
  }

  h2 {
    padding-bottom: 8px;
    + p {
      padding-bottom: 32px;
    }
  }

  .auth-form__btn-wrapper {
    margin-bottom: 16px;
    + p {
      font-size: 14px;
    }
  }
</style>
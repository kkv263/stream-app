<script lang="ts">
  import { supabase } from "$lib/utils/supabaseClient";
  import { isauthModalOpen } from "$lib/stores/authModalStore";
  import Twitch from "$lib/components/icons/Twitch.svelte";
  import Button from "$lib/components/global/Button.svelte";
  import Input from "$lib/components/global/Input.svelte";

  let loading: boolean = false;
  let email: string;
  let password: string;

  const signInWithTwitch = async() => {
    const { user, session, error } = await supabase.auth.signIn({
      provider: 'twitch',
    })
  }

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

  // Example session
  // access_token: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJhdWQiOiJhdXRoZW50aWNhdGVkIiwiZXhwIjoxNjU5NjYxMjM1LCJzdWIiOiIyOGIzMjE0Mi1jNTY2LTRmNDAtYTlmNi1mZGZiMDJlYzFhMmUiLCJlbWFpbCI6InNwcmFudG1hc3RlckBnbWFpbC5jb20iLCJwaG9uZSI6IiIsImFwcF9tZXRhZGF0YSI6eyJwcm92aWRlciI6ImVtYWlsIiwicHJvdmlkZXJzIjpbImVtYWlsIl19LCJ1c2VyX21ldGFkYXRhIjp7fSwicm9sZSI6ImF1dGhlbnRpY2F0ZWQifQ.12nwYcDbEzVCBoEEKFQuxjcB7QJXeX43GzQyuY5pXJI"
  // expires_at: 1659661235
  // expires_in: 3600
  // refresh_token: "NYxqglMQ1Z7FkD4CprX5-w"
  // token_type: "bearer"
  // user:
  // app_metadata: {provider: 'email', providers: Array(1)}
  // aud: "authenticated"
  // confirmation_sent_at: "2022-08-04T23:40:30.564311Z"
  // confirmed_at: "2022-08-04T23:40:52.489129Z"
  // created_at: "2022-08-04T23:40:30.558733Z"
  // email: "sprantmaster@gmail.com"
  // email_confirmed_at: "2022-08-04T23:40:52.489129Z"
  // id: "28b32142-c566-4f40-a9f6-fdfb02ec1a2e"
  // identities: [{…}]
  // last_sign_in_at: "2022-08-05T00:00:35.047832554Z"
  // phone: ""
  // role: "authenticated"
  // updated_at: "2022-08-05T00:00:35.048994Z"
  // user_metadata: {}

  const handleLogin = async () => {
    try {
      loading = true;
      const { user, session, error } = await supabase.auth.signIn({ email, password });
      // twitch login
      // discord probably don't need it
      // const { user, session, error } = await supabase.auth.signIn({
      //   provider: 'twitch',
      // })
      if (error) throw error;
    } catch (error: any) {
      console.log(error);
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
      <p>Create an account with other platforms:</p>
      <div class="auth-form__header-icons">
        <Button on:click={signInWithTwitch} square type="button" color="twitch"><Twitch height="24px" width="24px"/></Button>
      </div>
      <div class="auth-form__wrapper">
        <Input name="authEmail" type="email" placeholder="name@example.com" bind:value={email} required={true}>Email Address</Input>
        <Input name="authPassword" type="password" placeholder="Password" bind:value={password} required={true}>
          <span>Password</span>
        </Input>
      </div>
      <div class="auth-form__btn-wrapper"><Button full type="submit" color="primary" disabled={loading} arrow>{loading ? "loading" : "sign up"}</Button></div>
      <div class="auth-form__footer">
        <p>Already registered? <Button type="button" color="primary" link on:click={() => isauthModalOpen.set('login')}>Login to Potion</Button></p>
      </div>
    </div>
  {:else if $isauthModalOpen === 'login'}
  <div class="col-6 form-widget">
    <h2 class="header">Login</h2>
    <p>Login to your account to continue!</p>
    <div class="auth-form__header-icons">
      <Button on:click={signInWithTwitch} square type="button" color="twitch"><Twitch height="24px" width="24px"/></Button>
    </div>
    <div class="auth-form__wrapper">
      <Input name="authEmail" type="email" placeholder="name@example.com" bind:value={email}>Email Address</Input>
      <Input name="authPassword" type="password" placeholder="Password" bind:value={password}>
        <span>Password</span>
        <span class="forgot">Forgot Password?</span>
      </Input>
    </div>
    <div class="auth-form__btn-wrapper">
      <Button full type="submit" color="primary" disabled={loading} arrow>{loading ? "loading" : "log in"}</Button>
    </div>
    <div class="auth-form__footer">
      <p>No account? <Button type="button" color="primary" link on:click={() => isauthModalOpen.set('signup')}>Sign up for Potion</Button></p>
    </div>
  </div>
  {/if}
  

</form>

<style lang="scss">
  .auth-form__wrapper {
    padding-bottom: 16px;
  }

  h2 {
    padding-bottom: 16px;
    text-align: center;
    font-size: 32px;
    + p {
      padding-bottom: 8px;
      color: #777;
      font-size: 14px;
      text-align: center;
    }
  }

  .auth-form__btn-wrapper {
    margin-bottom: 16px;
  }

  .auth-form__footer {
    padding-top: 16px;
    p {
      font-size: 14px;
      color: #777;
      text-align: center;
    }
  }

  .auth-form__header-icons {
    display: flex;
    justify-content: center;
    padding-bottom: 16px;
    border-bottom: 1px solid #ccc;
    margin-bottom: 16px;
    position: relative;

    &:after {
      content: 'OR';
      position: absolute;
      bottom: -10px;
      color: #777;
      left: 50%;
      font-size: 14px;
      transform: translateX(-50%);
      background-color: #fff;
      width: 48px;
      display: flex;
      justify-content: center;
      align-items: center;
    }
  }

  span.forgot {
    color: #777;
  }
</style>
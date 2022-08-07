<script lang="ts">
  import { supabase } from "$lib/utils/supabaseClient";
  import { authModalState } from "$lib/stores/authModalStore";
  import AuthSignup from "$lib/components/Auth/AuthSignup.svelte";
  import AuthLogin from "$lib/components/Auth/AuthLogin.svelte";
  import type { Provider } from "@supabase/supabase-js";
  import AuthForgot from "$lib/components/Auth/AuthForgot.svelte";

  const signInWithPlatform = async(e: CustomEvent) => {
    const { user, session, error } = await supabase.auth.signIn({
      provider: <Provider>e.detail.platform,
    })
  }

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

</script>

<div class="auth-modal {$authModalState}">
  {#if $authModalState === 'signup'}
    <AuthSignup on:auth={signInWithPlatform} />
  {:else if $authModalState === 'login'}
    <AuthLogin on:auth={signInWithPlatform}/>
  {:else if $authModalState === 'forgot'}
    <AuthForgot />
  {/if}
  

</div>

<style lang="scss">
  @import '../../../styles/vars.scss';
  @import "../../../styles/breakpoints";

  .auth-modal :global(.auth-form__wrapper) {
    padding-bottom: 16px;
  }

  .auth-modal :global(.header) {
    padding-bottom: 16px;
    text-align: center;
    font-size: 32px; 
  }

  .auth-modal :global(.header + p) {
    padding-bottom: 8px;
    color: #777;
    font-size: 14px;
    text-align: center;
  }

  .auth-modal :global(.auth-form__btn-wrapper) {
    padding-bottom: 16px;
    display: flex;
    gap: 16px;

    @include bp(mobile) {
      flex-direction: column;
    }
  }

  .auth-modal :global(.auth-form__footer) {
    padding-top: 16px;
  }

  .auth-modal :global(.auth-form__footer p) {
    font-size: 14px;
    color: #777;
    text-align: center;
  }

  .auth-modal :global(.auth-form__header-icons) {
    display: flex;
    justify-content: center;
    padding-bottom: 16px;
    border-bottom: 1px solid #ccc;
    margin-bottom: 16px;
    position: relative;
    gap: 8px;


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

  .auth-modal :global(.icon__span) {
    margin-left: 8px;
    font-size: 14px;
  }

</style>
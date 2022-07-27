<script lang="ts">
  import { supabase } from "$lib/utils/supabaseClient";

  let loading: boolean = false;
  let email: string;

  const handleLogin = async () => {
    try {
      loading = true;
      const { error } = await supabase.auth.signIn({ email });
      // twitch login
      // discord probably don't need it if we are using  oauth2.0
      // const { user, session, error } = await supabase.auth.signIn({
      //   provider: 'twitch',
      // })
      // console.log(user);
      // console.log(session);
      if (error) throw error;
      alert("Check your email for the login link!");
    } catch (error: any) {
      alert(error.error_description || error.message);
    } finally {
      loading = false;
    }
  };
</script>

<form class="row flex flex-center" on:submit|preventDefault={handleLogin}>
  <div class="col-6 form-widget">
    <h1 class="header">Supabase + Svelte</h1>
    <p class="description">Sign in via magic link with your email below</p>
    <div>
      <input
        class="inputField"
        type="email"
        placeholder="Your email"
        bind:value={email}
      />
    </div>
    <div>
      <input
        type="submit"
        class="button block"
        value={loading ? "Loading" : "Send magic link"}
        disabled={loading}
      />
    </div>
  </div>
</form>

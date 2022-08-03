<script lang="ts">
  import { supabase } from "$lib/utils/supabaseClient";

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

<form class="row flex flex-center" on:submit|preventDefault={handleLogin}>
  <div class="col-6 form-widget">
    <h1 class="header">Supabase + Svelte</h1>
    <div>
      <input class="inputField" type="email" placeholder="Your email" bind:value={email} />
      <input class="inputField" type="password" placeholder="Password" bind:value={password} />
    </div>
    <div>
      <input type="submit" class="button block" value={loading ? "Loading" : "Sign up"} disabled={loading} />
    </div>
  </div>
</form>

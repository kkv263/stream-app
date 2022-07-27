<script lang="ts">
  import { user } from "$lib/utils/sessionStore";
  import { supabase } from "$lib/utils/supabaseClient";
  import Auth from "$lib/components/Auth.svelte";
  import Profile from "$lib/components/Profile.svelte";
  import Twitter from "$lib/components/Twitter.svelte";
  import type { Session } from "@supabase/supabase-js";
  import cryptoRandomString from 'crypto-random-string';

  user.set(supabase.auth.user());

  supabase.auth.onAuthStateChange((_, session: Session | null) => {
    if (session) user.set(session.user);
  });
  const redirectURI = 'http://127.0.0.1:5173';
  const token = import.meta.env.VITE_TWITTER_OAUTH_CLIENT_ID;
  const scope = "tweet.read%20users.read%20tweet.write%20offline.access"
  const randomState = cryptoRandomString({length: 10, type: 'distinguishable'});
  const url = `https://twitter.com/i/oauth2/authorize?response_type=code&client_id=${token}&redirect_uri=${redirectURI}&scope=${scope}&state=${randomState}&code_challenge=challenge&code_challenge_method=plain`;
  export let message:string;
</script>

<div class="container" style="padding: 50px 0 100px 0;">
  <Twitter />
  {#if $user}
    <Profile />
  {:else}
    <Auth />
  {/if}
  <span>{message}</span>
</div>

<a href={url}>authorize tweeter</a>
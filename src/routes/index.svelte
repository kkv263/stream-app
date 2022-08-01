<script lang="ts" context="module">
  import type { Load } from "@sveltejs/kit";

  export const load:Load = async({session}) => {
    return {
      props: {
        twitterUser: session.user
      }
    };
  }
</script>

<script lang="ts">
  import { user } from "$lib/utils/sessionStore";
  import { supabase } from "$lib/utils/supabaseClient";
  import Auth from "$lib/components/Auth.svelte";
  import Profile from "$lib/components/Profile.svelte";
  import Twitter from "$lib/components/Twitter.svelte";
  import Section from "$lib/components/layout/Section.svelte";
  import type { Session } from "@supabase/supabase-js";

  user.set(supabase.auth.user());

  supabase.auth.onAuthStateChange((_, session: Session | null) => {
    if (session) user.set(session.user);
  });
  export let twitterUser:string;
</script>

<Section>
  <Twitter />
  {#if $user}
    <Profile />
  {:else}
    <Auth />
  {/if}
</Section>

<!-- should dynamically generate -->
<Section>
  {#if twitterUser}
    <h2>Welcome {twitterUser}</h2>
    <a href='twitter/logout'>logout tweeter</a>
  {:else}
    <a href='twitter/login' rel="external">authorize tweeter</a>
  {/if}
</Section>

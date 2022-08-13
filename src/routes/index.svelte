<script lang="ts" context="module">
  import type { Load } from "@sveltejs/kit";

  export const load:Load = async({session}) => {
    return {
      props: {
        ...(session.platform === 'twitter') && {twitterUser: session.user},
      }
    };
  }
</script>


<script lang="ts">
  import { user } from "$lib/stores/sessionStore";
  import { supabase } from "$lib/utils/supabaseClient";
  import Section from "$lib/components/layout/Section.svelte";
  import Profile from "$lib/components/Profile.svelte";
  import type { Session } from "@supabase/supabase-js";
  import Twitter from "$lib/components/Twitter/Twitter.svelte";

  user.set(supabase.auth.user());

  supabase.auth.onAuthStateChange((_, session: Session | null) => {
    if (session) user.set(session.user);
  });
  export let twitterUser:string;
</script>


<Section>
  {#if $user}
    <Twitter twtUser={twitterUser}/>
    <!-- <Profile />
    <a href="/settings">This is settings page</a> -->
  {:else}
    <a href="/welcome">Weclome page</a>
    <h1>not logged in lol</h1>
    <h2>should redirect to welcome page</h2>
  {/if}
</Section>
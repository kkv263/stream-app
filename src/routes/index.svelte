<script lang="ts">
  import { user } from "$lib/stores/sessionStore";
  import { supabase } from "$lib/utils/supabaseClient";
  import Section from "$lib/components/layout/Section.svelte";
  import Profile from "$lib/components/Profile.svelte";
  import type { Session } from "@supabase/supabase-js";

  user.set(supabase.auth.user());

  supabase.auth.onAuthStateChange((_, session: Session | null) => {
    if (session) user.set(session.user);
  });
</script>

<a href="/welcome">Weclome page</a>

<Section>
  {#if $user}
    <Profile />
  {:else}
    <h1>not logged in lol</h1>
    <h2>should redirect to welcome page</h2>
  {/if}
</Section>
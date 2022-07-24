<script lang="ts">
  import { user } from "$lib/utils/sessionStore";
  import { supabase } from "$lib/utils/supabaseClient";
  import Auth from "$lib/components/Auth.svelte";
  import Profile from "$lib/components/Profile.svelte";
  import type { Session } from "@supabase/supabase-js";

  user.set(supabase.auth.user());

  supabase.auth.onAuthStateChange((_, session: Session | null) => {
    if (session) user.set(session.user);
  });
</script>

<div class="container" style="padding: 50px 0 100px 0;">
  {#if $user}
    <Profile />
  {:else}
    <Auth />
  {/if}
</div>

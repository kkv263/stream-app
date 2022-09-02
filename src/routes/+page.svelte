<script lang="ts">
  import { user } from "$lib/stores/sessionStore";
  import { twitterUser } from "$lib/stores/twitterSessionStore";
  import { twitchUser } from "$lib/stores/twitchSessionStore";
  import { supabase } from "$lib/_includes/supabaseClient";
  import Section from "$lib/components/layout/Section.svelte";
  import SideDrawer from "$lib/components/_global/SideDrawer.svelte";
  import { sideDrawerState } from "$lib/stores/sideDrawerStore";
  import Profile from "$lib/components/Profile.svelte";
  import OBS from "$lib/components/OBS/OBS.svelte";
  import Twitter from "$lib/components/Twitter/Twitter.svelte";
  import Twitch from "$lib/components/Twitch/Twitch.svelte";
  import type { Session } from "@supabase/supabase-js";
  import { page } from "$app/stores";
  import Grid from "$lib/components/Grid/Grid.svelte";
  import Clock from "$lib/components/BrowserSource/Clock.svelte";

  user.set(supabase.auth.user());

  supabase.auth.onAuthStateChange((_, session: Session | null) => {
    if (session) user.set(session.user);
  });

  const { twitteruser, twitchuser } = $page.data;

  if (twitteruser) { twitterUser.set(twitteruser) };
  if (twitchuser) { twitchUser.set(twitchuser) };

</script>

{#if $sideDrawerState}
  <SideDrawer />
{/if}
<!-- <Grid/> -->
<Section>
  {#if $user}
    <Twitter twtUser={twitteruser?.name}/>
    <OBS />
    <Twitch twitchUser={twitchuser?.display_name} />
    <Clock />
    <!-- <Profile /> -->
    <!-- <a href="/settings">This is settings page</a> -->
  {:else}
    <a href="/welcome">Weclome page</a>
    <h1>not logged in lol</h1>
    <h2>should redirect to welcome page</h2>
  {/if}
</Section>
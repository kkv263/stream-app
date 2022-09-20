<script lang="ts">
  import { user } from "$lib/stores/sessionStore";
  import { discordUser } from "$lib/stores/discordSessionStore";
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
  import Discord from "$lib/components/Discord/Discord.svelte";

  user.set(supabase.auth.user());

  supabase.auth.onAuthStateChange((_, session: Session | null) => {
    if (session) user.set(session.user);
  });

  const { discorduser, twitteruser, twitchuser } = $page.data;

  if (discorduser) { discordUser.set(discorduser) };
  if (twitteruser) { twitterUser.set(twitteruser) };
  if (twitchuser) { twitchUser.set(twitchuser) };

</script>

<!-- {#if $sideDrawerState} -->
  <SideDrawer />
<!-- {/if} -->
<Grid/>
<Section>
  {#if $user}
    <Profile />
    <Discord discordUser={discorduser?.username}/>
    <a href='auth/logout/twitter'>logout tweeter</a>
    <a href='auth/logout/twitch'>logout twitch</a>
    <!-- <a href="/settings">This is settings page</a> -->
  {:else}
    <a href="/welcome">Weclome page</a>
    <h1>not logged in lol</h1>
    <h2>should redirect to welcome page</h2>
  {/if}
</Section>

<style lang="scss"></style>
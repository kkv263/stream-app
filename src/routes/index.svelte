<script lang="ts" context="module">
  import type { Load } from "@sveltejs/kit";

  export const load:Load = async({session}) => {
    return {
      props: {
        ...(session.platform === 'twitter') && {twitterUser: session.user},
        ...(session.platform === 'twitch') && {twitchUser: session.user},
      }
    };
  }
</script>

<script lang="ts">
  import { user } from "$lib/utils/sessionStore";
  import { supabase } from "$lib/utils/supabaseClient";
  import AuthModal from "$lib/components/Auth/AuthModal.svelte";
  import Profile from "$lib/components/Profile.svelte";
  import Twitter from "$lib/components/Twitter.svelte";
  import Section from "$lib/components/layout/Section.svelte";
  import Nav from "$lib/components/layout/Nav.svelte";
  import { isauthModalOpen } from "$lib/stores/authModalStore";
  import Modal from "$lib/components/global/Modal.svelte";
  import type { Session } from "@supabase/supabase-js";

  export let twitterUser:string;
  export let twitchUser:string;

  user.set(supabase.auth.user());

  supabase.auth.onAuthStateChange((_, session: Session | null) => {
    if (session) user.set(session.user);
  });
</script>

<Nav />
{#if $isauthModalOpen}
  <Modal type="auth">
    <AuthModal />
  </Modal>
{/if}

<Section>
  <!-- {#if $user}
    <Profile />
  {:else}
    <Auth />
  {/if} -->
</Section>

<!-- should dynamically generate -->
<Section>
  {#if twitterUser}
    <h2>Welcome {twitterUser}</h2>

    <Twitter/>

    <a href='logout/twitter'>logout tweeter</a>
  {:else}
    <a href='login/twitter' rel="external">authorize tweeter</a>
  {/if}
</Section>

<Section>
  {#if twitchUser}
    <h2>Welcome {twitchUser}</h2>
    <a href='logout/twitch'>revoke twitch</a>
  {:else}
    <a href='login/twitch' rel="external">authorize twitch</a>
  {/if}
</Section>

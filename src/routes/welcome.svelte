<script lang="ts" context="module">
  import type { Load } from "@sveltejs/kit";

  export const load:Load = async({session}) => {
    return {
      props: {
        ...(session.platform === 'twitch') && {twitchUser: session.user},
      }
    };
  }
</script>

<script lang="ts">
  import AuthModal from "$lib/components/Auth/AuthModal.svelte";
  import Section from "$lib/components/layout/Section.svelte";
  import Nav from "$lib/components/layout/Nav.svelte";
  import { authModalState } from "$lib/stores/authModalStore";
  import Modal from "$lib/components/_global/Modal.svelte";

  export let twitchUser:string;
</script>

<Nav />
{#if $authModalState}
  <Modal type="auth">
    <AuthModal />
  </Modal>
{/if}


<Section>
  {#if twitchUser}
    <h2>Welcome {twitchUser}</h2>
    <a href='logout/twitch'>revoke twitch</a>
  {:else}
    <a href='login/twitch' rel="external">authorize twitch</a>
  {/if}
</Section>

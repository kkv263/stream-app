<script lang="ts">
  import AuthModal from "$lib/components/Auth/AuthModal.svelte";
  import Section from "$lib/components/layout/Section.svelte";
  import Nav from "$lib/components/layout/Nav.svelte";
  import { authModalState } from "$lib/stores/authModalStore";
  import Modal from "$lib/components/_global/Modal.svelte";
</script>

<Nav />
{#if $authModalState}
  <Modal modalType="auth">
    <AuthModal />
  </Modal>
{/if}

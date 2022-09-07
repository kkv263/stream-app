<script lang="ts">
  import OBSLogo from '$lib/components/icons/OBSLogo.svelte';
  import { obsSession, obsConnected } from "$lib/stores/obsSessionStore";
  import CogMenu from '$lib/components/Grid/CogMenu.svelte';
</script>

<header>
  <div class="top">
    <div><OBSLogo width="28px" height="28px" /></div>  

    <div class="name-wrapper">
      {#if $obsConnected}
        <h3>Connected:</h3>
        <span>{$obsSession.localhost.replace('ws://', '')}</span>
      {:else} 
        <h3>Not Connected</h3>
      {/if}
    </div>

    <CogMenu on:deleteblock/>
  </div>
</header>

<style lang="scss">
	@import '../../../styles/vars.scss';

  header {
    color: #fff;
    padding: 4px 16px;
    background-color: #222;
  }

  .top {
    display: flex;
    justify-content: space-between;
    align-items: center;
  }

  .name-wrapper {
    display: flex;
    flex-direction: column;
    padding-left: 8px;
    align-items: center;

    h3 {
      padding-bottom: 0;
      color: #fff;
      font-size: 14px;
    }

    span {
      font-size: 12px;
    }
  }
</style>
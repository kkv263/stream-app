<script lang="ts">
  import CogMenu from '$lib/components/Grid/CogMenu.svelte';
</script>

<header>
  <div class="top">
    <div class="logo">Logo</div>  

    <div class="name-wrapper">
      <h3>Browser Source:</h3>
      <span>Clock</span>
    </div>

    <CogMenu on:deleteblock />
  </div>
</header>

<style lang="scss">
	@import '../../../styles/vars.scss';

  header {
    color: $text-color;
    padding: 4px 16px;
    background-color: $off-white;
    min-height: 32px;
  }

  .logo {
    font-size: 14px;
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
      color: $text-color;
      font-size: 14px;
    }

    span {
      font-size: 12px;
    }
  }
</style>
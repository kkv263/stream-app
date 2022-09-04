<script lang="ts">
  import Cog from '$lib/components/icons/Cog.svelte';
</script>

<header>
  <div class="top">
    <div class="logo">Logo</div>  

    <div class="name-wrapper">
      <h3>Browser Source:</h3>
      <span>Clock</span>
    </div>

    <button type="button"><Cog width="16px" height="16px"/></button>
  </div>
</header>

<style lang="scss">
	@import '../../../styles/vars.scss';

  header {
    color: #fff;
    padding: 4px 16px;
    background-color: #222;
    min-height: 32px;
  }

  .logo {
    font-size: 14px;
  }

  button {
    background-color: transparent;
    border: 0;
    color: currentColor;
    cursor: pointer;
  }

  .top {
    display: flex;
    justify-content: space-between;
    align-items: center;

    button {
      display: inline-flex;
      align-items: center;
    }
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
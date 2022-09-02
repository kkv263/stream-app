<script lang="ts">
  import Ellipsis from '$lib/components/icons/Ellipsis.svelte';
</script>

<header>
  <div class="top">
    <div>Logo</div>  

    <div class="name-wrapper">
      <h3>Browser Source:</h3>
      <span>Clock</span>
    </div>

    <button type="button"><Ellipsis width="20px" height="20px"/></button>
  </div>
</header>

<style lang="scss">
	@import '../../../styles/vars.scss';

  header {
    color: #fff;
    padding: 8px 16px;
    background-color: #222;
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
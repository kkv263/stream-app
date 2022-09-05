<script lang="ts">
  import Cog from '$lib/components/icons/Cog.svelte';
</script>
<div class="cog-wrapper">
  <button type="button">
    <Cog width="16px" height="16px"/>
  </button>
</div>

<style lang="scss">
	@import '../../../styles/vars.scss';
  button {
    padding:0;
    display: flex;
    align-items: center;
    background-color: transparent;
    border: 0;
    color: currentColor;
    cursor: pointer;
  }
</style>
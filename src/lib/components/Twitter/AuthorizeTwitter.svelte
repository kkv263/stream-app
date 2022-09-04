<script lang="ts">
  	import Button from "$lib/components/_global/Button.svelte";
</script>

<div class="login-header">
  <h2>Login to Twitter</h2>
  <a href='login/twitter' rel="external">
    <Button type="button" color="primary">Authorize</Button>
  </a>
</div>

<style lang="scss">
  .login-header {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    min-height: 172px;
    h2 {
      padding-bottom: 16px;
      color: #fff;
    }
  }

  a {
    &:hover,
    &:focus {
      box-shadow: none;
    }
  }
</style>

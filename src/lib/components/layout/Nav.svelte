<script lang="ts">
  import Section from "$lib/components/layout/Section.svelte";
  import Button from "$lib/components/global/Button.svelte";
  import { isauthModalOpen } from "$lib/stores/authModalStore";

</script>

<nav>
  <Section>
    <div>
      <h1>Logo.</h1>
      <div class="btn-wrapper">
        <Button on:click={() => isauthModalOpen.set(true)} color="secondary" type="button">sign up</Button>
        <Button color="primary" type="button">log in</Button>
      </div>
    </div>
  </Section>
</nav>

<style lang="scss">
  nav {
    min-height: 64px;
    display: flex;
    align-items: center;
    box-shadow: 0 1px 2px #ddd;

    div {
      display: flex;
      justify-content: space-between;
      align-items: center;
    }
  }  

  // Delete later, plogo placeholder;
  h1 {
    margin: 0;
  }

  .btn-wrapper {
    display: flex;
    gap: 16px;
  }
</style>
<script lang="ts">
  import Section from "./Section.svelte";
  import Button from "./../Button.svelte";
</script>

<nav>
  <Section>
    <div>
      <h1>Logo.</h1>
      <div class="btn-wrapper">
        <Button type="secondary">sign up</Button>
        <Button type="primary">log in</Button>
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
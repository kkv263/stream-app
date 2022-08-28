<script lang="ts">
  export let size:number = 4;
</script>

<section data-size={size}>
  <slot></slot>
</section>

<style lang="scss">
  section {
    &[data-size = '2'] {
      height: 120px;
      width: 375px;
    }

    &[data-size = '4'] {
      height: 240px;
      width: 375px;
    }
    display: flex;
    flex-direction: column;
  }
</style>
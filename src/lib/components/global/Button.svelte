
<script lang="ts">
  import CircleArrowRight from "$lib/components/icons/CircleArrowRight.svelte";

	export let color:string;
  export let type:string;
  export let disabled:boolean | null = null;
  export let arrow:boolean | null = null;
  export let link:boolean | null = null;
</script>

<button on:click class={color} class:link type={type} {disabled}>
  <slot></slot>
  {#if arrow}
    <CircleArrowRight width="20px" height="20px" marginLeft="16px" />
  {/if}
</button>

<style lang="scss">
@import '../../../styles/vars.scss';

  button {
    background-color: $primary;
    font-family: 'Nunito', sans-serif;
    font-weight: 600;
    border-radius: 8px;
    padding: 8px 16px;
    border: 2px solid $primary;
    color: #fff;
    cursor: pointer;
    transition: $transition;
    box-shadow: 0 1px 2px #ccc;
    display: flex;
    align-items: center;
    justify-content: center;
    min-width: 112px;

    &:hover,
    &:active,
    &:focus {
      background-color: transparent;
      color: $primary;
    }

    &[disabled] {
      cursor: pointer;
      opacity: 0.5;
    }

    &.secondary {
      background-color: $secondary;
      color: #fff;
      border: 2px solid $secondary;

      &:hover,
      &:active,
      &:focus {
        background-color: transparent;
        color: $secondary;
      }
    }

    &.link {
      display: inline-block;
      min-width: 0;
      padding: 0;
      background-color: transparent;
      border: 0;
      box-shadow: none;
      text-decoration: none;
      transition: $transition;
      border-radius:  0;

      &.primary {
        color: $primary;

        &:hover,
        &:active,
        &:focus {
          box-shadow: 0 2px 1px -1px $primary;
        }
      }
      &.secondary {
        color: $secondary;

        &:hover,
        &:active,
        &:focus {
          box-shadow: 0 2px 1px -1px $secondary;
        }
      }
    }
  }
</style>
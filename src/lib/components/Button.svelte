
<script lang="ts">
	export let type:string;
</script>

<button class={type} type="button"><slot></slot></button>

<style lang="scss">
@import '../../styles/vars.scss';

  button {
    background-color: $pink;
    font-family: 'Nunito', sans-serif;
    font-weight: 600;
    border-radius: 8px;
    padding: 8px 24px;
    border: 2px solid $pink;
    color: #fff;
    cursor: pointer;
    transition: $transition;
    box-shadow: 0 1px 2px #ccc;


    &:hover,
    &:active,
    &:focus {
      background-color: transparent;
      color: $pink;
    }

    &.secondary {
      background-color: $off-black;
      color: #fff;
      border: 2px solid $off-black;

      &:hover,
      &:active,
      &:focus {
        background-color: transparent;
        color: $off-black;
      }
    }
  }
</style>
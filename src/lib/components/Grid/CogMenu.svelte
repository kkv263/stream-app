<script lang="ts">
  import Cog from '$lib/components/icons/Cog.svelte';
  import { createEventDispatcher } from 'svelte';

  let active:boolean = false;
  const dispatchBlockDelete = createEventDispatcher();

  const deleteBlock = () => {
    dispatchBlockDelete('deleteblock');
  }

  const toggleSettings = () => {
    active = !active;
  };
</script>

<div class="cog-wrapper">
  <button type="button" on:click={toggleSettings} class:active>
    <Cog width="16px" height="16px"/>
  </button>
  <aside class="menu" class:active>
    <ul>
      <li on:click={deleteBlock}>
        <button type="button">Remove</button>
      </li>
      <li>
        <button type="button">Settings</button>
      </li>
    </ul>
  </aside>
</div>

<style lang="scss">
	@import '../../../styles/vars.scss';

  .cog-wrapper {
    position: relative;
  }

  @keyframes spin-animation {
		0% {
			transform: rotate(0deg);
		}
		100% {
			transform: rotate(-180deg);
		}
	}
  button {
    padding:0;
    display: flex;
    align-items: center;
    background-color: transparent;
    border: 0;
    color: currentColor;
    cursor: pointer;
    transition: $transition;

    &:hover {
      color: #CCC;
    }
    &.active {
      animation: spin-animation .4s ease;
    }
  }

  .menu {
    position: absolute;
    background-color: #fff;
    color: $text-color;
    padding: 4px 0;
    right: 0;
    top: calc(100% + 8px);
    cursor:default;
    border-radius: 4px;
    min-width: 80px;
    padding: 0;
    transition: $transition;
    opacity: 0;
    visibility: hidden;

    &.active {
      opacity: 1;
      visibility: visible;
    }
  }

  ul {
    list-style: none;
    padding: 0;
    margin: 0;
    li {
      cursor: pointer;
      font-size: 14px;
      padding: 2px 8px;
      border-bottom: 1px solid $off-black;

      &:last-child {
        border-bottom: 0;
      }
      &:hover,
      &:focus {
        background-color: salmon;
        color: #fff;
      }
    }
  }
</style>
<script lang="ts">
  import TwitterSideDrawer from "$lib/components/Twitter/TwitterSideDrawer.svelte";
  import { sideDrawerState } from "$lib/stores/sideDrawerStore";
  import { fly, fade } from "svelte/transition";
</script>

<aside class="sidedrawer" tabindex="-1" role="dialog" aria-labelledby="sidedrawer-label" aria-modal="true" in:fade={{duration: 250}} out:fade={{duration:400}}>
  <div on:click|stopPropagation={() => sideDrawerState.set('')} data-testid="sidedrawer__backdrop" class="sidedrawer__backdrop" data-dismiss="sidedrawer"></div>
  <section class="sidedrawer__inner" transition:fly={{x:600, duration: 400}}>
    <button on:click={() => sideDrawerState.set('')} type="button" class="sidedrawer__close-icon" title="Close" data-dismiss="sidedrawer">&times;</button>
    <div class="sidedrawer__content">
      <!-- <slot></slot> -->
      {#if $sideDrawerState === 'twitter'}
        <TwitterSideDrawer />
      {/if}
    </div>
  </section>
</aside>

<style lang="scss">
  @import "../../../styles/vars";
  @import "../../../styles/breakpoints";

  .sidedrawer {
    position: fixed;
    width: 100%;
    height: 100%;
    z-index: 2;
    top: 0;
    left: 0;

    &__backdrop {
      width: 100%;
      height: 100%;
      background-color: $off-black;
      opacity: .5;
    }

    &__inner {
      position: absolute;
      top: 0;
      right: 0;
      background-color: #fff;
      padding: 32px;
      width: 600px;
      height: 100%;

      @include bp(mobile) {
      }
    }
  }
</style>
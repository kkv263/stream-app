<script lang="ts">
  import TwitterHeader from "$lib/components/Twitter/TwitterHeader.svelte";
  import TwitchHeader from "$lib/components/Twitch/TwitchHeader.svelte";
  import OBSHeader from '$lib/components/OBS/OBSHeader.svelte';
  import BrowserSourceHeader from '$lib/components/BrowserSource/BrowserSourceHeader.svelte';
  import { createEventDispatcher } from 'svelte';

  export let sizeX:number = 4;
  export let sizeY:number = 4;
  export let type:string;

  const dispatchDrag = createEventDispatcher();
  let draggable:boolean = false;

  const header: Record<string, any> = {
    twitter: TwitterHeader,
    twitch: TwitchHeader,
    obs: OBSHeader,
    bs: BrowserSourceHeader
  }

  const toggleDrag = () => {
    dispatchDrag('dragtoggle');
  }
</script>

<section data-sizeX={sizeX} data-sizeY={sizeY} data-type={type} draggable={draggable}>
  <header on:mousedown={toggleDrag}>
    <svelte:component this={header[type]} on:deleteblock />
  </header>
  <slot></slot>
</section>

<style lang="scss">
  section {
    @for $i from 1 through 12 {
      &[data-sizeX = '#{$i}'] {
        width: calc(#{$i} * 80px + (4px * #{$i - 1}));

      }

      &[data-sizeY = '#{$i}'] {
        height: calc(#{$i} * 58px + (4px * #{$i - 1}));
      }
    }

    display: flex;
    flex-direction: column;

    header {
      cursor: grab;
      max-height: 40px;
    }
  }
</style>
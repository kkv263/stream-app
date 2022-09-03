<script lang="ts">
  import TwitterHeader from "$lib/components/Twitter/TwitterHeader.svelte";
  import TwitchHeader from "$lib/components/Twitch/TwitchHeader.svelte";
  import OBSHeader from '$lib/components/OBS/OBSHeader.svelte';
  import BrowserSourceHeader from '$lib/components/BrowserSource/BrowserSourceHeader.svelte';
  import { createEventDispatcher } from 'svelte';

  export let size:number = 4;
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

<section data-size={size} data-type={type} draggable={draggable}>
  <header on:mousedown={toggleDrag}>
    <svelte:component this={header[type]}/>
  </header>
  <slot></slot>
</section>

<style lang="scss">
  section {
    &[data-size = '2'] {
      height: 116px;
      width: 360px;
    }

    &[data-size = '4'] {
      height: 232px;
      width: 360px;
    }
    display: flex;
    flex-direction: column;

    header {
      cursor: grab;
      max-height: 40px;
    }
  }
</style>
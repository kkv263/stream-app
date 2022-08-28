<script lang="ts">
  import TwitterGetTweets from "$lib/components/Twitter/TwitterGetTweets.svelte";
  
  let blocks:any = []

  const addBlock = () => {
    blocks.push(TwitterGetTweets);
    blocks = blocks;
  }
</script>

<div class="grid">
  <div class="box"></div>
  <div class="box"></div>
  <div class="box"></div>
  <div class="box"></div>
  <div class="box"></div>
  <div class="box"></div>
  {#each blocks as block}
    <svelte:component this={block}/>
  {/each}
  <TwitterGetTweets />
</div>
<button on:click={addBlock}>add</button>

<style lang="scss">
  @import '../../../styles/vars.scss';
  .grid {
    margin: 0 auto;
    height: 99vh;
    width: 1280px;
    background-color: $off-black;
    display: grid;
    grid-template-columns: repeat(6, 1fr);
    gap: 4px;
    padding: 4px;
  }

  .box {
    background-color: #fff;
  }

  .grid-box {
    background-color: #fff;
    width: 375px;
    height: 240px;
  }
</style>
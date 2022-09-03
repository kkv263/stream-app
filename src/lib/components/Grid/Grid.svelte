<script lang="ts">
  import TwitterGetTweets from "$lib/components/Twitter/TwitterGetTweets.svelte";
  import Clock from "$lib/components/BrowserSource/Clock.svelte";
  import { onMount } from "svelte";
  
  let blocks:any = []
  let fill:HTMLDivElement;
  let empty:HTMLDivElement;
  let hovered:boolean = false;
  let hold:boolean = false;
  let invisible:boolean = false;
  
  const cols = Math.floor(1024 / 90); // 11
  const rows = Math.floor(768 / 60); // 12

  let cells:any = []

  onMount(() => {
    cells = renderCells();
  })

  const renderCells = () => {
    // TODO: Get "saved" grid from DB
    const temp = {
      48: {
        block: TwitterGetTweets,
        sizeX: 4,
        sizeY: 4
      },
      12: {
        block: Clock,
        sizeX: 4,
        sizeY: 2
      }
    }

    const init:any = [];
    for (let x = 0; x < rows; x++) {
      for (let y = 0; y < cols; y++) {
        init.push({
          block: null,
          sizeX: 1,
          sizeY: 1,
          pos: x * cols + y,
          draggable: false,
          x,
          y,
        });
      }
    }

    Object.entries(temp).forEach(([key, value]) => {
      const { sizeX, sizeY } = value;
      const keyInt = parseInt(key);
      init[key] = {...init[key], ...value}

      for (let x = 0; x < sizeY; x++) {
        for (let y = keyInt; y < keyInt+sizeX; y++) {
          const pos = y + x * cols;
          if (pos === keyInt) {continue;}
          init[pos].sizeY = init[pos].sizeX = 0;
        }
      }
    });

    return init;
  }

  const addBlock = () => {
    blocks.push(TwitterGetTweets);
    blocks = blocks;
  }

  // TODO: Debounce
  const dragOver = (e:any) => {
    e.preventDefault();
    console.log('dragover');
  }

  const dragEnter = (e:any) => {
    e.preventDefault;
    hovered = true;
    console.log('dragenter');
  }

  const dragLeave = () => {
    console.log('dragLeave');
    hovered = false;
  }

  const dragDrop = (e:any, i:number) => {
    console.log('dragDrop');
    hovered = false;
    const oldCell = cells[parseInt(e.dataTransfer.getData('text/plain'))];
    const { sizeX, sizeY, block } = oldCell
    const keyInt = parseInt(oldCell?.pos);

    cells[i] = {...cells[i], ...{ sizeX, sizeY, block}};
    cells[keyInt].block = null;

    console.log(cells[i])

    for (let x = 0; x < sizeY; x++) {
      for (let y = keyInt; y < keyInt+sizeX; y++) {
        const pos = y + x * cols;
        cells[pos].sizeY = cells[pos].sizeX = 1;
      }
    } 

    for (let x = 0; x < sizeY; x++) {
      for (let y = i; y < i + sizeX; y++) {
        const pos = y + x * cols;
        if (pos === i) {
          continue;
        }
        cells[pos].sizeY = cells[pos].sizeX = 0;
      }
    } 

    cells = cells
  }

  const dragStart = (e:any, i:number) => {
    e.dataTransfer.setData('text/plain', i);
    // console.log('dragstart', e);
    // hold = true;
    setTimeout(() => {
      // invisible = true;
    }, 0)
  }

  const dragEnd = (e:any, i:number) => {
    // hold = false;
    // invisible = false;
    cells[i].draggable = false;
  }

  const dragToggle = (i:number) => {
    cells[i].draggable = true;
  }
</script>

<div class="grid">
  {#each cells as {x, y, sizeX, sizeY, block, draggable}, i}
    <div
      bind:this={cells[i].cell}
      data-sizeX={sizeX}
      data-sizeY={sizeY}
      data-col={y}
      data-row={x}
      class:hovered 
      on:dragover={(e) => dragOver(e)} 
      on:dragenter={(e) => dragEnter(e)} 
      on:dragleave={dragLeave} 
      on:drop={(e) => dragDrop(e, i)} 
      class="box">
      {#if block}
        <div on:dragstart={(e) => dragStart(e,i)} on:dragend={(e) => dragEnd(e,i)} class="block-wrapper" data-pos={i} draggable={draggable}>
          <svelte:component on:dragtoggle={() => dragToggle(i)} this={block} />
        </div>
      {:else} 
        {i}
      {/if}
    </div>
  {/each}

  <!-- <div class="box empty">
    <div bind:this={fill} on:dragstart={dragStart} on:dragend={dragEnd} class="fill" class:hold class:invisible draggable="true"></div>
  </div>
  <div bind:this={empty} class:hovered on:dragover={(e) => dragOver(e)} on:dragenter={(e) => dragEnter(e)} on:dragleave={dragLeave} on:drop={dragDrop} class="box empty"></div>
  <div class="box empty"></div> -->
  <!-- <div class="grid-box span">
    <TwitterGetTweets />
  </div> -->
  
  <!-- {#each blocks as block}
    <svelte:component this={block}/>
  {/each} -->
</div>
<button on:click={addBlock}>add</button>

<style lang="scss">
  @import '../../../styles/vars.scss';
  .grid {
    margin: 0 auto;
    width: 1024px;
    background-color: $off-black;
    display: grid;
    grid-template-columns: repeat(11, minmax(0, 90px));
    grid-template-rows: repeat(12, minmax(0, 58px));
    gap: 4px;
    padding: 4px;
  }

  .box {
    background-color: #fff;
    display:flex; 
    align-items: center;
    justify-content: center;
    &[data-sizeX="0"],
    &[data-sizeY="0"] {
      display: none;
    }

    @for $i from 1 through 12 {
      &[data-sizeX="#{$i}"] {
        grid-column: span $i;
      }
      &[data-sizeY="#{$i}"] {
        grid-row: span $i;
      }
    }
  }

  .grid-box {
    background-color: #fff;
    // width: 375px;
    // height: 240px;
  }

  .fill {
    background-image: url('http://source.unsplash.com/random/150x150');
    width: 150px;
    height: 150px;
    position: relative;
    cursor: pointer;
  }

  .hold {
    border: solid orange 4px;
  }

  .hovered {
    background: salmon;
    border-style: dashed;
  }

  .invisible {
    display: none;
  }
</style>
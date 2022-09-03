<script lang="ts">
  import TwitterGetTweets from "$lib/components/Twitter/TwitterGetTweets.svelte";
  import Clock from "$lib/components/BrowserSource/Clock.svelte";
  import { cellDragStore } from "$lib/stores/cellDragStore";
  import { get } from "svelte/store";
  import { onMount } from "svelte";
  import type { CellBlock } from '$lib/types/general';
  
  const cols = Math.floor(1024 / 90); // 11
  const rows = Math.floor(768 / 60); // 12
  let blocks:any = []
  let cells:CellBlock[] = [];

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

    const init:CellBlock[string] = [];
    for (let x = 0; x < rows; x++) {
      for (let y = 0; y < cols; y++) {
        init.push({
          block: null,
          sizeX: 1,
          sizeY: 1,
          pos: (x * cols + y).toString(),
          draggable: false,
          hovered: false,
          invisible: false,
          x,
          y,
        });
      }
    }

    Object.entries(temp).forEach(([key, value]) => {
      const { sizeX, sizeY } = value;
      const keyInt = parseInt(key);
      init[key] = {...init[key], ...value}

      // TODO: Refactor to reuse this function
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
  // Maybe use this to "Update preview"
  const dragOver = (e:any) => {
    e.preventDefault();
    console.log('dragover');
  }

  const dragEnter = (e:any, i:number) => {
    e.preventDefault();
    // const oldCell = get(cellDragStore);
    // const { sizeX, sizeY } = oldCell;
    cells[i].hovered = true;
    cells = cells;
  }

  const dragLeave = (i:number) => {
    // const oldCell = get(cellDragStore);
    // const { sizeX, sizeY } = oldCell;
    cells[i].hovered = false;
    cells = cells;
  }

  // Messes up when "dragged inside itself"
  const dragDrop = (e:any, i:number) => {
    cells[i].draggable = false;
    cells[i].hovered = false;
    cells[i].invisible = false;
    const oldCell = get(cellDragStore);
    const oldPos = parseInt(oldCell?.pos);

    if (oldPos === i) { return; }

    const { sizeX, sizeY, block } = oldCell
    const checkRowOverLapX = Math.floor((i) / cols) != Math.floor((i + (sizeX - 1)) / cols);
    const checkRowOverLapY = Math.ceil((i + (rows)) / rows) > rows - 1;
    let blockOverlap = false;
    let newPos = checkRowOverLapX ? i - ((i + (sizeX)) % cols) : i;
    newPos = checkRowOverLapY ? newPos - cols : newPos;

    // TODO: Refactor to not check the all spaces.
    for (let x = 0; x < sizeY; x++) {
      for (let y = newPos; y < newPos + sizeX; y++) {
        const pos = y + x * cols;
        if (cells[pos].sizeX === 0) {
          blockOverlap = true;
          break;
        }
      }
    } 

    if (blockOverlap) { return; }

    for (let x = 0; x < sizeY; x++) {
      for (let y = newPos; y < newPos + sizeX; y++) {
        const pos = y + x * cols;
        if (pos === newPos) {
          continue;
        }
        cells[pos].sizeY = cells[pos].sizeX = 0;
      }
    } 

    for (let x = 0; x < sizeY; x++) {
      for (let y = oldPos; y < oldPos + sizeX; y++) {
        const pos = y + x * cols;
        cells[pos].sizeY = cells[pos].sizeX = 1;
      }
    } 

    cells[newPos] = {...cells[newPos], ...{ sizeX, sizeY, block}};
    cells[oldPos].block = null;
    cells = cells
  }

  const dragStart = (e:any, i:number) => {
    const { sizeX, sizeY } = cells[i]
    cellDragStore.set(cells[i]);

    for (let x = 0; x < sizeY; x++) {
      for (let y = i; y < i + sizeX; y++) {
        const pos = y + x * cols;
        if (i == pos) { continue };
        cells[pos].sizeY = cells[pos].sizeX = 1;
      }
    } 

    setTimeout(() => {
      cells[i].invisible = true;
      cells = cells
    }, 0)
  }

  const dragEnd = (e:any, i:number) => {
    cells[i].draggable = false;
    cells[i].invisible = false;
    cells = cells
  }

  const dragToggle = (i:number) => {
    cells[i].draggable = true;
    cells = cells
  }
</script>

<div class="grid">
  {#each cells as {x, y, sizeX, sizeY, block, draggable, hovered, invisible}, i}
    <div class="box"
      class:hovered 
      bind:this={cells[i].cell} 
      data-sizeX={sizeX} 
      data-sizeY={sizeY}
      ata-col={y} 
      data-row={x} 
      on:dragover={(e) => dragOver(e)} 
      on:dragenter={(e) => dragEnter(e, i)} 
      on:dragleave={() => dragLeave(i)}
      on:drop={(e) => dragDrop(e, i)} 
      >
      {#if block}
        <div class="block-wrapper"  
          class:invisible
          data-pos={i} 
          draggable={draggable} 
          on:dragstart={(e) => dragStart(e,i)} 
          on:dragend={(e) => dragEnd(e,i)} >
            <svelte:component on:dragtoggle={() => dragToggle(i)} this={block} />
        </div>
      {:else} 
        {i}
      {/if}
    </div>
  {/each}
</div>
<button on:click={addBlock}>add</button>

<style lang="scss">
  @import '../../../styles/vars.scss';
  .grid {
    margin: 0 auto;
    width: 1024px;
    background-color: slateblue;
    display: grid;
    grid-template-columns: repeat(11, minmax(0, 90px));
    grid-template-rows: repeat(12, minmax(0, 58px));
    gap: 4px;
    padding: 4px;
  }

  .box {
    background-color: #fff;
    &[data-sizeX="0"],
    &[data-sizeY="0"] {
      opacity: 0;
      visibility: hidden;
    }
  }

  .block-wrapper {
    position: relative;
    z-index: 1;
  }

  .grid-box {
    background-color: #fff;
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
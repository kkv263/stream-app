<script lang="ts">
  import { cellDragStore, cellDragOffset } from "$lib/stores/cellDragStore";
  import { onMount } from "svelte";
  import type { CellBlock, SaveState, SaveBlock } from '$lib/types/general';
  import { updateSaveState, checkExistingRow, blockCodes } from "$lib/_includes/gridHelpers";
  import ActionModal from "$lib/components/Grid/ActionModal.svelte";
  
  const cols = Math.floor(1024 / 80); // 11
  const rows = Math.floor(768 / 60); // 12
  let cells:CellBlock[] = [];
  let saveState:SaveState = {}
  let isDraggingState:boolean = false;
  let isOutOfBounds:boolean = false;

  onMount(async() => {
    saveState = await checkExistingRow();
    cells = renderCells();
  })
  
  const renderCells = () => {
    const init:CellBlock[] = [];
    for (let x = 0; x < rows; x++) {
      for (let y = 0; y < cols; y++) {
        init.push({
          block: null,
          val: '',
          sizeX: 1,
          sizeY: 1,
          pos: (x * cols + y).toString(),
          draggable: false,
          hovered: false,
          invisible: false,
          locked: false,
          x,
          y,
        });
      }
    }

    Object.entries(saveState).forEach(([key, value]) => {
      const { sizeX, sizeY, pos } = value as SaveBlock;
      const keyInt = pos;
      init[pos] = {...init[pos], sizeX, sizeY, block: blockCodes[key].block, val: key}

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

  const addBlock = (e:CustomEvent) => {
    const blockOption = e.detail.blockOption;
    
    if (saveState[blockOption]) {
      alert('There is already one of this block')
      return;
    }

    const { block, sizeX, sizeY } = blockCodes[blockOption];
    let blockInserted = false;

    for (let i = 0; i < cells.length; i ++) {
      // If block will bleed into edge, move to next spot.
      if (cols - (i % cols) < sizeX || i + (cols * (sizeY - 1)) >= cells.length) {
        continue;
      } 

      // Check if block overlaps with another block
      let overlap = false;
      for (let x = 0; x < sizeY; x++) {
        for (let y = i; y < i + sizeX; y++) {
          const pos = y + x * cols;
          if (cells[pos].sizeX === 0) {
            overlap = true;
            break;
          }
        }
      } 

      if (overlap) {continue;}

      if (cells[i].block === null) {
        cells[i].block = block
        cells[i].val = blockOption 
        cells[i].sizeX = sizeX;
        cells[i].sizeY = sizeY;
        for (let x = 0; x < sizeY; x++) {
          for (let y = i; y < i + sizeX; y++) {
            const pos = y + x * cols;
            if (pos === i) {continue;}
            cells[pos].sizeY = cells[pos].sizeX = 0;
          }
        }
        blockInserted = true;
        saveState[blockOption] = { pos: i, sizeX, sizeY, val: blockOption}
        updateSaveState(saveState);
        break;
      } 
    }

    // TODO Error modal.
    if (!blockInserted) { alert('Not able to insert anymore of this block!')}
    cells = cells;
  }

  // TODO: Debounce
  const dragOver = (e:any, i:number) => {
    e.preventDefault();
    const oldCell = $cellDragStore;
    const { sizeX, sizeY, pos} = oldCell;
    const offsetIndex = i - $cellDragOffset;
    const checkRowOverLapX = Math.floor((offsetIndex) / cols) != Math.floor((offsetIndex + (sizeX - 1)) / cols);
    const checkRowOverLapY = Math.ceil((offsetIndex + (rows)) / rows) > rows;
    const edgeOfGrid = i % cols < sizeX - 1 || i % cols > (cols - sizeX - 1)
    if (offsetIndex < 0 || (checkRowOverLapX && edgeOfGrid) || checkRowOverLapY) { 
      isOutOfBounds = true;
      return; 
    }

    isOutOfBounds = false;

    for (let x = 0; x < sizeY; x++) {
      for (let y = offsetIndex; y < offsetIndex + sizeX; y++) {
        const posIndex = y + x * cols;
        if (cells[posIndex].sizeX === 0 || cells[posIndex].val != '' && posIndex != parseInt(pos)) { 
          isOutOfBounds = true;
          return; 
        }
        cells[posIndex].hovered = true;
      }
    }

    cells[offsetIndex].hovered = cells[offsetIndex].block &&  offsetIndex != parseInt(pos) ?  false : true;
    cells = cells;
  }

  const dragEnter = (e:any, i:number) => {
    e.preventDefault();
  }

  const dragLeave = (i:number) => {
    const offsetIndex = i - $cellDragOffset;
    const oldCell = $cellDragStore;
    const { sizeX, sizeY } = oldCell;

    for (let x = 0; x < sizeY; x++) {
      for (let y = offsetIndex; y < offsetIndex + sizeX; y++) {
        const pos = y + x * cols;
        if (pos > rows * cols - 1) {return;}
        cells[pos].hovered = false;
      }
    }

    if (offsetIndex < 0) { return; }
    cells[offsetIndex].hovered = false;
    cells = cells;
  }

  const dragDrop = (e:any, i:number) => {
    const offsetIndex = i - $cellDragOffset;
    const oldCell = $cellDragStore;
    const oldPos = parseInt(oldCell?.pos);
    const { sizeX, sizeY, block, val, locked } = oldCell
    const checkRowOverLapX = Math.floor((offsetIndex) / cols) != Math.floor((offsetIndex + (sizeX - 1)) / cols);
    const checkRowOverLapY = Math.ceil((offsetIndex + (rows)) / rows) > rows;
    let blockOverlap = false;
    let newPos = checkRowOverLapY ? offsetIndex - cols : offsetIndex;

    cells[oldPos].draggable = false;
    cells[oldPos].invisible = false;
    cells[offsetIndex].hovered = false;

    if (oldPos === newPos || checkRowOverLapX) { 
      cells = cells;
      return; 
    }

    // TODO: Refactor to not check the all spaces.
    for (let x = 0; x < sizeY; x++) {
      for (let y = newPos; y < newPos + sizeX; y++) {
        const pos = y + x * cols;
        const bottomRight = (newPos + sizeX-1) + (sizeY - 1) * cols;
        cells[pos].hovered = false;
        if (cells[pos].sizeX === 0 || (cells[pos].val != '' && pos === bottomRight)) {
          blockOverlap = true;
        }
      }
    } 

    if (blockOverlap) { 
      cells = cells
      return; 
    }

    for (let x = 0; x < sizeY; x++) {
      for (let y = oldPos; y < oldPos + sizeX; y++) {
        const pos = y + x * cols;
        cells[pos].sizeY = cells[pos].sizeX = 1;
      }
    } 

    for (let x = 0; x < sizeY; x++) {
      for (let y = newPos; y < newPos + sizeX; y++) {
        const pos = y + x * cols;
        if (pos === newPos) {continue;}
        cells[pos].sizeY = cells[pos].sizeX = 0;
      }
    } 

    cells[newPos] = {...cells[newPos], ...{ sizeX, sizeY, block, val, locked }};
    saveState[val] = { pos: newPos, sizeX, sizeY, val }
    updateSaveState(saveState);
    cells[oldPos].val = '';
    cells[oldPos].block = null
    cells = cells
    cellDragStore.set({} as CellBlock);
    isDraggingState = false;
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

    isDraggingState = true;
    setTimeout(() => {
      cells[i].invisible = true;
      cells = cells
    }, 0)
  }

  const dragEnd = (e:any, i:number) => {
    cells[i].draggable = false;
    cells[i].invisible = false;
    isDraggingState = false;
    isOutOfBounds = false;
    cells = cells
  }

  const dragToggle = (e:CustomEvent, i:number) => {
    const { locked } = cells[i]
    cellDragOffset.set(e.detail.offset);
    cells[i].draggable = !locked;
    cells = cells
  }

  const deleteBlock = (i:number) => {
    const { sizeX, sizeY, val } = cells[i];

    cells[i].draggable = false;
    cells[i].invisible = false;
    cells[i].locked = false;

    for (let x = 0; x < sizeY; x++) {
      for (let y = i; y < i + sizeX; y++) {
        const pos = y + x * cols;
        cells[pos].sizeY = cells[pos].sizeX = 1;
      }
    }
    cells[i].block = null;
    cells[i].val = '';
    saveState[val] = null;
    updateSaveState(saveState);
    cells = cells;
  }

  const lockBlock = (e: CustomEvent, i:number) => {
    cells[i].locked = e.detail.locked;
    cells = cells;
  }

</script>

<ActionModal on:addblock={addBlock}/>

<div class="grid" data-drag={isDraggingState} data-oob={isOutOfBounds}>
  {#each cells as {x, y, block, draggable, hovered, invisible, locked}, i}
    <div class="box"
      class:hovered 
      bind:this={cells[i].cell} 
      data-col={y} 
      data-row={x} 
      on:dragover={(e) => dragOver(e, i)} 
      on:dragenter={(e) => dragEnter(e, i)} 
      on:dragleave={() => dragLeave(i)}
      on:drop={(e) => dragDrop(e, i)} 
      >
      {#if block}
        <div class="block-wrapper"  
          class:invisible
          data-pos={i} 
          draggable={draggable} 
          data-locked={locked}
          on:dragstart={(e) => dragStart(e,i)} 
          on:dragend={(e) => dragEnd(e,i)} >
            <svelte:component 
            on:deleteblock={() => deleteBlock(i)} 
            on:lockblock={(e) => lockBlock(e,i)} 
            on:dragtoggle={(e) => dragToggle(e,i)} 
            this={block} />
        </div>
      {:else} 
        {i}
      {/if}
    </div>
  {/each}
</div>

<style lang="scss">
  @import '../../../styles/vars.scss';

  .grid {
    margin-left: auto;
    width: 1004px;
    background-color: slateblue;
    display: grid;
    grid-template-columns: repeat(12, minmax(0, 80px));
    grid-template-rows: repeat(12, minmax(0, 58px));
    gap: 4px;
    padding: 4px;

    &[data-drag=true] {
      .block-wrapper[draggable=false] {
        pointer-events: none;
      }
    }

    &[data-oob=true] {
      .box {
        background-color: salmon;
      }
    }
  }

  .box {
    background-color: #fff;
  }

  .block-wrapper {
    position: relative;
    z-index: 1;

    &[data-locked=false] {
      :global {
        .block-header {
          cursor: grab;
          user-select: none;
        }
      }
    }
  }

  .hovered {
    background: mediumseagreen;
  }
  .invisible {
    display: none;
  }
</style>
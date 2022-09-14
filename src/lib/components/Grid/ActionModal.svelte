<script lang="ts">
  import Modal from "$lib/components/_global/Modal.svelte";
  import { actionModalState } from "$lib/stores/actionModalStore";
  import { blockCodes } from "$lib/_includes/gridHelpers";

  let blockOption:string;

</script>

{#if $actionModalState === 'addblock'}
<Modal modalType="action">
  <div>
    <select name="block-add" id="block-add" bind:value={blockOption}>
      {#each Object.entries(blockCodes) as [val, attr]}
        <option value={val}>{attr.name}</option>
      {/each}
    </select>
    <button>add</button>
   </div>
</Modal>
{/if}

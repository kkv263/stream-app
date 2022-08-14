<script lang="ts">
  import { getContext, onMount } from 'svelte';
  import type OBSWebSocket from 'obs-websocket-js';

  export let name:string;
  let obs:OBSWebSocket = getContext('obs');

</script>

<!-- Definite inpplement settings for % on input -->

<span>scene: {name}</span>

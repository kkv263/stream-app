<script lang="ts">
  import GlobeAlt from "../icons/GlobeAlt.svelte";
  import { createEventDispatcher } from 'svelte';
  import type { InputError } from "$lib/types/general";
  import { validateWebsocketUrl } from "$lib/_includes/generalHelpers";

  export let name:string;
  export let placeholder:string | null = null;;
  export let value:string = "";
  export let required:boolean | null = null;
  export let error:boolean = false;
  export let noerror:boolean | null = null;
  export let inputtype: string;
  export let noicon:boolean | null = null;

  const dispatchError = createEventDispatcher();

  const inputError: { [name: string]: InputError } = {
    name: {
      regex: new RegExp(/^(?=[a-zA-Z0-9._]{2,20}$)(?!.*[_.]{2})[^_.].*[^_.]$/),
      error: 'Name format is invalid'
    },
    url: {
      error: 'Localhost url format is invalid! Check the port and url again.'
    }
  }

  const icons: Record<string, any> = {
    url: GlobeAlt,
  }

  const bindValue = (e: Event) => {
    value = (<HTMLInputElement>e.target).value;
  }
  const validateInput = (e: Event, type:string) => {
    if (type === 'url') {
      const { match } = validateWebsocketUrl(value);
      error = !match
    }
    else {
      const regex = inputError[type]?.regex;
      error = !regex?.test(value);
    }

    dispatchError('text_error', { state: error });
  }
</script>

<div class="form-input" data-type="text">
  <label for={name}><slot></slot></label>
  <div class="input-wrapper">
    <div class="icon-wrapper">
      <svelte:component width="24px" height="24px" this={icons[inputtype]}/>
    </div>
    <input 
      class="{value ? 'has-value': ''}"
      class:error
      class:noicon
      id={name} 
      type="text"
      placeholder={placeholder} 
      {value} 
      {required} 
      on:input={bindValue}
      on:blur={(e) => {if(!noerror) validateInput(e,inputtype)}}
      />
      {#if error}
        <span class="error-text">{inputError[inputtype]?.error}</span>
      {/if}
  </div>
</div>

<style lang="scss">
</style>
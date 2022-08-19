<script lang="ts">
  import Mail from "$lib/components/icons/Mail.svelte";
  import type { InputError } from "$lib/types/general";
  import { createEventDispatcher } from 'svelte';

  export let inputtype:string;
  export let placeholder:string;
  export let value:string = "";
  export let name:string;
  export let required:boolean | null = null;
  export let error:boolean = false;
  export let noerror:boolean | null = null;

  const dispatchError = createEventDispatcher();

  const bindValue = (e: Event) => {
    value = (<HTMLInputElement>e.target).value;
  }

  const emailError: { [name: string]: InputError } = {
    email: {
      regex: new RegExp(/^(([^<>()\[\]\.,;:\s@\"]+(\.[^<>()\[\]\.,;:\s@\"]+)*)|(\".+\"))@(([^<>()[\]\.,;:\s@\"]+\.)+[^<>()[\]\.,;:\s@\"]{2,})$/),
      error: 'Email format is invalid.'
    },
  }

  const validateInput = (e: Event, type:string) => {
    const regex = emailError[type]?.regex;
    error = !regex?.test(value)
    dispatchError('email_error', { state: error });
  }
</script>

<div class="form-input">
  <label for={name}><slot></slot></label>
  <div class="input-wrapper">
    <div class="icon-wrapper">
      <Mail width="24px" height="24px" />
    </div>
    <input 
      class="{value ? 'has-value': ''}"
      class:error 
      id={name} 
      placeholder={placeholder} 
      {value} 
      {required} 
      on:input={bindValue}
      on:blur={(e) => {if(!noerror) validateInput(e,inputtype)}}
      />
      {#if error}
        <span class="error-text">{emailError[inputtype]?.error}</span>
      {/if}
  </div>
</div>
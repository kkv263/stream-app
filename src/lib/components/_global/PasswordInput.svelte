<script lang="ts">
  import Eye from "$lib/components/icons/Eye.svelte";
  import EyeOff from "$lib/components/icons/EyeOff.svelte";
  import Key from "$lib/components/icons/Key.svelte";
  import type { InputError } from "$lib/types/general";
  import { createEventDispatcher } from 'svelte';

  export let inputtype:string;
  export let placeholder:string;
  export let value:string = "";
  export let name:string;
  export let pwVisible:string = 'password';
  export let required:boolean | null = null;
  export let error:boolean = false;
  export let noerror:boolean | null = null;

  const dispatchError = createEventDispatcher();

  const eye: Record<string, any> = {
    password: Eye,
    text: EyeOff,
  }

  const bindValue = (e: Event) => {
    value = (<HTMLInputElement>e.target).value;
  }

  const passwordError: { [name: string]: InputError } = {
    authpassword: {
      regex: new RegExp(/^(?=.*[A-Za-z])(?=.*\d)(?=.*[@$!%*#?&])[A-Za-z\d@$!%*#?&]{8,}$/),
      error: 'Password must contain minimum 8 characters, 1 uppercase letter, 1 lowercase letter, and 1 special character.'
    },
  }

  const validateInput = (e: Event, type:string) => {
    const regex = passwordError[type]?.regex;
    error = !regex?.test(value)
    dispatchError('password_error', { state: error });
  }
</script>

<label for={name}><slot></slot></label>
<div class="input-wrapper">
  <div class="icon-wrapper">
    <Key width="24px" height="24px" />
  </div>
  <div class="eye-icon-wrapper" on:click={() => pwVisible = pwVisible === 'password' ? 'text' : 'password'}>
    <svelte:component width="24px" height="24px" this={eye[pwVisible]}/>
  </div>
  <input 
    class="{value ? 'has-value': ''}"
    class:error 
    id={name} 
    type={pwVisible} 
    placeholder={placeholder} 
    {value} 
    {required} 
    on:input={bindValue}
    on:blur={(e) => {if(!noerror) validateInput(e,inputtype)}}
    />
    {#if error}
      <span class="error-text">{passwordError[inputtype]?.error}</span>
    {/if}
</div>

<style lang="scss">
  @import '../../../styles/vars.scss';
  @import '../../../styles/breakpoints.scss';

  .eye-icon-wrapper {
    position: absolute;
    top: 50%;
    transform: translateY(-50%);
    right: 16px;
    display: flex;
    align-items: center;
    cursor: pointer;
    color: $text-color;
    transition: $transition;

    &:hover,
    &:focus {
      color: #ccc;
    }
  }

  input {
    &[type="password"] {
      padding-right: 48px;
    }
  }
</style>

<script lang="ts">
  import { createEventDispatcher } from 'svelte';
  import Mail from "$lib/components/icons/Mail.svelte";
  import Key from "$lib/components/icons/Key.svelte";
  import Eye from "$lib/components/icons/Eye.svelte";
  import EyeOff from "$lib/components/icons/EyeOff.svelte";
  import type { AuthError } from "$lib/types/auth";

  export let type:string;
  export let placeholder:string;
  export let value:string = "";
  export let name:string;
  export let pwVisible:string = 'password';
  export let required:boolean | null = null;
  export let error:boolean = false;
  export let noerror:boolean | null = null;

  const dispatchError = createEventDispatcher();

  const authError: { [name: string]: AuthError } = {
    email: {
      regex: new RegExp(/^(([^<>()\[\]\.,;:\s@\"]+(\.[^<>()\[\]\.,;:\s@\"]+)*)|(\".+\"))@(([^<>()[\]\.,;:\s@\"]+\.)+[^<>()[\]\.,;:\s@\"]{2,})$/),
      error: 'Email format is invalid.'
    },
    password: {
      regex: new RegExp(/^(?=.*[A-Za-z])(?=.*\d)(?=.*[@$!%*#?&])[A-Za-z\d@$!%*#?&]{8,}$/),
      error: 'Password must contain minimum 8 characters, 1 uppercase letter, 1 lowercase letter, and 1 special character.'
    },
    text: {
      regex: new RegExp(/^(?=[a-zA-Z0-9._]{2,20}$)(?!.*[_.]{2})[^_.].*[^_.]$/),
      error: 'Name format is invalid'
    },
    date: {
      regex: new RegExp(/.*/),
      error: ''
    }
    
  }

  const icons: Record<string, any> = {
    email: Mail,
    password: Key,
  }

  const eye: Record<string, any> = {
    password: Eye,
    text: EyeOff,
  }

  const bindValue = (e: Event) => {
    value = (<HTMLInputElement>e.target).value;
  }

  const validateInput = (e: Event, type:string) => {
    const regex = authError[type]?.regex;
    error = !authError[type]?.regex.test(value)
    dispatchError('error', { state: error });
  }
</script>

<div class="form-input" data-type={type}>
  <label for={name}><slot></slot></label>
  <div class="input-wrapper">
    <div class="icon-wrapper">
      <svelte:component width="24px" height="24px" this={icons[type]}/>
    </div>
      {#if type === 'password'}
        <div class="eye-icon-wrapper" on:click={() => pwVisible = pwVisible === 'password' ? 'text' : 'password'}>
          <svelte:component width="24px" height="24px" this={eye[pwVisible]}/>
        </div>
      {/if}
    <input 
      class="{value ? 'has-value': ''}"
      class:error 
      id={name} 
      type={name === 'authPassword' ? pwVisible : type} 
      placeholder={placeholder} 
      data-testid={`${type}-input`}
      {value} 
      {required} 
      on:input={bindValue}
      on:blur={(e) => {if(!noerror) validateInput(e,type)}}/>
      {#if error}
        <span class="error-text">{authError[type]?.error}</span>
      {/if}
  </div>
</div>

<style lang="scss">
  @import '../../../styles/vars.scss';
  @import '../../../styles/breakpoints.scss';
  .form-input {
    display: flex;
    padding-bottom: 36px;
    flex-direction: column;
    justify-content: center;
  }

  label {
    padding-bottom: 8px;
    display: flex;
    align-items: center;
    justify-content: space-between;

    @include bp(tablet) {
      font-size: 14px;
    }
  }

  .input-wrapper {
    display: flex;
    position: relative;
    color: #ccc;
  }

  .icon-wrapper {
    position: absolute;
    top: 50%;
    transform: translateY(-50%);
    left: 16px;
    display: flex;
    align-items: center;
  }

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
    &:active,
    &:focus {
      color: #ccc;
    }
  }

  input {
    border: 1px solid #777;
    border-radius: 8px;
    height: 32px;
    padding: 8px 16px 8px 48px;
    flex: 1 0 auto;

    @include bp(tablet) {
      height: 24px;
    }

    &.error {
      border-color: $error-red;
      background-color: rgba($error-red, 0.05);
    }
    &[type="text"]:not(#authPassword),
    &[type="date"] {
      padding-left: 16px;
    }

    &[type="password"] {
      padding-right: 48px;
    }

    &::-webkit-datetime-edit-text,
    &::-webkit-datetime-edit-month-field,
    &::-webkit-datetime-edit-day-field,
    &::-webkit-datetime-edit-year-field,
    &::placeholder {
      color: #ccc;
    }

    &.has-value {
      &::-webkit-datetime-edit-text,
      &::-webkit-datetime-edit-month-field,
      &::-webkit-datetime-edit-day-field,
      &::-webkit-datetime-edit-year-field {
        color: $text-color;
      }
    }
  }

  .error-text {
    color: $error-red;
    position: absolute;
    top: 100%;
    left: 0;
    font-size: 14px;
    margin-top: 2px;

    @include bp(tablet) {
      font-size: 12px;
    }
  }
</style>
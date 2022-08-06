
<script lang="ts">
  import Mail from "$lib/components/icons/Mail.svelte";
  import Key from "$lib/components/icons/Key.svelte";
  import Eye from "$lib/components/icons/Eye.svelte";
  import EyeOff from "$lib/components/icons/EyeOff.svelte";

  export let type:string;
  export let placeholder:string;
  export let value:string = "";
  export let name:string;
  export let pwVisible:string = 'password';
  export let required:boolean | null = null;

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
</script>

<div class="form-input" data-type={type}>
  <label for={name}><slot></slot></label>
  <div class="input-wrapper">
    <div class="icon-wrapper">
      <svelte:component width="24px" height="24px" fill="#777" this={icons[type]}/>
    </div>
      {#if type === 'password'}
        <div class="eye-icon-wrapper" on:click={() => pwVisible = pwVisible === 'password' ? 'text' : 'password'}>
          <svelte:component width="24px" height="24px" this={eye[pwVisible]}/>
        </div>
      {/if}
    <input id={name} type={name === 'authPassword' ? pwVisible : type} placeholder={placeholder} {value} on:input={bindValue} {required}/>
  </div>
</div>

<style lang="scss">
  @import '../../../styles/vars.scss';
  .form-input {
    display: flex;
    padding-bottom: 32px;
    flex-direction: column;
    justify-content: center;
  }

  label {
    padding-bottom: 8px;
    display: flex;
    align-items: center;
    justify-content: space-between;
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

    &[type="password"] {
      padding-right: 48px;
    }

    &::placeholder {
      color: #ccc;
    }
  }
</style>
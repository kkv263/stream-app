
<script lang="ts">
  import Mail from "$lib/components/icons/Mail.svelte";
  import Key from "$lib/components/icons/Key.svelte";

  export let type:string;
  export let placeholder:string;
  export let value:string = "";
  export let name:string;

  const icons: Record<string, any> = {
    email: Mail,
    password: Key
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
    <input id={name} type={type} placeholder={placeholder} {value} on:input={bindValue}/>
  </div>
</div>

<style lang="scss">
  @import '../../../styles/vars.scss';
  .form-input {
    display: flex;
    padding-bottom: 16px;
    flex-direction: column;
    justify-content: center;
  }

  label {
    padding-bottom: 8px;
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

  input {
    border: 1px solid #777;
    border-radius: 8px;
    height: 36px;
    padding: 8px 8px 8px 48px;
    flex: 1 0 auto;

    &::placeholder {
      color: #ccc;
    }
  }
</style>
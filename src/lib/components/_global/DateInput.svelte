<script lang="ts">
  export let placeholder:string;
  export let value:string = "";
  export let name:string;
  export let required:boolean | null = null;
  export let error:boolean = false;

  const bindValue = (e: Event) => {
    value = (<HTMLInputElement>e.target).value;
  }
</script>

<div class="form-input">
  <label for={name}><slot></slot></label>
  <div class="input-wrapper">
    <input 
      class="{value ? 'has-value': ''}"
      class:error 
      id={name} 
      type="date"
      placeholder={placeholder} 
      {value} 
      {required} 
      on:input={bindValue}/>
  </div>
</div>

<style lang="scss">
  @import '../../../styles/vars.scss';
  
  input {
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
</style>
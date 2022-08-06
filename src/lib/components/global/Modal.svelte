<script lang="ts">
  import { isauthModalOpen } from "$lib/stores/authModalStore";
  import { fade } from "svelte/transition";
</script>

<aside class="modal" tabindex="-1" role="dialog" aria-labelledby="modal-label" aria-modal="true" transition:fade={{duration: 200}}>
  <div on:click|stopPropagation={() => isauthModalOpen.set('')} class="modal__backdrop" data-dismiss="modal"></div>
  <section class="modal__inner">
    <button on:click={() => isauthModalOpen.set('')} type="button" class="modal__close-icon" title="Close" data-dismiss="modal">&times;</button>
    <div class="modal__content"><slot></slot></div>
  </section>
</aside>

<style lang="scss">
  @import "../../../styles/vars";
  @import "../../../styles/breakpoints";
  .modal {
    position: fixed;
    width: 100%;
    height: 100%;
    z-index: 2;
    top: 0;
    left: 0;

    &__backdrop {
      width: 100%;
      height: 100%;
      background-color: #777;
      opacity: .5;
    }

    &__inner {
      position: absolute;
      top: 50%;
      left: 50%;
      transform: translate(-50%, -50%);
      background-color: #fff;
      padding: 16px 32px;
      border-radius: 8px;
      border-bottom-right-radius: 50px;
      min-width: 375px;

      @include bp(mobile) {
        min-width: 0px;
      }
    }

    &__close-icon {
      position: absolute;
      top: 12px;
      right: 12px;
      width: 40px;
      height: 40px;
      display: flex;
      padding: 0;
      align-items: center;
      justify-content: center;
      background-color: transparent;
      font-size: 24px;
      border: 0;
      color: $text-color;
      cursor: pointer;
      transition: $transition;

      &:hover,
      &:active,
      &:focus {
        opacity: .5;
      }
    }
  }
</style>
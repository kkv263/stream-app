<div class="form-input">
  <slot></slot>
</div>

<style lang="scss">
  @import '../../../styles/vars.scss';
  @import '../../../styles/breakpoints.scss';
  .form-input {
    display: flex;
    padding-bottom: 36px;
    flex-direction: column;
    justify-content: center;

    :global {
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

      input {
        border: 1px solid #777;
        border-radius: 8px;
        height: 24px;
        padding: 8px 16px 8px 48px;
        flex: 1 0 auto;

        @include bp(tablet) {
          height: 16px;
        }

        &.error {
          border-color: $error-red;
          background-color: rgba($error-red, 0.05);
        }
      }
    }
  }


</style>
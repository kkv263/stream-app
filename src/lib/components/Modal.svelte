<script lang="ts"></script>

<aside class="modal" tabindex="-1" role="dialog" aria-labelledby="modal-label" aria-modal="true">
  <div class="modal__backdrop" data-dismiss="modal"></div>
  <section class="modal__inner">
    <button type="button" class="modal__close-icon" title="Close" data-dismiss="modal"></button>
    <div class="modal__content"><slot></slot></div>
  </section>
</aside>

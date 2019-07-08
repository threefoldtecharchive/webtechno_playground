<style>
  .post {
    width: 300px;
    border: 1px solid #aaa;
    border-radius: 2px;
    box-shadow: 2px 2px 8px rgba(0, 0, 0, 0.1);
    padding: 1em;
    margin: 0 0 1em 0;
  }
</style>

<div class="post">
  <slot name="title">
    <span>Placeholder title</span>
  </slot>
  <br>
  <slot name="body">
    <span>Placeholder body</span>
  </slot>
  <br>
  <slot name="undefined">
    <span>Testing placeholder values</span>
  </slot>
</div>

<script>
  import { format } from "date-fns";
  export let data;
</script>

<style>
  .container {
    padding: 12px;
    margin: 12px;
    display: flex;
    flex-direction: column;
  }
</style>

{#if data.length}
  <div class="container">
    <div>{data.mobileID}</div>
    <div>
      <span>{data.percent}% {data.index + 1} de {data.total}</span>
    </div>
    <div class="progress">
      <div class="determinate" style="width:{data.percent}%" />
    </div>
    <div>
      <span>{data.currentMessage}</span>
      <br />
      <span>{data.sendTime}</span>
    </div>
  </div>
{/if}

<script>
  import { format } from "date-fns";
  export let data;
</script>

<style>
  .input {
    clip-path: polygon(0 0, 100% 0, 100% 100%, 1% 100%, 1% 10%);
    border-radius: 0 10px 10px 15px;
    background-color: #718093ee;
    min-width: 300px;
    max-width: 85%;
    overflow-x: hidden;
    display: grid;
    grid-template-columns: 1fr 1fr;
    grid-template-rows: 20px 50px;
    margin: 10px;
    padding: 10px 20px 10px 20px;
    color: white;
  }
  .output-container {
    width: 100%;
    display: flex;
    justify-content: flex-end;
  }
  .input-container {
    width: 100%;
    display: flex;
    justify-content: flex-start;
  }
  .output {
    clip-path: polygon(100% 0, 99% 10%, 99% 100%, 0 100%, 0 0);
    border-radius: 10px 0 15px 10px;
    background-color: #8c7ae6ee;
    min-width: 300px;
    max-width: 85%;
    overflow-x: hidden;
    display: grid;
    grid-template-columns: 1fr 1fr;
    grid-template-rows: 20px 50px;
    margin: 10px;
    padding: 10px;

    color: white;
  }
  .id {
    grid-column: 1/2;
    grid-row: 1/2;
  }
  .createdAt {
    grid-column: 2/3;
    grid-row: 1/2;
  }
  .message {
    grid-column: 1/3;
    grid-row: 2/3;
    overflow-x: auto;
    margin-top: 10px;
    padding-bottom: 15px;
  }
</style>

{#if data.type === 'in'}
  <div class="input-container">
    <div class="input">
      <div class="id">{data.id}</div>
      <div class="message">{data.message}</div>
      <div class="createdAt">{format(data.createdAt, 'HH:mm:ss dd/MM/yyyy')}</div>
    </div>
  </div>
{:else if data.type === 'out'}
  <div class="output-container">
    <div class="output">
      <div class="id">{data.id}</div>
      <div class="message">{data.message}</div>
      <div class="createdAt">{format(data.createdAt, 'HH:mm:ss dd/MM/yyyy')}</div>
    </div>
  </div>
{/if}

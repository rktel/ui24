<script>
  import { format } from "date-fns";
  import { onMount } from "svelte";
  export let data;
  onMount(() => {
    const elems = document.querySelectorAll(".collapsible");
    const instances = M.Collapsible.init(elems);
  });
</script>

<ul class="collapsible">

  <li>
    <div class="collapsible-header">
      <ul class="collection" style="width:100%">
        <li class="collection-item avatar">
          <i class="material-icons circle orange">collections_bookmark</i>
          <span class="title">{data.mobileID}</span>
          <p style="overflow-x:auto;">
            <span class="progress">
              <span class="determinate" style="width: {data.percent}%" />
            </span>
            <br />
            {data.percent}% [ {data.meter} de {data.script.length} lineas ]
            <br />
            Inicio: {format(data.createdAt, 'HH:mm:ss dd/MM/yyyy')}
            <br>
            Fin: {data.endedAt && format(data.endedAt, 'HH:mm:ss dd/MM/yyyy')} 
          </p>
        </li>
      </ul>
    </div>
    <div class="collapsible-body" style="background-color: white">
      {#each data.script as element}
        <p style="overflow-x:auto;">{element.index}_message.- {element.message}</p>
        <p style="overflow-x:auto;">{element.index}_response.- {element.response}</p>
        <br />
      {/each}
    </div>
  </li>

</ul>



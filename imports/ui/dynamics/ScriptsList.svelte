<script>
  import { Meteor } from "meteor/meteor";
  import { useTracker } from "meteor/rdb:svelte-meteor-data";

  import { longpress, longtouch } from "../../extras/actions";
  import { format } from "date-fns";
  import { fade, fly } from "svelte/transition";
  import { appHeight } from "../../stores/appStore";
  import { onMount } from "svelte";
  export let currentUser;
  export let scripts;
  let files;
  let script;
  $: {
    if (files && files[0]) {
      let fr = new FileReader();
      fr.onload = function () {
        script = fr.result;
      };

      fr.readAsText(files[0]);
    }
  }
  export const openDialogNewScript = () => methods.openDialogNewScript();

  const data = {};
  const methods = {
    saveScriptFile: () => {
      if (files && files[0]) {
        Meteor.call(
          "scripts.create",
          files[0].name,
          script,
          currentUser.username
        );
        methods.closeDialogNewScript();
      }
    },
    openDialogNewScript: () => {
      document.querySelector("#dialogScriptNew").showModal();
    },
    closeDialogNewScript: () => {
      files = null;
      document.querySelector("#dialogScriptNew").close();
    },
    openDialogScript: (_group) => {
      data["groupSelected"] = _group;
      document.querySelector("#dialogScript").showModal();
    },
    closeDialogScript: () => {
      data["groupSelected"] = null;
      // data["inputMessage"] = "";
      document.querySelector("#dialogScript").close();
      // data['messagesSize'] = 0;
    },
    onRemoveScript: (_nameScript) => {
      Meteor.call("scripts.remove", _nameScript);
    },
  };
  onMount(() => {
    const elems = document.querySelectorAll(".collapsible");
    const instances = M.Collapsible.init(elems);
  });
</script>

<style>
  #dialogScriptNew {
    width: 100%;
    border: none;
    margin: 0;
    padding: 0;
    z-index: 2000;
  }
  .dialogScriptNewContainer {
    display: grid;
    width: 100%;
    height: 100%;
    grid-template-columns: 1fr;
    grid-template-rows: 60px 1fr;
  }
  .dialogScriptNewHeader {
    display: flex;
    justify-content: flex-end;
    padding: 12px;
  }
  .dialogScriptNewBody {
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    padding: 12px;
  }
  .overflowX{
    width:98%;
    overflow-x: auto;
  }
</style>

<!--  DIALOG SCRIPTS-->

<!-- <dialog class="dialog" id="dialogScript" style="height:{$appHeight}px">
  <div class="dialogMain">
    <div class="dialog-header">
      <ul class="collection" style="margin:0">
        {#if data['groupSelected']}
          <li class="collection-item avatar">
            <i class="material-icons circle green">insert_chart</i>
            <span class="title">{data['groupSelected'].nameGroup}</span>
            <p style="max-width:80%; overflow-x:auto;">
              {data['groupSelected'].mobileIDArray}
            </p>
            <a
              href="#!"
              class="secondary-content grey-text"
              on:click={methods.closeDialogScript}>
              <i class="material-icons" style="font-size:36px">highlight_off</i>
            </a>
          </li>
        {/if}
      </ul>
    </div>
    <div id="progress" class="dialog-container">

      {#if $tasks_group.length && data['groupSelected']}
        {#each $tasks_group.find((element) => element['nameGroup'] === data['groupSelected'].nameGroup).tasks as item}
          <Progress data={item} />
        {/each}
      {/if}

    </div>
  </div>
</dialog> -->
<!-- ############################ SCRIPTS LIST ########################## -->
<ul class="collapsible">
  {#each scripts as item}
    <li>
      <div class="collapsible-header">
        <ul class="collection" style="width:100%">
          <li
            class="collection-item avatar"
            use:longpress={5000}
            on:longpress={methods.onRemoveScript(item.nameScript)}>
            <i class="material-icons circle orange">collections_bookmark</i>
            <span class="title">{item.nameScript}</span>
            <p style="overflow-x:auto;">
              {item.script.length} lineas
              <br />
              author: {item.author}
              <br />
              {format(item.createdAt, 'dd/MM/yyyy')}
            </p>
          </li>
        </ul>
      </div>
      <div class="collapsible-body" >
        {#each item.script as element}
          <p style="overflow-x:auto;">{element.index}.- {element.message}</p>
          <br />
        {/each}
      </div>
    </li>
  {:else}
    <span>Nothing</span>
  {/each}

</ul>
<!--######################### DIALOG NEW SCRIPT ##############################-->

<dialog id="dialogScriptNew" style="height:{$appHeight}px">
  <div class="dialogScriptNewContainer">
    <div class="dialogScriptNewHeader">
      <i
        class="material-icons"
        style="font-size:36px"
        on:click={methods.closeDialogNewScript}>
        highlight_off
      </i>
    </div>
    <div class="dialogScriptNewBody">
      <div>
        <form action="#" style="width:300px">
          <div class="file-field input-field">
            <div class="btn">
              <span>Script</span>
              <input type="file" bind:files />
            </div>
            <div class="file-path-wrapper">
              <input
                class="file-path validate"
                type="text"
                title={files ? files[0].name : ''} />
            </div>
          </div>
        </form>
        <a
          class="waves-effect waves-light btn"
          style="width:100%"
          on:click={methods.saveScriptFile}>
          save
        </a>

      </div>
    </div>

  </div>
</dialog>

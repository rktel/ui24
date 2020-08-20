<script>
  import { Meteor } from "meteor/meteor";
  import { useTracker } from "meteor/rdb:svelte-meteor-data";
  import { TasksGroup } from "../../api/tasks_group/collection";
  import { Tasks } from "../../api/tasks/collection";
  import { longpress, longtouch } from "../../extras/actions";
  import { format } from "date-fns";
  import { fade, fly } from "svelte/transition";
  import { appHeight } from "../../stores/appStore";

  import Progress from "./Progress.svelte";
  export let currentUser;
  export let devices;
  export let scripts;
  export const openDialogDevices = () => methods.openDialogDevices();

  let scriptSelected = "";
  let tasksSubscribe;
  $: tasks_group = useTracker(() =>
    TasksGroup.find({}, { sort: { createdAt: -1 } }).fetch()
  );
  $: tasks = useTracker(() =>
    Tasks.find({}, { sort: { createdAt: -1 } }).fetch()
  );
  $: {
    if (devices.length) {
      data["devicesFiltered"] = devices.filter(
        (item) => item.mobileID.indexOf(data["inputSearchTasks"]) !== -1
      );
    }

    console.log($tasks);
  }
  const data = {
    inputSearchTasks: "",
    devicesFiltered: [],
    devicesSelected: [],
    inputGroupTasks: "",
    groupSelected: null,
  };
  const methods = {
    openDialogDevices: () => {
      document.querySelector("#dialogDevicesTasks").showModal();
    },
    closeDialogDevices: () => {
      document.querySelector("#dialogDevicesTasks").close();
      data["inputGroupTasks"] = "";
      data["inputSearchTasks"] = "";
      data["devicesFiltered"] = [];
      data["devicesSelected"] = [];
      scriptSelected = "";
    },
    openDialogProgress: (_taskGroup) => {
      data["groupSelected"] = _taskGroup;
      tasksSubscribe = Meteor.subscribe('tasks',currentUser.username, _taskGroup.nameGroup);
      document.querySelector("#dialogProgress").showModal();
    },
    closeDialogProgress: () => {
      data["groupSelected"] = null;
      // data["inputMessage"] = "";
      document.querySelector("#dialogProgress").close();
      tasksSubscribe.stop();
      // data['messagesSize'] = 0;
    },
    onSendGroup: () => {
      if (
        data["inputGroupTasks"].trim() &&
        data["devicesSelected"].length &&
        scriptSelected
      ) {
        Meteor.call(
          "tasks_group.insert",
          currentUser.username,
          data["inputGroupTasks"].trim(),
          data["devicesSelected"],
          scriptSelected,
          (error, ok) => {
            if (!error && !ok) {
              M.toast({
                html: `Grupo ${data["inputGroupTasks"].trim()} ya existe!`,
              });
            } else {
              methods.closeDialogDevices();
            }
          }
        );
      }
    },
    onRemoveGroup: (_nameGroup) => {
      console.log("onRemoveGroup:", _nameGroup);
      Meteor.call("tasks_group.remove", _nameGroup);
    },
    addDevice: (device) => {
      if (!data["devicesSelected"].includes(device)) {
        data["devicesSelected"] = [device, ...data["devicesSelected"]];
      } else {
        data["devicesSelected"].splice(
          data["devicesSelected"].indexOf(device),
          1
        );
        data["devicesSelected"] = data["devicesSelected"];
      }
    },
  };


</script>

<style>
  .selected {
    background-color: rgb(189, 247, 224, 85);
  }
  #inputScript,
  #inputGroupTasks,
  #inputSearchTasks {
    border-radius: 25px;
    color: black;
    padding-left: 15px;
    box-shadow: none;
    box-sizing: border-box;
    border: 1px solid gray;
    margin: 0 15px 0 0;
  }
  #inputScript::placeholder,
  #inputGroupTasks::placeholder,
  #inputSearchTasks::placeholder {
    color: gray;
  }
  #inputScript:focus,
  #inputGroupTasks:focus,
  #inputSearchTasks:focus {
    border: 1px solid black;
    box-shadow: none;
  }
  .collection .collection-item.avatar {
    min-height: 66px;
  }
  #progress {
    overflow-y: auto;
    background-color: #f4f4f4;
    background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='80' height='80' viewBox='0 0 80 80'%3E%3Cg fill='%23cccccc' fill-opacity='0.4'%3E%3Cpath fill-rule='evenodd' d='M11 0l5 20H6l5-20zm42 31a3 3 0 1 0 0-6 3 3 0 0 0 0 6zM0 72h40v4H0v-4zm0-8h31v4H0v-4zm20-16h20v4H20v-4zM0 56h40v4H0v-4zm63-25a3 3 0 1 0 0-6 3 3 0 0 0 0 6zm10 0a3 3 0 1 0 0-6 3 3 0 0 0 0 6zM53 41a3 3 0 1 0 0-6 3 3 0 0 0 0 6zm10 0a3 3 0 1 0 0-6 3 3 0 0 0 0 6zm10 0a3 3 0 1 0 0-6 3 3 0 0 0 0 6zm-30 0a3 3 0 1 0 0-6 3 3 0 0 0 0 6zm-28-8a5 5 0 0 0-10 0h10zm10 0a5 5 0 0 1-10 0h10zM56 5a5 5 0 0 0-10 0h10zm10 0a5 5 0 0 1-10 0h10zm-3 46a3 3 0 1 0 0-6 3 3 0 0 0 0 6zm10 0a3 3 0 1 0 0-6 3 3 0 0 0 0 6zM21 0l5 20H16l5-20zm43 64v-4h-4v4h-4v4h4v4h4v-4h4v-4h-4zM36 13h4v4h-4v-4zm4 4h4v4h-4v-4zm-4 4h4v4h-4v-4zm8-8h4v4h-4v-4z'/%3E%3C/g%3E%3C/svg%3E");
  }
  .dialog {
    width: 100%;
    border: none;
    margin: 0;
    padding: 0;
    z-index: 2000;
  }
  .dialogMain {
    height: 100%;
    width: 100%;
    display: grid;
    grid-template-columns: 100%;
    grid-template-rows: min-content 1fr;
  }
  .dialog-bottom {
    margin: 0;
    display: flex;
    align-items: center;
    padding: 10px 15px;
  }
  .dialogMain-alt {
    height: 100%;
    width: 100%;
    display: grid;
    grid-template-columns: 100%;
    grid-template-rows: min-content 1fr 124px;
  }
  .dialog-bottom-alt {
    margin: 0;
    display: flex;
    flex-direction: column;
    padding: 10px 15px;
    justify-content: space-evenly;
  }
  .dialog-bottom-alt-input {
    display: flex;
  }
</style>

<!-- PROGRESS DIALOG -->

<dialog class="dialog" id="dialogProgress" style="height:{$appHeight}px">
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
              on:click={methods.closeDialogProgress}>
              <i class="material-icons" style="font-size:36px">highlight_off</i>
            </a>
          </li>
        {/if}
      </ul>
    </div>
    <div id="progress" class="dialog-container">
      {#each $tasks as task}
        <Progress data={task}/>
        {:else}
        <h4>Nothing</h4>
      {/each}

      <!-- {#if $tasks_group.length && data['groupSelected']}
        {#each $tasks_group.find((element) => element['nameGroup'] === data['groupSelected'].nameGroup).tasks as item}
          <Progress data={item} />
        {/each}
      {/if} -->

    </div>
  </div>
</dialog>
<!-- ############################ TASKS GROUP ########################## -->
<ul class="collection" >
  {#await Meteor.subscribe('tasks_group', currentUser.username)}
    <div class="progress">
      <div class="indeterminate" />
    </div>
  {:then Ok}
    {#each $tasks_group as msg_group}
      <li
        class="collection-item avatar"
        on:dblclick={methods.openDialogProgress(msg_group)}
        use:longpress={5000}
        on:longpress={methods.onRemoveGroup(msg_group.nameGroup)}
        use:longtouch={5000}
        on:longtouch={methods.onRemoveGroup(msg_group.nameGroup)}>
        <i class="material-icons circle orange">archive</i>
        <span class="title">{msg_group.nameGroup}</span>
        <p style="max-width:80%; overflow-x:hidden;">
          {msg_group.nameScript}
          <br />
          {msg_group.mobileIDArray}
        </p>
        <span class="secondary-content">
          {format(msg_group.createdAt, 'dd/MM')}
        </span>
      </li>
    {/each}
  {/await}
</ul>
<!--######################### DEVICES ##############################-->

<dialog
  class="dialog"
  id="dialogDevicesTasks"
  style="height:{$appHeight}px"
  transition:fade>
  {#if devices.length}
    <div class="dialogMain-alt">
      <div class="dialog-header">
        <ul class="collection" style="margin:0">
          <li class="collection-item avatar">
            <span class="title">Devices</span>
            <p>
              {data['devicesSelected'].length} seleccionados de {devices.length}
            </p>
            <a
              href="#!"
              class="secondary-content grey-text"
              on:click={methods.closeDialogDevices}>
              <i class="material-icons" style="font-size:36px">highlight_off</i>
            </a>
          </li>
          <li
            class="collection-item"
            style="padding-left:50px;padding-right:50px;">
            <input
              id="inputSearchTasks"
              type="text"
              placeholder="Buscar dispositivo..."
              bind:value={data['inputSearchTasks']} />
          </li>
        </ul>

      </div>
      <div class="dialog-container" style="overflow-y:auto;">
        <ul class="collection" style="margin:0">
          {#each data['devicesFiltered'] as device}
            <li
              class="collection-item"
              class:selected={data['devicesSelected'].includes(device.mobileID)}
              on:click={methods.addDevice(device.mobileID)}>
              <div style="max-width:95%; overflow-x:auto;">
                {device.mobileID}
                <span class="secondary-content">
                  {device.updatedAt && format(device.updatedAt, 'HH:mm:ss dd/MM/yyyy')}
                </span>
              </div>
            </li>
          {/each}
        </ul>
      </div>
      <div class="dialog-bottom-alt">
        <div>
          <select class="browser-default" bind:value={scriptSelected}>
            <option value="" disabled selected>Selecciona script...</option>
            {#each scripts as script}
              <option value={script.nameScript}>{script.nameScript}</option>
            {/each}
          </select>
        </div>
        <div class="dialog-bottom-alt-input">
          <input
            id="inputGroupTasks"
            type="text"
            placeholder="Group..."
            bind:value={data['inputGroupTasks']} />
          <a
            href="#!"
            style="color:{data['inputGroupTasks'].trim() && data['devicesSelected'].length && scriptSelected ? '#039be5' : 'gray'}"
            on:click={methods.onSendGroup}>
            <i class="material-icons" style="font-size:30px;">done</i>
          </a>
        </div>

      </div>
    </div>
  {:else}
    <div class="progress blue">
      <div class="indeterminate" />
    </div>
  {/if}
</dialog>

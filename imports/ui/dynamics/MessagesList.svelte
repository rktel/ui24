<script>
  import { Meteor } from "meteor/meteor";
  import { useTracker } from "meteor/rdb:svelte-meteor-data";
  import { MessagesGroup } from "../../api/messages_group/collection";

  import { appHeight } from "../../stores/appStore";

  import { serverToast } from "../../streamers/serverToast";
  import { streamClient } from "../../streamers/client";
  import { longpress, longtouch } from "../../extras/actions";

  import { format } from "date-fns";
  import { fade, fly } from "svelte/transition";
  import Bubble from "./Bubble.svelte";

  export let currentUser;
  export let devices;
  export const openDialogDevices = () => methods.openDialogDevices();


  $: messages_group = useTracker(() =>
    MessagesGroup.find({}, { sort: { createdAt: -1 } }).fetch()
  );

  $: {
    if (devices.length) {
      data["devicesFiltered"] = devices.filter(
        item => item.mobileID.indexOf(data["inputSearch"]) !== -1
      );
    }
    if (data["groupSelected"]) {
      if (data['messagesSize'] != $messages_group.find(element => element["nameGroup"] === data["groupSelected"].nameGroup).messages.length) {
         
        setTimeout(() => {
          const messageBody = document.querySelector("#chat");
          messageBody.scrollTop =  messageBody.scrollHeight - messageBody.clientHeight
          }, 50);
        data['messagesSize'] = $messages_group.find(element => element["nameGroup"] === data["groupSelected"].nameGroup).messages.length;
      }
    }
  }

  const init = () => {
    serverToast.on("toast", () => {
      M.toast({ html: 'msgFromServer' });
    });
  
  };
  const data = {
    messagesSize : 0,
    inputMessage: "",
    inputGroup: "",
    groupSelected: null,
    inputSearch: "",
    devicesFiltered: [],
    devicesSelected: [],
  }
  const methods={
      openDialogDevices: () => {
      document.querySelector("#dialogDevices").showModal();
    },
    closeDialogDevices: () => {
      
      document.querySelector("#dialogDevices").close();
      data["inputGroup"] = "";
      data["inputSearch"] = "";
      data["devicesFiltered"] = [];
      data["devicesSelected"] = [];
    },
    openDialogChat: group => {
      data["groupSelected"] = group;
      document.querySelector("#dialogChat").showModal();
    },
    closeDialogChat: () => {
      data["groupSelected"] = null;
      data["inputMessage"] = "";
      document.querySelector("#dialogChat").close();
      data['messagesSize'] = 0;
    },
    onSendMessage: () => {
      if (data["inputMessage"].trim()) {
          data["groupSelected"].mobileIDArray.map(mobileID => {
          streamClient.emit("writeMessage",currentUser.username,data["groupSelected"].nameGroup,data["inputMessage"].trim(), mobileID );
        });
      }
    },
    
    onSendGroup: () => {
      if (data["inputGroup"].trim() && data["devicesSelected"].length) {
        Meteor.call("messages_group.insert", currentUser.username,data["inputGroup"].trim(), data["devicesSelected"],
          (error, ok) => {
            if (!error && !ok) {
              M.toast({
                html: `Grupo ${data["inputGroup"].trim()} ya existe!`
              });
            } else {
              methods.closeDialogDevices();
            }
          }
        );
      }
    },
    onRemoveGroup: nameGroup => {
      Meteor.call("messages_group.remove", nameGroup);
    },

    addDevice: device => {
      if (!data["devicesSelected"].includes(device)) {
        data["devicesSelected"] = [device, ...data["devicesSelected"]];
      } else {
        data["devicesSelected"].splice(data["devicesSelected"].indexOf(device), 1);
        data["devicesSelected"] = data["devicesSelected"];
      }
    }
  }


</script>

<style>
  .selected {
    background-color: rgb(189, 247, 224,85);
  }
  #inputMessage,
  #inputGroup,
  #inputSearch {
    border-radius: 25px;
    color: black;
    padding-left: 15px;
    box-shadow: none;
    box-sizing: border-box;
    border: 1px solid gray;
    margin: 0 15px 0 0;
  }
  #inputMessage::placeholder,
  #inputGroup::placeholder,
  #inputSearch::placeholder {
    color: gray;
  }
  #inputMessage:focus,
  #inputGroup:focus,
  #inputSearch:focus {
    border: 1px solid black;
    box-shadow: none;
  }
  .collection .collection-item.avatar {
    min-height: 66px;
  }
  #chat {
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
    grid-template-rows: min-content  1fr  62px;
  }
  .dialog-bottom {
    margin: 0;
    display: flex;
    align-items: center;
    padding: 10px 15px;
  }
</style>

<!--########################## CHAT ################################-->

  <dialog
    class="dialog"
    id="dialogChat"
    style="height:{$appHeight}px"
    in:fly="{{ y: 200, duration: 500 }}" out:fade>
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
                on:click={methods.closeDialogChat}>
                <i class="material-icons" style="font-size:36px">
                  highlight_off
                </i>
              </a>
            </li>
          {/if}
        </ul>
      </div>
      <div id="chat" class="dialog-container">

        {#if $messages_group.length && data['groupSelected']}
          {#each $messages_group.find(element => element['nameGroup'] === data['groupSelected'].nameGroup).messages as item}
            <Bubble data={item} />
          {/each}
        {/if}
        
      </div>
      <div class="dialog-bottom">
        <input
          id="inputMessage"
          type="text"
          placeholder="Message..."
          bind:value={data['inputMessage']}
           />
        <a
          href="#!"
          style="color:{data['inputMessage'].trim() ? '#039be5' : 'gray'}"
          on:click={methods.onSendMessage}>
          <i class="material-icons" style="font-size:30px;">send</i>
        </a>
      </div>
    </div>
  </dialog>

<!--######################### DEVICES ##############################-->

  <dialog
    class="dialog"
    id="dialogDevices"
    style="height:{$appHeight}px"
    in:fly="{{ y: 200, duration: 500 }}" out:fade>
    {#if devices.length}
   <div class="dialogMain">
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
                <i class="material-icons" style="font-size:36px">
                  highlight_off
                </i>
              </a>
            </li>
            <li
              class="collection-item"
              style="padding-left:50px;padding-right:50px;">
              <input
                id="inputSearch"
                type="text"
                placeholder="Buscar..."
                bind:value={data['inputSearch']} />
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
        <div class="dialog-bottom">
          <input
            id="inputGroup"
            type="text"
            placeholder="Group..."
            bind:value={data['inputGroup']} />
          <a
            href="#!"
            style="color:{data['inputGroup'].trim() && data['devicesSelected'].length ? '#039be5' : 'gray'}"
            on:click={methods.onSendGroup}>
            <i class="material-icons" style="font-size:30px;">done</i>
          </a>
        </div>
      </div>
    {:else}
      <div class="progress blue">
        <div class="indeterminate" />
      </div>
    {/if}
  </dialog>


<!-- ############################ MESSAGES GROUP ########################## -->
<ul class="collection" use:init>
  {#await Meteor.subscribe('messages_group', currentUser.username)}
    <div class="progress">
      <div class="indeterminate" />
    </div>
  {:then Ok}
    {#each $messages_group as msg_group}
      <li
        class="collection-item avatar"
        on:dblclick={methods.openDialogChat(msg_group)}
        use:longpress={5000}
        on:longpress={methods.onRemoveGroup(msg_group.nameGroup)}
        use:longtouch={5000}
        on:longtouch={methods.onRemoveGroup(msg_group.nameGroup)}>
        <i class="material-icons circle green">insert_chart</i>
        <span class="title">{msg_group.nameGroup}</span>
        <p style="max-width:80%; overflow-x:hidden;">
          {msg_group.mobileIDArray}
        </p>
        <span class="secondary-content">
          {format(msg_group.createdAt, 'dd/MM')}
        </span>
      </li>
    {/each}
  {/await}

</ul>



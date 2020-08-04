<script>
  import { Meteor } from "meteor/meteor";
  import { useTracker } from "meteor/rdb:svelte-meteor-data";
  import { Devices } from "../../api/devices/collection";
  import { MessagesGroup } from "../../api/messages_group/collection";

  import { serverToast } from "../../streamers/serverToast";
  import { streamClient } from "../../streamers/client";
  import { longpress, longtouch } from "../../extras/actions";

  import { format } from "date-fns";
  import { onDestroy } from "svelte";
  import Bubble from "./Bubble.svelte";

  export let currentUser;
  export const openModalDevices = () => core.openModalDevices();

  $: devices = useTracker(() =>
    Devices.find({}, { sort: { createdAt: -1 } }).fetch()
  );
  $: messages_group = useTracker(() =>
    MessagesGroup.find({}, { sort: { createdAt: -1 } }).fetch()
  );
  // $: single_messages_group = useTracker(() => {
  //   setTimeout(() => {
  //     document.querySelector(".chat").scrollBy(0, 10000);
  //   }, 100);
  //   return MessagesGroup.find({}).fetch();
  // });
  $: {
    if ($devices.length) {
      core["devicesFiltered"] = $devices.filter(
        item => item.mobileID.indexOf(core["inputSearch"]) !== -1
      );
    }
    if ($messages_group.length && core["groupSelected"]) {
      setTimeout(() => {
        document.querySelector(".chat").scrollBy(0, 10000);
      }, 50);
      // console.log($messages_group.find(element => element['nameGroup']===core['groupSelected'].nameGroup).messages);
    }
    // console.log('coreGroupSelected:',core['groupSelected'])
  }

  const init = () => {
    serverToast.on("toast", msgFromServer => {
      M.toast({ html: msgFromServer });
    });
    core.setModalInstance();
    setTimeout(() => {
      core["showList"] = true;
    }, 1000);
  };
  const core = {
    groupSelected: null,

    showListModal: false,
    showList: false,
    modalInstance: null,
    modalDevicesInstance: null,

    openModalDevices: () => {
      core.modalDevicesInstance.open();
    },
    closeModalDevices: () => {
      core.modalDevicesInstance.close();
      core["inputGroup"] = "";
      core["inputSearch"] = "";
      core["devicesFiltered"] = [];
      core["devicesSelected"] = [];
    },
    destroyModalDevices: () => {
      core.modalDevicesInstance.destroy();
    },
    setModalInstance: () => {
      const HTMLElements = document.querySelectorAll(".modal");
      M.Modal.init(HTMLElements, {
        dismissible: false,
        endingTop: "0%",
        inDuration: 150,
        outDuration: 150,
        onCloseEnd: () => {}
      });
      core.modalInstance = M.Modal.getInstance(
        document.querySelector("#modalChat")
      );
      core.modalDevicesInstance = M.Modal.getInstance(
        document.querySelector("#modalDevices")
      );
    },
    openModal: group => {
      // CHAT MODAL
      core.modalInstance.open();
      core["groupSelected"] = group;
      //  Meteor.subscribe(
      //   "single_messages_group",
      //   currentUser.username,
      //   core["groupSelected"].nameGroup
      // );
      // setTimeout(() => {
      //   document.querySelector(".chat").scrollBy(0, 10000);
      // }, 50);
      //Meteor.subscribe('single_messages_group', currentUser.username, core['groupSelected']);
      // setTimeout(() => {
      //   core["showListModal"] = true;
      // }, 1000);
      // setTimeout(() => {
      //   document.querySelector("#inputMessage").focus();
      // }, 150);
    },
    closeModal: () => {
      // CHAT MODAL
      core.modalInstance.close();
      core["groupSelected"] = null;
      core["inputMessage"] = "";

      //core["showListModal"] = false;
    },
    destroyModal: () => {
      core.modalInstance.destroy();
    },
    inputMessage: "",
    onKeyupInputMessage: event => {
      event.keyCode === 13 && core.onSendMessage();
    },
    onSendMessage: () => {
      if (core["inputMessage"].trim()) {
        core["groupSelected"].mobileIDArray.map(mobileID => {
          streamClient.emit(
            "writeMessage",
            currentUser.username,
            core["groupSelected"].nameGroup,
            core["inputMessage"].trim(),
            mobileID
          );
        });
      }
    },
    inputGroup: "",
    onSendGroup: () => {
      if (core["inputGroup"].trim() && core["devicesSelected"].length) {
        Meteor.call(
          "messages_group.insert",
          currentUser.username,
          core["inputGroup"].trim(),
          core["devicesSelected"],
          (error, ok) => {
            if (!error && !ok) {
              M.toast({
                html: `Grupo ${core["inputGroup"].trim()} ya existe!`
              });
            } else {
              core.closeModalDevices();
            }
          }
        );
      }
    },
    onRemoveGroup: nameGroup => {
      Meteor.call("messages_group.remove", nameGroup);
    },
    inputSearch: "",
    devicesFiltered: [],
    devicesSelected: [],
    addDevice: device => {
      if (!core["devicesSelected"].includes(device)) {
        core["devicesSelected"] = [device, ...core["devicesSelected"]];
      } else {
        // console.log(core["devicesSelected"].indexOf(device));
        core["devicesSelected"].splice(
          core["devicesSelected"].indexOf(device),
          1
        );
        core["devicesSelected"] = core["devicesSelected"];
      }
    }
  };
  onDestroy(() => {
    core.destroyModal();
    core.destroyModalDevices();
  });
</script>

<style>
  .selected {
    background-color: lightgreen;
  }
  .modal-footer {
    margin: 0;
    display: flex;
    align-items: center;
    padding-left: 15px;
    padding-right: 15px;
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
  .modal {
    width: 100%;
    max-height: 100%;
  }
  .chat {
    overflow-y: auto;
    background-color: #f4f4f4;
    background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='80' height='80' viewBox='0 0 80 80'%3E%3Cg fill='%23cccccc' fill-opacity='0.4'%3E%3Cpath fill-rule='evenodd' d='M11 0l5 20H6l5-20zm42 31a3 3 0 1 0 0-6 3 3 0 0 0 0 6zM0 72h40v4H0v-4zm0-8h31v4H0v-4zm20-16h20v4H20v-4zM0 56h40v4H0v-4zm63-25a3 3 0 1 0 0-6 3 3 0 0 0 0 6zm10 0a3 3 0 1 0 0-6 3 3 0 0 0 0 6zM53 41a3 3 0 1 0 0-6 3 3 0 0 0 0 6zm10 0a3 3 0 1 0 0-6 3 3 0 0 0 0 6zm10 0a3 3 0 1 0 0-6 3 3 0 0 0 0 6zm-30 0a3 3 0 1 0 0-6 3 3 0 0 0 0 6zm-28-8a5 5 0 0 0-10 0h10zm10 0a5 5 0 0 1-10 0h10zM56 5a5 5 0 0 0-10 0h10zm10 0a5 5 0 0 1-10 0h10zm-3 46a3 3 0 1 0 0-6 3 3 0 0 0 0 6zm10 0a3 3 0 1 0 0-6 3 3 0 0 0 0 6zM21 0l5 20H16l5-20zm43 64v-4h-4v4h-4v4h4v4h4v-4h4v-4h-4zM36 13h4v4h-4v-4zm4 4h4v4h-4v-4zm-4 4h4v4h-4v-4zm8-8h4v4h-4v-4z'/%3E%3C/g%3E%3C/svg%3E");
  }
</style>

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
        on:dblclick={core.openModal(msg_group)}
        use:longpress={5000}
        on:longpress={core.onRemoveGroup(msg_group.nameGroup)}
        use:longtouch={5000}
        on:longtouch={core.onRemoveGroup(msg_group.nameGroup)}>
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
<!-- ######################### CHAT ################################# -->
<div
  id="modalChat"
  class="modal modal-fixed-footer"
  style="height:{Meteor.innerHeight}px">
  <ul class="collection" style="margin:0">
    {#if core['groupSelected']}
      <li class="collection-item avatar">
        <i class="material-icons circle green">insert_chart</i>
        <span class="title">{core['groupSelected'].nameGroup}</span>
        <p style="max-width:80%; overflow-x:auto;">
          {core['groupSelected'].mobileIDArray}
        </p>
        <a
          href="#!"
          class="secondary-content grey-text"
          on:click={core.closeModal}>
          <i class="material-icons" style="font-size:36px">highlight_off</i>
        </a>
      </li>
    {/if}
  </ul>
  <div class="chat" style="height:{Meteor.innerHeight - 68 - 56}px">
    {#if $messages_group.length && core['groupSelected']}
      {#each $messages_group.find(element => element['nameGroup'] === core['groupSelected'].nameGroup).messages as item}
        <Bubble data={item} />
      {/each}
    {/if}
  </div>
  <div class="modal-footer">
    <input
      id="inputMessage"
      type="text"
      placeholder="Message..."
      bind:value={core['inputMessage']}
      on:keyup={core.onKeyupInputMessage} />
    <a
      href="#!"
      style="color:{core['inputMessage'].trim() ? '#039be5' : 'gray'}"
      on:click={core.onSendMessage}>
      <i class="material-icons" style="font-size:30px;">send</i>
    </a>
  </div>
</div>
<!-- ##################### DEVICES ############################### -->
<div
  id="modalDevices"
  class="modal modal-fixed-footer"
  style="height:{Meteor.innerHeight}px">

  {#await Meteor.subscribe('devices')}
    <div class="progress blue">
      <div class="indeterminate" />
    </div>
  {:then OK}
    <ul class="collection" style="margin:0">
      <li class="collection-item avatar">
        <span class="title">Devices</span>
        <p>
          {core['devicesSelected'].length} seleccionados de {$devices.length}
        </p>
        <a
          href="#!"
          class="secondary-content grey-text"
          on:click={core.closeModalDevices}>
          <i class="material-icons" style="font-size:36px">highlight_off</i>
        </a>
      </li>
      <li class="collection-item" style="padding-left:50px;padding-right:50px;">
        <input
          id="inputSearch"
          type="text"
          placeholder="Buscar..."
          bind:value={core.inputSearch} />
      </li>
      <div
        style="height:{Meteor.innerHeight - 66 - 66 - 56}px; overflow-y:auto;">
        {#each core['devicesFiltered'] as device}
          <li
            class="collection-item"
            class:selected={core['devicesSelected'].includes(device.mobileID)}
            on:click={core.addDevice(device.mobileID)}>
            <div style="max-width:95%; overflow-x:auto;">{device.mobileID}</div>
          </li>
        {/each}
      </div>

    </ul>
  {/await}
  <div class="modal-footer">
    <input
      id="inputGroup"
      type="text"
      placeholder="Group..."
      bind:value={core['inputGroup']} />
    <a
      href="#!"
      style="color:{core['inputGroup'].trim() && core['devicesSelected'].length ? '#039be5' : 'gray'}"
      on:click={core.onSendGroup}>
      <i class="material-icons" style="font-size:30px;">done</i>
    </a>
  </div>
</div>

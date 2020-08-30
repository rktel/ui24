<script>
  import { Meteor } from "meteor/meteor";
  import { useTracker } from "meteor/rdb:svelte-meteor-data";
  import { onDestroy } from "svelte";
  import { Roles } from "meteor/alanning:roles";
  import { navigate } from "svelte-navaid";
  import MessagesList from "../dynamics/MessagesList.svelte";
  import TasksList from "../dynamics/TasksList.svelte";
  import ScriptsList from "../dynamics/ScriptsList.svelte";
  import { Devices } from "../../api/devices/collection.js";
  import { Scripts } from "../../api/scripts/collection.js";
  import UsersList from '../dynamics/UsersList.svelte';

  let targetMessages;
  let targetTasks;
  let targetScripts;
  let targetUsers;

  $: currentUser = useTracker(() => Meteor.user());
  $: userIsAdmin = useTracker(() =>
    Roles.userIsInRole(Meteor.userId(), "admin")
  );
  $: devices = useTracker(() =>
    Devices.find({}, { sort: { createdAt: -1 } }).fetch()
  );
  $: scripts = useTracker(() =>
    Scripts.find({}, { sort: { createdAt: -1 } }).fetch()
  );
  $: users = useTracker(()=>
    Meteor.users.find({}).fetch()
  )

  const homeCore = {
    tabsInstance: undefined,
    dropdownInstances: undefined,
    mainContent: 0,
    onLogout: () => {
      Meteor.logout((error) => {
        if (!error) {
          setTimeout(() => {
            navigate("/login");
          }, 50);
        }
      });
    },
    onActionButton: () => {
      if (homeCore["tabsInstance"].index === 0) {
        homeCore.openDevicesForMessages();
      } else if (homeCore["tabsInstance"].index === 1) {
        homeCore.openDevicesForTasks();
      } else if (homeCore["tabsInstance"].index === 2) {
        homeCore.openNewScript();
      } else if(homeCore["tabsInstance"].index === 3){
        homeCore.openDialogUsers();
      }
    },
    openDevicesForMessages: () => {
      targetMessages.openDialogDevices();
    },
    openDevicesForTasks: () => {
      targetTasks.openDialogDevices();
    },
    closeDevicesForMessages: () => {},
    openNewScript: () => {
      targetScripts.openDialogNewScript();
    },
    openDialogUsers:()=>{
      targetUsers.openDialogUsers();
    }
  };

  const initNav = (event) => {
    Meteor.subscribe("role");
    Meteor.subscribe("devices");
    Meteor.subscribe('scripts');
    Meteor.subscribe('daUsers');
    homeCore["mainContent"] = window.innerHeight - event.offsetHeight;
    setTimeout((_) => {
      homeCore["tabsInstance"] = M.Tabs.init(
        document.querySelector("ul.tabs"),
        {
          swipeable: false,
        }
      );
      homeCore["dropdownInstances"] = M.Dropdown.init(
        document.querySelectorAll(".dropdown-trigger")
      );
    }, 150);
  };

  const onResize = (event) => {
    homeCore["mainContent"] =
      window.innerHeight - document.querySelector("#nav").offsetHeight;
  };
  onDestroy(() => {
    homeCore["tabsInstance"].destroy();
  });
</script>

<style>
  .brand-logo {
    padding-left: 25px;
  }
  #search {
    border-radius: 25px;
    color: white;
    padding-left: 10px;
    box-shadow: none;
    box-sizing: border-box;
    border: 1px solid transparent;
  }
  #search::placeholder {
    color: pink;
  }
  #search:focus {
    border: 1px solid pink;
    box-shadow: none;
  }
</style>

<svelte:window on:resize={onResize} />

{#if $currentUser}
  <ul id="nav-menu" class="dropdown-content">
    <li>
      <a href="#!">{$currentUser.username}</a>
    </li>
    <li class="divider" />
    <li on:click={homeCore.onLogout}>
      <a href="#!">Salir</a>
    </li>
  </ul>

  <nav class="nav-extended" use:initNav id="nav">
    <div class="nav-wrapper">
      <span class="left brand-logo">F</span>
      <ul class="right">
        <li style="margin-right:20px;">
          <!-- <input id="search" type="text" placeholder="Buscar..." /> -->
        </li>
        <li>
          <a href="#!" class="dropdown-trigger" data-target="nav-menu">
            <i class="material-icons medium">more_vert</i>
          </a>
        </li>
      </ul>
    </div>
    <div class="nav-content">
      <ul class="tabs tabs-transparent">
        <li class="tab">
          <a class="active" href="#messages">Messages</a>
        </li>
        <li class="tab">
          <a href="#tasks">Tasks</a>
        </li>
        <li class="tab">
          <a href="#scripts">Scripts</a>
        </li>
 
          <li class="tab">
            <a href="#users">Users</a>
          </li>
      
      </ul>
    </div>
  </nav>

  <div
    id="messages"
    class="col s12"
    style="height:{homeCore['mainContent']}px;overflow-y: auto;
    overflow-x:hidden">
    <MessagesList
      bind:this={targetMessages}
      currentUser={$currentUser}
      devices={$devices} />
  </div>
  <div
    id="tasks"
    class="col s12"
    style="height:{homeCore['mainContent']}px;overflow-y: auto;
    overflow-x:hidden">
    <TasksList
      bind:this={targetTasks}
      currentUser={$currentUser}
      devices={$devices}
      scripts={$scripts} />
  </div>
  <div
    id="scripts"
    class="col s12"
    style="height:{homeCore['mainContent']}px;overflow-y: auto;
    overflow-x:hidden">
    <ScriptsList
      bind:this={targetScripts}
      currentUser={$currentUser}
      scripts={$scripts} />
  </div>

    <div
      id="users"
      class="col s12"
      style="height:{homeCore['mainContent']}px;overflow-y: auto;
      overflow-x:hidden">
      <UsersList users={$users} bind:this={targetUsers}/>
    </div>
  
  <div class="fixed-action-btn" on:click={homeCore.onActionButton}>
    <a href="#!" class="btn-floating btn-large red">
      <i class="large material-icons">add</i>
    </a>
  </div>
{:else}
  <div class="progress">
    <div class="indeterminate" />
  </div>
{/if}

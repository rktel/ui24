<script>
  import { Meteor } from "meteor/meteor";
  import { useTracker } from "meteor/rdb:svelte-meteor-data";
  import { onDestroy } from "svelte";
  import { Roles } from "meteor/alanning:roles";
  import { navigate } from "svelte-navaid";
  import MessagesList from "../dynamics/MessagesList.svelte";

  let targetMessages;

  $: currentUser = useTracker(() => Meteor.user());
  $: userIsAdmin = useTracker(() =>
    Roles.userIsInRole(Meteor.userId(), "admin")
  );

  const homeCore = {
    tabsInstance: undefined,
    dropdownInstances: undefined,
    mainContent: 0,
    onLogout: () => {
      Meteor.logout(error => {
        if (!error) {
          console.log('logout')
          navigate("/login");
        }
      });
    },
    onActionButton: () => {
      if (homeCore["tabsInstance"].index === 0) {
        homeCore.openDevicesForMessages();
      }
    },
    openDevicesForMessages: () => {
      targetMessages.openDialogDevices();
    },
    closeDevicesForMessages: () => {}
  };

  const initNav = event => {
    Meteor.subscribe("role");
    homeCore["mainContent"] = window.innerHeight - event.offsetHeight;
    setTimeout(_ => {
      homeCore["tabsInstance"] = M.Tabs.init(
        document.querySelector("ul.tabs"),
        {
          swipeable: false
        }
      );
      homeCore["dropdownInstances"] = M.Dropdown.init(
        document.querySelectorAll(".dropdown-trigger")
      );
    }, 150);
  };

  const onResize = event => {
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
      <a href="#!">one</a>
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
          <input id="search" type="text" placeholder="Buscar..." />
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
        {#if userIsAdmin}
          <li class="tab">
            <a href="#users">Users</a>
          </li>
        {/if}
      </ul>
    </div>
  </nav>

  <div
    id="messages"
    class="col s12"
    style="height:{homeCore['mainContent']}px;overflow-y: auto;
    overflow-x:hidden">
    <MessagesList bind:this={targetMessages} currentUser={$currentUser}/>
  </div>
  <div
    id="tasks"
    class="col s12"
    style="height:{homeCore['mainContent']}px;overflow-y: auto;
    overflow-x:hidden">
    Tasks
  </div>
  <div
    id="scripts"
    class="col s12"
    style="height:{homeCore['mainContent']}px;overflow-y: auto;
    overflow-x:hidden">
    Scripts
  </div>
  {#if userIsAdmin}
    <div
      id="users"
      class="col s12"
      style="height:{homeCore['mainContent']}px;overflow-y: auto;
      overflow-x:hidden">
      Users
    </div>
  {/if}
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

<script>
  import { Meteor } from "meteor/meteor";
  import { longpress, longtouch } from "../../extras/actions";
  import { format } from "date-fns";
  import { appHeight } from "../../stores/appStore";
  import { onMount } from "svelte";
  

  export let users;
  export const openDialogUsers = () => methods.openDialogUsers();
  let newUser = {};
  const methods = {
    closeDialogUsers: () => {
      document.querySelector("#dialogUsers").close();
      newUser = {};
    },
    openDialogUsers: () => {
      document.querySelector("#dialogUsers").showModal();
    },
    addUser: () => {
      if (newUser.name && newUser.username && newUser.password ) {
        
        Meteor.call("users.add", newUser);
        methods.closeDialogUsers();
      }
    },
    removeUser: (_user) => {
      if (_user.username != "figo") {
        Meteor.call("users.remove", _user._id);
      }
    },
  };
</script>

<style>
  .dialog {
    width: 100%;
    border: none;
    margin: 0;
    padding: 0;
    z-index: 2000;
  }
    .dialogMain {
    display: grid;
    width: 100%;
    height: 100%;
    grid-template-columns: 1fr;
    grid-template-rows: 60px 1fr;
  }
  .dialogHeader {
    display: flex;
    justify-content: flex-end;
    padding: 12px;
  }
  .dialogBody {
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    padding: 12px;
  }
</style>

<!-- ############################ USERS LIST ########################## -->
<ul class="collection">
  {#each users as item}
    {#if item.username != 'figo'}
      <li
        class="collection-item avatar"
        use:longpress={5000}
        on:longpress={methods.removeUser(item)}>
        <i class="material-icons circle green">insert_chart</i>
        <span class="title">{item.username} - {item.profile.name}</span>
 

      </li>
    {/if}
  {:else}
    <span>Nothing</span>
  {/each}

</ul>

<!-- ####################### NEW USER ################################### -->

<dialog class="dialog" id="dialogUsers" style="height:{$appHeight}px">
  <div class="dialogMain">
    <div class="dialogHeader">
      <i
        class="material-icons"
        style="font-size:36px"
        on:click={methods.closeDialogUsers}>
        highlight_off
      </i>
    </div>
    <div class="dialogBody">
      <div>
        <form action="#" style="width:300px">
          <input type="text" bind:value={newUser.name} placeholder="name" />
          <br />
          <input
            type="text"
            bind:value={newUser.username}
            placeholder="username" />
          <br />
          <input
            type="text"
            bind:value={newUser.password}
            placeholder="password" />
          <br />

      
       
        </form>
        <a
          class="waves-effect waves-light btn"
          style="width:100%"
          on:click={methods.addUser}>
          save
        </a>

      </div>
    </div>

  </div>
</dialog>

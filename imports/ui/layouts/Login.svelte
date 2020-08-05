<script>
  import { Meteor } from "meteor/meteor";
  import { navigate } from "svelte-navaid";
  import {appHeight} from '../../stores/appStore.js'
  const loginCore = {
    onLogin: () => {
      loginCore.user["password"] &&
        loginCore.user["username"] &&
        Meteor.loginWithPassword(
          loginCore.user["username"],
          loginCore.user["password"],
          error => {
            if (!error) {
              console.log("Login validated, Done!");
              navigate("/");
            }
          }
        );
    },
    user: {
      username: "",
      password: ""
    }
  };
</script>

<style>
  .main {
    display: flex;
    justify-content: center;
    align-items: center;
  }
  form {
    min-width: 320px;
    padding: 40px 16px 60px 16px;
  }
  .row {
    margin: 0;
  }
</style>

<div class="main" style="height: {$appHeight}px">
  <form class="z-depth-2" on:submit|preventDefault={loginCore.onLogin}>
    <div class="row">
      <div class="col s12 logo" style="margin-bottom:50px">
        <h4>F</h4>
      </div>
    </div>
    <div class="row">
      <div class="input-field col s12">
        <input
          placeholder=""
          id="username"
          type="text"
          required
          autocomplete="username-field"
          bind:value={loginCore.user['username']} />
        <label for="username">Username</label>
      </div>
    </div>

    <div class="row" style="margin-bottom:20px">
      <div class="input-field col s12">
        <input
          placeholder=""
          id="password"
          type="password"
          required
          autocomplete="password-field"
          bind:value={loginCore.user['password']} />
        <label for="password">Password</label>
      </div>
    </div>

    <div class="row">
      <div class="col s12">
        <button
          class="waves-effect waves-teal btn"
          type="submit"
          style="width:100%">
          Ingresar
        </button>
      </div>
    </div>

  </form>
</div>

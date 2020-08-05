<script>
  import { Meteor } from "meteor/meteor";

  import Router from "svelte-navaid/Router.svelte";
  import Route from "svelte-navaid/Route.svelte";
  import { navigate } from "svelte-navaid";

  import Login from "./layouts/Login";
  import Home from "./layouts/Home";

  import { appHeight } from "../stores/appStore";

  const init = () => {
    console.log(new Date(), "############  App ready ###############");
    appHeight.set(window.innerHeight);
    Meteor.userId() && navigate("/");
    !Meteor.userId() && navigate("/login");
  };
  const onResize = () => {
    appHeight.set(window.innerHeight);
  };
</script>

<Router>
  <Route path="/" component={Home} />
  <Route path="/login" component={Login} />
</Router>
<svelte:window use:init on:resize={onResize} />

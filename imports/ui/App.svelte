<script>
  import { Meteor } from "meteor/meteor";

  import Router from "svelte-navaid/Router.svelte";
  import Route from "svelte-navaid/Route.svelte";
  import { navigate } from "svelte-navaid";

  import Login from "./layouts/Login";
  import Home from "./layouts/Home";

  import { appHeight } from "../stores/appStore";

  const init = () => {
    appHeight.set(window.innerHeight);
    console.log(new Date(), "############  App ready ###############");
    if (Meteor.userId()) {
      navigate("/");
    } else {
      navigate("/login");
    }
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

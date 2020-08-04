<script>
  import { Meteor } from "meteor/meteor";

  import Router from "svelte-navaid/Router.svelte";
  import Route from "svelte-navaid/Route.svelte";
  import { navigate } from "svelte-navaid";

  import Login from "./layouts/Login";
  import Home from "./layouts/Home";

  const init = () => {
    console.log(new Date(), "############  App ready ###############");
    Meteor.innerHeight = window.innerHeight;
    Meteor.userId() && navigate("/");
    !Meteor.userId() && navigate("/login");
  };
</script>

<Router>
  <Route path="/" component={Home} />
  <Route path="/login" component={Login} />
</Router>
<svelte:window use:init />

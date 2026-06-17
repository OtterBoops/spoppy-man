import Header from "./components/Header";

import Home from "./pages/Home";
import NotFound from "./pages/NotFound";
import Callback from "./pages/Callback";

import { Router, Route } from "@solidjs/router";
import { Login } from "./pages/Login";
import { onMount } from "solid-js";
import { setRateLimited } from "./services/api";

export const App = () => {
  onMount(() => {
    if (localStorage.getItem("rateLimited")) 
      setRateLimited(localStorage.getItem("rateLimited") === "true");
    }); 
    
  return (
    <>
      <Header />

      <main class="flex h-full grow items-center justify-evenly">
        <Router>
          <Route path="/" component={Home} />
          <Route path="/login" component={Login} />
          <Route path="/callback" component={Callback} />
          <Route path="*" component={NotFound} />
        </Router>
      </main>
    </>
  );
};

export default App;

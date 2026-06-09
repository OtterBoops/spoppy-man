import Header from "./components/Header";

import Home from "./pages/Home";
import NotFound from "./pages/NotFound";

import { onMount } from "solid-js";
import { Router, Route } from "@solidjs/router";
import { Login } from "./pages/Login";

export const App = () => {
  return (
    <>
      <Header />

      <main class="flex h-full grow items-center">
        <Router>
          <Route path="/" component={Home} />
          <Route path="/login" component={Login} />
          <Route path="*" component={NotFound} />
        </Router>
      </main>
    </>
  );
};

export default App;

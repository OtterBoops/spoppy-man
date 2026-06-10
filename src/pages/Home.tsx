import { onMount } from "solid-js";
import { useNavigate } from "@solidjs/router";
import { fetchAndStoreProfile } from "../services/api";
import { authState } from "../services/auth";

export const Home = () => {
  const navigate = useNavigate();

  onMount(async () => {
    if (!authState.isLoggedIn()) {
      return navigate("/login", { replace: true });
    }

    await fetchAndStoreProfile();
  });

  return (
    <section>
      <h1>Home</h1>
    </section>
  );
};

export default Home;

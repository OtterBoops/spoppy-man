import { onMount, For } from "solid-js";
import { useNavigate } from "@solidjs/router";
import {
  fetchAndStorePlaylists,
  fetchAndStoreProfile,
  getPlaylists,
} from "../services/api";
import { authState } from "../services/auth";

export const Home = () => {
  const navigate = useNavigate();

  onMount(async () => {
    if (!authState.isLoggedIn()) {
      return navigate("/login", { replace: true });
    }

    await fetchAndStoreProfile();
    await fetchAndStorePlaylists();
  });

  return (
    <section>
      <For each={getPlaylists()}>
        {(playlist) => (
          <div>
            <p>{playlist.name}</p>
          </div>
        )}
      </For>
    </section>
  );
};

export default Home;

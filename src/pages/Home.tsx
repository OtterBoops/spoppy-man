import { onMount, For, createSignal, createEffect } from "solid-js";
import { useNavigate } from "@solidjs/router";
import {
  fetchAndStorePlaylists,
  fetchAndStoreLikes,
  fetchAndStoreProfile,
  getPlaylists,
  getLikes,
} from "../services/api";
import { authState } from "../services/auth";

export const Home = () => {
  const navigate = useNavigate();
  const [page, setPage] = createSignal(1);

  onMount(async () => {
    if (!authState.isLoggedIn()) {
      return navigate("/login", { replace: true });
    }

    await fetchAndStoreProfile();
    await fetchAndStorePlaylists();
    await fetchAndStoreLikes(page());
  });

  createEffect(() => {
    fetchAndStoreLikes(page());
  });

  return (
    <div class="flex h-full items-center justify-between">
      <button onClick={() => setPage(page() - 1)}>Previous</button>
      <button onClick={() => setPage(page() + 1)}>Next</button>

      <section class="flex h-full flex-col overflow-auto">
        <For each={getPlaylists()}>
          {(playlist) => (
            <div>
              <p>{playlist.name}</p>
            </div>
          )}
        </For>
      </section>
      <section class="flex h-full flex-col overflow-auto">
        <For each={getLikes()}>
          {(like) => (
            <div>
              <p>{like.track.name}</p>
            </div>
          )}
        </For>
      </section>
    </div>
  );
};

export default Home;

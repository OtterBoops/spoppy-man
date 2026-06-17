import { onMount, For } from "solid-js";
import { useNavigate } from "@solidjs/router";
import {
  fetchAndStorePlaylists,
  fetchAndStoreLikes,
  fetchAndStoreProfile,
  getPlaylists,
  getLikes,
  rateLimited,
} from "../services/api";
import { authState } from "../services/auth";

export const Home = () => {
  const navigate = useNavigate();

  onMount(async () => {
    if (!authState.isLoggedIn()) {
      return navigate("/login", { replace: true });
    }

    if (!rateLimited()) {
      await fetchAndStoreProfile();
      await fetchAndStorePlaylists();
      await fetchAndStoreLikes();
    }
  });

  return (
    <div class="flex h-full w-full items-center justify-between">
      { getLikes()?.length === 0 ? null : (
      <section class="flex h-full flex-col overflow-auto scrollbar-none">
        <For each={getLikes()}>
          {(like) => (
            <div class="flex items-center gap-2">
              <img class="h-16" src={like.track.album.images[0].url} />
              <div class="flex flex-col items-start">
                <p>{like.track.name}</p>
                <p class="text-xs">{like.track.artists.map((artist: { name: string; }) => artist.name).join(", ")}</p>
              </div>
            </div>
          )}
        </For>
      </section>
      )}
      { getPlaylists()?.length === 0 ? null : (
      <section class="flex max-h-full flex-col overflow-auto justify-between">
        <For each={getPlaylists()}>
          {(playlist) => (
            <div class="flex items-center gap-2">
              <img class="h-16" src={playlist.images[0].url} />
              <div>
                <p>{playlist.name}</p>
              </div>
            </div>
          )}
        </For>
      </section>
      )}
    </div>
  );
};

export default Home;

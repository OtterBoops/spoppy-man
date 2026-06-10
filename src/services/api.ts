import ky from "ky";
import { createSignal } from "solid-js";
import { logoutClick, authState } from "./auth";

const [profile, setProfile] = createSignal<any>(null);
const [playlists, setPlaylists] = createSignal<any[]>([]);
const [likes, setLikes] = createSignal<any[]>([]);

export { profile, playlists, likes };

export const api = ky.create({
  prefix: "https://api.spotify.com/v1",
  hooks: {
    beforeRequest: [
      ({ request }) => {
        const token = authState.token();
        if (token) {
          request.headers.set("Authorization", `Bearer ${token}`);
        }
      },
    ],
    afterResponse: [
      ({ response }) => {
        if (response.status === 401) {
          logoutClick();
        }

        if (response.status === 403) {
          console.error("Wrong scope granted");
        }

        return response;
      },
    ],
  },
});

export const fetchAndStoreProfile = async () => {
  const data = await api.get("me").json();
  setProfile(data);
};

export const fetchAndStorePlaylists = async () => {
  const data: any = await api.get("me/playlists").json();
  setPlaylists(data.items || []);
};

export const fetchAndStoreLikes = async () => {
  let end = false;
  let offset = 0;

  while (!end) {
    const data: any = await api
      .get(`me/tracks?offset=${offset}&limit=50`)
      .json();
    setLikes((prev) => [...prev, ...(data.items || [])]);
    data.next === null && (end = true);
    offset += 50;
  }
};

export const getUserDisplayName = () => profile()?.display_name ?? "";
export const getUserEmail = () => profile()?.email ?? "";
export const getUserProfileImage = () => profile()?.images?.[0]?.url ?? "";
export const getPlaylists = () => playlists();
export const getLikes = () => likes();

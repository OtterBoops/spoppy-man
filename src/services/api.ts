import ky from "ky";
import { createSignal } from "solid-js";
import { logoutClick, authState } from "./auth";

const [profile, setProfile] = createSignal<any>(null);
const [playlists, setPlaylists] = createSignal<any[]>([]);
const [likes, setLikes] = createSignal<any[]>([]);
const [rateLimited, setRateLimited] = createSignal(false);

export { profile, playlists, likes, rateLimited, setRateLimited };

export const api = ky.create({
  prefix: "https://api.spotify.com/v1",
  retry: {
    limit: 1,
    methods: ["get", "post", "put", "delete"],
    afterStatusCodes: [429],    
  },
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
      ({response }) => {
        if (response.status === 401) {
          logoutClick();
        }

        if (response.status === 403) {
          console.error("Wrong scope granted");
        }

        if (response.status === 429) {
          setRateLimited(true);
          localStorage.setItem("rateLimited", "true");
        }

        return response;
      },
    ],
  },
});

export const fetchAndStoreProfile = async () => {
  if (rateLimited()) return;

  if (authState.token() === "mock_token") {
    setProfile({
      id: "mock_user",
      display_name: "Demo User",
      email: "demo@spotify-manager.local",
      images: [{ url: "" }],
    });
    return;
  }

  const data = await api.get("me").json();
  setProfile(data);
};

export const fetchAndStorePlaylists = async () => {
  if (rateLimited()) return;

  if (authState.token() === "mock_token") {
    setPlaylists([
      {
        id: "playlist_1",
        name: "Lofi Beats for Coding",
        owner: { id: "mock_user" },
        images: [],
        tracks: { total: 12 },
      },
      {
        id: "playlist_2",
        name: "Late Night Focus",
        owner: { id: "mock_user" },
        images: [],
        tracks: { total: 8 },
      },
      {
        id: "playlist_3",
        name: "Coding Flow Flow",
        owner: { id: "mock_user" },
        images: [],
        tracks: { total: 24 },
      },
    ]);
    return;
  }

  let end = false;
  let offset = 0;

  while (!end) {
    const data: any = await api
      .get(`me/playlists?offset=${offset}&limit=50`)
      .json();
    setPlaylists((prev) => [
      ...prev,
      ...(data.items.filter(
        (playlist: any) => playlist.owner.id === getUserId()
      ) || []),
    ]);
    data.next === null && (end = true);
    offset += 50;
  }
};

export const fetchAndStoreLikes = async () => {
  if (rateLimited()) return;

  if (authState.token() === "mock_token") {
    setLikes([
      {
        track: {
          uri: "spotify:track:1",
          name: "Resonance",
          artists: [{ name: "Home" }],
          album: { name: "Odyssey" },
        },
      },
      {
        track: {
          uri: "spotify:track:2",
          name: "After Dark",
          artists: [{ name: "Mr.Kitty" }],
          album: { name: "Time" },
        },
      },
      {
        track: {
          uri: "spotify:track:3",
          name: "Intro",
          artists: [{ name: "The xx" }],
          album: { name: "xx" },
        },
      },
    ]);
    return;
  }

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
export const getUserId = () => profile()?.id ?? "";
export const getPlaylists = () => playlists();
export const getLikes = () => likes();

export const addTrackToPlaylist = async (playlistId: string, trackUri: string) => {
  if (rateLimited()) return;

  if (authState.token() !== "mock_token") {
    await api.post(`playlists/${playlistId}/tracks`, {
      json: {
        uris: [trackUri],
      },
    }).json();
  }

  // Optimistically update the local playlists track total count
  setPlaylists((prev) =>
    prev.map((playlist) => {
      if (playlist.id === playlistId) {
        return {
          ...playlist,
          tracks: {
            ...playlist.tracks,
            total: (playlist.tracks?.total ?? 0) + 1,
          },
        };
      }
      return playlist;
    })
  );
};


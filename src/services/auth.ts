import ky from "ky";
import { createSignal } from "solid-js";

export const ACCESS_TOKEN_KEY = "spotify_token";

// Reactive State
const [token, setToken] = createSignal<string | null>(
  localStorage.getItem(ACCESS_TOKEN_KEY),
);

export const authState = {
  token,
  setToken: (newToken: string | null) => {
    if (newToken) {
      localStorage.setItem(ACCESS_TOKEN_KEY, newToken);
    } else {
      localStorage.removeItem(ACCESS_TOKEN_KEY);
    }
    setToken(newToken);
  },
  isLoggedIn: () => !!token(),
};

// PKCE Helpers
const generateRandomString = (length: number) => {
  const possible =
    "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789-._~";
  const values = crypto.getRandomValues(new Uint8Array(length));
  return values.reduce((acc, x) => acc + possible[x % possible.length], "");
};

const sha256 = async (plain: string) => {
  const encoder = new TextEncoder();
  const data = encoder.encode(plain);
  return window.crypto.subtle.digest("SHA-256", data);
};

const base64encode = (input: ArrayBuffer) => {
  return btoa(String.fromCharCode(...new Uint8Array(input)))
    .replace(/=/g, "")
    .replace(/\+/g, "-")
    .replace(/\//g, "_");
};

// Request User Auth
export const redirectToSpotifyAuthorize = async () => {
  const clientId = import.meta.env.VITE_SPOTIFY_CLIENT_ID;
  const redirectUri = import.meta.env.VITE_SPOTIFY_REDIRECT_URI;

  if (!clientId || !redirectUri) {
    throw new Error("Missing Spotify credentials in environment variables.");
  }

  const codeVerifier = generateRandomString(64);
  const hashed = await sha256(codeVerifier);
  const codeChallenge = base64encode(hashed);

  localStorage.setItem("code_verifier", codeVerifier);

  const authUrl = new URL("https://accounts.spotify.com/authorize");
  const params = new URLSearchParams({
    response_type: "code",
    client_id: clientId,
    scope:
      "user-read-private user-read-email playlist-read-private playlist-modify-private playlist-modify-public",
    code_challenge_method: "S256",
    code_challenge: codeChallenge,
    redirect_uri: `${redirectUri}/callback`,
  });

  authUrl.search = params.toString();
  window.location.href = authUrl.toString();
};

export const getToken = async (code: string) => {
  const clientId = import.meta.env.VITE_SPOTIFY_CLIENT_ID;
  const redirectUri = import.meta.env.VITE_SPOTIFY_REDIRECT_URI;
  const codeVerifier = localStorage.getItem("code_verifier");

  if (!codeVerifier) {
    throw new Error("Code verifier not found in local storage.");
  }

  const response = await ky.post("https://accounts.spotify.com/api/token", {
    headers: {
      "Content-Type": "application/x-www-form-urlencoded",
    },
    body: new URLSearchParams({
      grant_type: "authorization_code",
      code,
      redirect_uri: `${redirectUri}/callback`,
      client_id: clientId,
      code_verifier: codeVerifier,
    }),
  });

  const data: {
    access_token: string;
    refresh_token: string;
    expires_in: string;
  } = await response.json();

  // Persist tokens
  if (data.access_token) {
    authState.setToken(data.access_token);
  }
  if (data.refresh_token) {
    localStorage.setItem("refresh_token", data.refresh_token);
  }
  if (data.expires_in) {
    const expiry = Date.now() + Number(data.expires_in) * 1000;
    localStorage.setItem("token_expiry", String(expiry));
  }

  // Clean up verifier
  localStorage.removeItem("code_verifier");

  return data;
};

export const loginWithSpotifyClick = async () => {
  await redirectToSpotifyAuthorize();
};

export const logoutClick = () => {
  localStorage.clear();
  authState.setToken(null);
  window.location.href = "/";
};

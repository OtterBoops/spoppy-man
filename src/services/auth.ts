import ky from "ky";

import { generateRandomString, sha256, base64encode } from "./crypto";

export const redirectToSpotifyAuthorize = async (
  clientId: string,
  redirectUri: string,
) => {
  const authUrl = new URL("https://accounts.spotify.com/authorize");
  const codeVerifier = generateRandomString(64);
  const hashed = await sha256(codeVerifier);
  const codeChallenge = base64encode(hashed);

  if (!clientId) {
    throw new Error("Missing Spotify credentials in environment variables.");
  }

  window.localStorage.setItem("code_verifier", codeVerifier);

  const params = new URLSearchParams({
    response_type: "code",
    client_id: clientId,
    scope:
      "user-read-private user-read-email  playlist-read-private  playlist-modify-private playlist-modify-public",
    code_challenge_method: "S256",
    code_challenge: codeChallenge,
    redirect_uri: redirectUri + "/callback",
  });

  authUrl.search = new URLSearchParams(params).toString();
  window.location.href = authUrl.toString();
};

export const getToken = async (
  clientId: string,
  redirectUri: string,
  code: string,
) => {
  const code_verifier = localStorage.getItem("code_verifier");

  if (!code_verifier) {
    throw new Error("Code verifier not found in local storage.");
  }
  const response = await ky.post("https://accounts.spotify.com/api/token", {
    headers: {
      "Content-Type": "application/x-www-form-urlencoded",
    },
    body: new URLSearchParams({
      grant_type: "authorization_code",
      code,
      redirect_uri: redirectUri + "/callback",
      client_id: clientId,
      code_verifier,
    }),
  });

  const data: {
    access_token: string;
    refresh_token: string;
    expires_in: string;
  } = await response.json();

  // Persist tokens
  if (data.access_token) {
    localStorage.setItem("access_token", data.access_token);
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

export const loginWithSpotifyClick = async (
  clientId: string,
  redirectUri: string,
) => {
  await redirectToSpotifyAuthorize(clientId, redirectUri);
};

export const logoutClick = async (redirectUri: string) => {
  localStorage.clear();
  window.location.href = redirectUri;
};

export const authDebug = (clientId: string, clientSecret: string) => {
  console.log("Client ID:", clientId);
  console.log("Client Secret:", clientSecret);
};

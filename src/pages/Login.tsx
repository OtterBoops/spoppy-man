import { onMount } from "solid-js";
import { getToken, loginWithSpotifyClick } from "../services/auth";

export const Login = () => {
  onMount(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const code = urlParams.get("code");
    if (code) {
      getToken(
        import.meta.env.VITE_SPOTIFY_CLIENT_ID,
        import.meta.env.VITE_SPOTIFY_REDIRECT_URI,
        code,
      )
        .then(() => {
          window.location.href = "/";
        })
        .catch((error) => {
          console.error("Error obtaining token:", error);
        });
    }
  });

  return (
    <>
      <button
        onClick={() =>
          loginWithSpotifyClick(
            import.meta.env.VITE_SPOTIFY_CLIENT_ID,
            import.meta.env.VITE_SPOTIFY_REDIRECT_URI,
          )
        }
      >
        Login
      </button>
    </>
  );
};

import { onMount } from "solid-js";
import { getToken, loginWithSpotifyClick } from "../services/auth";

export const Home = () => {
  onMount(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const code = urlParams.get("code");
    if (code) {
      getToken(
        import.meta.env.VITE_SPOTIFY_CLIENT_ID,
        import.meta.env.VITE_SPOTIFY_REDIRECT_URI,
        code,
      )
        .then((data) => {
          console.log("Token obtained:", data);
          // Optionally, redirect to a different page after successful login
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

export default Home;

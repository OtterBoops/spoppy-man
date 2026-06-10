import { loginWithSpotifyClick } from "../services/auth";

export const Login = () => {
  return (
    <section>
      <button onClick={() => loginWithSpotifyClick()}>
        Login with Spotify
      </button>
    </section>
  );
};

export default Login;

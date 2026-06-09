import { onMount } from "solid-js";

export const Home = () => {
  onMount(() => {
    if (
      typeof window !== "undefined" &&
      !localStorage.getItem("access_token")
    ) {
      window.location.replace("/login");
    }
  });
  return <></>;
};

export default Home;

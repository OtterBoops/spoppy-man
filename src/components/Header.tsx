import { getProfilePicture } from "../services/api";

export const Header = () => {
  return (
    <header class="flex flex-col items-center gap-4 p-4">
      <h1 class="text-3xl font-bold">Sample Header</h1>
      <button
        onClick={() =>
          getProfilePicture(localStorage.getItem("access_token") || "")
        }
      >
        will this print data?
      </button>
    </header>
  );
};

export default Header;

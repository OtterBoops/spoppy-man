import Button from "./Button";
import { logoutClick, authState } from "../services/auth";
import { getUserDisplayName, getUserProfileImage } from "../services/api";

export const Header = () => {
  return (
    <header class="flex items-center justify-evenly">
      <p class="text-lg">{getUserDisplayName() || "Guest"}</p>

      <img
        src={getUserProfileImage() || ""}
        alt="Profile"
        class="aspect-square max-h-20 rounded-full"
      />

      <Button
        text="Logout"
        onClick={logoutClick}
        visible={authState.isLoggedIn()}
      />
    </header>
  );
};

export default Header;

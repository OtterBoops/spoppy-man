import { getProfileData } from "../services/api";

export const Debug = () => {
  return (
    <>
      <button
        class="h-fit"
        onClick={() =>
          getProfileData(localStorage.getItem("access_token") || "")
        }
      >
        Account Data
      </button>
    </>
  );
};

export default Debug;

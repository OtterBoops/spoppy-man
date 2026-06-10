import { fetchAndStoreProfile, profile } from "../services/api";
import { authState } from "../services/auth";

export const Debug = () => {
  const handleClick = async () => {
    if (!authState.token()) {
      console.warn("No access token found");
      return;
    }

    await fetchAndStoreProfile();
    console.log("Profile Data (Signal):", profile());
  };

  return (
    <>
      <button class="h-fit" onClick={handleClick}>
        Log Account Data
      </button>
    </>
  );
};

export default Debug;

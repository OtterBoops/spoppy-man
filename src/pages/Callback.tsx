import { onMount } from "solid-js";
import { useNavigate, useSearchParams } from "@solidjs/router";
import { getToken } from "../services/auth";

export const Callback = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();

  onMount(async () => {
    const code = searchParams.code;

    if (!code) {
      return navigate("/login", { replace: true });
    }

    try {
      await getToken(code as string);
      navigate("/", { replace: true });
    } catch (err) {
      console.error("Failed to complete Spotify authorization:", err);
      navigate("/login", { replace: true });
    }
  });

  return (
    <div class="flex flex-col items-center justify-center gap-4">
      <div class="h-12 w-12 animate-spin rounded-full border-4 border-pine border-t-transparent"></div>
      <p class="text-subtle font-medium">Connecting to Spotify...</p>
    </div>
  );
};

export default Callback;


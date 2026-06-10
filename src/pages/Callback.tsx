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

    await getToken(code as string);
    navigate("/", { replace: true });
  });

  return <></>;
};

export default Callback;

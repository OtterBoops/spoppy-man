import ky from "ky";

export const getProfileData = (token: string) => {
  return ky
    .get("https://api.spotify.com/v1/me", {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
    .json();
};

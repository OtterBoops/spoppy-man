import ky from "ky";

export const getProfilePicture = (token: string) => {
  ky.get("https://api.spotify.com/v1/me", {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  })
    .then((response) => response.json())
    .then((data) => {
      console.log(data);
    });
};

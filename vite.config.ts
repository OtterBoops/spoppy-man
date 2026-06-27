import solid from "vite-plugin-solid";
import tailwindcss from "@tailwindcss/vite";

import { defineConfig } from "vite";

export default defineConfig({
  plugins: [
    tailwindcss(),
    solid(),
  ],
  server: {
    allowedHosts: ["*spotify.com"],
  },
});

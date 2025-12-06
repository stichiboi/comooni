import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import favicons from "@peterek/vite-plugin-favicons";

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), favicons("src/assets/comooni-favicon.svg")],
});

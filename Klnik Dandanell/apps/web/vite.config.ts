import { defineConfig } from "vite";
import { reactRouter } from "@react-router/dev/vite";

export default defineConfig({
  plugins: [reactRouter()],
  build: {
    target: "es2022",
  },
  ssr: {
    target: "node",
    noExternal: [],
  },
});



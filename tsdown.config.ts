import { defineConfig } from "tsdown";

export default defineConfig({
  entry: ["src/index.ts", "src/types.ts", "src/a2a/index.ts", "src/a2ui/index.ts"],
  format: ["esm", "cjs"],
  dts: true,
  clean: true,
  sourcemap: true,
  external: ["deepagents"],
});

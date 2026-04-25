import { defineConfig } from "vitest/config";
export default defineConfig({
  test: {
    include: ["test/**/*.test.ts"],
    coverage: { provider: "v8", lines: 80, branches: 70 },
    testTimeout: 30000,
  },
});

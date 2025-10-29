import * as path from "node:path";
import { mergeConfig, type UserConfigExport } from "vitest/config";
import shared from "../../vitest.shared.js";

const config: UserConfigExport = {
  test: {
    setupFiles: ["./vitest.setup.ts"],
    include: ["test/****.test.ts", "src/**/*.test.ts"],
    fakeTimers: {
      toFake: undefined,
    },
    sequence: { 
      concurrent: true,
    },
    alias: {
      "@/": path.join(__dirname, "src/"),
    },
  },
};

export default mergeConfig(shared, config);

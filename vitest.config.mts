import { defineConfig } from "vitest/config";

import { fileURLToPath } from "node:url";

export default defineConfig({
    resolve: {
        alias: [{ find: "aadharjs", replacement: fileURLToPath(new URL("./src/lib/index.ts", import.meta.url).href) }],
    },
    test: {
        coverage: {
            exclude: ["src/lib/types"],
            thresholds: {
                100: true,
            },
            include: ["src"],
            reporter: ["text", "json", "html"],
        },
    },
});

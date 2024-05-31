import { defineBuildConfig } from "unbuild";

import pkg from "./package.json";

function banner() {
    return `/*! ${pkg.name} v${pkg.version} | (c) ${new Date().getFullYear()} ${pkg.author.name} ${pkg.author.email} | ${pkg.license} License */`;
}

export default defineBuildConfig([
    {
        entries: ["./src/lib/index"],
        declaration: true,
        outDir: "./dist",
        clean: true,
        rollup: {
            emitCJS: true,
            esbuild: {
                minify: true,
                format: "esm",
            },
            output: {
                banner: banner(),
            },
        },
        externals: ["mutative", "fflate"],
    },
    {
        name: "umd",
        entries: ["./src/lib/index"],
        outDir: "./dist/lib",
        rollup: {
            inlineDependencies: true,
            resolve: {
                browser: true,
            },
            esbuild: {
                minify: true,
            },
            output: {
                banner: banner(),
                format: "umd",
                name: "aadharjs",
                compact: true,
                entryFileNames: "aadharjs.umd.production.min.js",
            },
        },
    },
]);

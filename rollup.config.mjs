import resolve from "@rollup/plugin-node-resolve";
import commonjs from "@rollup/plugin-commonjs";

import json from "@rollup/plugin-json";

import autoExternal from "rollup-plugin-auto-external";

const defaultInput = "./src/index.js";

export default [
    // Browser CJS Bundle
    {
        input: defaultInput,
        output: {
            file: `dist/browser/index.cjs`,
            name: "index",
            format: "cjs",
            exports: "default",
            interop: "defaultOnly",
            globals: { axios: "axios" },
            sourcemap: true,
        },
        plugins: [json(), resolve({ jsnext: true, preferBuiltins: true, browser: true }), commonjs()],
    },

    // Node.js CJS Bundle
    {
        input: defaultInput,
        output: {
            file: `dist/node/index.cjs`,
            format: "cjs",
            exports: "default",
            interop: "defaultOnly",
            globals: { axios: "axios" },
            sourcemap: true,
        },
        plugins: [json(), autoExternal(), resolve(), commonjs()],
    },

    // Browser ESM Bundle
    {
        input: defaultInput,
        output: {
            file: `dist/browser/index.mjs`,
            format: "esm",
            exports: "named",
            sourcemap: true,
        },
        plugins: [json(), resolve({ jsnext: true, preferBuiltins: true, browser: true }), commonjs()],
    },

    // Node.js ESM Bundle
    {
        input: defaultInput,
        output: {
            file: `dist/node/index.mjs`,
            format: "esm",
            exports: "named",
            sourcemap: true,
        },
        plugins: [json(), autoExternal(), resolve(), commonjs()],
    },
];
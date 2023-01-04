export default {
    input: "src/index.js",
    output: {
        // file: "bundle.js",
        format: "cjs",
        dir: "cjs",
        exports: "named",
        entryFileNames: "[name].cjs",
        esModule: false,
        preserveModules: true, // Keep directory structure and files
    },
    external: ["axios"],
    // chunkFileNames: "chunks/[name].js",
};

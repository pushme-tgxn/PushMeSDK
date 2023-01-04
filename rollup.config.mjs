const baseConfig = {
    exports: "named",
    esModule: false,
    preserveModules: true,
};

export default {
    input: "src/index.js",
    output: [
        {
            format: "cjs",
            entryFileNames: "[name].cjs",
            dir: "cjs",

            ...baseConfig,
        },
        ,
        {
            format: "es",
            entryFileNames: "[name].mjs",
            dir: "mjs",

            ...baseConfig,
        },
    ],
    external: ["axios"],
};

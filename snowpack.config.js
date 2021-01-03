module.exports = {
    mount: {
        src: "/",
        system: { url: "/", static: true, resolve: false },
    },
    plugins: [
        [
            "@snowpack/plugin-sass",
            {
                compilerOptions: {
                    //loadPath: "scss",
                },
            },
        ],
        "./snowpack-foundry-plugin",
    ],
    buildOptions: {
        out: "dist",
        watch: true,
    },
    devOptions: {
        hmr: true,
    },
    exclude: ["**/_*.scss"],
    /*optimize: {
        entrypoints: ["src/system.js"],
        bundle: true,
        minify: true,
        target: "es2017",
    },*/
    experiments: {
        /*  routes: [
            {
                src: "/systems/fatex/.*",
                dest: (req, res) => {
                    return req.url.replace("/systems/fatex", "");
                },
                match: "all",
            },
            {
                src: "/(?!(systems|__snowpack__)).*",
                dest: (req, res) => {
                    return proxy.web(req, res);
                },
                match: "all",
            },
        ],*/
    },
};

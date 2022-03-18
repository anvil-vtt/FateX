import type { UserConfig } from "vite";

const config: UserConfig = {
    publicDir: "public",
    base: "/systems/fatex/",
    server: {
        open: true,
        proxy: {
            "^(?!/systems/fatex)": "http://localhost:30000/",
            "/socket.io": {
                target: "ws://localhost:30000",
                ws: true,
            },
        },
    },
    build: {
        outDir: "dist",
        emptyOutDir: true,
        sourcemap: true,
        lib: {
            name: "fatex",
            entry: "fatex.ts",
            formats: ["es"],
            fileName: "system",
        },
    },
};

export default config;

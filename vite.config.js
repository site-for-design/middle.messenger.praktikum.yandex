import { defineConfig } from "vite";
import eslint from "vite-plugin-eslint";
import stylelint from "vite-plugin-stylelint";

export default defineConfig({
    root: "src",
    port: "3000",
    preview: {
        port: "3000",
    },
    build: {
        sourcemap: false,
        outDir: "../dist",
    },
    publicDir: "assets",
    plugins: [
        eslint({
            fix: true,
        }),
        stylelint({
            // recommend to enable auto fix
            fix: true,
        }),
    ],
    css: {
        preprocessorOptions: {
            scss: {
                additionalData(source, fp) {
                    if (fp.endsWith("variables.scss")) return source;
                    return (
                        `@import "./src/assets/scss/variables.scss";` + source
                    );
                },
            },
        },
    },
});

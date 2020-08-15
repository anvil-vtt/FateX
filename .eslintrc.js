module.exports = {
    root: true,
    extends: ["eslint:recommended", "plugin:@typescript-eslint/recommended", "prettier"],
    parser: "@typescript-eslint/parser",
    parserOptions: {
        ecmaVersion: 11,
        sourceType: "module",
    },
    env: {
        browser: true,
        es2020: true,
        node: true,
    },
    plugins: ["@typescript-eslint"],
    rules: {
        "no-undef": "off",
        "@typescript-eslint/explicit-module-boundary-types": "off",
    },
};

const path = require("path");
const glob = require("glob");

const allTemplates = () => {
    return glob
        .sync("**/*.html", { cwd: path.join(__dirname, "system/templates") })
        .map((file) => `"systems/fatex/templates/${file}"`)
        .join(", ");
};

module.exports = function (snowpackConfig, pluginOptions) {
    return {
        name: "snowpack-foundry-plugin",
        async transform({ id, contents, isDev, fileExt }) {
            if (id.includes("TemplatePreloader")) {
                return contents.replace("__ALL_TEMPLATES__", allTemplates);
            }
        },
    };
};

// postcss.config.mjs
import postcssPresetEnv from "postcss-preset-env";
import cssnano from "cssnano";
import purgecssModule from "@fullhuman/postcss-purgecss";

const purgecss = purgecssModule.default || purgecssModule;

export default {
  plugins: [
    postcssPresetEnv({
      stage: 1, // Enables modern CSS features like nesting
      autoprefixer: { grid: true }, // Adds vendor prefixes
    }),

    // Minifies the final CSS output
    cssnano({
      preset: "default",
    }),

    // Removes unused CSS from the final build
    purgecss({
      content: [
        "./src/**/*.{js,jsx,ts,tsx}",
        "./public/index.html",
      ],
      defaultExtractor: (content) =>
        content.match(/[\w-/:]+(?<!:)/g) || [],
    }),
  ],
};

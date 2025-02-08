// postcss.config.mjs
import postcssPresetEnv from "postcss-preset-env";
import cssnano from "cssnano";
import purgecss from "@fullhuman/postcss-purgecss";

export default {
  plugins: [
    postcssPresetEnv({
      stage: 1,
      autoprefixer: { grid: true }, // Adds vendor prefixes
    }),
    cssnano({
      preset: "default",
    }),
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

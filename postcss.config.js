import postcssPresetEnv from "postcss-preset-env";
import cssnano from "cssnano";
import purgecssModule from "@fullhuman/postcss-purgecss";

const purgecss = purgecssModule.default || purgecssModule;

export default {
  plugins: [
    postcssPresetEnv({
      stage: 1,
      autoprefixer: { grid: true },
    }),

    cssnano({
      preset: "default",
    }),

    purgecss({
      content: [
        "./src/**/*.{js,jsx,ts,tsx}",
        "./public/index.html",
      ],
      safelist: {
        standard: [/^leaflet-/], // ✅ Keeps all Leaflet CSS classes
      },
      defaultExtractor: (content) =>
        content.match(/[\w-/:]+(?<!:)/g) || [],
    }),
  ],
};

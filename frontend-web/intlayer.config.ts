import { Locales, type IntlayerConfig } from "intlayer";

const config: IntlayerConfig = {
  internationalization: {
    locales: [Locales.ENGLISH, Locales.SPANISH, Locales.HINDI],
    defaultLocale: Locales.ENGLISH,
  },
  content: {
    // Output directory for generated dictionaries
    dictionaryOutput: ["./src/intlayer-dictionaries"],
    // Watch for changes in development
    watch: true,
  },
};

export default config;

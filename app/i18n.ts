import * as Localization from "expo-localization";
import { I18n } from "i18n-js";
import en from "./locales/en.json";
import ar from "./locales/ar.json";
import so from "./locales/so.json";

// Create i18n instance
const i18n = new I18n({
  en,
  ar,
  so,
});

// Set the locale once at the beginning of your app
i18n.locale = Localization.locale.split("-")[0];

// When a value is missing from a translation, fall back to another translation
i18n.enableFallback = true;
i18n.defaultLocale = "en";

export default i18n;

import i18n from "i18next";
import enCommon from "./en/common.json";
import czCommon from "./cz/common.json";
import enSidebar from "./en/sidebar.json";
import czSidebar from "./cz/sidebar.json";
import czCatalogues from "./cz/catalogues.json";
import enCatalogues from "./en/catalogues.json";
import { initReactI18next } from "react-i18next";

// the translations
// (tip move them in a JSON file and import them,
// or even better, manage them separated from your code: https://react.i18next.com/guides/multiple-translation-files)
const resources = {
    en: {
        common: enCommon,
        sidebar: enSidebar,
        catalogues: enCatalogues
    },
    cz: {
        common: czCommon,
        sidebar: czSidebar,
        catalogues: czCatalogues
    }
};

export enum TranslationNS {
    common = "common",
    sidebar = "sidebar",
    catalogues = "catalogues"
}

i18n
    .use(initReactI18next) // passes i18n down to react-i18next
    .init({
    resources,
    lng: localStorage.getItem("language") || "cz", // language to use, more information here: https://www.i18next.com/overview/configuration-options#languages-namespaces-resources
    // you can use the i18n.changeLanguage function to change the language manually: https://www.i18next.com/overview/api#changelanguage
    // if you're using a language detector, do not define the lng option

    interpolation: {
    escapeValue: false // react already safes from xss
    }
});

  export default i18n;
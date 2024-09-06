// import the original type declarations
import "i18next";
// import all namespaces (for the default language, only)
import common from "../translations/en/common.json";
import sidebar from "../translations/en/sidebar.json";
import catalogues from "../translations/en/catalogues.json";

declare module "i18next" {
  // Extend CustomTypeOptions
  interface CustomTypeOptions {
    // custom namespace type, if you changed it
    defaultNS: "common";
    // custom resources type
    resources: {
      common: typeof common;
      sidebar: typeof sidebar;
      catalogues: typeof catalogues;
    };
    // other
  }
}
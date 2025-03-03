import i18n from "i18next";
import { initReactI18next } from "react-i18next";
import en from "./locales/en.json";
import vi from "./locales/vi.json";

//lấy ngôn ngữ đã lưu(hoặc mặc định là "en")
const storedLanguage = localStorage.getItem("language") || "en";

i18n.use(initReactI18next).init({
  resources: {
    en: { translation: en },

    vi: { translation: vi },

    lng: storedLanguage, //lấy từ localstorage
    fallbackLgn: "en", //không thì mặc định là english
    interpolation: { escapeValue: false },
  },
});

export default i18n;

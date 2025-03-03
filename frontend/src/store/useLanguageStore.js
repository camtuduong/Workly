import { create } from "zustand";
import i18n from "../i18n";

const useLanguageStore = create((set) => ({
  language: localStorage.getItem("language") || "en",

  setLanguage: async (lang, userId = null) => {
    try {
      //gửi request lên backend để lưu vào database
      if (userId) {
        await fetch("http://localhost:7000/api/users/language", {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ userId, language: lang }),
        });
      }

      //cập nhật localStorage vào i18n
      localStorage.setItem("language", lang);
      i18n.changeLanguage(lang);
      set({ language: lang });

      //
    } catch (error) {
      console.error("Error updating language", error);
    }
  },
}));

export default useLanguageStore;

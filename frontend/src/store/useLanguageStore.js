import { create } from "zustand";
import i18n from "../i18n";

const useLanguageStore = create((set, get) => ({
  language: localStorage.getItem("language") || "en",

  setLanguage: (lang) => {
    if (get().language !== lang) {
      // Chỉ cập nhật nếu khác ngôn ngữ hiện tại
      localStorage.setItem("language", lang);
      i18n.changeLanguage(lang);
      set({ language: lang });
    }
  },

  fetchUserLanguage: async (userId) => {
    try {
      const res = await fetch(
        `http://localhost:7000/api/users/${userId}/language`,
      );
      if (!res.ok) throw new Error("Failed to fetch language");
      const data = await res.json();

      if (data.language && get().language !== data.language) {
        get().setLanguage(data.language); // Tận dụng setLanguage để tối ưu
      }
    } catch (error) {
      console.error("Error fetching user language:", error);
    }
  },
}));

export default useLanguageStore;

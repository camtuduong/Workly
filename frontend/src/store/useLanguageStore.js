import { create } from "zustand";
import i18n from "../i18n";
import debounce from "lodash/debounce";

const useLanguageStore = create((set, get) => ({
  language: localStorage.getItem("language") || "en",
  error: null,
  setLanguage: (newLanguage) => {
    const currentLanguage = get().language;
    if (currentLanguage === newLanguage) {
      return;
    }

    set({ language: newLanguage, error: null });
    try {
      localStorage.setItem("language", newLanguage);
    } catch (error) {
      console.error("Error saving language to localStorage:", error);
      set({ error: "Failed to save language to localStorage" });
    }
    i18n.changeLanguage(newLanguage);
  },
  updateUserLanguage: debounce(async (language) => {
    const currentLanguage = get().language;
    if (currentLanguage === language) {
      return;
    }

    set({ language, error: null });
    try {
      localStorage.setItem("language", language);
    } catch (error) {
      console.error("Error saving language to localStorage:", error);
      set({ error: "Failed to save language to localStorage" });
    }
    i18n.changeLanguage(language);

    try {
      const token = localStorage.getItem("token");
      if (token) {
        const res = await fetch("http://localhost:8000/api/users/language", {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({ language }),
        });

        if (!res.ok) {
          throw new Error("Failed to update language in database");
        }
      }
    } catch (error) {
      console.error("Error updating user language in database:", error);
      set({ error: "Failed to sync language with server" });
    }
  }, 500),
  clearError: () => set({ error: null }),
}));

export default useLanguageStore;

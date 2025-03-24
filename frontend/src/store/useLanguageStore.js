import { create } from "zustand";
import i18n from "../i18n";

const useLanguageStore = create((set, get) => ({
  language: localStorage.getItem("language") || "en",
  setLanguage: (newLanguage) => {
    const currentLanguage = get().language; // Lấy ngôn ngữ hiện tại từ state
    if (currentLanguage === newLanguage) {
      return; // Bỏ qua nếu ngôn ngữ không thay đổi
    }

    set({ language: newLanguage });
    try {
      localStorage.setItem("language", newLanguage); // Lưu vào localStorage
    } catch (error) {
      console.error("Error saving language to localStorage:", error);
    }
    i18n.changeLanguage(newLanguage);
  },
  updateUserLanguage: async (language) => {
    try {
      const token = localStorage.getItem("token");
      const user = JSON.parse(localStorage.getItem("user"));
      if (user && token) {
        await fetch(`http://localhost:8000/api/users/${user.id}/language`, {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({ language }),
        });
        set({ language });
        try {
          localStorage.setItem("language", language);
        } catch (error) {
          console.error("Error saving language to localStorage:", error);
        }
        i18n.changeLanguage(language);
      }
    } catch (error) {
      console.error("Error updating user language:", error);
    }
  },
}));

export default useLanguageStore;

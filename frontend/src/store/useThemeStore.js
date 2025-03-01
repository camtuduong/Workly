import { create } from "zustand";

const getInitialTheme = () => {
  return (
    localStorage.getItem("theme") ??
    (window.matchMedia("(prefers-color-scheme: dark)").matches
      ? "dark"
      : "light")
  );
};

const updateThemeClass = (theme) => {
  document.documentElement.classList.remove("light", "dark");
  document.documentElement.classList.add(theme);
};

const useThemeStore = create((set) => ({
  theme: getInitialTheme(),
  toggleTheme: () =>
    set((state) => {
      const newTheme = state.theme === "light" ? "dark" : "light";
      localStorage.setItem("theme", newTheme);
      updateThemeClass(newTheme);
      return { theme: newTheme };
    }),
}));

updateThemeClass(getInitialTheme()); // Gọi ngay khi ứng dụng tải lần đầu

export default useThemeStore;

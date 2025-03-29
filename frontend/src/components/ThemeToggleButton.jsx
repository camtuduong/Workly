import useThemeStore from "../store/useThemeStore";
import { Moon, Sun } from "lucide-react";

export default function ThemeToggleButton() {
  const { theme, toggleTheme } = useThemeStore();

  return (
    <button
      onClick={toggleTheme}
      className="rounded-xl bg-gray-200 p-2 text-black transition duration-300 hover:bg-gray-300 dark:bg-[#3a2c5a] dark:text-white hover:dark:bg-[#2a1c4a]"
      aria-label="Toggle Theme"
    >
      {theme === "dark" ? <Sun /> : <Moon />}
    </button>
  );
}

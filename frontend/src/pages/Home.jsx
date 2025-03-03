import "../i18n";
import { useTranslation } from "react-i18next";
import LanguageSwitcher from "../components/LanguageSwitcher";
import ThemeToggleButton from "../components/ThemeToggleButton";
import useThemeStore from "../store/useThemeStore";
import { useEffect } from "react";
import useLanguageStore from "../store/useLanguageStore";

export default function Home() {
  const { theme } = useThemeStore();
  const { t } = useTranslation(); //hook để dịch ngôn ngữ
  const { language, setLanguage } = useLanguageStore();

  useEffect(() => {
    //khi load trang, đặt lại ngôn ngữ từ localStorage
    const storedLanguage = localStorage.getItem("language") || "en";
    setLanguage(storedLanguage);
  });

  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-white text-black dark:bg-gray-900 dark:text-white">
      <h1 className="text-3xl font-bold">{t("welcome")}</h1>
      <p className="mt-2">
        Current Theme: <strong>{theme}</strong>
      </p>
      <div className="mt-4">
        <ThemeToggleButton />
      </div>

      <h1>{t("welcome")}</h1>
      <h1>{t("logout")}</h1>

      <LanguageSwitcher />
    </div>
  );
}

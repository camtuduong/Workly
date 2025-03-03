import useLanguageStore from "../store/useLanguageStore";

export default function LanguageSwitcher({ userId }) {
  const { language, setLanguage } = useLanguageStore();

  const changeLanguage = () => {
    const newLang = language === "en" ? "vi" : "en";
    setLanguage(newLang, userId); //gửi userid khi cập nhật
  };

  return (
    <div>
      <button
        onClick={changeLanguage}
        className="rounded bg-blue-500 p-2 text-white"
      >
        {language === "en" ? "🇻🇳 Tiếng Việt" : "🇬🇧 English"}
      </button>
    </div>
  );
}

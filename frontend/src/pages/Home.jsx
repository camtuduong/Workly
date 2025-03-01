import ThemeToggleButton from "../components/ThemeToggleButton";
import useThemeStore from "../store/useThemeStore";

export default function Home() {
  const { theme } = useThemeStore();

  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-white text-black dark:bg-gray-900 dark:text-white">
      <h1 className="text-3xl font-bold">Welcome to Home</h1>
      <p className="mt-2">
        Current Theme: <strong>{theme}</strong>
      </p>
      <div className="mt-4">
        <ThemeToggleButton />
      </div>
    </div>
  );
}

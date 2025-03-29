import React from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { useTranslation } from "react-i18next";
import Navbar from "../components/Navbar";
import useThemeStore from "../store/useThemeStore";

const Home = () => {
  const navigate = useNavigate();
  const { user, loading } = useAuth();
  const { t } = useTranslation();
  const { theme } = useThemeStore();

  if (loading) {
    return (
      <div
        className={`flex min-h-screen items-center justify-center ${
          theme === "dark" ? "bg-[#1E1331]" : "bg-gray-100"
        }`}
      >
        <div className="text-2xl font-bold text-white">{t("Loading...")}</div>
      </div>
    );
  }

  return (
    <div
      className={`min-h-screen ${
        theme === "dark" ? "bg-[#1E1331]" : "bg-gray-100"
      }`}
    >
      <Navbar />

      {/* Hero Section */}
      <div className="mx-auto max-w-6xl px-4 pt-12 md:pt-16">
        <div className="flex flex-col items-center md:flex-row">
          <div
            className={`text-left md:w-1/2 ${theme === "dark" ? "text-white" : "text-gray-800"}`}
          >
            <h1 className="mb-4 text-4xl font-bold md:text-5xl">
              {t("trelloTitle", "Trello helps teams move work forward.")}
            </h1>
            <p
              className={`mb-6 text-lg ${theme === "dark" ? "text-gray-300" : "text-gray-600"}`}
            >
              {t(
                "trelloSubtitle",
                "Collaborate, manage projects, and reach new productivity peaks. From high rises to the home office, the way your team works is unique—accomplish it all with Trello.",
              )}
            </p>

            <div className="mb-8 flex flex-col space-y-3 md:flex-row md:space-y-0 md:space-x-4">
              {user ? (
                <button
                  onClick={() => navigate("/boards")}
                  className={`rounded-lg px-6 py-3 font-semibold text-white transition duration-300 ${
                    theme === "dark"
                      ? "bg-gradient-to-r from-blue-600 to-blue-500 hover:from-blue-500 hover:to-blue-400"
                      : "bg-gradient-to-r from-blue-500 to-blue-400 hover:from-blue-400 hover:to-blue-300"
                  }`}
                >
                  {t("viewBoards", "View Your Boards")}
                </button>
              ) : (
                <>
                  <button
                    onClick={() => navigate("/register")}
                    className={`rounded-lg px-6 py-3 font-semibold text-white transition duration-300 ${
                      theme === "dark"
                        ? "bg-gradient-to-r from-purple-600 to-purple-500 hover:from-purple-500 hover:to-purple-400"
                        : "bg-gradient-to-r from-purple-500 to-purple-400 hover:from-purple-400 hover:to-purple-300"
                    }`}
                  >
                    {t("signUp", "Sign up - it's free!")}
                  </button>
                  <button
                    onClick={() => navigate("/signin")}
                    className={`rounded-lg px-6 py-3 font-semibold transition duration-300 ${
                      theme === "dark"
                        ? "border border-white bg-transparent text-white hover:bg-white hover:text-purple-600"
                        : "border border-purple-500 bg-transparent text-purple-500 hover:bg-purple-500 hover:text-white"
                    }`}
                  >
                    {t("signin", "Sign In")}
                  </button>
                </>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Features Section */}
      <div
        className={`py-16 ${theme === "dark" ? "bg-[#2a1c4a]" : "bg-white"}`}
      >
        <div className="mx-auto max-w-6xl px-4">
          <h2
            className={`mb-12 text-center text-3xl font-bold ${theme === "dark" ? "text-white" : "text-gray-800"}`}
          >
            {t("featuresTitle", "Trello in action")}
          </h2>

          <div className="grid grid-cols-1 gap-8 md:grid-cols-3">
            {/* Feature 1 */}
            <div
              className={`rounded-lg p-6 ${theme === "dark" ? "bg-[#1E1331] text-white" : "bg-gray-100 text-gray-800"}`}
            >
              <div
                className={`mb-4 flex h-12 w-12 items-center justify-center rounded-full ${theme === "dark" ? "bg-blue-600" : "bg-blue-500"}`}
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-6 w-6 text-white"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"
                  />
                </svg>
              </div>
              <h3 className="mb-2 text-xl font-semibold">
                {t("feature1Title", "Project Management")}
              </h3>
              <p
                className={theme === "dark" ? "text-gray-300" : "text-gray-600"}
              >
                {t(
                  "feature1Description",
                  "Keep tasks in order, deadlines on track, and team members aligned with Trello's intuitive boards, lists, and cards.",
                )}
              </p>
            </div>

            {/* Feature 2 */}
            <div
              className={`rounded-lg p-6 ${theme === "dark" ? "bg-[#1E1331] text-white" : "bg-gray-100 text-gray-800"}`}
            >
              <div
                className={`mb-4 flex h-12 w-12 items-center justify-center rounded-full ${theme === "dark" ? "bg-purple-600" : "bg-purple-500"}`}
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-6 w-6 text-white"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"
                  />
                </svg>
              </div>
              <h3 className="mb-2 text-xl font-semibold">
                {t("feature2Title", "Team Collaboration")}
              </h3>
              <p
                className={theme === "dark" ? "text-gray-300" : "text-gray-600"}
              >
                {t(
                  "feature2Description",
                  "Whether it's for work, a side project, or even the next family vacation, Trello helps your team stay organized.",
                )}
              </p>
            </div>

            {/* Feature 3 */}
            <div
              className={`rounded-lg p-6 ${theme === "dark" ? "bg-[#1E1331] text-white" : "bg-gray-100 text-gray-800"}`}
            >
              <div
                className={`mb-4 flex h-12 w-12 items-center justify-center rounded-full ${theme === "dark" ? "bg-green-600" : "bg-green-500"}`}
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-6 w-6 text-white"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M13 10V3L4 14h7v7l9-11h-7z"
                  />
                </svg>
              </div>
              <h3 className="mb-2 text-xl font-semibold">
                {t("feature3Title", "Workflow Automation")}
              </h3>
              <p
                className={theme === "dark" ? "text-gray-300" : "text-gray-600"}
              >
                {t(
                  "feature3Description",
                  "Automate tedious tasks and keep your team moving forward with custom rules, buttons, and integrations.",
                )}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* CTA Section */}
      <div className="py-16">
        <div className="mx-auto max-w-4xl px-4 text-center">
          <h2
            className={`mb-6 text-3xl font-bold ${theme === "dark" ? "text-white" : "text-gray-800"}`}
          >
            {t("ctaTitle", "Ready to start your productivity journey?")}
          </h2>
          <p
            className={`mb-8 text-lg ${theme === "dark" ? "text-gray-300" : "text-gray-600"}`}
          >
            {t(
              "ctaSubtitle",
              "Join millions of users to achieve a new level of organization and collaboration.",
            )}
          </p>
          <button
            onClick={() => navigate(user ? "/boards" : "/signup")}
            className={`rounded-lg px-8 py-4 text-lg font-semibold text-white transition duration-300 ${
              theme === "dark"
                ? "bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-500 hover:to-purple-500"
                : "bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-400 hover:to-purple-400"
            }`}
          >
            {user
              ? t("getStarted", "Go to Your Boards")
              : t("getStarted", "Get Started For Free")}
          </button>
          {!user && (
            <p
              className={`mt-4 text-sm ${theme === "dark" ? "text-gray-400" : "text-gray-500"}`}
            >
              {t("noCardRequired", "No credit card needed. Free forever.")}
            </p>
          )}
        </div>
      </div>
    </div>
  );
};

export default Home;

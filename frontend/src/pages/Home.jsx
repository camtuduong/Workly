import React from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import Navbar from "../components/Navbar";

const Home = () => {
  const navigate = useNavigate();
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <div className="flex h-screen w-full items-center justify-center bg-gradient-to-r from-indigo-50 to-blue-50">
        <div className="flex flex-col items-center">
          <div className="h-12 w-12 animate-spin rounded-full border-4 border-blue-100 border-t-blue-500"></div>
          <p className="mt-4 text-lg font-medium text-gray-700">Loading...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 dark:from-gray-900 dark:via-gray-900 dark:to-black">
      <Navbar />
      <div className="container mx-auto px-4 py-16">
        <div className="flex min-h-screen items-center justify-center">
          <div className="overflow-hidden rounded-2xl bg-white shadow-2xl lg:flex lg:max-w-5xl dark:bg-gray-800">
            {/* Left - Image */}
            <div className="hidden bg-gradient-to-br from-blue-500 to-indigo-600 lg:block lg:w-1/2">
              <div className="flex h-full items-center justify-center p-12">
                <div className="text-center">
                  <div className="mb-6 inline-block rounded-full bg-white/20 p-4">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-12 w-12 text-white"
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
                  <h3 className="text-2xl font-bold text-white">
                    Project Management
                  </h3>
                  <p className="mt-2 text-blue-100">
                    Organize, track, and manage your projects with ease
                  </p>
                </div>
              </div>
            </div>

            {/* Right - Content */}
            <div className="w-full p-8 lg:w-1/2 lg:p-12">
              <div className="text-center lg:text-left">
                <h2 className="text-3xl font-bold text-gray-800 lg:text-4xl dark:text-white">
                  Welcome{" "}
                  <span className="bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
                    {user ? user.username : "Guest"}!
                  </span>
                </h2>

                <p className="mt-4 text-lg text-gray-600 dark:text-gray-300">
                  {user
                    ? "Let's manage your projects with ease and efficiency."
                    : "Sign in to start managing your projects and boost productivity."}
                </p>

                <div className="mt-8">
                  {user ? (
                    <button
                      onClick={() => navigate("/dashboard/boards")}
                      className="w-full transform rounded-xl bg-gradient-to-r from-blue-500 to-indigo-600 px-8 py-4 font-bold text-white shadow-lg transition-all duration-300 hover:-translate-y-1 hover:shadow-xl focus:ring-2 focus:ring-blue-300 focus:ring-offset-2 focus:outline-none lg:w-auto dark:focus:ring-offset-gray-900"
                    >
                      View Your Boards
                    </button>
                  ) : (
                    <button
                      onClick={() => navigate("/signin")}
                      className="w-full transform rounded-xl bg-gradient-to-r from-indigo-500 to-purple-600 px-8 py-4 font-bold text-white shadow-lg transition-all duration-300 hover:-translate-y-1 hover:shadow-xl focus:ring-2 focus:ring-purple-300 focus:ring-offset-2 focus:outline-none lg:w-auto dark:focus:ring-offset-gray-900"
                    >
                      Sign In
                    </button>
                  )}

                  {!user && (
                    <button
                      onClick={() => navigate("/register")}
                      className="mt-4 w-full rounded-xl border-2 border-indigo-500 bg-transparent px-8 py-4 font-bold text-indigo-600 transition-all duration-300 hover:bg-indigo-50 lg:mt-0 lg:ml-4 lg:w-auto dark:border-indigo-400 dark:text-indigo-300 dark:hover:bg-indigo-900"
                    >
                      Create Account
                    </button>
                  )}
                </div>

                {user && (
                  <div className="mt-8 rounded-lg bg-blue-50 p-4 dark:bg-blue-900">
                    <p className="text-sm font-medium text-blue-800 dark:text-blue-200">
                      You have access to all premium features. Enjoy managing
                      your projects!
                    </p>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Home;

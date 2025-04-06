import React from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import Navbar from "../components/Navbar";

const Home = () => {
  const navigate = useNavigate();
  const { user, loading } = useAuth();

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <div className="min-h-screen bg-gray-100">
      <Navbar />
      <div className="flex h-screen items-center justify-center">
        <div className="text-center text-gray-800">
          <h2 className="text-4xl font-bold">
            Welcome {user ? user.username : "Guest"}!
          </h2>
          <p className="mt-2 text-lg text-gray-600">
            {user
              ? "Let's manage your projects with ease!"
              : "Sign in to start managing your projects."}
          </p>
          <div className="mt-6 space-x-4">
            {user ? (
              <button
                onClick={() => navigate("/dashboard/boards")}
                className="rounded-lg bg-gradient-to-r from-blue-500 to-blue-400 p-3 font-semibold text-white hover:from-blue-200"
              >
                View Your Boards
              </button>
            ) : (
              <button
                onClick={() => navigate("/signin")}
                className="rounded-lg bg-gradient-to-r from-purple-500 to-purple-400 p-3 font-semibold text-white hover:from-purple-200"
              >
                Sign In
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Home;

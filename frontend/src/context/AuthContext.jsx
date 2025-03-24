import { createContext, useContext, useState, useEffect } from "react";
import useLanguageStore from "../store/useLanguageStore";
import i18n from "../i18n";

const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const { setLanguage, fetchUserLanguage } = useLanguageStore();

  useEffect(() => {
    const verifyToken = async () => {
      const storedUser = JSON.parse(localStorage.getItem("user"));
      const token = localStorage.getItem("token");

      if (storedUser && token) {
        try {
          const res = await fetch("http://localhost:8000/api/auth/verify", {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          });

          if (!res.ok) {
            throw new Error("Token invalid");
          }

          const data = await res.json();
          // console.log("Verify token response:", data);
          setUser(data.user);
          // fetchUserLanguage(data.user.id);
        } catch (error) {
          console.error("Token verification failed:", error);
          setUser(null);
          localStorage.removeItem("user");
          localStorage.removeItem("token");
        }
      } else {
        const browserLanguage = navigator.language.startsWith("vi")
          ? "vi"
          : "en";
        const initialLanguage =
          localStorage.getItem("language") || browserLanguage;
        setLanguage(initialLanguage);
      }
      setLoading(false);
    };

    verifyToken();
  }, []);

  const login = async (email, password) => {
    try {
      const res = await fetch("http://localhost:8000/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.message || "Login failed");
      }

      const data = await res.json();
      // console.log("Login response:", data);

      if (!data.user || !data.token) {
        throw new Error("Invalid response from server: Missing user or token");
      }

      setUser(data.user);
      localStorage.setItem("user", JSON.stringify(data.user));
      localStorage.setItem("token", data.token);

      fetchUserLanguage(data.user.id);
    } catch (error) {
      console.error("Error logging in:", error.message);
      throw error;
    }
  };

  const register = async (username, email, password, language) => {
    try {
      const res = await fetch("http://localhost:8000/api/users/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username, email, password, language }),
      });

      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.message || "Registration failed");
      }

      const data = await res.json();
      console.log("Register response:", data);
      return data;
    } catch (error) {
      console.error("Error registering user:", error.message);
      throw error;
    }
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem("user");
    localStorage.removeItem("token");
  };

  return (
    <AuthContext.Provider value={{ user, login, register, logout, loading }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}

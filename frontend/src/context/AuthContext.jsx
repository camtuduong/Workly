import { createContext, useContext, useState, useEffect } from "react";
import useLanguageStore from "../store/useLanguageStore";

const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const { setLanguage } = useLanguageStore();

  const updateLanguage = (language) => {
    if (language) {
      setLanguage(language);
    } else {
      setLanguage("en");
    }
  };

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
          setUser(data.user);
          updateLanguage(data.user.language);
        } catch (error) {
          console.error("Token verification failed:", error);
          setUser(null);
          localStorage.removeItem("user");
          localStorage.removeItem("token");
          const browserLanguage = navigator.language.startsWith("vi")
            ? "vi"
            : "en";
          const initialLanguage =
            localStorage.getItem("language") || browserLanguage;
          setLanguage(initialLanguage);
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
  }, [setLanguage]);

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
      setUser(data.user);
      localStorage.setItem("user", JSON.stringify(data.user));
      localStorage.setItem("token", data.token);
      updateLanguage(data.user.language);
    } catch (error) {
      console.error("Error logging in:", error.message);
      throw error;
    }
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem("user");
    localStorage.removeItem("token");
  };

  return (
    <AuthContext.Provider value={{ user, login, logout, loading }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}

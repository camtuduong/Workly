import { createContext, useContext, useState, useEffect } from "react";
import useLanguageStore from "../store/useLanguageStore";

const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const { fetchUserLanguage } = useLanguageStore();

  // Kiểm tra user từ localStorage khi tải trang
  useEffect(() => {
    const storedUser = JSON.parse(localStorage.getItem("user"));
    if (storedUser) {
      setUser(storedUser);
      fetchUserLanguage(storedUser.id); // Lấy ngôn ngữ từ DB khi có user
    }
  }, []);

  // Hàm login
  const login = async (email, password) => {
    try {
      const res = await fetch("http://localhost:7000/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      if (!res.ok) throw new Error("Login failed");
      const data = await res.json();

      setUser(data.user);
      localStorage.setItem("user", JSON.stringify(data.user));

      fetchUserLanguage(data.user.id); // Load ngôn ngữ từ database
    } catch (error) {
      console.error("Error logging in:", error);
    }
  };

  // Hàm logout
  const logout = () => {
    setUser(null);
    localStorage.removeItem("user");
  };

  return (
    <AuthContext.Provider value={{ user, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

// Hook để sử dụng AuthContext
export function useAuth() {
  return useContext(AuthContext);
}

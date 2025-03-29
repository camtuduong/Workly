import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import Dashboard from "./pages/Dashboard";
import Login from "./pages/login/Login";
import Register from "./pages/login/Register";
import { AuthProvider } from "./context/AuthContext";
import Board from "./pages/Board";

const App = () => {
  return (
    <Router>
      <AuthProvider>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/signin" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/board" element={<Board />} />
          <Route path="/board/:id" element={<Board />} />
        </Routes>
      </AuthProvider>
    </Router>
  );
};

export default App;

import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import Dashboard from "./pages/Dashboard";
import Login from "./pages/login/Login";
import Register from "./pages/login/Register";
import { AuthProvider } from "./context/AuthContext";
import Boards from "./pages/Boards";
import Board from "./pages/Board";
import CardDetail from "./pages/CardDetail";
import PrivateRoute from "./components/PrivateRoute";
import DashboardLayout from "./pages/layouts/DashboardLayout";

const App = () => {
  return (
    <Router>
      <AuthProvider>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/signin" element={<Login />} />
          <Route path="/register" element={<Register />} />

          {/* Route cha dùng layout Dashboard */}
          <Route
            path="/dashboard"
            element={
              <PrivateRoute>
                <DashboardLayout />
              </PrivateRoute>
            }
          >
            <Route index element={<Dashboard />} />
            <Route path="boards" element={<Boards />} />
            <Route path="board/:id" element={<Board />} />
            <Route path="card/:id" element={<CardDetail />} />
          </Route>
        </Routes>
      </AuthProvider>
    </Router>
  );
};

export default App;

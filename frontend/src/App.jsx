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

const App = () => {
  return (
    <Router>
      <AuthProvider>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/signin" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route
            path="/dashboard"
            element={
              <PrivateRoute>
                <Dashboard />
              </PrivateRoute>
            }
          />
          <Route
            path="/boards"
            element={
              <PrivateRoute>
                <Boards />
              </PrivateRoute>
            }
          />
          <Route
            path="/board/:id"
            element={
              <PrivateRoute>
                <Board />
              </PrivateRoute>
            }
          />
          <Route
            path="/card/:id"
            element={
              <PrivateRoute>
                <CardDetail />
              </PrivateRoute>
            }
          />
        </Routes>
      </AuthProvider>
    </Router>
  );
};

export default App;

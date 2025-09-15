import './App.css';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Register from './Component/Register';
import Login from './Component/Login';
import StudentDashboard from "./Pages/StudentDashboard";
import TeacherDashboard from './Pages/TeacherDashboard';
import NotFound from "./Pages/PageNotFound";
import Profile from "./Pages/Profile";
import Navbar from './Component/Navbar';
import Logout from "./Component/Logout"
import Newpage from './Pages/Newpage';
import { useEffect, useState } from 'react';
import api from "./Api";

function App() {
  const token = localStorage.getItem("token");
  
  const [user, setUser] = useState<{ role?: string }>({});
  
  useEffect(() => {
    if (!token) return;

    const fetchUser = async () => {
      try {
        const res = await api.get('/auth/user');  
        setUser(res.data.user);
      } catch (error) {
        console.error("Error fetching user", error);
      
      }
    };
    fetchUser();
  }, [token]);

  const getDashboardComponent = () => {
    if (user.role === "student") return <StudentDashboard />;
    if (user.role === "teacher") return <TeacherDashboard />;
    return <Navigate to="/" />;
  };
  return (
    <Router>
      <Navbar />
      <Routes>
        <Route path="/" element={token? <Navigate to="/dashboard" /> : <Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/newpage" element={<Newpage />} />
        <Route path="/dashboard" element={token? getDashboardComponent() : <Navigate to="/" />} />
        <Route path="/profile" element={token ? <Profile /> : <Navigate to="/" />} />
        <Route path="/logout" element={token ? <Logout /> : <Navigate to="/" />} />
        <Route path="*" element={<NotFound />} />
      </Routes>
    </Router>
  );
}

export default App;

import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom";
import Navbar from "./components/Navbar";
import Home from "./pages/Home";
import Jobs from "./pages/Jobs";
import JobDetails from "./pages/JobDetails";
import JobApplication from "./pages/JobApplication";
import MyApplications from "./pages/MyApplications";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Dashboard from "./pages/Dashboard";
import Profile from "./pages/Profile";
import "./App.css";

function App() {
  return (
    <BrowserRouter><Navbar /><main><Routes>
      <Route path="/" element={<Home />} /><Route path="/jobs" element={<Jobs />} />
      <Route path="/jobs/:id" element={<JobDetails />} /><Route path="/apply/:id" element={<JobApplication />} />
      <Route path="/applications" element={<MyApplications />} /><Route path="/dashboard" element={<Dashboard />} />
      <Route path="/profile" element={<Profile />} /><Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} /><Route path="*" element={<Navigate to="/" replace />} />
    </Routes></main></BrowserRouter>
  );
}

export default App;

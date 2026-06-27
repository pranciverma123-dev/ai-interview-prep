import { BrowserRouter, Routes, Route } from "react-router-dom";

import Home from "./components/Home";
import Signup from "./components/Signup";
import Login from "./components/Login";
import ResetPassword from "./components/ResetPassword";
import CreateInterview from "./pages/CreateInterview";
import InterviewPage from "./pages/InterviewPage";
import InterviewDetails from "./pages/InterviewDetails";
import VerifyOTP from "./components/VerifyOTP";
import History from "./pages/History";
import ResumeGenerator from "./pages/ResumeGenerator";
import ForgotPassword from "./components/ForgotPassword";
import CreateInter from "./pages/Cinterview";
import Skills from "./pages/Skills";
import DSA from "./pages/DSA";
import Profile from "./components/Profile";
function App() {
  return (
    <BrowserRouter>
      <Routes>

        {/* HOME */}
        <Route path="/" element={<Home />} />
        <Route path="/profile" element={<Profile />} />
        {/* AUTH */}
        <Route path="/signup" element={<Signup />} />
        <Route path="/login" element={<Login />} />
       <Route path="/forgot-password" element={<ForgotPassword />} />
        {/* MAIN FEATURES */}
        <Route path="/dsa" element={<DSA />} />
        <Route path="/resume" element={<ResumeGenerator />} />
        <Route path="/cinterview" element={<CreateInter />} />
        <Route path="/skills" element={<Skills />} />
        <Route path="/verify-otp" element={<VerifyOTP />} />
        {/* INTERVIEW FLOW */}
        <Route path="/create" element={<CreateInterview />} />
        <Route path="/interview/:id" element={<InterviewPage />} />
        <Route path="/details/:id" element={<InterviewDetails />} />
        <Route path="/history" element={<History />} />
        <Route path="/reset-password" element={<ResetPassword />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;

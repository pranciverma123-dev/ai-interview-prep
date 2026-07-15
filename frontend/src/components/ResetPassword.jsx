import { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";

function ResetPassword() {
  const navigate = useNavigate();
  const location = useLocation();

  const email = location.state?.email || "";
  const otp = location.state?.otp || "";

  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const resetPassword = async (e) => {
    e.preventDefault();

    if (!email || !otp) {
      alert("Session expired. Please verify OTP again.");
      navigate("/forgot-password");
      return;
    }

    if (!newPassword || !confirmPassword) {
      alert("Please fill all fields.");
      return;
    }

    if (newPassword !== confirmPassword) {
      alert("Passwords do not match.");
      return;
    }

    if (newPassword.length < 6) {
      alert("Password must be at least 6 characters.");
      return;
    }

    try {
      setLoading(true);

      const res = await fetch(
        "https://ai-interview-prep-ffjr.onrender.com/user/reset-password",
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            email,
            otp,
            newPassword,
          }),
        }
      );

      const data = await res.json();

      if (!res.ok) {
        alert(data.message || "Password reset failed.");
        return;
      }

      alert("Password reset successfully!");

      navigate("/login");

    } catch (err) {
      console.log(err);
      alert("Server Error");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-black px-4">

      <div className="w-full max-w-md bg-[#111] border border-orange-500/30 rounded-3xl p-8 shadow-xl">

        <h1 className="text-3xl font-bold text-center text-white">
          Reset <span className="text-orange-500">Password</span>
        </h1>

        <p className="text-center text-gray-400 mt-2 mb-6">
          Create your new password
        </p>

        <form onSubmit={resetPassword}>

          <input
            type="password"
            placeholder="New Password"
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
            className="w-full p-3 rounded-xl bg-black border border-orange-500/30 text-white outline-none focus:border-orange-500 mb-4"
          />

          <input
            type="password"
            placeholder="Confirm Password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            className="w-full p-3 rounded-xl bg-black border border-orange-500/30 text-white outline-none focus:border-orange-500"
          />

          <button
            type="submit"
            disabled={loading}
            className="w-full mt-6 bg-orange-500 hover:bg-orange-600 py-3 rounded-xl font-semibold transition"
          >
            {loading ? "Resetting..." : "Reset Password"}
          </button>

        </form>

        <button
          onClick={() => navigate("/login")}
          className="w-full mt-4 text-orange-400 hover:underline"
        >
          Back to Login
        </button>

      </div>

    </div>
  );
}

export default ResetPassword;
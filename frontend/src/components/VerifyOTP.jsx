import { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";

function VerifyOTP() {
  const navigate = useNavigate();
  const location = useLocation();

  const email = location.state?.email || "";

  const [otp, setOtp] = useState("");
  const [loading, setLoading] = useState(false);

  const verifyOTP = async (e) => {
    e.preventDefault();

    if (!email) {
      alert("Email not found. Please try again.");
      navigate("/forgot-password");
      return;
    }

    if (!otp) {
      alert("Please enter OTP");
      return;
    }

    try {
      setLoading(true);

      const res = await fetch(
        "https://ai-interview-prep-ffjr.onrender.com/user/verify-otp",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            email,
            otp,
          }),
        }
      );

      const data = await res.json();

      if (!res.ok) {
        alert(data.message);
        return;
      }

      alert("OTP Verified Successfully");

      navigate("/reset-password", {
        state: {
          email,
          otp,
        },
      });

    } catch (err) {
      console.log(err);
      alert("Server Error");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-black px-4">

      <div className="w-full max-w-md bg-[#111] rounded-3xl p-8 border border-orange-500/30 shadow-xl">

        <h1 className="text-3xl font-bold text-center text-white">
          Verify <span className="text-orange-500">OTP</span>
        </h1>

        <p className="text-gray-400 text-center mt-2">
          Enter the 6-digit OTP sent to
        </p>

        <p className="text-orange-400 text-center mb-6">
          {email}
        </p>

        <form onSubmit={verifyOTP}>

          <input
            type="text"
            maxLength={6}
            placeholder="Enter OTP"
            value={otp}
            onChange={(e) => setOtp(e.target.value)}
            className="w-full p-3 rounded-xl bg-black border border-orange-500/30 text-white outline-none focus:border-orange-500 text-center tracking-[8px] text-xl"
          />

          <button
            type="submit"
            disabled={loading}
            className="w-full mt-6 bg-orange-500 hover:bg-orange-600 py-3 rounded-xl font-semibold transition"
          >
            {loading ? "Verifying..." : "Verify OTP"}
          </button>

        </form>

        <button
          onClick={() => navigate("/forgot-password")}
          className="w-full mt-4 text-orange-400 hover:underline"
        >
          Back
        </button>

      </div>

    </div>
  );
}

export default VerifyOTP;
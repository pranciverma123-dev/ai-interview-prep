import { useState } from "react";
import { useNavigate } from "react-router-dom";

function ForgotPassword() {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();

    setLoading(true);
    setMessage("");
    setError("");

    try {
    const res = await fetch(
  "http://localhost:8000/user/forgot-password",
  {
    method: "POST",   
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      email,
 
    }),
  }
);

      const data = await res.json();

     if (data.success) {

  alert(`Your OTP is: ${data.otp}`);

  setMessage(data.message);

  setTimeout(() => {
    navigate("/verify-otp", {
      state: {
        email,
      },
    });
  }, 1000);

} else {
  setError(data.message);
}
    } catch (err) {
      console.log(err);
      setError("Something went wrong.");
    }

    setLoading(false);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-black px-4">
      <div className="w-full max-w-md bg-gray-900 rounded-xl shadow-lg p-8">

        <h2 className="text-3xl font-bold text-center text-orange-500">
          Forgot Password
        </h2>

        <p className="text-gray-400 text-center mt-2">
          Enter your registered email to receive an OTP.
        </p>

        {message && (
          <div className="mt-4 bg-green-600 text-white p-3 rounded">
            {message}
          </div>
        )}

        {error && (
          <div className="mt-4 bg-red-600 text-white p-3 rounded">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="mt-6">

          <label className="text-gray-300">
            Email Address
          </label>

          <input
            type="email"
            required
            placeholder="Enter Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full mt-2 p-3 rounded bg-gray-800 text-white border border-gray-700 focus:border-orange-500 outline-none"
          />

          <button
            type="submit"
            disabled={loading}
            className="w-full mt-6 bg-orange-500 hover:bg-orange-600 transition-all py-3 rounded font-semibold"
          >
            {loading ? "Sending OTP..." : "Send OTP"}
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

export default ForgotPassword;
import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";

function Login() {
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  // ================= LOGIN =================
  const login = async () => {
    if (!email || !password) {
      alert("Please fill all fields");
      return;
    }

    try {
      setLoading(true);

      const res = await fetch("https://ai-interview-prep-ffjr.onrender.com/user/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({
          email: email.trim(),
          password,
        }),
      });

      const data = await res.json();

    if (!res.ok) {
  alert(data?.message || "Login failed");
  return;
}

// ================= AUTH SAVE =================
localStorage.setItem("isLoggedIn", "true");
localStorage.setItem("token", data.token);
localStorage.setItem("user", JSON.stringify(data.user || {}));

navigate("/");

    } catch (err) {
      console.error("Login error:", err);
      alert("Server error. Try again later.");
    } finally {
      setLoading(false);
    }
  };

  // ================= ENTER KEY SUPPORT =================
  const handleKeyDown = (e) => {
    if (e.key === "Enter") {
      login();
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center px-4 bg-black text-white relative overflow-hidden">

      {/* Glow */}
      <div className="absolute w-[500px] h-[500px] bg-orange-500/20 blur-3xl rounded-full -top-40 -left-40"></div>
      <div className="absolute w-[500px] h-[500px] bg-fuchsia-600/20 blur-3xl rounded-full -bottom-40 -right-40"></div>

      {/* CARD */}
      <div
        onKeyDown={handleKeyDown}
        className="w-full max-w-md p-8 rounded-3xl bg-[#0f0f0f] border border-orange-500/30 shadow-2xl shadow-orange-500/20"
      >

        {/* TITLE */}
        <h1 className="text-4xl font-black text-center">
          Welcome <span className="text-orange-500">Back</span>
        </h1>

        <p className="text-center text-gray-400 text-sm mt-2 mb-6">
          Login to continue Interview AI
        </p>

        {/* EMAIL */}
        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="w-full mb-4 px-4 py-3 rounded-xl bg-black/60 border border-orange-500/30 outline-none focus:border-orange-500"
        />

        {/* PASSWORD */}
        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="w-full mb-6 px-4 py-3 rounded-xl bg-black/60 border border-orange-500/30 outline-none focus:border-orange-500"
        />

        {/* BUTTON */}
        <button
          onClick={login}
          disabled={loading}
          className={`w-full py-3 rounded-xl font-semibold transition ${
            loading
              ? "bg-gray-600 cursor-not-allowed"
              : "bg-orange-500 hover:bg-orange-600"
          }`}
        >
          {loading ? "Signing In..." : "Login"}
        </button>

        {/* LINKS */}
   <p className="text-center text-sm mt-5 text-gray-400">
  Forgot Password?{" "}
  <Link
    to="/forgot-password"
    className="text-orange-500 hover:text-orange-400 font-semibold"
  >
    Reset Here
  </Link>
</p>

        <p className="text-center text-sm mt-3 text-gray-400">
          Don't have an account?{" "}
          <span
            onClick={() => navigate("/signup")}
            className="text-orange-500 cursor-pointer"
          >
            Signup
          </span>
        </p>

      </div>
    </div>
  );
}

export default Login;
// import { useState } from "react";
// import { useNavigate } from "react-router-dom";

// function Login() {
//   const navigate = useNavigate();

//   const [email, setEmail] = useState("");
//   const [password, setPassword] = useState("");
//   const [loading, setLoading] = useState(false);

//   const login = async () => {
//     if (!email || !password) {
//       return alert("Please fill all fields");
//     }

//     try {
//       setLoading(true);

//       const res = await fetch(
//         "http://localhost:8000/user/login",
//         {
//           method: "POST",
//           headers: {
//             "Content-Type": "application/json",
//           },
//           credentials: "include",
//           body: JSON.stringify({
//             email,
//             password,
//           }),
//         }
//       );

//       const data = await res.json();

//      if (res.ok) {
//   localStorage.setItem(
//     "isLoggedIn",
//     "true"
//   );

//   navigate("/");
// } else {
//         alert(data.message || "Login Failed");
//       }
//     } catch (err) {
//       console.log(err);
//       alert("Server Error");
//     } finally {
//       setLoading(false);
//     }
//   };

//   return (
//     <div className="min-h-screen flex items-center justify-center bg-[#050505] px-4 relative overflow-hidden">

//       {/* Background Glow */}
//       <div className="absolute w-[500px] h-[500px] bg-fuchsia-600/20 blur-3xl rounded-full -top-40 -left-40 animate-pulse"></div>

//       <div className="absolute w-[500px] h-[500px] bg-orange-500/20 blur-3xl rounded-full -bottom-40 -right-40 animate-pulse"></div>

//       <div className="absolute w-[300px] h-[300px] bg-emerald-500/10 blur-3xl rounded-full top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2"></div>

//       <div className="relative w-full max-w-md">

//         <div
//           className="
//           bg-white/[0.03]
//           backdrop-blur-2xl
//           border border-white/10
//           rounded-3xl
//           p-8
//           shadow-[0_0_80px_rgba(168,85,247,0.15)]
//           hover:shadow-[0_0_100px_rgba(249,115,22,0.2)]
//           transition-all duration-700
//         "
//         >
//           <div className="text-center mb-8">
//             <h1 className="text-4xl font-black text-white">
//               Welcome Back
//             </h1>

//             <p className="text-zinc-400 mt-2">
//               Login to continue your AI Interview Journey
//             </p>
//           </div>

//           <div className="space-y-4">

//             <input
//               type="email"
//               placeholder="Email Address"
//               value={email}
//               onChange={(e) =>
//                 setEmail(e.target.value)
//               }
//               className="
//               w-full
//               bg-black/40
//               border border-white/10
//               text-white
//               px-4 py-3
//               rounded-xl
//               outline-none
//               transition-all duration-300
//               focus:border-fuchsia-500
//               focus:shadow-[0_0_20px_rgba(168,85,247,0.3)]
//             "
//             />

//             <input
//               type="password"
//               placeholder="Password"
//               value={password}
//               onChange={(e) =>
//                 setPassword(e.target.value)
//               }
//               className="
//               w-full
//               bg-black/40
//               border border-white/10
//               text-white
//               px-4 py-3
//               rounded-xl
//               outline-none
//               transition-all duration-300
//               focus:border-fuchsia-500
//               focus:shadow-[0_0_20px_rgba(168,85,247,0.3)]
//             "
//             />

//             <button
//               onClick={login}
//               disabled={loading}
//               className="
//               w-full
//               py-3
//               rounded-xl
//               font-semibold
//               text-white
//               bg-gradient-to-r
//               from-fuchsia-600
//               via-purple-600
//               to-orange-500
//               hover:scale-[1.03]
//               hover:shadow-[0_0_30px_rgba(249,115,22,0.4)]
//               transition-all
//               duration-300
//               disabled:opacity-50
//             "
//             >
//               {loading
//                 ? "Signing In..."
//                 : "Login"}
//             </button>

//           </div>

//           <div className="mt-5 text-center">
//             <span
//               onClick={() =>
//                 navigate("/reset-password")
//               }
//               className="
//               text-fuchsia-400
//               hover:text-orange-400
//               cursor-pointer
//               transition-colors
//             "
//             >
//               Forgot Password?
//             </span>
//           </div>

//           <div className="mt-4 text-center text-zinc-400">
//             Don't have an account?

//             <span
//               onClick={() => navigate("/")}
//               className="
//               ml-2
//               text-fuchsia-400
//               hover:text-orange-400
//               cursor-pointer
//               font-medium
//               transition-colors
//             "
//             >
//               Signup
//             </span>
//           </div>

//         </div>

//       </div>
//     </div>
//   );
// }

// export default Login;
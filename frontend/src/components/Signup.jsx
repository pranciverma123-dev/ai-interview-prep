import { useState } from "react";
import { useNavigate } from "react-router-dom";

function Signup() {
  const navigate = useNavigate();

  const [firstname, setFirstname] = useState("");
  const [lastname, setLastname] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  // ================= SIGNUP =================
  const signup = async () => {
    if (!firstname || !lastname || !email || !password) {
      alert("Please fill all fields");
      return;
    }

    try {
      setLoading(true);

      const res = await fetch("https://ai-interview-prep-ffjr.onrender.com/user/signup", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          firstname: firstname.trim(),
          lastname: lastname.trim(),
          email: email.trim(),
          password,
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        alert(data?.message || "Signup failed");
        return;
      }

      // ================= AUTH SAVE =================
      localStorage.setItem("isLoggedIn", "true");

      // (optional future use)
      localStorage.setItem("user", JSON.stringify(data.user || {}));

      navigate("/");

    } catch (err) {
      console.error("Signup error:", err);
      alert("Server error. Try again later.");
    } finally {
      setLoading(false);
    }
  };

  // ================= ENTER KEY SUPPORT =================
  const handleKeyDown = (e) => {
    if (e.key === "Enter") {
      signup();
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center px-4 bg-[#050505] text-white relative overflow-hidden">

      {/* Glow */}
      <div className="absolute w-[500px] h-[500px] bg-orange-500/20 blur-3xl rounded-full -top-40 -left-40"></div>
      <div className="absolute w-[500px] h-[500px] bg-fuchsia-600/20 blur-3xl rounded-full -bottom-40 -right-40"></div>

      {/* CARD */}
      <div
        onKeyDown={handleKeyDown}
        className="relative w-full max-w-md p-8 rounded-3xl backdrop-blur-2xl border border-white/10 bg-white/5"
      >

        <h1 className="text-4xl font-black text-center">
          Interview<span className="text-orange-500">AI</span>
        </h1>

        <p className="text-center text-gray-400 text-sm mt-2 mb-6">
          Create your account to start AI interviews
        </p>

        {/* INPUTS */}
        <input
          value={firstname}
          onChange={(e) => setFirstname(e.target.value)}
          placeholder="First Name"
          className="w-full mb-4 px-4 py-3 rounded-xl bg-black/30 border border-orange-400/30 outline-none"
        />

        <input
          value={lastname}
          onChange={(e) => setLastname(e.target.value)}
          placeholder="Last Name"
          className="w-full mb-4 px-4 py-3 rounded-xl bg-black/30 border border-orange-400/30 outline-none"
        />

        <input
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="Email"
          className="w-full mb-4 px-4 py-3 rounded-xl bg-black/30 border border-orange-400/30 outline-none"
        />

        <input
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder="Password"
          className="w-full mb-6 px-4 py-3 rounded-xl bg-black/30 border border-orange-400/30 outline-none"
        />

        {/* BUTTON */}
        <button
          onClick={signup}
          disabled={loading}
          className={`w-full py-3 rounded-xl font-semibold transition ${
            loading
              ? "bg-gray-600 cursor-not-allowed"
              : "bg-orange-500 hover:bg-orange-600"
          }`}
        >
          {loading ? "Creating Account..." : "Create Account"}
        </button>

        <p className="text-center text-sm mt-4 text-gray-400">
          Already have an account?{" "}
          <span
            onClick={() => navigate("/login")}
            className="text-orange-500 cursor-pointer"
          >
            Login
          </span>
        </p>

      </div>
    </div>
  );
}

export default Signup;

// import { useState } from "react";
// import { useNavigate } from "react-router-dom";

// function Signup() {
//   const navigate = useNavigate();

//   const [firstname, setFirstname] = useState("");
//   const [lastname, setLastname] = useState("");
//   const [email, setEmail] = useState("");
//   const [password, setPassword] = useState("");
//   const [loading, setLoading] = useState(false);

//   const signup = async () => {
//     if (!firstname || !lastname || !email || !password) {
//       return alert("Please fill all fields");
//     }

//     try {
//       setLoading(true);

//       const res = await fetch(
//         "http://localhost:8000/user/signup",
//         {
//           method: "POST",
//           headers: {
//             "Content-Type": "application/json",
//           },
//           body: JSON.stringify({
//             firstname,
//             lastname,
//             email,
//             password,
//           }),
//         }
//       );

//       const data = await res.json();

//  if (res.ok) {
//   localStorage.setItem(
//     "isLoggedIn",
//     "true"
//   );

//   navigate("/");
// }
//       else {
//         alert(data.message || "Signup Failed");
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

//       {/* Background Effects */}
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
//             <h1 className="text-4xl font-black text-white tracking-tight">
//               Join InterviewAI
//             </h1>

//             <p className="text-zinc-400 mt-2">
//               Practice Interviews • ATS • DSA • Code Runner
//             </p>
//           </div>

//           <div className="space-y-4">

//             <input
//               type="text"
//               placeholder="First Name"
//               value={firstname}
//               onChange={(e) =>
//                 setFirstname(e.target.value)
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
//               type="text"
//               placeholder="Last Name"
//               value={lastname}
//               onChange={(e) =>
//                 setLastname(e.target.value)
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
//               onClick={signup}
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
//                 ? "Creating Account..."
//                 : "Create Account"}
//             </button>

//           </div>

//           <div className="text-center mt-6 text-zinc-400">
//             Already have an account?

//             <span
//               onClick={() => navigate("/login")}
//               className="
//               ml-2
//               text-fuchsia-400
//               cursor-pointer
//               hover:text-orange-400
//               transition-colors
//             "
//             >
//               Login
//             </span>
//           </div>

//         </div>

//       </div>
//     </div>
//   );
// }

// export default Signup;
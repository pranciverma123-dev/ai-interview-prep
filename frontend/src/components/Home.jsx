import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import WhySection from "../WhySection";

function Home() {
  const navigate = useNavigate();
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  // ================= AUTH CHECK =================
  useEffect(() => {
    const auth = localStorage.getItem("isLoggedIn") === "true";
    setIsLoggedIn(auth);
  }, []);

  const handleNavigation = (path) => {
    if (!isLoggedIn) {
      navigate("/login");
      return;
    }
    navigate(path);
  };

  const handleLogout = () => {
    localStorage.removeItem("isLoggedIn");
    setIsLoggedIn(false);
    navigate("/login");
  };

  // ================= FEATURES =================
  const features = [
    {
      title: "AI Interview",
      desc: "Practice real AI-based mock interviews",
      path: "/create",
      img: "https://cdn-icons-png.flaticon.com/512/4712/4712035.png",
    },
    {
      title: "DSA Arena",
      desc: "Solve coding problems with AI hints",
      path: "/dsa",
      img: "https://cdn-icons-png.flaticon.com/512/6062/6062646.png",
    },
    {
      title: "Skills Analyzer",
      desc: "Analyze skills for any job role",
      path: "/skills",
      img: "https://cdn-icons-png.flaticon.com/512/3135/3135715.png",
    },
    {
      title: "Build Resume",
      desc: "AI-powered resume generator",
      path: "/resume",
      img: "https://cdn-icons-png.flaticon.com/512/3135/3135715.png",
    },
    {
      title: "History",
      desc: "Track your interview performance",
      path: "/history",
      img: "https://cdn-icons-png.flaticon.com/512/2092/2092663.png",
    },
  ];

  return (
    <div className="min-h-screen bg-[#050505] text-white">

      {/* ================= NAVBAR ================= */}
      <nav className="flex justify-between px-10 py-6 border-b border-white/10 bg-black/40 backdrop-blur-xl">

        <h1 className="text-3xl font-black cursor-pointer"
          onClick={() => navigate("/")}>
          AI Interview <span className="text-orange-500">Prep</span>
        </h1>

        <div className="flex gap-4 items-center">

          {!isLoggedIn ? (
            <>
              <button
                onClick={() => navigate("/login")}
                className="hover:text-orange-400"
              >
                Login
              </button>

              <button
                onClick={() => navigate("/signup")}
                className="bg-orange-500 px-4 py-2 rounded-xl hover:bg-orange-600 transition"
              >
                Get Started
              </button>
            </>
          ) : (
            <button
              onClick={handleLogout}
              className="bg-red-500 px-4 py-2 rounded-xl hover:bg-red-600 transition"
            >
              Logout
            </button>
          )}

        </div>
      </nav>

      {/* ================= HERO ================= */}
      <section className="text-center py-20 px-4">

        <img
          src="https://cdn.dribbble.com/users/1162077/screenshots/3848914/programmer.gif"
          className="w-72 mx-auto mb-6"
          alt="hero"
        />

        <h1 className="text-5xl font-black">
          Crack Interviews with <br />
          <span className="text-orange-500">AI Intelligence</span>
        </h1>

        <p className="text-zinc-400 mt-4 max-w-2xl mx-auto">
          All-in-one AI platform for interviews, DSA practice, skill analysis and career tracking.
        </p>

        <button
          onClick={() => handleNavigation("/create")}
          className="mt-6 bg-orange-500 px-6 py-3 rounded-xl hover:bg-orange-600 transition"
        >
          Start Now
        </button>

      </section>

      {/* ================= FEATURES ================= */}
      <section className="px-10 py-16">

        <h2 className="text-3xl font-bold text-center mb-10">
          Explore Features
        </h2>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">

          {features.map((item) => (
            <div
              key={item.title}
              onClick={() => handleNavigation(item.path)}
              className="cursor-pointer bg-white/5 border border-white/10 rounded-2xl p-6 hover:scale-105 transition"
            >
              <img src={item.img} className="w-16 h-16 mb-4" alt={item.title} />

              <h2 className="text-xl font-bold">{item.title}</h2>
              <p className="text-sm text-zinc-400 mt-2">{item.desc}</p>

              <p className="text-orange-400 mt-4 text-sm">Open →</p>
            </div>
          ))}

        </div>
      </section>

      {/* ================= WHY SECTION ================= */}
      <WhySection />

    </div>
  );
}

export default Home;


// import { useNavigate } from "react-router-dom";
// import { useEffect, useState } from "react";
// import WhySection from "../WhySection";
// function Home() {
//   const navigate = useNavigate();

//   const [isLoggedIn, setIsLoggedIn] = useState(false);

//   useEffect(() => {
//     setIsLoggedIn(localStorage.getItem("isLoggedIn") === "true");
//   }, []);

//   const handleAccess = (path) => {
//     if (!isLoggedIn) return navigate("/login");
//     navigate(path);
//   };

//   const features = [
//     {
//       title: "AI Interview",
//       desc: "Practice real AI-based mock interviews",
//       path: "/create",
//       img: "https://cdn-icons-png.flaticon.com/512/4712/4712035.png",
//     },
//     {
//       title: "DSA Arena",
//       desc: "Solve coding problems with AI hints",
//       path: "/dsa",
//       img: "https://cdn-icons-png.flaticon.com/512/6062/6062646.png",
//     },
//     {
//       title: "Skills Analyzer",
//       desc: "Analyze skills for any job role",
//       path: "/skills",
//       img: "https://cdn-icons-png.flaticon.com/512/3135/3135715.png",
//     },
//      {
//       title: "Build Resume",
//       desc: "Build Resume based on your role and skills",
//       path: "/resume",
//       img: "https://cdn-icons-png.flaticon.com/512/3135/3135715.png",
//     },
//     {
//       title: "History",
//       desc: "Track your interview performance",
//       path: "/history",
//       img: "https://cdn-icons-png.flaticon.com/512/2092/2092663.png",
//     },
//   ];

//   return (
//     <div className="min-h-screen bg-[#050505] text-white">

//       {/* NAVBAR */}
//       {/* <nav className="flex justify-between px-10 py-6 border-b border-white/10 bg-black/40 backdrop-blur-xl">

//         <h1 className="text-3xl font-black">
//           AI Interview <span className="text-orange-500">Prep</span>
//         </h1>

//         <div className="flex gap-4 items-center">

//           <button onClick={() => navigate("/login")}>
//             Login
//           </button>

//           <button
//             onClick={() => navigate("/signup")}
//             className="bg-orange-500 px-4 py-2 rounded-xl"
//           >
//             Get Started
//           </button>

//         </div>
//       </nav> */}
//       <nav className="flex justify-between px-10 py-6 border-b border-white/10 bg-black/40 backdrop-blur-xl">

//   <h1 className="text-3xl font-black">
//     AI Interview <span className="text-orange-500">Prep</span>
//   </h1>

//   <div className="flex gap-4 items-center">

//     {!isLoggedIn ? (
//       <>
//         <button onClick={() => navigate("/login")}>
//           Login
//         </button>

//         <button
//           onClick={() => navigate("/signup")}
//           className="bg-orange-500 px-4 py-2 rounded-xl"
//         >
//           Get Started
//         </button>
//       </>
//     ) : (
//       <button
//         onClick={() => {
//           localStorage.removeItem("isLoggedIn");
//           setIsLoggedIn(false);
//           navigate("/login");
//         }}
//         className="bg-red-500 px-4 py-2 rounded-xl hover:bg-red-600 transition"
//       >
//         Logout
//       </button>
//     )}

//   </div>
// </nav>

//       {/* HERO */}
//       <section className="text-center py-20 px-4">

//         <img
//           src="https://cdn.dribbble.com/users/1162077/screenshots/3848914/programmer.gif"
//           className="w-72 mx-auto mb-6"
//         />

//         <h1 className="text-5xl font-black">
//           Crack Interviews with <br />
//           <span className="text-orange-500">AI Intelligence</span>
//         </h1>

//         <p className="text-zinc-400 mt-4 max-w-2xl mx-auto">
//           All-in-one AI platform for interviews, DSA practice, skill analysis and career tracking.
//         </p>

//         <button
//           onClick={() => navigate("/create")}
//           className="mt-6 bg-orange-500 px-6 py-3 rounded-xl"
//         >
//           Start Now
//         </button>

//       </section>

//       {/* FEATURES */}
//       <section className="px-10 py-16">

//         <h2 className="text-3xl font-bold text-center mb-10">
//           Explore Features
//         </h2>

//         <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">

//           {features.map((item) => (
//             <div
//               key={item.title}
//               onClick={() => handleAccess(item.path)}
//               className="cursor-pointer bg-white/5 border border-white/10 rounded-2xl p-6 hover:scale-105 transition"
//             >
//               <img src={item.img} className="w-16 h-16 mb-4" />

//               <h2 className="text-xl font-bold">{item.title}</h2>
//               <p className="text-sm text-zinc-400 mt-2">{item.desc}</p>

//               <p className="text-orange-400 mt-4 text-sm">Open →</p>
//             </div>
//           ))}

//         </div>
//       </section>

//       {/* WHY SECTION
//       <section className="px-10 py-20">

//         <h2 className="text-3xl font-bold text-center mb-4">
//           Why Choose <span className="text-orange-500">AI Interview Prep?</span>
//         </h2>

//         <p className="text-center text-zinc-400 max-w-2xl mx-auto mb-12">
//           A complete AI-powered placement preparation system designed to make you interview-ready faster, smarter, and more confidently.
//         </p>

//         <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">

//           <div className="bg-white/5 border border-white/10 p-6 rounded-2xl">
//             🎯 Real Interview Simulation
//           </div>

//           <div className="bg-white/5 border border-white/10 p-6 rounded-2xl">
//             🧠 AI Feedback System
//           </div>

//           <div className="bg-white/5 border border-white/10 p-6 rounded-2xl">
//             💻 DSA Practice with AI Help
//           </div>

//           <div className="bg-white/5 border border-white/10 p-6 rounded-2xl">
//             📄 ATS Resume Scoring
//           </div>

//           <div className="bg-white/5 border border-white/10 p-6 rounded-2xl">
//             📊 Skill Gap Analysis
//           </div>

//           <div className="bg-white/5 border border-white/10 p-6 rounded-2xl">
//              Placement Ready System
//           </div>

//         </div>
//       </section> */}
//       <WhySection/>

//     </div>
//   );
// }

// export default Home;

// import { useNavigate } from "react-router-dom";
// import { useEffect, useState } from "react";

// function Home() {
//   const navigate = useNavigate();
//   const [isLoggedIn, setIsLoggedIn] = useState(false);

//   useEffect(() => {
//     setIsLoggedIn(localStorage.getItem("isLoggedIn") === "true");
//   }, []);

//   const handleAccess = (path) => {
//     if (!isLoggedIn) return navigate("/login");
//     navigate(path);
//   };

//   const features = [
//     {
//       title: "AI Interview",
//       desc: "Practice real AI-based mock interviews",
//       path: "/create",
//       img: "https://cdn-icons-png.flaticon.com/512/4712/4712035.png",
//     },
//     {
//       title: "DSA Arena",
//       desc: "Solve coding problems with AI hints",
//       path: "/dsa",
//       img: "https://cdn-icons-png.flaticon.com/512/6062/6062646.png",
//     },
//     {
//       title: "Skills Analyzer",
//       desc: "Analyze skills for any job role",
//       path: "/skills",
//       img: "https://cdn-icons-png.flaticon.com/512/3135/3135715.png",
//     },
//     {
//       title: "History",
//       desc: "Track your interview performance",
//       path: "/history",
//       img: "https://cdn-icons-png.flaticon.com/512/2092/2092663.png",
//     },
//   ];

//   return (
//     <div className="min-h-screen bg-[#050505] text-white">

//       {/* NAVBAR */}
//       <nav className="flex justify-between px-10 py-6 border-b border-white/10 bg-black/40 backdrop-blur-xl">
//         <h1 className="text-3xl font-black">
//           AI Interview <span className="text-orange-500">Prep</span>
//         </h1>

//         <div className="flex gap-4">
//           <button onClick={() => navigate("/login")}>Login</button>
//           <button
//             onClick={() => navigate("/signup")}
//             className="bg-orange-500 px-4 py-2 rounded-xl"
//           >
//             Get Started
//           </button>
//         </div>
//       </nav>

//       {/* HERO */}
//       <section className="text-center py-20 px-4">
//   <img
//   src="https://cdn.dribbble.com/users/1162077/screenshots/3848914/programmer.gif"
//   className="w-72 mx-auto mb-6"
// />

//         <h1 className="text-5xl font-black">
//           Crack Interviews with <br />
//           <span className="text-orange-500">AI Intelligence</span>
//         </h1>

//         <p className="text-zinc-400 mt-4 max-w-2xl mx-auto">
//           All-in-one AI platform for interviews, DSA practice, skill analysis and career tracking.
//         </p>

//         <button
//           onClick={() => navigate("/create")}
//           className="mt-6 bg-orange-500 px-6 py-3 rounded-xl"
//         >
//           Start Now
//         </button>
//       </section>

//       {/* FEATURE CARDS */}
//       <section className="px-10 py-16">
//         <h2 className="text-3xl font-bold text-center mb-10">
//           Explore Features
//         </h2>

//         <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
//           {features.map((item) => (
//             <div
//               key={item.title}
//               onClick={() => handleAccess(item.path)}
//               className="cursor-pointer bg-white/5 border border-white/10 rounded-2xl p-6 hover:scale-105 transition"
//             >
//               <img
//                 src={item.img}
//                 alt={item.title}
//                 className="w-16 h-16 mb-4"
//               />

//               <h2 className="text-xl font-bold">{item.title}</h2>
//               <p className="text-sm text-zinc-400 mt-2">{item.desc}</p>

//               <p className="text-orange-400 mt-4 text-sm">Open →</p>
//             </div>
//           ))}
//         </div>
//       </section>
//       {/* WHY THIS PLATFORM */}
// <section className="px-10 py-20">
//   <h2 className="text-3xl font-bold text-center mb-4">
//     Why Choose <span className="text-orange-500">AI Interview Prep?</span>
//   </h2>

//   <p className="text-center text-zinc-400 max-w-2xl mx-auto mb-12">
//     A complete AI-powered placement preparation system designed to make you interview-ready faster, smarter, and more confidently.
//   </p>

//   <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">

//     <div className="bg-white/5 border border-white/10 p-6 rounded-2xl hover:border-orange-500 transition">
//       <h3 className="text-xl font-bold text-orange-400">🎯 Real Interview Simulation</h3>
//       <p className="text-zinc-400 mt-2">
//         Practice AI-generated real interview questions just like top tech companies.
//       </p>
//     </div>

//     <div className="bg-white/5 border border-white/10 p-6 rounded-2xl hover:border-orange-500 transition">
//       <h3 className="text-xl font-bold text-orange-400">🧠 AI Feedback System</h3>
//       <p className="text-zinc-400 mt-2">
//         Get instant feedback on your answers, mistakes, and improvements like a mentor.
//       </p>
//     </div>

//     <div className="bg-white/5 border border-white/10 p-6 rounded-2xl hover:border-orange-500 transition">
//       <h3 className="text-xl font-bold text-orange-400">💻 DSA Practice with AI Help</h3>
//       <p className="text-zinc-400 mt-2">
//         Solve coding problems with AI hints, explanations, and optimal solutions.
//       </p>
//     </div>

//     <div className="bg-white/5 border border-white/10 p-6 rounded-2xl hover:border-orange-500 transition">
//       <h3 className="text-xl font-bold text-orange-400">📄 ATS Resume Scoring</h3>
//       <p className="text-zinc-400 mt-2">
//         Check how ATS-friendly your resume is and improve chances of selection.
//       </p>
//     </div>

//     <div className="bg-white/5 border border-white/10 p-6 rounded-2xl hover:border-orange-500 transition">
//       <h3 className="text-xl font-bold text-orange-400">📊 Skill Gap Analysis</h3>
//       <p className="text-zinc-400 mt-2">
//         Identify missing skills based on job roles and improve targeted preparation.
//       </p>
//     </div>

//     <div className="bg-white/5 border border-white/10 p-6 rounded-2xl hover:border-orange-500 transition">
//       <h3 className="text-xl font-bold text-orange-400">🚀 Placement Ready System</h3>
//       <p className="text-zinc-400 mt-2">
//         Everything in one place — practice, learn, track progress, and crack interviews faster.
//       </p>
//     </div>

//   </div>
// </section>

//     </div>
//   );
// }

// export default Home;
// import { useNavigate } from "react-router-dom";
// import { useEffect, useState } from "react";

// function Home() {
//   const navigate = useNavigate();
//   const [isLoggedIn, setIsLoggedIn] = useState(false);

//   useEffect(() => {
//     setIsLoggedIn(localStorage.getItem("isLoggedIn") === "true");
//   }, []);

//   const handleAccess = (path) => {
//     if (!isLoggedIn) return navigate("/login");
//     navigate(path);
//   };

//   return (
//     <div className="bg-[#050505] text-white overflow-hidden">

//       {/* HERO SECTION */}
//       <section className="relative min-h-screen flex flex-col justify-center items-center text-center px-6">

//         {/* Background Glow */}
//         <div className="absolute w-[700px] h-[700px] bg-orange-500/10 blur-[160px] rounded-full top-[-200px]"></div>
//         <div className="absolute w-[500px] h-[500px] bg-orange-400/10 blur-[140px] rounded-full bottom-[-200px] right-[-100px]"></div>

//         <p className="text-orange-400 uppercase tracking-[0.3em] text-xs">
//           AI Interview Platform
//         </p>

//         <h1 className="text-5xl md:text-7xl font-black leading-tight mt-6">
//           Crack Interviews <br />
//           <span className="text-orange-500">10x Faster with AI</span>
//         </h1>

//         <p className="text-zinc-400 mt-6 max-w-2xl text-lg">
//           AI-powered mock interviews, DSA practice, ATS resume scoring, and skill analysis —
//           designed to simulate real company hiring systems.
//         </p>

//         <div className="mt-10 flex gap-4">
//           <button
//             onClick={() => handleAccess("/create")}
//             className="bg-orange-500 px-8 py-3 rounded-xl font-semibold hover:scale-105 transition"
//           >
//             Get Started Free
//           </button>

//           <button
//             onClick={() => handleAccess("/dsa")}
//             className="border border-white/20 px-8 py-3 rounded-xl hover:border-orange-500 transition"
//           >
//             Try Demo
//           </button>
//         </div>

//         <p className="text-zinc-500 text-sm mt-5">
//           No credit card required • Setup in seconds
//         </p>
//       </section>

//       {/* PROBLEM */}
//       <section className="px-6 md:px-20 py-24 text-center">
//         <h2 className="text-4xl md:text-5xl font-black">
//           Interview Preparation is Broken
//         </h2>
//         <p className="text-zinc-400 mt-6 max-w-2xl mx-auto">
//           Students practice randomly, get no feedback, and struggle to understand real hiring expectations.
//         </p>
//       </section>

//       {/* SOLUTION FEATURES */}
//       <section className="px-6 md:px-20 pb-28 grid md:grid-cols-2 lg:grid-cols-3 gap-6">

//         {[
//           {
//             icon: "🎯",
//             title: "AI Mock Interviews",
//             desc: "Real company-level interview simulation with instant feedback."
//           },
//           {
//             icon: "💻",
//             title: "DSA AI Coach",
//             desc: "Step-by-step guided problem solving instead of just answers."
//           },
//           {
//             icon: "📄",
//             title: "ATS Resume Scanner",
//             desc: "Optimize resume for real hiring systems used in companies."
//           },
//           {
//             icon: "📊",
//             title: "Skill Gap Analyzer",
//             desc: "Detect missing skills required for your dream job."
//           },
//           {
//             icon: "📈",
//             title: "Performance Tracking",
//             desc: "Track improvement over time with AI insights."
//           },
//           {
//             icon: "🚀",
//             title: "Job Readiness Score",
//             desc: "One AI score showing how ready you are for placement."
//           },
//         ].map((f, i) => (
//           <div
//             key={i}
//             className="group p-6 rounded-2xl border border-white/10 bg-white/5 backdrop-blur-xl
//             hover:border-orange-500/50 transition hover:scale-[1.03]"
//           >
//             <div className="text-3xl">{f.icon}</div>

//             <h3 className="text-xl font-bold mt-3 group-hover:text-orange-400">
//               {f.title}
//             </h3>

//             <p className="text-zinc-400 text-sm mt-2">
//               {f.desc}
//             </p>
//           </div>
//         ))}
//       </section>

//       {/* TRUST METRICS */}
//       <section className="px-6 md:px-20 py-24 grid md:grid-cols-4 gap-6 text-center">

//         {[
//           { value: "10,000+", label: "Students" },
//           { value: "50,000+", label: "Mock Interviews" },
//           { value: "72%", label: "Avg Improvement" },
//           { value: "98%", label: "AI Accuracy" },
//         ].map((m, i) => (
//           <div
//             key={i}
//             className="p-6 rounded-2xl bg-white/5 border border-white/10"
//           >
//             <h3 className="text-3xl font-black text-orange-500">
//               {m.value}
//             </h3>
//             <p className="text-zinc-400 text-sm mt-2">
//               {m.label}
//             </p>
//           </div>
//         ))}
//       </section>

//       {/* FINAL CTA */}
//       <section className="relative text-center py-28 px-6">

//         <div className="absolute w-[600px] h-[600px] bg-orange-500/10 blur-[160px] rounded-full left-1/2 -translate-x-1/2"></div>

//         <h2 className="text-4xl md:text-5xl font-black">
//           Start Your Placement Journey Today
//         </h2>

//         <p className="text-zinc-400 mt-5 max-w-xl mx-auto">
//           Join thousands of students preparing smarter and landing high-paying jobs.
//         </p>

//         <button
//           onClick={() => navigate("/create")}
//           className="mt-10 bg-orange-500 px-10 py-3 rounded-xl font-semibold hover:scale-105 transition"
//         >
//           Get Started Free
//         </button>

//         <p className="text-zinc-500 text-sm mt-4">
//           No credit card required • Instant access
//         </p>
//       </section>

//     </div>
//   );
// }

// export default Home;

// import { useNavigate } from "react-router-dom";

// function Home() {
//   const navigate = useNavigate();

//   const isLoggedIn =
//     localStorage.getItem("isLoggedIn") === "true";

//   const logout = () => {
//     localStorage.removeItem("isLoggedIn");
//     navigate("/");
//   };

//   const handleAccess = (path) => {
//     if (!isLoggedIn) {
//       navigate("/login");
//       return;
//     }

//     navigate(path);
//   };

//   const features = [
//     {
//       title: "AI Interview Generator",
//       desc: "Generate role based AI interviews",
//       path: "/create",
//     },
//     {
//       title: "Interview History",
//       desc: "View all previous interviews",
//       path: "/history",
//     },
//       {
//       title: "Check Skills",
//       desc: "check skills based on role",
//       path: "/skills",
//     },
//      {
//       title: "DSA",
//       desc: "DSA Practice according to companies",
//       path: "/dsa",
//     },
    
//     {
//       title: "ATS Resume Checker",
//       desc: "Analyze resume ATS score",
//       path: "/ats-checker",
//     },
//   ];

//   return (
//     <div className="min-h-screen bg-[#050505] text-white overflow-hidden">

//       {/* Background */}
//       <div className="absolute w-[500px] h-[500px] bg-fuchsia-600/20 blur-3xl rounded-full -top-40 -left-40"></div>

//       <div className="absolute w-[500px] h-[500px] bg-orange-500/20 blur-3xl rounded-full -bottom-40 -right-40"></div>

//       {/* Navbar */}
//       <nav className="relative flex justify-between items-center px-10 py-6 border-b border-white/10">

//         <h1 className="text-3xl font-black">
//           AI Interview Prep
//         </h1>

//         {!isLoggedIn ? (
//           <div className="flex gap-4">

//             <button
//               onClick={() =>
//                 navigate("/login")
//               }
//               className="
//               px-5 py-2 rounded-xl
//               border border-white/10
//               hover:bg-white/10
//               transition-all
//             "
//             >
//               Login
//             </button>

//             <button
//               onClick={() =>
//                 navigate("/signup")
//               }
//               className="
//               px-5 py-2 rounded-xl
//               bg-gradient-to-r
//               from-fuchsia-600
//               via-purple-600
//               to-orange-500
//             "
//             >
//               Signup
//             </button>

//           </div>
//         ) : (
//           <div className="flex gap-4 items-center">

//             <span className="text-zinc-400">
//               Welcome Back 👋
//             </span>

//             <button
//               onClick={logout}
//               className="
//               px-5 py-2 rounded-xl
//               bg-red-500
//             "
//             >
//               Logout
//             </button>

//           </div>
//         )}

//       </nav>

//       {/* Hero */}
//       <section className="relative text-center py-24 px-6">

//         <h1 className="text-6xl font-black mb-6">
//           Crack Interviews
//           <br />
//           With AI
//         </h1>

//         <p className="text-zinc-400 max-w-2xl mx-auto text-lg">
//           Generate AI interviews, get instant
//           feedback, run code, practice DSA and
//           improve your ATS score.
//         </p>

//       </section>

//       {/* Cards */}
//       <section className="relative max-w-7xl mx-auto px-6 pb-20">

//         <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">

//           {features.map((item) => (
//             <div
//               key={item.title}
//               onClick={() =>
//                 handleAccess(item.path)
//               }
//               className="
//               cursor-pointer
//               bg-white/[0.03]
//               backdrop-blur-xl
//               border border-white/10
//               rounded-3xl
//               p-6
//               hover:scale-105
//               hover:border-fuchsia-500
//               transition-all
//               duration-300
//             "
//             >
//               <h2 className="text-xl font-bold mb-3">
//                 {item.title}
//               </h2>

//               <p className="text-zinc-400">
//                 {item.desc}
//               </p>

//               {!isLoggedIn && (
//                 <p className="mt-4 text-orange-400 text-sm">
//                   Login Required
//                 </p>
//               )}
//             </div>
//           ))}

//         </div>

//       </section>

//     </div>
//   );
// }

// export default Home;

// import { useNavigate } from "react-router-dom";
// import { useEffect, useState } from "react";

// function Home() {
//   const navigate = useNavigate();

//   const [isLoggedIn, setIsLoggedIn] = useState(false);

//   useEffect(() => {
//     setIsLoggedIn(localStorage.getItem("isLoggedIn") === "true");
//   }, []);

//   const logout = () => {
//     localStorage.removeItem("isLoggedIn");
//     setIsLoggedIn(false);
//     navigate("/");
//   };

//   const handleAccess = (path) => {
//     if (!isLoggedIn) {
//       navigate("/login");
//       return;
//     }
//     navigate(path);
//   };

//   const features = [
//     { title: "AI Interview based on role", path: "/create" },

//     { title: "Check Skills", path: "/skills" },
//     { title: "DSA", path: "/dsa" },
//     { title: "ATS Resume Checker", path: "/ats-checker" },
//        { title: "interview based on role and skills", path: "/cinterview" },
//            { title: "interview history", path: "/history" },

  
//   ];

//   return (
//     <div className="min-h-screen bg-[#050505] text-white overflow-hidden">

//       <nav className="flex justify-between px-10 py-6 border-b border-white/10">
//         <h1 className="text-3xl font-black">AI Interview Prep</h1>

//         {!isLoggedIn ? (
//           <div className="flex gap-4">
//             <button onClick={() => navigate("/login")}>Login</button>
//             <button onClick={() => navigate("/signup")}>Signup</button>
//           </div>
//         ) : (
//           <div className="flex gap-4 items-center">
//             <span className="text-zinc-400">Welcome 👋</span>
//             <button onClick={logout} className="bg-red-500 px-4 py-2 rounded">
//               Logout
//             </button>
//           </div>
//         )}
//       </nav>

//       <section className="text-center py-24">
//         <h1 className="text-6xl font-black">Crack Interviews With AI</h1>
//         <p className="text-zinc-400 mt-4">
//           Generate AI interviews, run code, practice DSA
//         </p>
//       </section>

//       <section className="max-w-7xl mx-auto px-6 pb-20">
//         <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">

//           {features.map((item) => (
//             <div
//               key={item.title}
//               onClick={() => handleAccess(item.path)}
//               className="
//               cursor-pointer
//               bg-white/[0.03]
//               border border-white/10
//               rounded-3xl
//               p-6
//               hover:scale-105
//               hover:border-fuchsia-500
//               transition-all
//               "
//             >
//               <h2 className="text-xl font-bold">{item.title}</h2>
//             </div>
//           ))}

//         </div>
//       </section>

//     </div>
//   );
// }

// export default Home;
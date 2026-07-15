import { useState } from "react";
import { useNavigate } from "react-router-dom";

function CreateInter() {
  const navigate = useNavigate();

  const [role, setRole] = useState("");
  const [skills, setSkills] = useState([]);
  const [selectedSkills, setSelectedSkills] = useState([]);
  const [difficulty, setDifficulty] = useState("easy");
  const [questionTypes, setQuestionTypes] = useState([]);
  const [questionCount, setQuestionCount] = useState(5);

  const [loadingSkills, setLoadingSkills] = useState(false);
  const [creatingInterview, setCreatingInterview] = useState(false);

  // ================= GET SKILLS =================
  const getSkills = async () => {
    if (!role.trim()) return alert("Please enter a role first");

    try {
      setLoadingSkills(true);

      const res = await fetch("https://ai-interview-prep-ffjr.onrender.com/api/ai/skills", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({ role: role.trim() }),
      });

      const data = await res.json();

      if (data?.success) {
        setSkills(Array.isArray(data.skills) ? data.skills : []);
        setSelectedSkills([]);
      } else {
        alert(data?.message || "Failed to generate skills");
      }
    } catch (err) {
      console.log(err);
      alert("Failed to generate skills");
    } finally {
      setLoadingSkills(false);
    }
  };

  // ================= TOGGLE SKILLS =================
  const toggleSkill = (skill) => {
    setSelectedSkills((prev) =>
      prev.includes(skill)
        ? prev.filter((s) => s !== skill)
        : [...prev, skill]
    );
  };

  // ================= TOGGLE QUESTION TYPE =================
  const toggleQuestionType = (type) => {
    setQuestionTypes((prev) =>
      prev.includes(type)
        ? prev.filter((t) => t !== type)
        : [...prev, type]
    );
  };

  // ================= CREATE INTERVIEW =================
  const createInterview = async () => {
    if (!role.trim()) return alert("Role is required");
    if (selectedSkills.length === 0)
      return alert("Select at least one skill");

    try {
      setCreatingInterview(true);

      const res = await fetch("http://localhost:8000/api/ai/interview", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({
          role: role.trim(),
          skills: selectedSkills,
          difficulty,
          questionTypes: questionTypes.length ? questionTypes : ["Technical"],
          questionCount: Number(questionCount),
        }),
      });

      const data = await res.json();

      if (data?.success && data?.interview?._id) {
        navigate(`/interview/${data.interview._id}`);
      } else {
        alert(data?.message || "Failed to create interview");
      }
    } catch (err) {
      console.log(err);
      alert("Server error");
    } finally {
      setCreatingInterview(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center px-4 bg-[#050505] text-white">

      <div className="w-full max-w-5xl p-8 rounded-3xl backdrop-blur-2xl border bg-white/5 border-white/10">

        {/* HEADER */}
        <div className="text-center mb-8">
          <h1 className="text-5xl font-black">
            AI <span className="text-orange-500">Interview Generator</span>
          </h1>
          <p className="text-sm opacity-70 mt-2">
            Build smart interviews with AI powered skill detection
          </p>
        </div>

        {/* ROLE */}
        <input
          placeholder="Frontend / Backend / Full Stack"
          value={role}
          onChange={(e) => setRole(e.target.value)}
          className="w-full px-4 py-3 rounded-xl border border-orange-400/30 mb-4"
        />

        {/* GET SKILLS */}
        <button
          onClick={getSkills}
          disabled={loadingSkills}
          className="px-6 py-3 rounded-xl bg-orange-500 font-semibold"
        >
          {loadingSkills ? "Generating Skills..." : "Generate Skills"}
        </button>

        {/* SKILLS */}
        {skills.length > 0 && (
          <div className="mt-6">
            <h2 className="text-xl font-bold mb-3">Select Skills</h2>

            <div className="flex flex-wrap gap-3">
              {skills.map((skill, i) => (
                <button
                  key={i}
                  onClick={() => toggleSkill(skill)}
                  className={`px-4 py-2 rounded-xl ${
                    selectedSkills.includes(skill)
                      ? "bg-orange-500"
                      : "bg-gray-800"
                  }`}
                >
                  {skill}
                </button>
              ))}
            </div>
          </div>
        )}

        {/* OPTIONS */}
        <div className="grid md:grid-cols-2 gap-5 mt-8">

          <select
            value={difficulty}
            onChange={(e) => setDifficulty(e.target.value)}
            className="p-3 rounded-xl bg-black border border-orange-400/30"
          >
            <option value="easy">Easy</option>
            <option value="medium">Medium</option>
            <option value="hard">Hard</option>
          </select>

          <input
            type="number"
            value={questionCount}
            onChange={(e) => setQuestionCount(Number(e.target.value))}
            className="p-3 rounded-xl bg-black border border-orange-400/30"
          />
        </div>

        {/* QUESTION TYPES */}
        <div className="mt-8">
          <h2 className="text-xl font-bold mb-3">Question Types</h2>

          <div className="flex flex-wrap gap-3">
            {["Technical", "HR", "DSA", "System Design", "Project"].map(
              (type) => (
                <button
                  key={type}
                  onClick={() => toggleQuestionType(type)}
                  className={`px-4 py-2 rounded-xl ${
                    questionTypes.includes(type)
                      ? "bg-fuchsia-600"
                      : "bg-gray-800"
                  }`}
                >
                  {type}
                </button>
              )
            )}
          </div>
        </div>

        {/* CREATE */}
        <button
          onClick={createInterview}
          disabled={creatingInterview}
          className="w-full mt-10 py-4 rounded-xl bg-orange-500 font-bold"
        >
          {creatingInterview ? "Creating..." : "Create AI Interview"}
        </button>

      </div>
    </div>
  );
}

export default CreateInter;
// import { useState } from "react";
// import { useNavigate } from "react-router-dom";

// function CreateInter() {
//   const navigate = useNavigate();

//   const [role, setRole] = useState("");
//   const [skills, setSkills] = useState([]);
//   const [selectedSkills, setSelectedSkills] = useState([]);
//   const [difficulty, setDifficulty] = useState("easy");
//   const [questionTypes, setQuestionTypes] = useState([]);
//   const [questionCount, setQuestionCount] = useState(5);

//   const [loadingSkills, setLoadingSkills] = useState(false);
//   const [creatingInterview, setCreatingInterview] = useState(false);

//   const getSkills = async () => {
//     if (!role.trim()) {
//       return alert("Please enter a role first");
//     }

//     try {
//       setLoadingSkills(true);

//       const res = await fetch(
//         "http://localhost:8000/api/ai/skills",
//         {
//           method: "POST",
//           headers: {
//             "Content-Type": "application/json",
//           },
//           credentials: "include",
//           body: JSON.stringify({
//             role,
//           }),
//         }
//       );

//       const data = await res.json();

//       if (data.success) {
//         setSkills(data.skills || []);
//       } else {
//         alert(data.message);
//       }
//     } catch (error) {
//       console.log(error);
//       alert("Failed to generate skills");
//     } finally {
//       setLoadingSkills(false);
//     }
//   };

//   const createInterview = async () => {
//     if (!role.trim()) {
//       return alert("Role is required");
//     }

//     if (selectedSkills.length === 0) {
//       return alert("Please select at least one skill");
//     }

//     try {
//       setCreatingInterview(true);

//       const res = await fetch(
//         "http://localhost:8000/api/ai/interview",
//         {
//           method: "POST",
//           headers: {
//             "Content-Type": "application/json",
//           },
//           credentials: "include",
//           body: JSON.stringify({
//             role,
//             skills: selectedSkills,
//             difficulty,
//             questionTypes,
//             questionCount,
//           }),
//         }
//       );

//       const data = await res.json();

//       if (data.success) {
//         alert("Interview Created Successfully");

//         navigate(
//           `/interview/${data.interview._id}`
//         );
//       } else {
//         alert(data.message);
//       }
//     } catch (error) {
//       console.log(error);
//       alert("Failed to create interview");
//     } finally {
//       setCreatingInterview(false);
//     }
//   };

//   const toggleSkill = (skill) => {
//     if (selectedSkills.includes(skill)) {
//       setSelectedSkills(
//         selectedSkills.filter(
//           (s) => s !== skill
//         )
//       );
//     } else {
//       setSelectedSkills([
//         ...selectedSkills,
//         skill,
//       ]);
//     }
//   };

//   const toggleQuestionType = (type) => {
//     if (questionTypes.includes(type)) {
//       setQuestionTypes(
//         questionTypes.filter(
//           (t) => t !== type
//         )
//       );
//     } else {
//       setQuestionTypes([
//         ...questionTypes,
//         type,
//       ]);
//     }
//   };

//   return (
//     <div className="min-h-screen bg-[#050505] text-white p-6 relative overflow-hidden">

//       {/* Background Effects */}
//       <div className="absolute w-[500px] h-[500px] bg-fuchsia-600/20 blur-3xl rounded-full -top-40 -left-40 animate-pulse"></div>

//       <div className="absolute w-[500px] h-[500px] bg-orange-500/20 blur-3xl rounded-full -bottom-40 -right-40 animate-pulse"></div>

//       <div className="relative max-w-5xl mx-auto">

//         {/* Header */}
//         <div className="mb-8">
//           <h1 className="text-5xl font-black">
//             AI Interview Generator
//           </h1>

//           <p className="text-zinc-400 mt-2">
//             Create personalized interviews
//             based on role, skills and
//             difficulty level
//           </p>
//         </div>

//         {/* Main Card */}
//         <div
//           className="
//           bg-white/[0.03]
//           backdrop-blur-xl
//           border border-white/10
//           rounded-3xl
//           p-8
//           shadow-[0_0_80px_rgba(168,85,247,0.15)]
//         "
//         >
//           {/* Role */}
//           <div className="mb-6">
//             <label className="block mb-2 text-zinc-300">
//               Role
//             </label>

//             <input
//               type="text"
//               placeholder="Frontend Developer"
//               value={role}
//               onChange={(e) =>
//                 setRole(e.target.value)
//               }
//               className="
//               w-full
//               p-4
//               rounded-2xl
//               bg-black/40
//               border border-white/10
//               outline-none
//               focus:border-fuchsia-500
//               transition-all
//               "
//             />
//           </div>

//           {/* Generate Skills */}
//           <button
//             onClick={getSkills}
//             disabled={loadingSkills}
//             className="
//             px-6 py-3
//             rounded-xl
//             bg-gradient-to-r
//             from-fuchsia-600
//             via-purple-600
//             to-orange-500
//             hover:scale-105
//             transition-all
//             disabled:opacity-50
//             "
//           >
//             {loadingSkills
//               ? "Generating Skills..."
//               : "Generate Skills"}
//           </button>

//           {/* Skills */}
//           {skills.length > 0 && (
//             <>
//               <h2 className="text-2xl font-bold mt-8 mb-4">
//                 Select Skills
//               </h2>

//               <div className="flex flex-wrap gap-3">
//                 {skills.map(
//                   (skill, index) => (
//                     <button
//                       key={index}
//                       onClick={() =>
//                         toggleSkill(skill)
//                       }
//                       className={`
//                       px-4 py-2 rounded-xl transition-all duration-300
//                       ${
//                         selectedSkills.includes(
//                           skill
//                         )
//                           ? "bg-fuchsia-600 text-white"
//                           : "bg-slate-800 hover:bg-slate-700"
//                       }
//                     `}
//                     >
//                       {skill}
//                     </button>
//                   )
//                 )}
//               </div>
//             </>
//           )}

//           {/* Difficulty + Question Count */}
//           <div className="grid md:grid-cols-2 gap-5 mt-8">

//             <div>
//               <label className="block mb-2">
//                 Difficulty
//               </label>

//               <select
//                 value={difficulty}
//                 onChange={(e) =>
//                   setDifficulty(
//                     e.target.value
//                   )
//                 }
//                 className="
//                 w-full
//                 p-4
//                 rounded-xl
//                 bg-slate-900
//                 border border-white/10
//                 "
//               >
//                 <option value="easy">
//                   Easy
//                 </option>
//                 <option value="medium">
//                   Medium
//                 </option>
//                 <option value="hard">
//                   Hard
//                 </option>
//               </select>
//             </div>

//             <div>
//               <label className="block mb-2">
//                 Question Count
//               </label>

//               <input
//                 type="number"
//                 min="1"
//                 max="20"
//                 value={questionCount}
//                 onChange={(e) =>
//                   setQuestionCount(
//                     Number(
//                       e.target.value
//                     )
//                   )
//                 }
//                 className="
//                 w-full
//                 p-4
//                 rounded-xl
//                 bg-slate-900
//                 border border-white/10
//                 "
//               />
//             </div>

//           </div>

//           {/* Question Types */}
//           <h2 className="text-2xl font-bold mt-8 mb-4">
//             Question Types
//           </h2>

//           <div className="flex flex-wrap gap-3">

//             {[
//               "Technical",
//               "HR",
//               "DSA",
//               "System Design",
//               "Project",
//             ].map((type) => (
//               <button
//                 key={type}
//                 onClick={() =>
//                   toggleQuestionType(
//                     type
//                   )
//                 }
//                 className={`
//                 px-4 py-2 rounded-xl transition-all duration-300
//                 ${
//                   questionTypes.includes(
//                     type
//                   )
//                     ? "bg-orange-500 text-white"
//                     : "bg-slate-800 hover:bg-slate-700"
//                 }
//               `}
//               >
//                 {type}
//               </button>
//             ))}

//           </div>

//           {/* Create Interview */}
//           <button
//             onClick={createInterview}
//             disabled={creatingInterview}
//             className="
//             w-full
//             py-4
//             mt-10
//             rounded-xl
//             font-bold
//             bg-gradient-to-r
//             from-fuchsia-600
//             via-purple-600
//             to-orange-500
//             hover:scale-[1.02]
//             transition-all
//             duration-300
//             disabled:opacity-50
//             "
//           >
//             {creatingInterview
//               ? "Creating Interview..."
//               : "Create AI Interview"}
//           </button>
//         </div>
//       </div>
//     </div>
//   );
// }

// export default CreateInter;
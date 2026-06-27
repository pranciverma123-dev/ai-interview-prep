import { useState } from "react";

function Skills() {
  const [role, setRole] = useState("");
  const [skills, setSkills] = useState([]);
  const [selectedSkills, setSelectedSkills] = useState([]);
  const [difficulty, setDifficulty] = useState("medium");
  const [questionCount, setQuestionCount] = useState(5);

  const [loadingSkills, setLoadingSkills] = useState(false);
  const [creatingInterview, setCreatingInterview] = useState(false);

  const [interview, setInterview] = useState(null);

  // ================= GET SKILLS =================
  const handleGetSkills = async () => {
    if (!role.trim()) return alert("Enter role first");

    try {
      setLoadingSkills(true);

      const res = await fetch("http://localhost:8000/api/ai/skills", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ role }),
      });

      const data = await res.json();

      if (!data.success) {
        alert(data.message || "Failed to get skills");
        return;
      }

      const rawSkills = data.skills?.skills || data.skills || [];

      const formatted = rawSkills.map((s) => ({
        name: typeof s === "string" ? s : s.name,
        level: s.level || "medium",
      }));

      setSkills(formatted);
    } catch (err) {
      console.log(err);
      alert("Server error while fetching skills");
    } finally {
      setLoadingSkills(false);
    }
  };

  // ================= TOGGLE SKILL =================
  const toggleSkill = (skillName) => {
    setSelectedSkills((prev) =>
      prev.includes(skillName)
        ? prev.filter((s) => s !== skillName)
        : [...prev, skillName]
    );
  };

  // ================= CREATE INTERVIEW =================
  const handleCreateInterview = async () => {
    if (!role.trim()) return alert("Role required");
    if (!selectedSkills.length)
      return alert("Select at least one skill");

    try {
      setCreatingInterview(true);

      const res = await fetch(
        "http://localhost:8000/api/ai/interview",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            role,
            skills: selectedSkills,
            difficulty,
            questionTypes: ["mcq", "code", "text"],
            questionCount: Number(questionCount),
          }),
        }
      );

      const data = await res.json();

      if (data.success && data.interview) {
        setInterview(data.interview);
      } else {
        alert(data.message || "Failed to create interview");
      }
    } catch (err) {
      console.log(err);
      alert("Server error");
    } finally {
      setCreatingInterview(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#050505] text-white p-6 relative overflow-hidden">

      {/* Glow */}
      <div className="absolute w-[500px] h-[500px] bg-orange-500/20 blur-3xl rounded-full -top-40 -left-40 animate-pulse"></div>
      <div className="absolute w-[500px] h-[500px] bg-fuchsia-600/20 blur-3xl rounded-full -bottom-40 -right-40 animate-pulse"></div>

      <div className="max-w-4xl mx-auto relative">

        {/* HEADER */}
        <div className="text-center mb-8">
          <h1 className="text-5xl font-black">
            AI <span className="text-orange-500">Interview Builder</span>
          </h1>
        </div>

        {/* CARD */}
        <div className="bg-white/5 border border-white/10 rounded-3xl p-6">

          {/* ROLE */}
          <input
            placeholder="Enter Role"
            value={role}
            onChange={(e) => setRole(e.target.value)}
            className="w-full px-4 py-3 rounded-xl bg-black/40 border border-white/10"
          />

          {/* GET SKILLS */}
          <button
            onClick={handleGetSkills}
            disabled={loadingSkills}
            className="w-full mt-4 py-3 rounded-xl bg-orange-500 disabled:opacity-50"
          >
            {loadingSkills ? "Generating Skills..." : "Generate Skills"}
          </button>

          {/* SKILLS */}
          {skills.length > 0 && (
            <div className="mt-6 flex flex-wrap gap-3">
              {skills.map((s, i) => (
                <button
                  key={i}
                  onClick={() => toggleSkill(s.name)}
                  className={`px-4 py-2 rounded-xl ${
                    selectedSkills.includes(s.name)
                      ? "bg-orange-500"
                      : "bg-gray-800"
                  }`}
                >
                  {s.name} ({s.level})
                </button>
              ))}
            </div>
          )}

          {/* SETTINGS */}
          <div className="grid md:grid-cols-2 gap-4 mt-8">

            <select
              value={difficulty}
              onChange={(e) => setDifficulty(e.target.value)}
              className="p-3 rounded-xl bg-black/40"
            >
              <option>easy</option>
              <option>medium</option>
              <option>hard</option>
            </select>

            <input
              type="number"
              value={questionCount}
              onChange={(e) =>
                setQuestionCount(Number(e.target.value))
              }
              className="p-3 rounded-xl bg-black/40"
            />
          </div>

          {/* CREATE */}
          <button
            onClick={handleCreateInterview}
            disabled={creatingInterview}
            className="w-full mt-8 py-4 rounded-xl bg-gradient-to-r from-orange-500 to-fuchsia-600 disabled:opacity-50"
          >
            {creatingInterview
              ? "Creating..."
              : "Create AI Interview"}
          </button>

          {/* RESULT */}
          {interview && (
            <div className="mt-8 p-5 bg-green-500/10 rounded-2xl">

              <h3 className="text-green-400 font-bold">
                Interview Created
              </h3>

              <p>Role: {interview.role}</p>
              <p>Status: {interview.status}</p>
              <p>Questions: {interview.questions?.length || 0}</p>

              <div className="mt-4 space-y-3">
                {(interview.questions || []).map((q, i) => (
                  <div key={i} className="p-3 bg-black/40 rounded-xl">
                    Q{i + 1}: {q.question}
                  </div>
                ))}
              </div>

            </div>
          )}

        </div>
      </div>
    </div>
  );
}

export default Skills;

// import { useState } from "react";

// function Skills() {
//   const [role, setRole] = useState("");
//   const [skills, setSkills] = useState([]);
//   const [difficulty, setDifficulty] = useState("medium");
//   const [questionCount, setQuestionCount] = useState(5);
//   const [loading, setLoading] = useState(false);
//   const [interview, setInterview] = useState(null);

 
// const handleGetSkills = async () => {
//   try {
//     setLoading(true);

//     const res = await fetch("http://localhost:8000/api/ai/skills", {
//       method: "POST",
//       headers: {
//         "Content-Type": "application/json",
//       },
//       body: JSON.stringify({ role }),
//     });

//     const data = await res.json();

//     // 🔥 convert string array → object array
//     const formattedSkills = (data.skills?.skills || []).map((skill) => ({
//       name: skill,
//       level: data.skills?.levels?.[skill] || "medium",
//     }));

//     setSkills(formattedSkills);
//   } catch (err) {
//     console.log("GET SKILLS ERROR:", err);
//   } finally {
//     setLoading(false);
//   }
// };

//   // ================= CREATE INTERVIEW =================
//   const handleCreateInterview = async () => {
//     try {
//       setLoading(true);

//       const res = await fetch("http://localhost:8000/api/ai/interview", {
//         method: "POST",
//         headers: {
//           "Content-Type": "application/json",
//         },
//         body: JSON.stringify({
//           role,
//           skills,
//           difficulty,
//           questionCount,
//           questionTypes: ["text", "mcq", "code"],
//         }),
//       });

//       const data = await res.json();

//       setInterview(data.interview);
//       setLoading(false);
//     } catch (err) {
//       console.log("CREATE INTERVIEW ERROR:", err);
//       setLoading(false);
//     }
//   };

//   return (
//     <div className="min-h-screen bg-gray-100 flex items-center justify-center p-6">
//       <div className="w-full max-w-2xl bg-white shadow-xl rounded-2xl p-6">

//         <h2 className="text-2xl font-bold text-center mb-6">
//           Create Interview
//         </h2>

//         {/* ROLE INPUT */}
//         <input
//           type="text"
//           placeholder="Enter Role (e.g. Frontend Developer)"
//           value={role}
//           onChange={(e) => setRole(e.target.value)}
//           className="w-full border p-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
//         />

//         {/* GET SKILLS */}
//         <button
//           onClick={handleGetSkills}
//           disabled={!role || loading}
//           className="w-full mt-3 bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 disabled:bg-gray-400"
//         >
//           {loading ? "Loading..." : "Get Skills"}
//         </button>

//         {/* SKILLS LIST */}
//         {skills.length > 0 && (
//           <div className="mt-6">
//             <h3 className="font-semibold mb-2">Generated Skills</h3>
//             <ul className="grid grid-cols-2 gap-2">
//               {skills.map((s, i) => (
//                 <li key={i} className="bg-gray-100 p-2 rounded-lg text-sm">
//                   {s.name} <span className="text-gray-500">({s.level})</span>
//                 </li>
//               ))}
//             </ul>
//           </div>
//         )}

//         {/* SETTINGS */}
//         <div className="mt-6 space-y-4">

//           <div>
//             <label className="font-medium">Difficulty</label>
//             <select
//               value={difficulty}
//               onChange={(e) => setDifficulty(e.target.value)}
//               className="w-full border p-2 rounded-lg mt-1"
//             >
//               <option value="easy">Easy</option>
//               <option value="medium">Medium</option>
//               <option value="hard">Hard</option>
//             </select>
//           </div>

//           <div>
//             <label className="font-medium">Question Count</label>
//             <input
//               type="number"
//               value={questionCount}
//               onChange={(e) => setQuestionCount(e.target.value)}
//               className="w-full border p-2 rounded-lg mt-1"
//             />
//           </div>
//         </div>

//         {/* CREATE INTERVIEW */}
//         <button
//           onClick={handleCreateInterview}
//           disabled={!skills.length || loading}
//           className="w-full mt-6 bg-green-600 text-white py-2 rounded-lg hover:bg-green-700 disabled:bg-gray-400"
//         >
//           Create Interview
//         </button>

//         {/* RESULT */}
//         {interview && (
//           <div className="mt-6 bg-green-50 border border-green-200 p-4 rounded-lg">
//             <h3 className="font-bold text-green-700">
//               🎉 Interview Created
//             </h3>
//             <p><b>Role:</b> {interview.role}</p>
//             <p><b>Status:</b> {interview.status}</p>
//             <p><b>Total Questions:</b> {interview.questions.length}</p>
//           </div>
//         )}
//       </div>
//     </div>
//   );
// }

// export default Skills;

// import { useState } from "react";

// function Skills() {
//   const [role, setRole] = useState("");
//   const [skills, setSkills] = useState([]);
//   const [selectedSkills, setSelectedSkills] = useState([]);
//   const [difficulty, setDifficulty] = useState("medium");
//   const [questionCount, setQuestionCount] = useState(5);
//   const [loading, setLoading] = useState(false);
//   const [interview, setInterview] = useState(null);

//   // ================= GET SKILLS =================
//   const handleGetSkills = async () => {
//     try {
//       setLoading(true);

//       const res = await fetch("http://localhost:8000/api/ai/skills", {
//         method: "POST",
//         headers: { "Content-Type": "application/json" },
//         body: JSON.stringify({ role }),
//       });

//       const data = await res.json();

//       const formattedSkills = (data.skills?.skills || []).map((skill) => ({
//         name: skill,
//         level: data.skills?.levels?.[skill] || "medium",
//       }));

//       setSkills(formattedSkills);
//     } catch (err) {
//       console.log(err);
//     } finally {
//       setLoading(false);
//     }
//   };

//   // ================= TOGGLE SKILL =================
//   const toggleSkill = (skillName) => {
//     setSelectedSkills((prev) =>
//       prev.includes(skillName)
//         ? prev.filter((s) => s !== skillName)
//         : [...prev, skillName]
//     );
//   };

//   // ================= CREATE INTERVIEW =================
//   const handleCreateInterview = async () => {
//     try {
//       setLoading(true);

//       const res = await fetch("http://localhost:8000/api/ai/interview", {
//         method: "POST",
//         headers: { "Content-Type": "application/json" },
//         body: JSON.stringify({
//           role,
//           skills: selectedSkills,
//           difficulty,
//           questionCount,
//           questionTypes: ["text", "mcq", "code"],
//         }),
//       });

//       const data = await res.json();
//       setInterview(data.interview);
//     } catch (err) {
//       console.log(err);
//     } finally {
//       setLoading(false);
//     }
//   };

//   return (
//     <div className="min-h-screen bg-gray-100 flex items-center justify-center p-6">
//       <div className="w-full max-w-2xl bg-white shadow-xl rounded-2xl p-6">

//         <h2 className="text-2xl font-bold text-center mb-6">
//           Create Interview
//         </h2>

//         {/* ROLE */}
//         <input
//           type="text"
//           placeholder="Enter Role"
//           value={role}
//           onChange={(e) => setRole(e.target.value)}
//           className="w-full border p-3 rounded-lg"
//         />

//         {/* GET SKILLS */}
//         <button
//           onClick={handleGetSkills}
//           disabled={!role || loading}
//           className="w-full mt-3 bg-blue-600 text-white py-2 rounded-lg"
//         >
//           Get Skills
//         </button>

//         {/* SKILLS */}
//         {skills.length > 0 && (
//           <div className="mt-4">
//             <h3>Select Skills</h3>

//             <ul className="grid grid-cols-2 gap-2">
//               {skills.map((s, i) => (
//                 <li
//                   key={i}
//                   onClick={() => toggleSkill(s.name)}
//                   className={`p-2 cursor-pointer border rounded ${
//                     selectedSkills.includes(s.name)
//                       ? "bg-blue-600 text-white"
//                       : "bg-gray-100"
//                   }`}
//                 >
//                   {s.name}
//                 </li>
//               ))}
//             </ul>
//           </div>
//         )}

//         {/* SETTINGS */}
//         <div className="mt-4">
//           <input
//             type="number"
//             value={questionCount}
//             onChange={(e) => setQuestionCount(e.target.value)}
//             className="border p-2 w-full"
//           />
//         </div>

//         {/* CREATE */}
//         <button
//           onClick={handleCreateInterview}
//           disabled={!selectedSkills.length}
//           className="w-full mt-4 bg-green-600 text-white py-2 rounded-lg"
//         >
//           Create Interview
//         </button>

//         {/* RESULT */}
//         {interview && (
//           <div className="mt-6 bg-green-50 p-4 rounded-lg">
//             <h3>🎉 Interview Created</h3>

//             <p>Role: {interview.role}</p>
//             <p>Status: {interview.status}</p>
//             <p>Total Questions: {interview.questions.length}</p>

//             <div className="mt-4">
//               <h4>Questions:</h4>

//               <ul className="space-y-3">
//                 {interview.questions.map((q, i) => (
//                   <li key={q._id} className="p-2 bg-white border rounded">
//                     <b>Q{i + 1}:</b> {q.question}

//                     {q.type === "mcq" && (
//                       <ul className="ml-4 list-disc text-sm">
//                         {q.options.map((opt, idx) => (
//                           <li key={idx}>{opt}</li>
//                         ))}
//                       </ul>
//                     )}
//                   </li>
//                 ))}
//               </ul>
//             </div>
//           </div>
//         )}

//       </div>
//     </div>
//   );
// }

// export default Skills;
// import { useState } from "react";

// function Skills() {
//   const [role, setRole] = useState("");
//   const [skills, setSkills] = useState([]);
//   const [selectedSkills, setSelectedSkills] = useState([]);
//   const [difficulty, setDifficulty] = useState("medium");
//   const [questionCount, setQuestionCount] = useState(5);
//   const [loading, setLoading] = useState(false);
//   const [interview, setInterview] = useState(null);

//   // ================= GET SKILLS (NO CHANGE) =================
//   const handleGetSkills = async () => {
//     try {
//       setLoading(true);

//       const res = await fetch("http://localhost:8000/api/ai/skills", {
//         method: "POST",
//         headers: {
//           "Content-Type": "application/json",
//         },
//         body: JSON.stringify({ role }),
//       });

//       const data = await res.json();

//       const formattedSkills = (data.skills?.skills || []).map((skill) => ({
//         name: skill,
//         level: data.skills?.levels?.[skill] || "medium",
//       }));

//       setSkills(formattedSkills);
//     } catch (err) {
//       console.log("GET SKILLS ERROR:", err);
//     } finally {
//       setLoading(false);
//     }
//   };

//   // ================= TOGGLE SKILL =================
//   const toggleSkill = (skillName) => {
//     setSelectedSkills((prev) =>
//       prev.includes(skillName)
//         ? prev.filter((s) => s !== skillName)
//         : [...prev, skillName]
//     );
//   };

//   // ================= CREATE INTERVIEW =================
//   const handleCreateInterview = async () => {
//     try {
//       setLoading(true);

//       const res = await fetch("http://localhost:8000/api/ai/interview", {
//         method: "POST",
//         headers: {
//           "Content-Type": "application/json",
//         },
//         body: JSON.stringify({
//           role,
//           skills: selectedSkills, // 🔥 IMPORTANT CHANGE
//           difficulty,
//           questionCount,
//           questionTypes: ["text", "mcq", "code"],
//         }),
//       });

//       const data = await res.json();

//       setInterview(data.interview);
//     } catch (err) {
//       console.log("CREATE INTERVIEW ERROR:", err);
//     } finally {
//       setLoading(false);
//     }
//   };

//   return (
//     <div className="min-h-screen bg-gray-100 flex items-center justify-center p-6">
//       <div className="w-full max-w-2xl bg-white shadow-xl rounded-2xl p-6">

//         <h2 className="text-2xl font-bold text-center mb-6">
//           Create Interview
//         </h2>

//         {/* ROLE INPUT */}
//         <input
//           type="text"
//           placeholder="Enter Role (e.g. Frontend Developer)"
//           value={role}
//           onChange={(e) => setRole(e.target.value)}
//           className="w-full border p-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
//         />

//         {/* GET SKILLS */}
//         <button
//           onClick={handleGetSkills}
//           disabled={!role || loading}
//           className="w-full mt-3 bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 disabled:bg-gray-400"
//         >
//           {loading ? "Loading..." : "Get Skills"}
//         </button>

//         {/* SKILLS LIST (CLICKABLE) */}
//         {skills.length > 0 && (
//           <div className="mt-6">
//             <h3 className="font-semibold mb-2">
//               Select Skills (Click to choose)
//             </h3>

//             <ul className="grid grid-cols-2 gap-2">
//               {skills.map((s, i) => (
//                 <li
//                   key={i}
//                   onClick={() => toggleSkill(s.name)}
//                   className={`p-2 rounded-lg text-sm cursor-pointer border transition
//                     ${
//                       selectedSkills.includes(s.name)
//                         ? "bg-blue-600 text-white border-blue-600"
//                         : "bg-gray-100 border-gray-300"
//                     }`}
//                 >
//                   {s.name}{" "}
//                   <span className="opacity-70">({s.level})</span>
//                 </li>
//               ))}
//             </ul>
//           </div>
//         )}

//         {/* SETTINGS */}
//         <div className="mt-6 space-y-4">

//           <div>
//             <label className="font-medium">Difficulty</label>
//             <select
//               value={difficulty}
//               onChange={(e) => setDifficulty(e.target.value)}
//               className="w-full border p-2 rounded-lg mt-1"
//             >
//               <option value="easy">Easy</option>
//               <option value="medium">Medium</option>
//               <option value="hard">Hard</option>
//             </select>
//           </div>

//           <div>
//             <label className="font-medium">Question Count</label>
//             <input
//               type="number"
//               value={questionCount}
//               onChange={(e) => setQuestionCount(e.target.value)}
//               className="w-full border p-2 rounded-lg mt-1"
//             />
//           </div>
//         </div>

//         {/* CREATE INTERVIEW */}
//         <button
//           onClick={handleCreateInterview}
//           disabled={!selectedSkills.length || loading}
//           className="w-full mt-6 bg-green-600 text-white py-2 rounded-lg hover:bg-green-700 disabled:bg-gray-400"
//         >
//           Create Interview
//         </button>

//         {/* RESULT */}
//         {interview && (
//           <div className="mt-6 bg-green-50 border border-green-200 p-4 rounded-lg">
//             <h3 className="font-bold text-green-700">
//               🎉 Interview Created
//             </h3>
//             <p><b>Role:</b> {interview.role}</p>
//             <p><b>Status:</b> {interview.status}</p>
//             <p><b>Total Questions:</b> {interview.questions.length}</p>
//           </div>
//         )}
//       </div>
//     </div>
//   );{interview && (
//   <div className="mt-6 bg-green-50 border border-green-200 p-4 rounded-lg">
    
//     <h3 className="font-bold text-green-700">
//       🎉 Interview Created
//     </h3>

//     <p><b>Role:</b> {interview.role}</p>
//     <p><b>Status:</b> {interview.status}</p>
//     <p><b>Total Questions:</b> {interview.questions.length}</p>

//     {/* 🔥 ADD THIS */}
//     <div className="mt-4">
//       <h4 className="font-semibold">Questions:</h4>

//       <ul className="space-y-3 mt-2">
//         {interview.questions.map((q, i) => (
//           <li key={q._id} className="p-2 bg-white rounded border">
//             <p><b>Q{i + 1}:</b> {q.question}</p>

//             {q.type === "mcq" && (
//               <ul className="ml-4 list-disc text-sm">
//                 {q.options.map((opt, idx) => (
//                   <li key={idx}>{opt}</li>
//                 ))}
//               </ul>
//             )}
//           </li>
//         ))}
//       </ul>
//     </div>

//   </div>
// )}
// }

// export default Skills;

// import { useState } from "react";

// function Skills() {
//   const [role, setRole] = useState("");
//   const [skills, setSkills] = useState([]);
//   const [selectedSkills, setSelectedSkills] = useState([]);
//   const [difficulty, setDifficulty] = useState("medium");
//   const [questionCount, setQuestionCount] = useState(5);
//   const [loading, setLoading] = useState(false);
//   const [interview, setInterview] = useState(null);

//   // ================= GET SKILLS =================
//   const handleGetSkills = async () => {
//     try {
//       setLoading(true);

//       const res = await fetch("http://localhost:8000/api/ai/skills", {
//         method: "POST",
//         headers: {
//           "Content-Type": "application/json",
//         },
//         body: JSON.stringify({ role }),
//       });

//       const data = await res.json();

//       const formattedSkills = (data.skills?.skills || []).map((skill) => ({
//         name: skill,
//         level: data.skills?.levels?.[skill] || "medium",
//       }));

//       setSkills(formattedSkills);
//     } catch (err) {
//       console.log("GET SKILLS ERROR:", err);
//     } finally {
//       setLoading(false);
//     }
//   };

//   // ================= TOGGLE SKILL =================
//   const toggleSkill = (skillName) => {
//     setSelectedSkills((prev) =>
//       prev.includes(skillName)
//         ? prev.filter((s) => s !== skillName)
//         : [...prev, skillName]
//     );
//   };

//   // ================= CREATE INTERVIEW =================
//   const handleCreateInterview = async () => {
//     try {
//       setLoading(true);

//       const payload = {
//         role: role.trim(),
//         skills: selectedSkills,
//         difficulty,
//         questionTypes: ["mcq", "code", "text"],
//         questionCount: Number(questionCount),
//       };

//       const res = await fetch(
//         "http://localhost:8000/api/ai/interview",
//         {
//           method: "POST",
//           headers: {
//             "Content-Type": "application/json",
//           },
//           body: JSON.stringify(payload),
//         }
//       );

//       const data = await res.json();

//       setInterview(data.interview);
//     } catch (err) {
//       console.log("CREATE INTERVIEW ERROR:", err);
//     } finally {
//       setLoading(false);
//     }
//   };

//   return (
//     <div className="min-h-screen bg-gray-100 flex items-center justify-center p-6">
//       <div className="w-full max-w-2xl bg-white shadow-xl rounded-2xl p-6">

//         <h2 className="text-2xl font-bold text-center mb-6">
//           Create Interview
//         </h2>

//         {/* ROLE INPUT */}
//         <input
//           type="text"
//           placeholder="Enter Role (e.g. React Developer)"
//           value={role}
//           onChange={(e) => setRole(e.target.value)}
//           className="w-full border p-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
//         />

//         {/* GET SKILLS */}
//         <button
//           onClick={handleGetSkills}
//           disabled={!role || loading}
//           className="w-full mt-3 bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 disabled:bg-gray-400"
//         >
//           {loading ? "Loading..." : "Get Skills"}
//         </button>

//         {/* SKILLS LIST */}
//         {skills.length > 0 && (
//           <div className="mt-6">
//             <h3 className="font-semibold mb-2">
//               Select Skills (Click to choose)
//             </h3>

//             <ul className="grid grid-cols-2 gap-2">
//               {skills.map((s, i) => (
//                 <li
//                   key={i}
//                   onClick={() => toggleSkill(s.name)}
//                   className={`p-2 rounded-lg text-sm cursor-pointer border transition ${
//                     selectedSkills.includes(s.name)
//                       ? "bg-blue-600 text-white border-blue-600"
//                       : "bg-gray-100 border-gray-300"
//                   }`}
//                 >
//                   {s.name}{" "}
//                   <span className="opacity-70">({s.level})</span>
//                 </li>
//               ))}
//             </ul>
//           </div>
//         )}

//         {/* SETTINGS */}
//         <div className="mt-6 space-y-4">

//           {/* DIFFICULTY */}
//           <div>
//             <label className="font-medium">Difficulty</label>
//             <select
//               value={difficulty}
//               onChange={(e) => setDifficulty(e.target.value)}
//               className="w-full border p-2 rounded-lg mt-1"
//             >
//               <option value="easy">Easy</option>
//               <option value="medium">Medium</option>
//               <option value="hard">Hard</option>
//             </select>
//           </div>

//           {/* QUESTION COUNT */}
//           <div>
//             <label className="font-medium">Question Count</label>
//             <input
//               type="number"
//               value={questionCount}
//               onChange={(e) => setQuestionCount(e.target.value)}
//               className="w-full border p-2 rounded-lg mt-1"
//             />
//           </div>
//         </div>

//         {/* CREATE INTERVIEW */}
//         <button
//           onClick={handleCreateInterview}
//           disabled={!selectedSkills.length || loading}
//           className="w-full mt-6 bg-green-600 text-white py-2 rounded-lg hover:bg-green-700 disabled:bg-gray-400"
//         >
//           Create Interview
//         </button>

//         {/* RESULT */}
//         {interview && (
//           <div className="mt-6 bg-green-50 border border-green-200 p-4 rounded-lg">
//             <h3 className="font-bold text-green-700">
//               🎉 Interview Created
//             </h3>

//             <p><b>Role:</b> {interview.role}</p>
//             <p><b>Status:</b> {interview.status}</p>
//             <p><b>Total Questions:</b> {interview.questions.length}</p>

//             <div className="mt-4">
//               <h4 className="font-semibold">Questions:</h4>

//               <ul className="space-y-3 mt-2">
//                 {interview.questions.map((q, i) => (
//                   <li key={q._id} className="p-2 bg-white rounded border">
//                     <p><b>Q{i + 1}:</b> {q.question}</p>

//                     {q.type === "mcq" && (
//                       <ul className="ml-4 list-disc text-sm">
//                         {q.options.map((opt, idx) => (
//                           <li key={idx}>{opt}</li>
//                         ))}
//                       </ul>
//                     )}
//                   </li>
//                 ))}
//               </ul>
//             </div>

//           </div>
//         )}

//       </div>
//     </div>
//   );
// }

// export default Skills;
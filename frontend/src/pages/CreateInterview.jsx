import { useState } from "react";
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer } from "recharts";
function CreateInterview() {
  const [role, setRole] = useState("");
  const [experience, setExperience] = useState("fresher");
  const [difficulty, setDifficulty] = useState("easy");
  const [questionCount, setQuestionCount] = useState(5);

  const [loading, setLoading] = useState(false);

  const [interview, setInterview] = useState(null);

  const [answers, setAnswers] = useState({});
  const [evaluation, setEvaluation] = useState(null);
  const [finalScore, setFinalScore] = useState(null);
  const [performance, setPerformance] = useState("");

  // ================= CREATE INTERVIEW =================
  const createInterview = async () => {
    if (!role.trim()) return alert("Please enter a role");

    try {
      setLoading(true);

      const res = await fetch("http://localhost:8000/api/interview/create", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({
          role,
          experience,
          difficulty,
          questionCount: Number(questionCount),
        }),
      });

      const data = await res.json();

      if (data.success) {
        setInterview(data.interview);
        setAnswers({});
        setEvaluation(null);
        setFinalScore(null);
        setPerformance("");
      } else {
        alert(data.message || "Failed");
      }
    } catch (err) {
      console.log(err);
      alert("Server Error");
    } finally {
      setLoading(false);
    }
  };

  // ================= ANSWER CHANGE =================
  const handleAnswerChange = (index, value) => {
    setAnswers((prev) => ({
      ...prev,
      [index]: value,
    }));
  };

  // ================= SUBMIT INTERVIEW =================
  const submitInterview = async () => {
    if (!interview) return;

    const formattedAnswers = interview.questions.map((q, index) => ({
      question: q.question,
      answer: answers[index] || "",
    }));

    try {
      setLoading(true);

      const res = await fetch("http://localhost:8000/api/interview/submit", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({
          interviewId: interview._id,
          answers: formattedAnswers,
        }),
      });

      const data = await res.json();

      if (data.success) {
        setEvaluation(data.evaluation);
        setFinalScore(data.finalScore);
        setPerformance(data.performance);
      } else {
        alert(data.message || "Submit failed");
      }
    } catch (err) {
      console.log(err);
      alert("Server Error");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen px-4 py-10 flex flex-col items-center bg-[#050505] text-white">

      {/* ================= FORM ================= */}
      <div className="w-full max-w-lg p-8 rounded-3xl bg-white/5 border border-white/10">

        <h1 className="text-3xl font-bold text-center mb-6">
          Create <span className="text-orange-500">Interview</span>
        </h1>

        <label>Role</label>
        <input
          value={role}
          onChange={(e) => setRole(e.target.value)}
          className="w-full mb-4 mt-1 px-4 py-3 rounded-xl bg-black/40 border border-orange-400/30"
          placeholder="Frontend Developer"
        />

        <label>Experience</label>
        <select
          value={experience}
          onChange={(e) => setExperience(e.target.value)}
          className="w-full mb-4 mt-1 px-4 py-3 rounded-xl bg-black/40 border border-orange-400/30"
        >
          <option value="fresher">Fresher</option>
          <option value="1-2 years">1-2 Years</option>
          <option value="3+ years">3+ Years</option>
        </select>

        <label>Difficulty</label>
        <select
          value={difficulty}
          onChange={(e) => setDifficulty(e.target.value)}
          className="w-full mb-4 mt-1 px-4 py-3 rounded-xl bg-black/40 border border-orange-400/30"
        >
          <option value="easy">Easy</option>
          <option value="medium">Medium</option>
          <option value="hard">Hard</option>
        </select>

        <label>Questions</label>
        <input
          type="number"
          value={questionCount}
          onChange={(e) => setQuestionCount(e.target.value)}
          className="w-full mb-6 mt-1 px-4 py-3 rounded-xl bg-black/40 border border-orange-400/30"
        />

        <button
          onClick={createInterview}
          disabled={loading}
          className="w-full py-3 bg-orange-500 rounded-xl font-semibold"
        >
          {loading ? "Generating..." : "Generate Interview"}
        </button>
      </div>

      {/* ================= QUESTIONS ================= */}
      {interview && (
        <div className="w-full max-w-2xl mt-10 p-6 rounded-2xl bg-white/10 border border-white/20">

          <h2 className="text-xl font-bold text-orange-400 mb-4">
             Answer Questions (Skip allowed)
          </h2>

          {interview.questions.map((q, index) => (
            <div key={index} className="mb-4">
              <p className="mb-1 text-gray-200">
                Q{index + 1}: {q.question}
              </p>

              <input
                type="text"
                value={answers[index] || ""}
                onChange={(e) => handleAnswerChange(index, e.target.value)}
                placeholder="Skip if you want..."
                className="w-full px-4 py-2 rounded-xl bg-black/40 border border-orange-400/30"
              />
            </div>
          ))}

          <button
            onClick={submitInterview}
            className="w-full mt-4 py-3 bg-green-500 rounded-xl font-semibold"
          >
            Submit Interview
          </button>
        </div>
      )}

     {evaluation && (
  <div className="w-full max-w-4xl mt-10 grid grid-cols-1 md:grid-cols-2 gap-6">

    {/* ================= CHART CARD ================= */}
    <div className="p-5 rounded-2xl bg-black/40 border border-white/20">

      <h2 className="text-lg font-bold text-orange-400 mb-4">
        📊 Skill Analysis
      </h2>

      {/* ✅ REAL REACT CHART */}
      <div className="w-full h-64">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart
            data={[
              {
                name: "Communication",
                score: evaluation.communication,
              },
              {
                name: "Technical",
                score: evaluation.technical,
              },
              {
                name: "Confidence",
                score: evaluation.confidence,
              },
              {
                name: "Overall",
                score: evaluation.overall,
              },
            ]}
          >
            <XAxis dataKey="name" stroke="#ccc" />
            <YAxis />
            <Tooltip />
            <Bar dataKey="score" fill="#f97316" radius={[6, 6, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </div>

    </div>

    {/* ================= RESULT CARD ================= */}
    <div className="p-6 rounded-2xl bg-black/40 border border-white/20">

      <h2 className="text-xl font-bold text-orange-400">
       AI Feedback Result
      </h2>

      <p className="mt-3 text-3xl font-bold text-white">
        {finalScore}/10
      </p>

      <p className="text-gray-300 mt-1">
        {performance}
      </p>

      {/* progress bar */}
      <div className="w-full h-3 bg-gray-800 rounded-full mt-5">
        <div
          className="h-full bg-orange-500 transition-all duration-500"
          style={{ width: `${finalScore * 10}%` }}
        />
      </div>

      {/* DETAILS */}
      <div className="mt-5 text-gray-300 text-sm space-y-1">
        <p>Communication: {evaluation.communication}</p>
        <p>Technical: {evaluation.technical}</p>
        <p>Confidence: {evaluation.confidence}</p>
        <p>Overall: {evaluation.overall}</p>
      </div>

    </div>

  </div>
)}
    </div>
  );
}

export default CreateInterview;  
// import { useState } from "react";
// import {
//   BarChart,
//   Bar,
//   XAxis,
//   YAxis,
//   Tooltip,
//   ResponsiveContainer,
// } from "recharts";

// function CreateInterview() {
//   const [role, setRole] = useState("");
//   const [experience, setExperience] = useState("fresher");
//   const [difficulty, setDifficulty] = useState("easy");
//   const [questionCount, setQuestionCount] = useState(5);

//   const [loading, setLoading] = useState(false);

//   const [interview, setInterview] = useState(null);
//   const [answers, setAnswers] = useState({});

//   const [evaluation, setEvaluation] = useState(null);
//   const [finalScore, setFinalScore] = useState(0);
//   const [performance, setPerformance] = useState("");

//   // ================= CREATE =================
//   const createInterview = async () => {
//     if (!role.trim()) return alert("Please enter a role");

//     try {
//       setLoading(true);

//       const res = await fetch("http://localhost:8000/api/interview/create", {
//         method: "POST",
//         headers: { "Content-Type": "application/json" },
//         credentials: "include",
//         body: JSON.stringify({
//           role,
//           experience,
//           difficulty,
//           questionCount: Number(questionCount),
//         }),
//       });

//       const data = await res.json();

//       if (data?.success) {
//         setInterview(data.interview);
//         setAnswers({});
//         setEvaluation(null);
//         setFinalScore(0);
//         setPerformance("");
//       } else {
//         alert(data?.message || "Failed");
//       }
//     } catch (err) {
//       console.log(err);
//       alert("Server Error");
//     } finally {
//       setLoading(false);
//     }
//   };

//   // ================= ANSWERS =================
//   const handleAnswerChange = (index, value) => {
//     setAnswers((prev) => ({
//       ...prev,
//       [index]: value,
//     }));
//   };

//   // ================= SUBMIT =================
//   const submitInterview = async () => {
//     if (!interview) return;

//     const formattedAnswers = interview.questions.map((q, index) => ({
//       question: q.question,
//       answer: answers[index] || "",
//     }));

//     try {
//       setLoading(true);

//       const res = await fetch("http://localhost:8000/api/interview/submit", {
//         method: "POST",
//         headers: { "Content-Type": "application/json" },
//         credentials: "include",
//         body: JSON.stringify({
//           interviewId: interview._id,
//           answers: formattedAnswers,
//         }),
//       });

//       const data = await res.json();

//       if (data?.success) {
//         setEvaluation(data.evaluation || {});
//         setFinalScore(data.finalScore || 0);
//         setPerformance(data.performance || "");
//       } else {
//         alert(data?.message || "Submit failed");
//       }
//     } catch (err) {
//       console.log(err);
//       alert("Server Error");
//     } finally {
//       setLoading(false);
//     }
//   };

//   return (
//     <div className="min-h-screen px-4 py-10 flex flex-col items-center bg-[#050505] text-white">

//       {/* FORM */}
//       <div className="w-full max-w-lg p-8 rounded-3xl bg-white/5 border border-white/10">

//         <h1 className="text-3xl font-bold text-center mb-6">
//           Create <span className="text-orange-500">Interview</span>
//         </h1>

//         <input
//           value={role}
//           onChange={(e) => setRole(e.target.value)}
//           className="w-full mb-4 px-4 py-3 rounded-xl bg-black/40 border border-orange-400/30"
//           placeholder="Frontend Developer"
//         />

//         <select
//           value={experience}
//           onChange={(e) => setExperience(e.target.value)}
//           className="w-full mb-4 px-4 py-3 rounded-xl bg-black/40 border border-orange-400/30"
//         >
//           <option value="fresher">Fresher</option>
//           <option value="1-2 years">1-2 Years</option>
//           <option value="3+ years">3+ Years</option>
//         </select>

//         <select
//           value={difficulty}
//           onChange={(e) => setDifficulty(e.target.value)}
//           className="w-full mb-4 px-4 py-3 rounded-xl bg-black/40 border border-orange-400/30"
//         >
//           <option value="easy">Easy</option>
//           <option value="medium">Medium</option>
//           <option value="hard">Hard</option>
//         </select>

//         <input
//           type="number"
//           value={questionCount}
//           onChange={(e) => setQuestionCount(Number(e.target.value))}
//           className="w-full mb-6 px-4 py-3 rounded-xl bg-black/40 border border-orange-400/30"
//         />

//         <button
//           onClick={createInterview}
//           disabled={loading}
//           className="w-full py-3 bg-orange-500 rounded-xl font-semibold"
//         >
//           {loading ? "Generating..." : "Generate Interview"}
//         </button>
//       </div>

//       {/* QUESTIONS */}
//       {interview && (
//         <div className="w-full max-w-2xl mt-10 p-6 rounded-2xl bg-white/10 border border-white/20">

//           <h2 className="text-xl font-bold text-orange-400 mb-4">
//             🧠 Answer Questions
//           </h2>

//           {interview.questions?.map((q, index) => (
//             <div key={index} className="mb-4">
//               <p className="mb-1">
//                 Q{index + 1}: {q.question}
//               </p>

//               <input
//                 value={answers[index] || ""}
//                 onChange={(e) => handleAnswerChange(index, e.target.value)}
//                 className="w-full px-4 py-2 rounded-xl bg-black/40 border border-orange-400/30"
//               />
//             </div>
//           ))}

//           <button
//             onClick={submitInterview}
//             className="w-full mt-4 py-3 bg-green-500 rounded-xl font-semibold"
//           >
//             Submit Interview
//           </button>
//         </div>
//       )}

//       {/* RESULTS SAFE */}
//       {evaluation && (
//         <div className="w-full max-w-4xl mt-10 grid grid-cols-1 md:grid-cols-2 gap-6">

//           <div className="p-5 rounded-2xl bg-black/40 border border-white/20">
//             <h2 className="text-lg font-bold text-orange-400 mb-4">
//               📊 Skill Analysis
//             </h2>

//             <div className="h-64">
//               <ResponsiveContainer width="100%" height="100%">
//                 <BarChart
//                   data={[
//                     { name: "Communication", score: evaluation?.communication || 0 },
//                     { name: "Technical", score: evaluation?.technical || 0 },
//                     { name: "Confidence", score: evaluation?.confidence || 0 },
//                     { name: "Overall", score: evaluation?.overall || 0 },
//                   ]}
//                 >
//                   <XAxis dataKey="name" stroke="#ccc" />
//                   <YAxis />
//                   <Tooltip />
//                   <Bar dataKey="score" fill="#f97316" />
//                 </BarChart>
//               </ResponsiveContainer>
//             </div>
//           </div>

//           <div className="p-6 rounded-2xl bg-black/40 border border-white/20">

//             <h2 className="text-xl font-bold text-orange-400">
//               🎯 Result
//             </h2>

//             <p className="text-3xl font-bold mt-2">
//               {finalScore}/10
//             </p>

//             <p className="text-gray-300 mt-1">
//               {performance}
//             </p>

//           </div>

//         </div>
//       )}

//     </div>
//   );
// }

// export default CreateInterview;
// import { useState } from "react";
// import { useNavigate } from "react-router-dom";

// function CreateInterview() {
//   const [role, setRole] = useState("");
//   const [experience, setExperience] = useState("fresher");
//   const [difficulty, setDifficulty] = useState("easy");
//   const [questionCount, setQuestionCount] = useState(5);
//   const [loading, setLoading] = useState(false);

//   const navigate = useNavigate();

//   const createInterview = async () => {
//     if (!role.trim()) {
//       return alert("Please enter a role");
//     }

//     try {
//       setLoading(true);

//       const res = await fetch(
//         "http://localhost:8000/api/interview/create",
//         {
//           method: "POST",
//           headers: {
//             "Content-Type": "application/json",
//           },
//           credentials: "include",
//           body: JSON.stringify({
//             role,
//             experience,
//             difficulty,
//             questionCount,
//           }),
//         }
//       );

//       const data = await res.json();

//       if (data.success) {
//         alert("Interview Created Successfully");
//         navigate(`/interview/${data.interview._id}`);
//       } else {
//         alert(data.message || "Failed");
//       }
//     } catch (error) {
//       console.log(error);
//       alert("Server Error");
//     } finally {
//       setLoading(false);
//     }
//   };

//   return (
//     <div className="min-h-screen bg-[#050505] flex items-center justify-center px-4 relative overflow-hidden">
      
//       <div className="absolute w-[500px] h-[500px] bg-fuchsia-600/20 blur-3xl rounded-full -top-40 -left-40 animate-pulse"></div>

//       <div className="absolute w-[500px] h-[500px] bg-orange-500/20 blur-3xl rounded-full -bottom-40 -right-40 animate-pulse"></div>

//       <div className="absolute w-[300px] h-[300px] bg-emerald-500/10 blur-3xl rounded-full top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2"></div>

//       <div className="relative w-full max-w-lg">
//         <div className="bg-white/[0.03] backdrop-blur-2xl border border-white/10 rounded-3xl p-8 shadow-[0_0_80px_rgba(168,85,247,0.15)] hover:shadow-[0_0_100px_rgba(249,115,22,0.2)] transition-all duration-700">

//           <div className="text-center mb-8">
//             <h1 className="text-4xl font-black text-white">
//               Create Interview
//             </h1>

//             <p className="text-zinc-400 mt-2">
//               Generate AI Powered Mock Interviews
//             </p>
//           </div>

//           <div className="space-y-4">

//             <input
//               type="text"
//               placeholder="Frontend Developer"
//               value={role}
//               onChange={(e) => setRole(e.target.value)}
//               className="w-full bg-black/40 border border-white/10 text-white px-4 py-3 rounded-xl outline-none transition-all duration-300 focus:border-fuchsia-500 focus:shadow-[0_0_20px_rgba(168,85,247,0.3)]"
//             />

//             <select
//               value={experience}
//               onChange={(e) => setExperience(e.target.value)}
//               className="w-full bg-black/40 border border-white/10 text-white px-4 py-3 rounded-xl outline-none"
//             >
//               <option value="fresher">Fresher</option>
//               <option value="1-2 years">1-2 Years</option>
//               <option value="3+ years">3+ Years</option>
//             </select>

//             <select
//               value={difficulty}
//               onChange={(e) => setDifficulty(e.target.value)}
//               className="w-full bg-black/40 border border-white/10 text-white px-4 py-3 rounded-xl outline-none"
//             >
//               <option value="easy">Easy</option>
//               <option value="medium">Medium</option>
//               <option value="hard">Hard</option>
//             </select>

//             <input
//               type="number"
//               min="1"
//               max="20"
//               value={questionCount}
//               onChange={(e) => setQuestionCount(e.target.value)}
//               className="w-full bg-black/40 border border-white/10 text-white px-4 py-3 rounded-xl outline-none"
//             />

//             <button
//               onClick={createInterview}
//               disabled={loading}
//               className="w-full py-3 rounded-xl font-semibold text-white bg-gradient-to-r from-fuchsia-600 via-purple-600 to-orange-500 hover:scale-[1.03] hover:shadow-[0_0_30px_rgba(249,115,22,0.4)] transition-all duration-300 disabled:opacity-50"
//             >
//               {loading ? "Generating..." : "Generate Interview"}
//             </button>

//           </div>

//         </div>
//       </div>
//     </div>
//   );
// }

// export default CreateInterview;
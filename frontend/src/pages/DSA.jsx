import { useState } from "react";

function DSA() {
  const [company, setCompany] = useState("");
  const [difficulty, setDifficulty] = useState("easy");
  const [topic, setTopic] = useState("");
  const [questionCount, setQuestionCount] = useState(5);

  const [questions, setQuestions] = useState([]);
  const [loading, setLoading] = useState(false);

  const [activeQuestionIndex, setActiveQuestionIndex] = useState(null);
  const [codeMap, setCodeMap] = useState({});
  const [language, setLanguage] = useState("javascript");

  const [runResult, setRunResult] = useState(null);
  const [solveResult, setSolveResult] = useState(null);
  const token = localStorage.getItem("token");

  const generateQuestions = async () => {
    try {
      setLoading(true);

      const res = await fetch("https://ai-interview-prep-ffjr.onrender.com/api/dsa", {
        method: "POST",
       headers: {
  "Content-Type": "application/json",
  Authorization: `Bearer ${token}`,
},
        body: JSON.stringify({
          company,
          difficulty,
          topic,
          questionCount,
        }),
      });

      const data = await res.json();
      setQuestions(data.questions || []);
    } catch (err) {
      console.log(err);
    } finally {
      setLoading(false);
    }
  };

  const openEditor = (index) => {
    setActiveQuestionIndex(index);

    setCodeMap((prev) => ({
      ...prev,
      [index]: prev[index] || questions[index].starterCode || "",
    }));
  };

  const updateCode = (value) => {
    setCodeMap((prev) => ({
      ...prev,
      [activeQuestionIndex]: value,
    }));
  };

  const runCode = async () => {
    try {
      const code = codeMap[activeQuestionIndex] || "";
      const currentQuestion = questions[activeQuestionIndex];

      const res = await fetch("https://ai-interview-prep-ffjr.onrender.com/api/run-code", {
        method: "POST",
      headers: {
  "Content-Type": "application/json",
  Authorization: `Bearer ${token}`,
},
        body: JSON.stringify({
          code,
          language,
          testCases: currentQuestion.testCases || [],
        }),
      });

      const data = await res.json();

      if (!data.success) return alert(data.message);

      setRunResult(data.result);
    } catch (err) {
      console.log(err);
    }
  };

  const solveDSA = async (question) => {
    try {
      const code = codeMap[activeQuestionIndex] || "";

      const res = await fetch("https://ai-interview-prep-ffjr.onrender.com/api/dsa/solve", {
        method: "POST",
      headers: {
  "Content-Type": "application/json",
  Authorization: `Bearer ${token}`,
},
        body: JSON.stringify({
          question,
          code,
          language,
        }),
      });

      const data = await res.json();
      setSolveResult(data.result);
    } catch (err) {
      console.log(err);
    }
  };

  return (
    <div className="min-h-screen bg-[#050505] text-white p-6 relative overflow-hidden">

      {/* Glow Background */}
      <div className="absolute w-[500px] h-[500px] bg-orange-500/20 blur-3xl rounded-full -top-40 -left-40 animate-pulse"></div>
      <div className="absolute w-[500px] h-[500px] bg-fuchsia-600/20 blur-3xl rounded-full -bottom-40 -right-40 animate-pulse"></div>

      <div className="max-w-6xl mx-auto relative">

        {/* HEADER */}
        <div className="text-center mb-8">
          <h1 className="text-5xl font-black">
            DSA <span className="text-orange-500">AI Practice</span>
          </h1>
          <p className="text-sm opacity-70 mt-2">
            LeetCode + AI Code Reviewer + Interview Prep
          </p>
        </div>

        {/* INPUT PANEL */}
        <div className="bg-white/5 border border-white/10 backdrop-blur-2xl rounded-3xl p-6 mb-6">

          <div className="grid md:grid-cols-2 gap-4">

            <input
              placeholder="Company (Google, Amazon...)"
              value={company}
              onChange={(e) => setCompany(e.target.value)}
              className="p-3 rounded-xl bg-black/40 border border-white/10"
            />

            <input
              placeholder="Topic (Array, DP, Graph...)"
              value={topic}
              onChange={(e) => setTopic(e.target.value)}
              className="p-3 rounded-xl bg-black/40 border border-white/10"
            />

            <select
              value={difficulty}
              onChange={(e) => setDifficulty(e.target.value)}
              className="p-3 rounded-xl bg-black/40 border border-white/10"
            >
              <option>easy</option>
              <option>medium</option>
              <option>hard</option>
            </select>

            <input
              type="number"
              value={questionCount}
              onChange={(e) => setQuestionCount(e.target.value)}
              className="p-3 rounded-xl bg-black/40 border border-white/10"
            />
          </div>

          <button
            onClick={generateQuestions}
            disabled={loading}
            className="w-full mt-5 py-3 rounded-xl bg-orange-500 hover:bg-orange-600 font-semibold"
          >
            {loading ? "Generating..." : "Generate DSA Questions"}
          </button>
        </div>

        {/* QUESTIONS */}
        <div className="space-y-5">

          {questions.map((q, i) => (
            <div
              key={i}
              className="bg-white/5 border border-white/10 rounded-2xl p-5"
            >

              {/* QUESTION */}
              <div className="flex justify-between items-start gap-4">
                <div>
                  <p className="font-medium text-lg">
                    Q{i + 1}: {q.question}
                  </p>
                  <p className="text-sm opacity-70 mt-1">
                    Company: {company || "N/A"}
                  </p>
                </div>

                <div className="flex gap-2">
                  <button
                    onClick={() => openEditor(i)}
                    className="px-3 py-1 rounded-lg bg-black/40 border border-white/10"
                  >
                    Code
                  </button>

                  <button
                    onClick={() => solveDSA(q.question)}
                    className="px-3 py-1 rounded-lg bg-orange-500"
                  >
                    AI Solve
                  </button>
                </div>
              </div>

              {/* CODE EDITOR */}
              {activeQuestionIndex === i && (
                <div className="mt-4">

                  <select
                    value={language}
                    onChange={(e) => setLanguage(e.target.value)}
                    className="p-2 mb-2 rounded-lg bg-black/40 border border-white/10"
                  >
                    <option>javascript</option>
                    <option>python</option>
                    <option>java</option>
                  </select>

                  <textarea
                    value={codeMap[i] || ""}
                    onChange={(e) => updateCode(e.target.value)}
                    className="w-full h-40 p-3 rounded-xl bg-black/40 border border-white/10"
                    placeholder="Write your code..."
                  />

                  <button
                    onClick={runCode}
                    className="w-full mt-3 py-3 rounded-xl bg-fuchsia-600 hover:bg-fuchsia-700"
                  >
                    Run Code
                  </button>
                </div>
              )}

            </div>
          ))}
        </div>

        {/* OUTPUT */}
        {runResult && (
          <div className="mt-6 bg-black/40 border border-white/10 p-4 rounded-xl">
            <pre>{JSON.stringify(runResult, null, 2)}</pre>
          </div>
        )}

        {/* AI SOLVE */}
        {solveResult && (
          <div className="mt-6 bg-green-500/10 border border-green-500/20 p-4 rounded-xl">

            <p><b>Approach:</b> {solveResult.approach}</p>
            <p><b>Correct:</b> {solveResult.isCorrect ? "Yes" : "No"}</p>
            <p><b>Time:</b> {solveResult.timeComplexity}</p>
            <p><b>Space:</b> {solveResult.spaceComplexity}</p>

            <pre className="mt-3 bg-black p-3 rounded-lg overflow-x-auto">
              {solveResult.correctCode}
            </pre>

          </div>
        )}

      </div>
    </div>
  );
}

export default DSA;

// import { useState } from "react";

// function DSA() {
//   // ================= GENERATE STATES =================
//   const [company, setCompany] = useState("");
//   const [difficulty, setDifficulty] = useState("easy");
//   const [topic, setTopic] = useState("");
//   const [questionCount, setQuestionCount] = useState(5);

//   const [questions, setQuestions] = useState([]);
//   const [loading, setLoading] = useState(false);

//   // ================= CODE STATES =================
//   const [code, setCode] = useState("");
//   const [language, setLanguage] = useState("javascript");

//   const [runResult, setRunResult] = useState(null);
//   const [solveResult, setSolveResult] = useState("");

//   // ================= GET DSA QUESTIONS =================
//   const generateQuestions = async () => {
//     try {
//       setLoading(true);

//       const res = await fetch("http://localhost:8000/api/dsa", {
//         method: "POST",
//         headers: {
//           "Content-Type": "application/json",
//         },
//         credentials: "include",
//         body: JSON.stringify({
//           company,
//           difficulty,
//           topic,
//           questionCount,
//         }),
//       });

//       const data = await res.json();

//       setQuestions(data.questions || []);
//     } catch (err) {
//       console.log(err);
//     } finally {
//       setLoading(false);
//     }
//   };

//   // ================= RUN CODE =================
//   const runCode = async () => {
//     try {
//       const res = await fetch("http://localhost:8000/api/run-code", {
//         method: "POST",
//         headers: {
//           "Content-Type": "application/json",
//         },
//         credentials: "include",
//         body: JSON.stringify({
//           code,
//           language,
//           testCases: [],
//         }),
//       });

//       const data = await res.json();
//       setRunResult(data.result);
//     } catch (err) {
//       console.log(err);
//     }
//   };

//   // ================= SOLVE DSA =================
//   const solveDSA = async (question) => {
//     try {
//       const res = await fetch("http://localhost:8000/api/dsa/solve", {
//         method: "POST",
//         headers: {
//           "Content-Type": "application/json",
//         },
//         credentials: "include",
//         body: JSON.stringify({
//           question,
//           code,
//           language,
//         }),
//       });

//       const data = await res.json();
//       setSolveResult(data.result);
//     } catch (err) {
//       console.log(err);
//     }
//   };

//   return (
//     <div className="min-h-screen bg-gray-100 p-6 flex justify-center">
//       <div className="w-full max-w-3xl bg-white p-6 rounded-xl shadow-lg">

//         <h1 className="text-2xl font-bold mb-4">DSA Generator + Runner</h1>

//         {/* ================= INPUTS ================= */}
//         <input
//           className="w-full border p-2 mb-2"
//           placeholder="Company (Google, Amazon)"
//           value={company}
//           onChange={(e) => setCompany(e.target.value)}
//         />

//         <input
//           className="w-full border p-2 mb-2"
//           placeholder="Topic (Arrays, DP, Trees)"
//           value={topic}
//           onChange={(e) => setTopic(e.target.value)}
//         />

//         <select
//           className="w-full border p-2 mb-2"
//           value={difficulty}
//           onChange={(e) => setDifficulty(e.target.value)}
//         >
//           <option>easy</option>
//           <option>medium</option>
//           <option>hard</option>
//         </select>

//         <input
//           type="number"
//           className="w-full border p-2 mb-2"
//           value={questionCount}
//           onChange={(e) => setQuestionCount(e.target.value)}
//         />

//         {/* GENERATE BUTTON */}
//         <button
//           onClick={generateQuestions}
//           disabled={loading}
//           className="w-full bg-blue-600 text-white p-2 rounded"
//         >
//           {loading ? "Generating..." : "Generate DSA Questions"}
//         </button>

//         {/* ================= QUESTIONS ================= */}
//         {questions.length > 0 && (
//           <div className="mt-6">
//             <h2 className="font-bold mb-2">Questions</h2>

//             {questions.map((q, i) => (
//               <div key={i} className="border p-3 mb-2 rounded">
//                 <p className="font-semibold">
//                   Q{i + 1}: {q.question}
//                 </p>

//                 <button
//                   onClick={() => solveDSA(q.question)}
//                   className="mt-2 bg-green-600 text-white px-3 py-1 rounded"
//                 >
//                   Solve with AI
//                 </button>
//               </div>
//             ))}
//           </div>
//         )}

//         {/* ================= CODE EDITOR ================= */}
//         <div className="mt-6">
//           <h2 className="font-bold">Code Editor</h2>

//           <select
//             className="border p-2 w-full mb-2"
//             value={language}
//             onChange={(e) => setLanguage(e.target.value)}
//           >
//             <option value="javascript">JavaScript</option>
//             <option value="python">Python</option>
//             <option value="java">Java</option>
//           </select>

//           <textarea
//             className="w-full border p-2 h-40"
//             value={code}
//             onChange={(e) => setCode(e.target.value)}
//             placeholder="Write your code here..."
//           />

//           <button
//             onClick={runCode}
//             className="w-full bg-black text-white p-2 mt-2 rounded"
//           >
//             Run Code
//           </button>
//         </div>

//         {/* ================= OUTPUT ================= */}
//         {runResult && (
//           <div className="mt-4 bg-gray-200 p-3 rounded">
//             <h3 className="font-bold">Output:</h3>
//             <pre>{JSON.stringify(runResult, null, 2)}</pre>
//           </div>
//         )}

//         {/* ================= AI SOLUTION ================= */}
//         {solveResult && (
//           <div className="mt-4 bg-green-100 p-3 rounded">
//             <h3 className="font-bold">AI Solution:</h3>
//             <pre>{solveResult}</pre>
//           </div>
//         )}

//       </div>
//     </div>
//   );
// }

// export default DSA;
// import { useState } from "react";

// function DSA() {
//   const [company, setCompany] = useState("");
//   const [difficulty, setDifficulty] = useState("easy");
//   const [topic, setTopic] = useState("");
//   const [questionCount, setQuestionCount] = useState(5);

//   const [questions, setQuestions] = useState([]);
//   const [loading, setLoading] = useState(false);

//   // 🔥 selected question state
//   const [activeQuestionIndex, setActiveQuestionIndex] = useState(null);

//   // code per question
//   const [codeMap, setCodeMap] = useState({});
//   const [language, setLanguage] = useState("javascript");

//   const [runResult, setRunResult] = useState(null);
//   const [solveResult, setSolveResult] = useState("");

//   // ================= GENERATE QUESTIONS =================
//   const generateQuestions = async () => {
//     try {
//       setLoading(true);

//       const res = await fetch("http://localhost:8000/api/dsa", {
//         method: "POST",
//         headers: { "Content-Type": "application/json" },
//         credentials: "include",
//         body: JSON.stringify({
//           company,
//           difficulty,
//           topic,
//           questionCount,
//         }),
//       });

//       const data = await res.json();
//       setQuestions(data.questions || []);
//     } catch (err) {
//       console.log(err);
//     } finally {
//       setLoading(false);
//     }
//   };

//   // ================= OPEN CODE EDITOR =================
//   // const openEditor = (index) => {
//   //   setActiveQuestionIndex(index);

//   //   // initialize code if not exists
//   //   setCodeMap((prev) => ({
//   //     ...prev,
//   //     [index]: prev[index] || "",
//   //   }));
//   // };
// const openEditor = (index) => {
//   setActiveQuestionIndex(index);

//   setCodeMap((prev) => ({
//     ...prev,
//     [index]: prev[index] || questions[index].starterCode || "",
//   }));
// };
//   // ================= UPDATE CODE =================
//   const updateCode = (value) => {
//     setCodeMap((prev) => ({
//       ...prev,
//       [activeQuestionIndex]: value,
//     }));
//   };
// const runCode = async () => {
//   try {
//     const code = codeMap[activeQuestionIndex] || "";

//     // Current AI generated question
//     const currentQuestion = questions[activeQuestionIndex];

//     const res = await fetch("http://localhost:8000/api/run-code", {
//       method: "POST",
//       headers: {
//         "Content-Type": "application/json",
//       },
//       credentials: "include",
//       body: JSON.stringify({
//         code,
//         language,
//         testCases: currentQuestion.testCases || [],
//       }),
//     });

//     const data = await res.json();

//     if (!data.success) {
//       alert(data.message);
//       return;
//     }

//     setRunResult(data.result);
//   } catch (err) {
//     console.error(err);
//   }
// };
// //   // ================= RUN CODE =================
// //   const runCode = async () => {
// //     try {
// //       const code = codeMap[activeQuestionIndex] || "";

// //       const res = await fetch("http://localhost:8000/api/run-code", {
// //         method: "POST",
// //         headers: { "Content-Type": "application/json" },
// //         credentials: "include",
// //        body: JSON.stringify({
// //   code,
// //   language,
// //   testCases: [
// //     {
// //       input: [[2, 1, 3, 5, 3, 2]],
// //       expected: 3,
// //     },
// //     {
// //       input: [[1, 2, 3, 4]],
// //       expected: null,
// //     },
// //     {
// //       input: [[5, 5, 6, 7]],
// //       expected: 5,
// //     },
// //   ],
// // }),
// //       });

// //       const data = await res.json();
// //       setRunResult(data.result);
// //     } catch (err) {
// //       console.log(err);
// //     }
// //   };

//   // ================= SOLVE AI =================
//   const solveDSA = async (question) => {
//     try {
//       const code = codeMap[activeQuestionIndex] || "";

//       const res = await fetch("http://localhost:8000/api/dsa/solve", {
//         method: "POST",
//         headers: { "Content-Type": "application/json" },
//         credentials: "include",
//         body: JSON.stringify({
//           question,
//           code,
//           language,
//         }),
//       });

//       const data = await res.json();
//       setSolveResult(data.result);
//     } catch (err) {
//       console.log(err);
//     }
//   };

//   return (
//     <div className="min-h-screen bg-gray-100 p-6 flex justify-center">
//       <div className="w-full max-w-4xl bg-white p-6 rounded-xl shadow-lg">

//         <h1 className="text-2xl font-bold mb-4">DSA Practice</h1>

//         {/* INPUTS */}
//         <input
//           className="w-full border p-2 mb-2"
//           placeholder="Company"
//           value={company}
//           onChange={(e) => setCompany(e.target.value)}
//         />

//         <input
//           className="w-full border p-2 mb-2"
//           placeholder="Topic"
//           value={topic}
//           onChange={(e) => setTopic(e.target.value)}
//         />

//         <select
//           className="w-full border p-2 mb-2"
//           value={difficulty}
//           onChange={(e) => setDifficulty(e.target.value)}
//         >
//           <option>easy</option>
//           <option>medium</option>
//           <option>hard</option>
//         </select>

//         <input
//           type="number"
//           className="w-full border p-2 mb-2"
//           value={questionCount}
//           onChange={(e) => setQuestionCount(e.target.value)}
//         />

//         <button
//           onClick={generateQuestions}
//           className="w-full bg-blue-600 text-white p-2 rounded"
//         >
//           Generate Questions
//         </button>

//         {/* ================= QUESTIONS ================= */}
//         {questions.map((q, i) => (
//           <div key={i} className="border p-3 mt-3 rounded">

//             <p className="font-semibold">
//               Q{i + 1}: {q.question}
//             </p>

//             <button
//               onClick={() => openEditor(i)}
//               className="mt-2 bg-black text-white px-3 py-1 rounded"
//             >
//               Write Code
//             </button>

//             {/* AI Solve */}
//             <button
//               onClick={() => solveDSA(q.question)}
//               className="mt-2 ml-2 bg-green-600 text-white px-3 py-1 rounded"
//             >
//               AI Solve
//             </button>

//             {/* ================= CODE EDITOR (ONLY ACTIVE ONE) ================= */}
//             {activeQuestionIndex === i && (
//               <div className="mt-3">
//                 <select
//                   className="border p-2 w-full mb-2"
//                   value={language}
//                   onChange={(e) => setLanguage(e.target.value)}
//                 >
//                   <option value="javascript">JavaScript</option>
//                   <option value="python">Python</option>
//                   <option value="java">Java</option>
//                 </select>

//                 <textarea
//                   className="w-full border p-2 h-40"
//                   value={codeMap[i] || ""}
//                   onChange={(e) => updateCode(e.target.value)}
//                   placeholder="Write code here..."
//                 />

//                 <button
//                   onClick={runCode}
//                   className="w-full bg-purple-600 text-white p-2 mt-2 rounded"
//                 >
//                   Run Code
//                 </button>
//               </div>
//             )}

//           </div>
//         ))}

//         {/* OUTPUT */}
//         {runResult && (
//           <div className="mt-4 bg-gray-200 p-3 rounded">
//             <pre>{JSON.stringify(runResult, null, 2)}</pre>
//           </div>
//         )}

//       {solveResult && (
//   <div className="mt-4 bg-green-100 p-3 rounded">

//     <p><b>Language:</b> {solveResult.language}</p>

//     <p><b>Correct:</b> {solveResult.isCorrect ? "Yes" : "No"}</p>

//     <p><b>Approach:</b> {solveResult.approach}</p>

//     <p><b>Mistakes:</b> {solveResult.mistakes}</p>

//     <p><b>Time Complexity:</b> {solveResult.timeComplexity}</p>

//     <p><b>Space Complexity:</b> {solveResult.spaceComplexity}</p>

//     <p><b>Feedback:</b> {solveResult.feedback}</p>

//     <div className="mt-2">
//       <b>Correct Code:</b>
//       <pre className="bg-black text-white p-2 mt-1 overflow-x-auto">
//         {solveResult.correctCode}
//       </pre>
//     </div>

//   </div>
// )}

//       </div>
//     </div>
//   );
// }

// export default DSA;
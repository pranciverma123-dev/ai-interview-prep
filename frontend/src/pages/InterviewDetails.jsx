import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";

function InterviewDetails() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [interview, setInterview] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (id) getInterview();
  }, [id]);

  const getInterview = async () => {
    try {
      const res = await fetch(
        `http://localhost:8000/api/interview/${id}`,
        { credentials: "include" }
      );

      const data = await res.json();

      if (data.success) setInterview(data.interview);
      else alert(data.message);
    } catch (err) {
      console.log(err);
      alert("Failed to fetch interview");
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#050505] text-white">
        Loading AI Interview...
      </div>
    );
  }

  if (!interview) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#050505] text-red-500">
        Interview Not Found
      </div>
    );
  }

  return (
    <div className="min-h-screen w-full bg-[#050505] text-white p-6 relative overflow-x-hidden">

      {/* FIXED GLOW (no screen shift) */}
      <div className="fixed w-[500px] h-[500px] bg-orange-500/20 blur-3xl rounded-full -top-40 -left-40 pointer-events-none" />
      <div className="fixed w-[500px] h-[500px] bg-fuchsia-600/20 blur-3xl rounded-full -bottom-40 -right-40 pointer-events-none" />

      <div className="relative max-w-5xl mx-auto">

        {/* HEADER CARD */}
        <div className="bg-white/5 border border-white/10 backdrop-blur-2xl rounded-3xl p-8 mb-6 shadow-lg">

          <h1 className="text-5xl font-black">
            {interview?.role}{" "}
            <span className="text-orange-500">Interview</span>
          </h1>

          <p className="text-sm opacity-70 mt-2">
            AI generated interview session details
          </p>

          {/* BADGES */}
          <div className="flex gap-4 mt-6 flex-wrap">

            <div className="px-4 py-2 rounded-full bg-emerald-500/20 border border-emerald-500/30">
              Status: {interview?.status || "pending"}
            </div>

            <div className="px-4 py-2 rounded-full bg-orange-500/20 border border-orange-500/30">
              Score: {interview?.score ?? 0}
            </div>

            <div className="px-4 py-2 rounded-full bg-fuchsia-500/20 border border-fuchsia-500/30">
              Questions: {interview?.questions?.length || 0}
            </div>

          </div>
        </div>

        {/* QUESTIONS */}
        <div className="space-y-5">

          {interview?.questions?.length ? (
            interview.questions.map((q, index) => (
              <div
                key={q._id || index}
                className="bg-white/5 border border-white/10 backdrop-blur-xl rounded-2xl p-5 hover:border-orange-500 transition-all"
              >
                <div className="flex items-start gap-3">

                  <div className="min-w-[40px] h-[40px] flex items-center justify-center rounded-full bg-orange-500 text-black font-bold">
                    {index + 1}
                  </div>

                  <div>
                    <p className="text-lg font-medium">
                      {q?.question}
                    </p>

                    <p className="text-sm text-gray-400 mt-2">
                      Type:{" "}
                      <span className="text-orange-400">
                        {q?.type || "general"}
                      </span>
                    </p>
                  </div>

                </div>
              </div>
            ))
          ) : (
            <p className="text-gray-400">No questions found</p>
          )}

        </div>

        {/* ACTION BUTTONS */}
        <div className="mt-10 flex gap-4 flex-wrap">

          <button
            onClick={() => navigate(`/submit/${id}`)}
            className="px-6 py-3 rounded-xl font-semibold bg-orange-500 hover:bg-orange-600 transition-all"
          >
            Start Interview
          </button>

          <button
            onClick={() => navigate("/history")}
            className="px-6 py-3 rounded-xl border border-white/10 hover:bg-white/5 transition-all"
          >
            View History
          </button>

        </div>

      </div>
    </div>
  );
}

export default InterviewDetails;

// import { useEffect, useState } from "react";
// import { useParams, useNavigate } from "react-router-dom";

// function InterviewDetails() {
//   const { id } = useParams();
//   const navigate = useNavigate();

//   const [interview, setInterview] = useState(null);
//   const [loading, setLoading] = useState(true);

//   useEffect(() => {
//     getInterview();
//     // eslint-disable-next-line
//   }, []);

//   const getInterview = async () => {
//     try {
//       const res = await fetch(`http://localhost:8000/api/interview/${id}`, {
//         method: "GET",
//         credentials: "include",
//       });

//       const data = await res.json();

//       if (data.success) {
//         setInterview(data.interview);
//       } else {
//         alert(data.message);
//       }
//     } catch (error) {
//       console.log(error);
//       alert("Failed to fetch interview");
//     } finally {
//       setLoading(false);
//     }
//   };

//   if (loading) {
//     return (
//       <div className="min-h-screen bg-[#050505] flex justify-center items-center text-white text-2xl">
//         Loading Interview...
//       </div>
//     );
//   }

//   if (!interview) {
//     return (
//       <div className="min-h-screen bg-[#050505] flex justify-center items-center text-red-500 text-2xl">
//         Interview Not Found
//       </div>
//     );
//   }

//   return (
//     <div className="min-h-screen bg-[#050505] text-white p-6 relative overflow-hidden">

//       {/* Background Effects */}
//       <div className="absolute w-[500px] h-[500px] bg-fuchsia-600/20 blur-3xl rounded-full -top-40 -left-40 animate-pulse"></div>
//       <div className="absolute w-[500px] h-[500px] bg-orange-500/20 blur-3xl rounded-full -bottom-40 -right-40 animate-pulse"></div>

//       <div className="relative max-w-5xl mx-auto">

//         {/* Header */}
//         <div className="bg-white/[0.03] backdrop-blur-2xl border border-white/10 rounded-3xl p-8 mb-6">
//           <h1 className="text-4xl font-black">
//             {interview?.role}
//           </h1>

//           <div className="flex gap-4 mt-5 flex-wrap">
//             <div className="px-4 py-2 rounded-full bg-emerald-500/20 border border-emerald-500/20">
//               Status: {interview?.status}
//             </div>

//             <div className="px-4 py-2 rounded-full bg-yellow-500/20 border border-yellow-500/20">
//               Score: {interview?.score ?? 0}
//             </div>
//           </div>
//         </div>

//         {/* Questions */}
//         <div className="space-y-5">
//           {interview?.questions?.length > 0 ? (
//             interview.questions.map((q, index) => (
//               <div
//                 key={q._id || index}
//                 className="bg-slate-800 p-4 rounded-lg"
//               >
//                 <p className="text-lg">
//                   <span className="font-bold text-pink-400">
//                     Q{index + 1}:
//                   </span>{" "}
//                   {q?.question}
//                 </p>

//                 <p className="text-sm text-gray-400 mt-2">
//                   Type: {q?.type}
//                 </p>
//               </div>
//             ))
//           ) : (
//             <p className="text-gray-400">No questions found</p>
//           )}
//         </div>

//         {/* Actions */}
//         <div className="mt-8 flex gap-4 flex-wrap">
//          <button
//   onClick={() => navigate(`/submit/${id}`)}
//   className="px-6 py-3 bg-gradient-to-r from-fuchsia-600 via-purple-600 to-orange-500 rounded-xl"
// >
//   Submit Answers
// </button>

//           <button
//             onClick={() => navigate("/history")}
//             className="
//               px-6 py-3
//               rounded-xl
//               border border-white/10
//               hover:bg-white/5
//               transition-all
//             "
//           >
//             View History
//           </button>
//         </div>

//       </div>
//     </div>
//   );
// }

// export default InterviewDetails;
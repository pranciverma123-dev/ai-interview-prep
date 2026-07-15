import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";

function InterviewPage() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [interview, setInterview] = useState(null);
  const [answers, setAnswers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    load();
  }, []);

  const load = async () => {
    try {
      const res = await fetch(
        `https://ai-interview-prep-ffjr.onrender.com/api/interview/${id}`,
        { credentials: "include" }
      );

      const data = await res.json();

      if (data.success && data.interview) {
        setInterview(data.interview);

        const qLen = data.interview.questions?.length || 0;
        setAnswers(new Array(qLen).fill(""));
      } else {
        alert(data.message || "Interview not found");
        setInterview(null);
      }
    } catch (err) {
      console.log(err);
      alert("Failed to load interview");
      setInterview(null);
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (index, value) => {
    setAnswers((prev) => {
      const copy = [...prev];
      copy[index] = value;
      return copy;
    });
  };

  const submit = async () => {
    if (!interview?.questions?.length) return;

    const formattedAnswers = interview.questions.map((q, i) => ({
      question: q.question,
      answer: (answers[i] || "").trim(),
    }));

    const hasEmpty = formattedAnswers.some((a) => !a.answer);
    if (hasEmpty) return alert("Please answer all questions");

    try {
      setSubmitting(true);

      const res = await fetch(
        "http://localhost:8000/api/interview/submit",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          credentials: "include",
          body: JSON.stringify({
            interviewId: id,
            answers: formattedAnswers,
          }),
        }
      );

      const data = await res.json();

      if (data.success) {
        navigate(`/feedback/${data.feedbackId}`);
      } else {
        alert(data.message || "Submit failed");
      }
    } catch (err) {
      console.log(err);
      alert("Submit failed");
    } finally {
      setSubmitting(false);
    }
  };

  // ================= LOADING =================
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#050505] text-white">
        Loading AI Interview...
      </div>
    );
  }

  // ================= NOT FOUND =================
  if (!interview) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#050505] text-red-500">
        Interview Not Found
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#050505] text-white p-6 relative overflow-hidden">

      {/* Glow */}
      <div className="absolute w-[500px] h-[500px] bg-orange-500/20 blur-3xl rounded-full -top-40 -left-40 animate-pulse"></div>
      <div className="absolute w-[500px] h-[500px] bg-fuchsia-600/20 blur-3xl rounded-full -bottom-40 -right-40 animate-pulse"></div>

      {/* Header */}
      <div className="max-w-4xl mx-auto mb-8">
        <h1 className="text-4xl font-black">
          {interview.role}{" "}
          <span className="text-orange-500">Interview</span>
        </h1>
        <p className="text-sm opacity-70">
          Answer like you're in a real AI interview session
        </p>
      </div>

      {/* QUESTIONS */}
      <div className="max-w-4xl mx-auto space-y-6">
        {(interview.questions || []).map((q, i) => (
          <div
            key={i}
            className="bg-white/5 border border-white/10 rounded-2xl p-5 backdrop-blur-xl"
          >
            <span className="inline-block bg-orange-500 px-3 py-1 rounded-full text-xs mb-2">
              Question {i + 1}
            </span>

            <p className="text-lg font-medium">{q.question}</p>

            <textarea
              className="w-full mt-4 min-h-[120px] p-4 rounded-xl bg-black/40 border border-white/10 focus:border-orange-500 outline-none"
              placeholder="Type your answer..."
              value={answers[i] || ""}
              onChange={(e) => handleChange(i, e.target.value)}
            />
          </div>
        ))}
      </div>

      {/* BUTTON */}
      <div className="max-w-4xl mx-auto mt-8">
        <button
          onClick={submit}
          disabled={submitting}
          className="w-full py-4 rounded-xl font-bold bg-orange-500 hover:bg-orange-600 disabled:opacity-50"
        >
          {submitting ? "Submitting..." : "Submit Interview"}
        </button>
      </div>
    </div>
  );
}

export default InterviewPage;
// import { useEffect, useState } from "react";
// import { useParams, useNavigate } from "react-router-dom";

// function InterviewPage() {
//   const { id } = useParams();
//   const navigate = useNavigate();

//   const [interview, setInterview] = useState(null);
//   const [answers, setAnswers] = useState([]);

//   useEffect(() => {
//     load();
//   }, []);

//   const load = async () => {
//     try {
//       const res = await fetch(
//         `http://localhost:8000/api/interview/${id}`,
//         {
//           credentials: "include",
//         }
//       );

//       const data = await res.json();

//       if (data.success) {
//         setInterview(data.interview);
//         setAnswers(
//           new Array(data.interview.questions.length).fill("")
//         );
//       } else {
//         alert(data.message);
//       }
//     } catch (err) {
//       console.log(err);
//       alert("Failed to load interview");
//     }
//   };
//   const submit = async () => {
//   const formattedAnswers = interview.questions.map((q, i) => ({
//     question: q.question,
//     answer: (answers[i] || "").trim(),
//   }));

//   const res = await fetch("http://localhost:8000/api/interview/submit", {
//     method: "POST",
//     headers: { "Content-Type": "application/json" },
//     credentials: "include",
//     body: JSON.stringify({
//       interviewId: id,
//       answers: formattedAnswers,
//     }),
//   });

//   const data = await res.json();

//   if (data.success) {
//     navigate(`/feedback/${data.feedbackId}`); // IMPORTANT
//   } else {
//     alert(data.message);
//   }
// };
// //   const submit = async () => {
// //   if (!interview?.questions) return;

// //   const formattedAnswers = interview.questions.map((q, i) => ({
// //     question: q.question,
// //     answer: (answers?.[i] ?? "").trim(),
// //   }));

// //   // 🔥 SAFE CHECK
// //   const hasEmpty = formattedAnswers.some(a => !a.answer);

// //   if (hasEmpty) {
// //     alert("Please answer all questions");
// //     return;
// //   }

// //   try {
// //     const res = await fetch("http://localhost:8000/api/interview/submit", {
// //       method: "POST",
// //       headers: { "Content-Type": "application/json" },
// //       credentials: "include",
// //       body: JSON.stringify({
// //         interviewId: id,
// //         answers: formattedAnswers,
// //       }),
// //     });

// //     const data = await res.json();

// //     if (data.success) {
// //       navigate(`/feedback/${data.feedbackId || id}`);
// //     } else {
// //       alert(data.message);
// //     }
// //   } catch (err) {
// //     console.log(err);
// //     alert("Submit failed");
// //   }
// // };

// //   const submit = async () => {
// //     if (!interview?.questions) return;

// //     const formattedAnswers = interview.questions.map((q, i) => ({
// //       question: q.question,
// //       answer: (answers[i] || "").trim(),
// //     }));

// //     try {
// //       const res = await fetch(
// //         "http://localhost:8000/api/interview/submit",
// //         {
// //           method: "POST",
// //           headers: {
// //             "Content-Type": "application/json",
// //           },
// //           credentials: "include",
// //           body: JSON.stringify({
// //             interviewId: id,
// //             answers: formattedAnswers,
// //           }),
// //         }
// //       );

// //       const data = await res.json();

// //     if (data.success) {
// //   navigate(`/feedback/${data.feedbackId}`);
// // } else {
// //         alert(data.message);
// //       }
// //     } catch (err) {
// //       console.log(err);
// //       alert("Submit failed");
// //     }
// //   };

//   if (!interview)
//     return <div className="text-white">Loading...</div>;

//   return (
//     <div className="min-h-screen bg-slate-950 text-white p-6">
//       <h1 className="text-xl mb-4">{interview.role} Interview</h1>

//       {interview.questions.map((q, i) => (
//         <div key={q._id || i} className="mb-4">
//           <p className="mb-2">{q.question}</p>

//           <textarea
//             className="w-full p-2 text-black"
//             value={answers[i]}
//             onChange={(e) => {
//               const copy = [...answers];
//               copy[i] = e.target.value;
//               setAnswers(copy);
//             }}
//           />
//         </div>
//       ))}

//       <button
//         onClick={submit}
//         className="bg-blue-500 px-4 py-2"
//       >
//         Submit
//       </button>
//     </div>
//   );
// }

// export default InterviewPage;


import { useState } from "react";

function ResumeGenerator() {
  const [role, setRole] = useState("");
  const [experience, setExperience] = useState("");
  const [skills, setSkills] = useState("");
  const [projects, setProjects] = useState("");
  const [targetCompany, setTargetCompany] = useState("");

  const [resume, setResume] = useState(null);
  const [loading, setLoading] = useState(false);

  // ================= GENERATE =================
  const generateResume = async () => {
    setLoading(true);

    const res = await fetch("https://ai-interview-prep-ffjr.onrender.com/api/resume/generate", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        role,
        experience,
        skills: skills.split(",").map(s => s.trim()),
        projects: projects.split(",").map(p => p.trim()),
        targetCompany,
      }),
    });

    const data = await res.json();

    if (data.success) {
      setResume(data.resume);
    }

    setLoading(false);
  };

  // ================= DOWNLOAD =================
  const downloadPDF = async () => {
    const res = await fetch("http://localhost:8000/api/resume/download", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ resume }),
    });

    const blob = await res.blob();
    const url = window.URL.createObjectURL(blob);

    const a = document.createElement("a");
    a.href = url;
    a.download = "ATS_Resume.pdf";
    a.click();
  };

  // ================= SAFE HELPERS =================
  const safeText = (val) => {
    if (!val) return "";
    if (typeof val === "string") return val;
    if (typeof val === "object") return val.name || val.title || JSON.stringify(val);
    return "";
  };

  const safeSkill = (s) => {
    if (!s) return "";
    if (typeof s === "string") return s;
    if (typeof s === "object") return s.name || "";
    return "";
  };

  const safeProjectTitle = (p) => {
    if (!p) return "";
    if (typeof p === "string") return p;
    return p.title || p.name || "Project";
  };

  const safeProjectDesc = (p) => {
    if (!p || typeof p !== "object") return "";
    return p.description || "";
  };

  return (
    <div className="min-h-screen p-6 bg-black text-white">

      <h1 className="text-2xl font-bold text-orange-400 mb-6">
         AI ATS Resume Generator
      </h1>

      {/* ================= INPUTS ================= */}
      <div className="grid gap-2 max-w-lg">

        <input placeholder="Role"
          className="p-2 bg-gray-800"
          onChange={(e) => setRole(e.target.value)}
        />

        <input placeholder="Experience"
          className="p-2 bg-gray-800"
          onChange={(e) => setExperience(e.target.value)}
        />

        <input placeholder="Skills (comma separated)"
          className="p-2 bg-gray-800"
          onChange={(e) => setSkills(e.target.value)}
        />

        <input placeholder="Projects (comma separated)"
          className="p-2 bg-gray-800"
          onChange={(e) => setProjects(e.target.value)}
        />

        <input placeholder="Target Company"
          className="p-2 bg-gray-800"
          onChange={(e) => setTargetCompany(e.target.value)}
        />

        <button
          onClick={generateResume}
          className="bg-orange-500 p-2 mt-2"
        >
          {loading ? "Generating..." : "Generate Resume"}
        </button>
      </div>

      {/* ================= OUTPUT ================= */}
      {resume && (
        <div className="mt-6 p-5 bg-gray-900 rounded-lg">

          <h2 className="text-orange-400 font-bold text-xl">
            ATS Resume Preview
          </h2>

          {/* SUMMARY */}
          <p className="mt-3 text-gray-300 text-sm">
            {safeText(resume.summary)}
          </p>

          {/* SKILLS */}
          <h3 className="mt-5 font-bold text-orange-300">Skills</h3>

          <div className="flex flex-wrap gap-2 mt-2">
            {resume.skills?.map((s, i) => (
              <span key={i} className="px-3 py-1 bg-gray-800 rounded text-sm">
                {safeSkill(s)}
              </span>
            ))}
          </div>

          {/* PROJECTS */}
          <h3 className="mt-5 font-bold text-orange-300">Projects</h3>

          <div className="space-y-4 mt-2">
            {resume.projects?.map((p, i) => (
              <div key={i} className="p-3 bg-gray-800 rounded">

                <h4 className="font-semibold">
                  {safeProjectTitle(p)}
                </h4>

                {safeProjectDesc(p) && (
                  <p className="text-sm text-gray-300 mt-1">
                    {safeProjectDesc(p)}
                  </p>
                )}

                {/* TECHNOLOGIES */}
                {Array.isArray(p?.technologies) && (
                  <p className="text-xs text-gray-400 mt-2">
                    Tech: {p.technologies.join(", ")}
                  </p>
                )}

                {/* ACHIEVEMENTS */}
                {Array.isArray(p?.achievements) && (
                  <ul className="list-disc ml-5 mt-2 text-xs text-green-400">
                    {p.achievements.map((a, idx) => (
                      <li key={idx}>{safeText(a)}</li>
                    ))}
                  </ul>
                )}

              </div>
            ))}
          </div>

          {/* STRENGTHS */}
          <h3 className="mt-5 font-bold text-orange-300">Strengths</h3>

          <ul className="list-disc ml-5 mt-2 text-sm text-gray-300">
            {resume.strengths?.map((s, i) => (
              <li key={i}>{safeText(s)}</li>
            ))}
          </ul>

          {/* DOWNLOAD */}
          <button
            onClick={downloadPDF}
            className="mt-6 bg-green-500 px-4 py-2 rounded"
          >
            📄 Download PDF
          </button>

        </div>
      )}

    </div>
  );
}

export default ResumeGenerator;
// import { useState } from "react";

// function ResumeGenerator() {
//   const [role, setRole] = useState("");
//   const [experience, setExperience] = useState("");
//   const [skills, setSkills] = useState("");
//   const [projects, setProjects] = useState("");
//   const [targetCompany, setTargetCompany] = useState("");

//   const [resume, setResume] = useState(null);
//   const [loading, setLoading] = useState(false);

//   // ================= GENERATE =================
//   const generateResume = async () => {
//     setLoading(true);

//     const res = await fetch("http://localhost:8000/api/resume/generate", {
//       method: "POST",
//       headers: { "Content-Type": "application/json" },
//       body: JSON.stringify({
//         role,
//         experience,
//         skills: skills.split(",").map(s => s.trim()),
//         projects: projects.split(",").map(p => p.trim()),
//         targetCompany,
//       }),
//     });

//     const data = await res.json();

//     if (data.success) {
//       setResume(data.resume);
//     }

//     setLoading(false);
//   };

//   // ================= DOWNLOAD =================
//   const downloadPDF = async () => {
//     const res = await fetch("http://localhost:8000/api/resume/download", {
//       method: "POST",
//       headers: { "Content-Type": "application/json" },
//       body: JSON.stringify({ resume }),
//     });

//     const blob = await res.blob();
//     const url = window.URL.createObjectURL(blob);

//     const a = document.createElement("a");
//     a.href = url;
//     a.download = "ATS_Resume.pdf";
//     a.click();
//   };

//   // ================= SAFE HELPERS =================
//   const safeText = (v) =>
//     typeof v === "string" ? v : v ? JSON.stringify(v) : "";

//   return (
//     <div className="min-h-screen p-6 bg-black text-white">

//       <h1 className="text-2xl font-bold text-orange-400 mb-6">
//         AI ATS Resume Generator
//       </h1>

//       {/* INPUTS */}
//       <div className="grid gap-2 max-w-lg">
//         <input placeholder="Role" className="p-2 bg-gray-800"
//           onChange={(e) => setRole(e.target.value)} />

//         <input placeholder="Experience" className="p-2 bg-gray-800"
//           onChange={(e) => setExperience(e.target.value)} />

//         <input placeholder="Skills (comma separated)" className="p-2 bg-gray-800"
//           onChange={(e) => setSkills(e.target.value)} />

//         <input placeholder="Projects (comma separated)" className="p-2 bg-gray-800"
//           onChange={(e) => setProjects(e.target.value)} />

//         <input placeholder="Target Company" className="p-2 bg-gray-800"
//           onChange={(e) => setTargetCompany(e.target.value)} />

//         <button onClick={generateResume}
//           className="bg-orange-500 p-2 mt-2">
//           {loading ? "Generating..." : "Generate Resume"}
//         </button>
//       </div>

//       {/* OUTPUT */}
//       {resume && (
//         <div className="mt-6 p-5 bg-gray-900 rounded-lg">

//           {/* PERSONAL */}
//           <h2 className="text-orange-400 font-bold text-xl">
//             ATS Resume Preview
//           </h2>

//           <div className="mt-3 text-sm text-gray-300">
//             <p><b>Name:</b> {resume.personal?.name}</p>
//             <p><b>Email:</b> {resume.personal?.email}</p>
//             <p><b>Phone:</b> {resume.personal?.phone}</p>
//             <p><b>LinkedIn:</b> {resume.personal?.linkedin}</p>
//             <p><b>GitHub:</b> {resume.personal?.github}</p>
//           </div>

//           {/* SUMMARY */}
//           <h3 className="mt-5 font-bold text-orange-300">Summary</h3>
//           <p className="text-gray-300 text-sm mt-1">
//             {resume.summary}
//           </p>

//           {/* SKILLS */}
//           <h3 className="mt-5 font-bold text-orange-300">Skills</h3>
//           <div className="flex flex-wrap gap-2 mt-2">
//             {resume.skills?.map((s, i) => (
//               <span key={i} className="px-3 py-1 bg-gray-800 rounded text-sm">
//                 {safeText(s)}
//               </span>
//             ))}
//           </div>

//           {/* PROJECTS */}
//           <h3 className="mt-5 font-bold text-orange-300">Projects</h3>

//           <div className="space-y-3 mt-2">
//             {resume.projects?.map((p, i) => (
//               <div key={i} className="p-3 bg-gray-800 rounded">
//                 <p className="font-semibold">{p.name}</p>
//                 <p className="text-sm text-gray-300">{p.description}</p>

//                 {p.technologies && (
//                   <p className="text-xs text-gray-400 mt-1">
//                     Tech: {p.technologies.join(", ")}
//                   </p>
//                 )}

//                 {p.achievements && (
//                   <ul className="list-disc ml-5 text-xs text-green-400 mt-1">
//                     {p.achievements.map((a, idx) => (
//                       <li key={idx}>{a}</li>
//                     ))}
//                   </ul>
//                 )}
//               </div>
//             ))}
//           </div>

//           {/* EXPERIENCE */}
//           <h3 className="mt-5 font-bold text-orange-300">Experience</h3>

//           <div className="space-y-3 mt-2">
//             {resume.experience?.map((e, i) => (
//               <div key={i} className="p-3 bg-gray-800 rounded">
//                 <p className="font-semibold">{e.role} @ {e.company}</p>
//                 <p className="text-xs text-gray-400">{e.duration}</p>

//                 <ul className="list-disc ml-5 text-xs text-gray-300 mt-1">
//                   {e.responsibilities?.map((r, idx) => (
//                     <li key={idx}>{r}</li>
//                   ))}
//                 </ul>
//               </div>
//             ))}
//           </div>

//           {/* EDUCATION */}
//           <h3 className="mt-5 font-bold text-orange-300">Education</h3>
//           <div className="text-sm text-gray-300 mt-1">
//             <p>{resume.education?.degree}</p>
//             <p>{resume.education?.college}</p>
//             <p>CGPA: {resume.education?.cgpa}</p>
//             <p>Year: {resume.education?.year}</p>
//           </div>

//           {/* ATS KEYWORDS */}
//           <h3 className="mt-5 font-bold text-orange-300">ATS Keywords</h3>
//           <div className="flex flex-wrap gap-2 mt-2">
//             {resume.ats_keywords?.map((k, i) => (
//               <span key={i} className="px-2 py-1 bg-purple-800 rounded text-xs">
//                 {k}
//               </span>
//             ))}
//           </div>

//           {/* DOWNLOAD */}
//           <button
//             onClick={downloadPDF}
//             className="mt-6 bg-green-500 px-4 py-2 rounded"
//           >
//             📄 Download PDF
//           </button>

//         </div>
//       )}
//     </div>
//   );
// }

// export default ResumeGenerator;

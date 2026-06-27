// const { generateAIResume } = require("../services/ats.service");
// const PDFDocument = require("pdfkit");

// const normalize = (r = {}) => ({
//   personal: r.personal || {},
//   summary: r.summary || "",
//   skills: Array.isArray(r.skills) ? r.skills : [],
//   projects: Array.isArray(r.projects) ? r.projects : [],
//   experience: Array.isArray(r.experience) ? r.experience : [],
//   strengths: Array.isArray(r.strengths) ? r.strengths : [],
// });
// // ================= GENERATE RESUME =================
// const generateResume = async (req, res) => {
//   try {
//     const {
//       role,
//       experience,
//       skills,
//       projects,
//       targetCompany,
//       personal,
//     } = req.body;

//     const ai = await generateAIResume({
//       role,
//       experience,
//       skills,
//       projects,
//       targetCompany,
//       personal,
//     });

//     return res.status(200).json({
//       success: true,
//       resume: ai,
//     });

//   } catch (err) {
//     return res.status(500).json({
//       success: false,
//       message: err.message,
//     });
//   }
// };
// const downloadResumePDF = async (req, res) => {
//   try {
//     let { resume } = req.body;

//     if (typeof resume === "string") {
//       resume = JSON.parse(resume);
//     }

//     resume = normalize(resume);
//     const p = resume.personal;

//     const doc = new PDFDocument({ margin: 40 });

//     res.setHeader("Content-Type", "application/pdf");
//     res.setHeader(
//       "Content-Disposition",
//       "attachment; filename=ATS_Resume.pdf"
//     );

//     doc.pipe(res);

//     // ================= HEADER =================
//     doc.fontSize(20).text("ATS FRIENDLY RESUME", { align: "center" });
//     doc.moveDown();

//     doc.fontSize(12).text(`Name: ${p.name || "N/A"}`);
//     doc.text(`Email: ${p.email || "N/A"}`);
//     doc.text(`Phone: ${p.phone || "N/A"}`);
//     doc.text(`LinkedIn: ${p.linkedin || "N/A"}`);
//     doc.text(`GitHub: ${p.github || "N/A"}`);

//     doc.moveDown();

//     // ================= SUMMARY =================
//     doc.fontSize(14).text("SUMMARY");
//     doc.fontSize(11).text(resume.summary || "N/A");

//     doc.moveDown();

//     // ================= SKILLS =================
//     doc.fontSize(14).text("SKILLS");
//     doc.fontSize(11).text(resume.skills.join(", ") || "N/A");

//     doc.moveDown();

//     // ================= PROJECTS =================
//     doc.fontSize(14).text("PROJECTS");

//     resume.projects.forEach((pr, i) => {
//       doc.fontSize(12).text(`${i + 1}. ${pr.name || "Project"}`);
//       doc.fontSize(10).text(pr.description || "");

//       if (pr.technologies?.length) {
//         doc.text("Tech: " + pr.technologies.join(", "));
//       }

//       if (pr.achievements?.length) {
//         doc.text("Achievements:");
//         pr.achievements.forEach((a) => doc.text("• " + a));
//       }

//       doc.moveDown();
//     });

//     // ================= EXPERIENCE =================
//     doc.fontSize(14).text("EXPERIENCE");

//     resume.experience.forEach((exp, i) => {
//       doc.fontSize(12).text(`${i + 1}. ${exp.company || "Company"}`);
//       doc.fontSize(10).text(`Role: ${exp.role || ""}`);
//       doc.text(`Duration: ${exp.duration || ""}`);

//       exp.responsibilities?.forEach((r) => {
//         doc.text("• " + r);
//       });

//       doc.moveDown();
//     });

//     // ================= STRENGTHS =================
//     doc.fontSize(14).text("STRENGTHS");
//     doc.fontSize(11).text(resume.strengths.join(", ") || "N/A");

//     doc.end();

//   } catch (err) {
//     console.error(err);
//     res.status(500).json({
//       success: false,
//       message: err.message,
//     });
//   }
// };


// module.exports = { generateResume,downloadResumePDF };
const PDFDocument = require("pdfkit");
const { generateAIResume } = require("../services/ats.service");

// ================= GENERATE RESUME =================
const generateResume = async (req, res) => {
  try {
    const {
      role,
      experience,
      skills,
      projects,
      targetCompany,
    } = req.body;

    const ai = await generateAIResume({
      role,
      experience,
      skills,
      projects,
      targetCompany,
    });

    res.status(200).json({
      success: true,
      resume: ai,
    });

  } catch (err) {
    res.status(500).json({
      success: false,
      message: err.message,
    });
  }
};


const downloadResumePDF = async (req, res) => {
  try {
    let { resume } = req.body;

    if (typeof resume === "string") {
      resume = JSON.parse(resume);
    }

    const doc = new PDFDocument({ margin: 40 });

    res.setHeader("Content-Type", "application/pdf");
    res.setHeader(
      "Content-Disposition",
      "attachment; filename=ATS_Resume.pdf"
    );

    doc.pipe(res);

    doc.fontSize(22).text("ATS FRIENDLY RESUME", { align: "center" });
    doc.moveDown(1.5);

   
    doc.fontSize(16).text("PERSONAL DETAILS", { underline: true });
    doc.moveDown(0.5);

    doc.fontSize(11).text(`Name: ${resume?.name || "N/A"}`);
    doc.text(`Email: ${resume?.email || "N/A"}`);
    doc.text(`Phone: ${resume?.phone || "N/A"}`);
    doc.text(`College: ${resume?.college || "N/A"}`);
    doc.text(`Role: ${resume?.role || "N/A"}`);

    doc.moveDown(1);

    doc.fontSize(16).text("SUMMARY", { underline: true });
    doc.moveDown(0.5);
    doc.fontSize(11).text(resume?.summary || "No summary provided");
    doc.moveDown(1);

   
    doc.fontSize(16).text("SKILLS", { underline: true });
    doc.moveDown(0.5);
    doc.fontSize(11).text(
      Array.isArray(resume?.skills)
        ? resume.skills.join(", ")
        : "No skills provided"
    );
    doc.moveDown(1);


    doc.fontSize(16).text("PROJECTS", { underline: true });
    doc.moveDown(0.5);

    if (Array.isArray(resume?.projects) && resume.projects.length > 0) {
      resume.projects.forEach((p, i) => {
        doc.fontSize(12).text(`${i + 1}. ${p?.name || "Project"}`);
        doc.moveDown(0.3);

        if (p?.description) {
          doc.fontSize(10).text(`Description: ${p.description}`);
        }

        if (Array.isArray(p?.features)) {
          doc.fontSize(10).text(`Features: ${p.features.join(", ")}`);
        }

        if (Array.isArray(p?.technologies)) {
          doc.fontSize(10).text(`Tech: ${p.technologies.join(", ")}`);
        }

        doc.moveDown(0.8);
      });
    } else {
      doc.fontSize(11).text("No projects provided");
      doc.moveDown(1);
    }

 
    doc.fontSize(16).text("WORK EXPERIENCE", { underline: true });
    doc.moveDown(0.5);

    if (Array.isArray(resume?.experience) && resume.experience.length > 0) {
      resume.experience.forEach((exp, i) => {
        doc.fontSize(12).text(`${i + 1}. ${exp?.company || "Company"}`);

        if (exp?.role) doc.fontSize(10).text(`Role: ${exp.role}`);
        if (exp?.duration) doc.fontSize(10).text(`Duration: ${exp.duration}`);
        if (exp?.description)
          doc.fontSize(10).text(`Description: ${exp.description}`);

        doc.moveDown(0.6);
      });
    } else {
      doc.fontSize(11).text("No work experience provided");
      doc.moveDown(1);
    }

    doc.fontSize(16).text("STRENGTHS", { underline: true });
    doc.moveDown(0.5);
    doc.fontSize(11).text(resume?.strengths || "No strengths provided");

    doc.end();

  } catch (err) {
    console.error("PDF Error:", err);

    res.status(500).json({
      success: false,
      message: err.message,
    });
  }
};

module.exports = { generateResume, downloadResumePDF };

// const PDFDocument = require("pdfkit");
// const { generateAIResume } = require("../services/ats.service");

// // ==========================
// // GENERATE ATS RESUME
// // ==========================

// const generateResume = async (req, res) => {

//   try {

//     const {
//       personal,
//       education,
//       role,
//       targetCompany,
//       experience,
//       projects,
//       skills,
//       certifications,
//       achievements,
//       languages,
//       interests
//     } = req.body;

//     // ==========================
//     // VALIDATION
//     // ==========================

//     if (!role) {

//       return res.status(400).json({

//         success: false,

//         message: "Target role is required."

//       });

//     }

//     const resume = await generateAIResume({

//       personal,

//       education,

//       role,

//       targetCompany,

//       experience,

//       projects,

//       skills,

//       certifications,

//       achievements,

//       languages,

//       interests

//     });

//     return res.status(200).json({

//       success: true,

//       message: "ATS Resume Generated Successfully",

//       resume

//     });

//   }

//   catch (error) {

//     console.log(error);

//     return res.status(500).json({

//       success: false,

//       message: "Resume generation failed.",

//       error: error.message

//     });

//   }

// };

// // ==========================
// // DOWNLOAD PDF
// // ==========================

// const downloadResumePDF = async (req, res) => {

//   try {

//     let { resume } = req.body;

//     if (!resume) {

//       return res.status(400).json({

//         success: false,

//         message: "Resume data missing."

//       });

//     }

//     if (typeof resume === "string") {

//       resume = JSON.parse(resume);

//     }

//     const doc = new PDFDocument({

//       margin: 40,

//       size: "A4"

//     });

//     res.setHeader(

//       "Content-Type",

//       "application/pdf"

//     );

//     res.setHeader(

//       "Content-Disposition",

//       "attachment; filename=ATS_Resume.pdf"

//     );

//     doc.pipe(res);

//     // ==========================
//     // HEADER
//     // ==========================

//     doc
//       .fontSize(24)
//       .text(

//         resume.personal?.name ||

//         "Candidate",

//         {

//           align: "center"

//         }

//       );

//     doc.moveDown(0.3);

//     doc
//       .fontSize(11)
//       .text(

//         resume.personal?.email || "",

//         {

//           align: "center"

//         }

//       );

//     doc.text(

//       resume.personal?.phone || "",

//       {

//         align: "center"

//       }

//     );

//     doc.text(

//       resume.personal?.linkedin || "",

//       {

//         align: "center"

//       }

//     );

//     doc.text(

//       resume.personal?.github || "",

//       {

//         align: "center"

//       }

//     );

//     doc.moveDown();

//     // ==========================
//     // SUMMARY
//     // ==========================

//     doc

//       .fontSize(16)

//       .text("Professional Summary");

//     doc.moveDown(0.5);

//     doc

//       .fontSize(11)

//       .text(resume.summary);

//     doc.moveDown();

//     // ==========================
//     // SKILLS
//     // ==========================

//     doc

//       .fontSize(16)

//       .text("Technical Skills");

//     doc.moveDown(0.5);

//     Object.entries(resume.skills || {}).forEach(

//       ([key, value]) => {

//         if (

//           Array.isArray(value) &&

//           value.length

//         ) {

//           doc.fontSize(11).text(

//             `${key}: ${value.join(", ")}`

//           );

//         }

//       }

//     );

//     doc.moveDown();

//     // ==========================
//     // PROJECTS
//     // ==========================

//     doc

//       .fontSize(16)

//       .text("Projects");

//     doc.moveDown(0.5);

//     (resume.projects || []).forEach(

//       (project) => {

//         doc

//           .fontSize(13)

//           .text(project.title);

//         doc

//           .fontSize(11)

//           .text(project.description);

//         doc.text(

//           "Technologies: " +

//           (project.technologies || []).join(", ")

//         );

//         doc.moveDown();

//       }

//     );

//     // ==========================
//     // EXPERIENCE
//     // ==========================

//     if (

//       resume.experience?.length

//     ) {

//       doc

//         .fontSize(16)

//         .text("Experience");

//       doc.moveDown(0.5);

//       resume.experience.forEach(

//         (exp) => {

//           doc

//             .fontSize(13)

//             .text(

//               `${exp.role} | ${exp.company}`

//             );

//           doc

//             .fontSize(11)

//             .text(exp.duration);

//           (exp.responsibilities || []).forEach(

//             (r) => {

//               doc.text("• " + r);

//             }

//           );

//           doc.moveDown();

//         }

//       );

//     }

//     // ==========================
//     // EDUCATION
//     // ==========================

//     doc

//       .fontSize(16)

//       .text("Education");

//     doc.moveDown(0.5);

//     doc.fontSize(11).text(

//       `${resume.education?.degree || ""}

// ${resume.education?.college || ""}

// CGPA: ${resume.education?.cgpa || ""}

// Passing Year: ${resume.education?.year || ""}`

//     );

//     doc.end();

//   }

//   catch (error) {

//     console.log(error);

//     return res.status(500).json({

//       success: false,

//       message: "PDF Generation Failed"

//     });

//   }

// };

// module.exports = {

//   generateResume,

//   downloadResumePDF

// };
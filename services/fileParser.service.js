const fs = require("fs");
const pdfParse = require("pdf-parse").default || require("pdf-parse");// 👈 better name
const mammoth = require("mammoth");

async function parseResume(filePath, mimeType) {
  let text = "";

  if (mimeType === "application/pdf") {
    const buffer = fs.readFileSync(filePath);

    const data = await pdfParse(buffer);
    text = data.text;
    console.log(pdfParse);
  }

  else if (mimeType.includes("wordprocessingml.document")) {
    const result = await mammoth.extractRawText({ path: filePath });
    text = result.value;
  }

  return text;
}

module.exports = { parseResume };
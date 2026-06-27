const { GoogleGenerativeAI } = require("@google/generative-ai");

const genAI = new GoogleGenerativeAI("AQ.Ab8RN6Ih24bWOww5xh9-LFyuY3td98iaIZuu9IQUqrCaX9HBOw");

async function listModels() {
  try {
    const models = await genAI.listModels();
    console.log("AVAILABLE MODELS:");
    console.log(models);
  } catch (error) {
    console.log("ERROR:", error);
  }
}

listModels();
const OpenAI = require("openai");

const client = new OpenAI({
  apiKey: process.env.GROQ_API_KEY,
  baseURL: "https://api.groq.com/openai/v1",
});

// ✅ helper function
function extractJSON(text) {
  const start = text.indexOf("[");
  const end = text.lastIndexOf("]");

  if (start === -1 || end === -1) {
    throw new Error("Invalid AI response format");
  }

  const jsonString = text.slice(start, end + 1);
  return JSON.parse(jsonString);
}

async function generateDSA(company, difficulty, topic, count) {
const prompt = `
You are an expert JavaScript DSA interviewer.

Generate exactly ${count} coding questions.

Company: ${company}
Difficulty: ${difficulty}
Preferred Topic: ${topic || "Any"}

IMPORTANT:

Generate questions ONLY from these topics:

- Arrays
- Strings
- HashMap
- HashSet
- Searching
- Sorting
- Stack
- Queue
- Sliding Window
- Two Pointers
- Prefix Sum

DO NOT generate questions from:

- Linked List
- Binary Tree
- Binary Search Tree
- Graph
- Trie
- Heap
- Dynamic Programming
- Backtracking
- Recursion
- Segment Tree
- Fenwick Tree

Return ONLY a valid JSON array.

FORMAT:

[
  {
    "question": "",
    "topic": "",
    "difficulty": "",
    "functionName": "",
    "starterCode": "",
    "exampleInput": "",
    "exampleOutput": "",
    "hint": "",
    "testCases": [
      {
        "input": [],
        "expected": null
      },
      {
        "input": [],
        "expected": null
      },
      {
        "input": [],
        "expected": null
      }
    ]
  }
]

==========================
RULES FOR starterCode
==========================

Return ONLY JavaScript.

Example:

function solve(arr){

}

Do NOT include console.log()

Do NOT call the function.

==========================
RULES FOR testCases
==========================

Every test case MUST match the function signature.

Example 1

function findDuplicates(arr)

Correct

"input":[[1,2,3,2]]

Wrong

"input":[1,2,3,2]

----------------------------------

Example 2

function twoSum(nums,target)

Correct

"input":[[2,7,11,15],9]

Wrong

"input":[2,7,11,15,9]

----------------------------------

Example 3

function rotate(nums,k)

Correct

"input":[[1,2,3,4],2]

----------------------------------

Example 4

function solve(matrix,row,col)

Correct

"input":[[[1,2],[3,4]],1,0]

----------------------------------

NEVER return arrays as strings.

Wrong

"input":"[1,2,3]"

Wrong

"input":"[2,7,11,15],9"

Wrong

"expected":"[1,2]"

Correct

"input":[[1,2,3]]

Correct

"input":[[2,7,11,15],9]

Correct

"expected":[1,2]

Correct

"expected":3

Correct

"expected":true

Correct

"expected":"hello"

Generate exactly 3 meaningful test cases.

expected MUST contain the correct answer.

Return ONLY JSON.

NO markdown.

NO explanation.

NO \`\`\`json
`;
  const response = await client.chat.completions.create({
    model: "llama-3.1-8b-instant",
    messages: [{ role: "user", content: prompt }],
  });

  // 🔥 STEP 1: get text
  let text = response.choices[0].message.content;

  // 🔥 STEP 2: clean
  text = text.replace(/```json/g, "").replace(/```/g, "").trim();

  // 🔥 STEP 3: parse safely
  return extractJSON(text);
}

module.exports = { generateDSA };
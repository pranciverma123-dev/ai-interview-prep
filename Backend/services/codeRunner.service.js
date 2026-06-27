
const { VM } = require("vm2");

async function executeCode(code, language, testCases = []) {
  if (language !== "javascript") {
    throw new Error("Only JavaScript is supported.");
  }

  const logs = [];

  const vm = new VM({
    timeout: 1000,
    sandbox: {
      console: {
        log: (...args) => logs.push(args.join(" ")),
      },
    },
  });

  try {
   
  vm.run(`
  (function() {
    ${code}
  })()
`);

  
    const functionNames = vm.run(`
      Object.keys(globalThis).filter(
        key => typeof globalThis[key] === "function"
      )
    `);

    if (!functionNames.length) {
      throw new Error("No function found in code.");
    }


    const fnName = functionNames[functionNames.length - 1];
    const fn = vm.run(`globalThis["${fnName}"]`);

    
    const results = [];

    for (const tc of testCases) {
      let input = tc.input;
      let output;

   try {
  if (typeof input === "string") {
    input = JSON.parse(input);
  }

  if (!Array.isArray(input)) {
    input = [input];
  }

  if (
    fn.length === 1 &&
    Array.isArray(input) &&
    input.length > 0 &&
    !Array.isArray(input[0])
  ) {
    input = [input];
  }
   console.log("================================");
    console.log("Function:", fnName);
    console.log("Function Length:", fn.length);
    console.log("Original TestCase:", tc);
    console.log("INPUT:", input);
    console.log("TYPE OF input:", typeof input);
    console.log("TYPE OF input[0]:", typeof input[0]);
    console.log("VALUE:", JSON.stringify(input));
    console.log("================================");
  output = fn(...input);

} catch (err) {
  output = err.message;
}

      let expected = tc.expected;

      // Parse expected if AI returned string
      if (typeof expected === "string") {
        try {
          expected = JSON.parse(expected);
        } catch (e) {
          // Leave as string
        }
      }

      results.push({
        input,
        expected,
        output,
        passed:
          JSON.stringify(output) === JSON.stringify(expected),
      });
    }

    const passed = results.filter(r => r.passed).length;

    return {
      score: testCases.length
        ? Math.round((passed / testCases.length) * 100)
        : 0,
      console: logs,
      results,
    };

  } catch (err) {
    throw new Error(err.message);
  }
}

module.exports = {
  executeCode,
};
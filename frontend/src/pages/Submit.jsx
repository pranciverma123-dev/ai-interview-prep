const submitAnswers = async () => {
  try {
    const res = await fetch(
      "https://ai-interview-prep-ffjr.onrender.com/api/feedback/submit-answers",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
        body: JSON.stringify({
          interviewId: id,
          answers,
        }),
      }
    );

    const data = await res.json();

    if (data.success) {
      alert("Answers Submitted Successfully");
      await generateFeedback(); // wait for feedback generation
    } else {
      alert(data.message);
    }
  } catch (error) {
    console.log(error);
    alert("Failed to submit answers");
  }
};

const generateFeedback = async () => {
  try {
    const res = await fetch(
      "http://localhost:8000/api/feedback",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
        body: JSON.stringify({
          interviewId: id,
        }),
      }
    );

    const data = await res.json();

    if (data.success) {
      navigate(`/feedback/${id}`);
    } else {
      alert(data.message);
    }
  } catch (error) {
    console.log(error);
    alert("Failed to generate feedback");
  }
};
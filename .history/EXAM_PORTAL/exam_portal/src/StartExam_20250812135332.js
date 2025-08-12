import { useEffect, useState, useCallback } from "react";

function StartExam() {
  const [examStarted, setExamStarted] = useState(false);
  const [timeleft, setTimeleft] = useState(60);
  const [questions, setQuestions] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [selectedOption, setSelectedOption] = useState(null);
  const [loading, setLoading] = useState(false);
  const [answers, setAnswers] = useState({});
  

  const startExam = async () => {
  setLoading(true);
  try {
    const response = await fetch("http://localhost:5000/start-exam", {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },
    });

    if (response.ok) {
      const data = await response.json();
      setExamStarted(true);
      setQuestions(data.questions || []);
      setCurrentIndex(0);
      setSelectedOption(null);
      setTimeleft(parseInt(data.timeleft) || 60);
      setAnswers({});
    } else {
      const errorData = await response.json();
      console.error("Error starting exam:", errorData.error);
    }
  } catch (error) {
    console.error("Error during exam start:", error);
  } finally {
    setLoading(false);
  }
};

function shuffleArray(array) {
  return array
    .map(value => ({ value, sort: Math.random() }))
    .sort((a, b) => a.sort - b.sort)
    .map(({ value }) => value);
}

// inside your route handler after fetching exam:
const shuffledQuestions = shuffleArray(exam.questions);

res.json({
  questions: shuffledQuestions,
  timeleft: exam.timeLimit || 60
});


const submitExam = useCallback(async (answersToSubmit) => {
  try {
    const response = await fetch("http://localhost:5000/submit-exam", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },
      body: JSON.stringify({
        answers: answersToSubmit,
        userId: "anonymous", // replace with actual userId from context
      }),
    });

    if (response.ok) {
      alert("Exam submitted successfully!");
    } else {
      const errorData = await response.json();
      console.error("Error submitting exam:", errorData.error);
      alert("Error submitting exam.");
    }
  } catch (error) {
    console.error("Error during exam submission:", error);
  }
}, []);
  // Updated useEffect
useEffect(() => {
  if (!examStarted) return;

  const timer = setInterval(() => {
    setTimeleft((prev) => {
      if (prev <= 1) {
        clearInterval(timer);
        submitExam();
        setExamStarted(false);
        alert("Time is up!");
        return 0;
      }
      return prev - 1;
    });
  }, 1000);

    return () => clearInterval(timer);
  }, [examStarted,submitExam]);

  const saveAnswerAndNext = () => {
  if (selectedOption === null) {
    alert("Please select an option before proceeding.");
    return;
  }

  const nextIndex = currentIndex + 1;

 setAnswers(prev => {
  const updated = {
    ...prev,
    [questions[currentIndex]._id]: selectedOption,  // Use question _id as key
  };

  if (nextIndex < questions.length) {
    setCurrentIndex(nextIndex);
    setSelectedOption(updated[questions[nextIndex]._id] || null);
  } else {
    submitExam(updated);  // Pass updated answers explicitly here
  }

  return updated;
});

};


      
  
  


  const goPrevious = () => {
    if (currentIndex > 0) {
      const prevIndex = currentIndex - 1;
      setCurrentIndex(prevIndex);
      setSelectedOption(answers[questions[prevIndex]._id] || null);

    } else {
      alert("You are at the first question.");
    }
  };

  if (!examStarted) {
    return (
      <div>
        <button onClick={startExam} disabled={loading}>
          {loading ? "Loading..." : "Start Exam"}
        </button>
        {!loading && <p>Click the button to start the exam.</p>}
      </div>
    );
  }

  const currentQuestion = questions[currentIndex];

  return (
    <div>
      <h2>
        Question: {currentIndex + 1} of {questions.length}
      </h2>
      <h3>{currentQuestion?.questionText}</h3>

      <form>
        {currentQuestion?.options.map((option, idx) => (
          <div key={idx}>
            <label>
              <input
                type="radio"
                name={`question-${currentIndex}`}
                value={option}
                checked={selectedOption === option}
                onChange={() => setSelectedOption(option)}
              />
              {option}
            </label>
          </div>
        ))}
      </form>

      <p>Time left: {timeleft} seconds</p>
      <div>
  <button onClick={goPrevious}>Previous</button>

  {currentIndex < questions.length - 1 ? (
    <button onClick={saveAnswerAndNext}>Next</button>
  ) : (
    <button
  onClick={() => {
  if (selectedOption === null) {
    alert("Please select an option before submitting.");
    return;
  }
  // Include the current selected answer with question ID as key before submitting
  const finalAnswers = {
    ...answers,
    [questions[currentIndex]._id]: selectedOption,
  };
  submitExam(finalAnswers);
}}

  style={{
    backgroundColor: "#4CAF50",
    color: "white",
    padding: "10px 20px",
    border: "none",
    borderRadius: "5px",
    fontSize: "16px",
    fontWeight: "bold",
    cursor: "pointer",
    marginLeft: "10px"
  }}
>
  Submit Exam
</button>

  )}
</div>

    </div>
  );
}

export default StartExam;

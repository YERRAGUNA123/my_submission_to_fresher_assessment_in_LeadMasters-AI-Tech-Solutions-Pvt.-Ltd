import { useEffect, useState } from "react";

function StartExam() {
  const [examStarted, setExamStarted] = useState(false);
  const [timeleft, setTimeleft] = useState(60);
  const [questions, setQuestions] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [selectedOption, setSelectedOption] = useState(null);
  const [loading, setLoading] = useState(false);
  const [answers, setAnswers] = useState({});
  const submitExam = useCallback(() => {
    // Function to submit the exam answers
  }, [answers]);

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
  }, [examStarted]);

  const saveAnswerAndNext = () => {
  if (selectedOption === null) {
    alert("Please select an option before proceeding.");
    return;
  }

  const nextIndex = currentIndex + 1;

  setAnswers(prev => {
    const updated = { ...prev, [currentIndex]: selectedOption };
    if (nextIndex < questions.length) {
      setCurrentIndex(nextIndex);
      setSelectedOption(updated[nextIndex] || null);
    } else {
      submitExam(); 
    }
    return updated;
  });

  if (currentIndex < questions.length - 1) {
    const nextIndex = currentIndex + 1;
    setCurrentIndex(nextIndex);
    setSelectedOption(answers[nextIndex] || null);
  } else {
    alert("You have reached the end of the exam.");
    console.log("Final answers:", answers);
  }
};

      
  const submitExam = async () => {
    try {
      const response = await fetch("http://localhost:5000/submit-exam", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
        body: JSON.stringify({ answers }),
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
  };
  


  const goPrevious = () => {
    if (currentIndex > 0) {
      const prevIndex = currentIndex - 1;
      setCurrentIndex(prevIndex);
      setSelectedOption(answers[prevIndex] || null);
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
      onClick={submitExam}
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

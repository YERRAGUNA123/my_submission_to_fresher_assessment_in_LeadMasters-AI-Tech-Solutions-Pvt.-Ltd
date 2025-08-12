import React, { useState, useEffect } from "react";
import axios from "axios";

function StartExam({ examData }) {
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [selectedOption, setSelectedOption] = useState(null);
  const [answers, setAnswers] = useState([]);
  const [timeleft, setTimeleft] = useState(examData.timeleft || 60);
  const [examStarted, setExamStarted] = useState(false);

  // ✅ Submit exam function
  const submitExam = async () => {
    try {
      const res = await axios.post("http://localhost:5000/api/submit-exam", {
        examId: examData._id,
        answers: answers,
      });
      alert(res.data.message || "Exam submitted successfully!");
    } catch (error) {
      console.error("Error submitting exam:", error);
      alert("Error submitting exam");
    }
  };

  // ✅ Timer auto-submit
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
  }, [examStarted, submitExam]); // ✅ dependency fixed

  // ✅ Save answer and go next
  const saveAnswerAndNext = () => {
    if (selectedOption === null) {
      alert("Please select an option before proceeding.");
      return;
    }

    const updatedAnswers = [...answers];
    updatedAnswers[currentQuestionIndex] = {
      question: examData.questions[currentQuestionIndex].questionText,
      selected: selectedOption,
    };
    setAnswers(updatedAnswers);
    setSelectedOption(null);

    if (currentQuestionIndex < examData.questions.length - 1) {
      setCurrentQuestionIndex(currentQuestionIndex + 1);
    } else {
      alert("You have reached the last question.");
    }
  };

  return (
    <div>
      {!examStarted ? (
        <button onClick={() => setExamStarted(true)}>Start Exam</button>
      ) : (
        <div>
          <h3>
            Time Left: <b>{timeleft}s</b>
          </h3>
          <h4>
            {examData.questions[currentQuestionIndex].questionText}
          </h4>

          {examData.questions[currentQuestionIndex].options.map((option, i) => (
            <div key={i}>
              <label>
                <input
                  type="radio"
                  value={option}
                  checked={selectedOption === option}
                  onChange={() => setSelectedOption(option)}
                />
                {option}
              </label>
            </div>
          ))}

          <button onClick={saveAnswerAndNext}>Next</button>
          <button
            onClick={() => {
              if (window.confirm("Are you sure you want to submit the exam?")) {
                submitExam();
                setExamStarted(false);
              }
            }}
          >
            Submit Exam
          </button>
        </div>
      )}
    </div>
  );
}

export default StartExam;

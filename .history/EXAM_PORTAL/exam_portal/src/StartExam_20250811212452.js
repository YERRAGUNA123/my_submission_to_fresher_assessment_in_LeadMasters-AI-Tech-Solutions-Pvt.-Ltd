import { useEffect , useState} from "react";    

function StartExam(){
    const [examStarted,setExamStarted] = useState(null);
    const [timeleft, settimleft] = useState(60);
    const [questions, setquestions] = useState([]);
    const [currentIndex, setCurrentIndex] = useState(0);
    const [options, setoptions] = useState([]);
     const [selectedOption, setSelectedOption] = useState(null);
    const [loading, setloading]= useState (false);
    const [answers, setAnswers] = useState({});
    const startExam = async () => {
        setloading(true);
        try {
            const response = await fetch('http://localhost:5000/start-exam', {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${localStorage.getItem('token')}`
                }
            });
            if (response.ok) {
                const data = await response.json();
                setExamStarted(true);
                setquestion(data.question);
                setCurrentIndex(0);
                setSelectedOption(null);
                setoptions(data.options);
                settimleft(data.timeleft);
                setAnswers({});
            } else {
                const errorData = await response.json();
                console.error('Error starting exam:', errorData.error);
            }
        } catch (error) {
            console.error('Error during exam start:', error);
        } finally {
            setloading(false);
        }
    };

    useEffect(() => {
        let timer;
        if (examStarted && timeleft > 0) {
            timer = setInterval(() => {
                settimleft(prevTime => prevTime - 1);
            }, 1000);
        } else if (timeleft === 0) {
            setExamStarted(false);
            alert("Time is up!");
        }
        return () => clearInterval(timer);
    }, [examStarted, timeleft]);   
    
    const handleNextQuestion = () => {
        if(selectedOption === null ) 
            {
            alert("Please select an option before proceeding.");
            return;
        }
        setAnswers(prevAnswers => ({
            ...prevAnswers,
            [currentIndex]: selectedOption
        }));
        alert(`Answwer Submitted: ${selectedOption}`);
    };
    const goNext = () => {
        if (currentIndex < options.length - 1) {    
            setCurrentIndex(prevIndex => prevIndex + 1);
            setSelectedOption(answers[currentIndex + 1] || null);
        }
        else {
            alert("You have reached the end of the exam.");
        }
        };
        const goPrevious = () => {
        if (currentIndex > 0) {
            setCurrentIndex(prevIndex => prevIndex - 1);
            setSelectedOption(answers[currentIndex - 1] || null);
        }
        else {
            alert("You are at the first question.");
        }
    };
    if(!examStarted){
    return (
        <div>
            <button onClick={startExam}>Start Exam</button>
            {loading && <p>Loading...</p>}
            {!loading && <p>Click the button to start the exam.</p>}
        </div>
    );
    } 
      const currentQuestion = questions[currentIndex];
    return (
        <div>
            
                
                    <h2>Question: {currentIndex + 1} of {questions.length}</h2>
                    <h3>{currentQuestion?.questionText}</h3>
<form>
            {options.map((option, idx) => (
              <div key={idx}>
                <label>
                  <input
                    type="radio"
                    name="options"
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
                    <button onClick={goNext}>Next Question</button>
                    <button onClick={goPrevious}>Previous Question</button>
                    <button onClick={handleNextQuestion}>Submit Answer</button>
                    
                </div>
            )}
            {!examStarted && !loading && <p>Click the button to start the exam.</p>}
        </div>
    );
    }
}
export default StartExam;
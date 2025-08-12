import { useEffect , useState} from "react";    

function StartExam(){
    const [examStarted,setExamStarted] = useState(null);
    const [timeleft, settimleft] = useState(60);
    const [question, setquestion] = useState(null);
    const [options, setoptions] = useState([]);
    const [loading, setloading]= useState (false);
    
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
                setoptions(data.options);
                settimleft(data.timeleft);
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
    return (
        <div>
            <button onClick={startExam}>Start Exam</button>
            {loading && <p>Loading...</p>}
            {examStarted && (
                <div>
                    <h2>Question: {question}</h2>
                    <h3>Options:</h3>
 <input
                    type="radio"
                    name="options"
                    value={options}
                    checked={selectedOptions === options}
                    onChange={() => setSelectedOptions(options)}
                  />

                    <p>Time left: {timeleft} seconds</p>
                </div>
            )}
            {!examStarted && !loading && <p>Click the button to start the exam.</p>}
        </div>
    );
    }
export default StartExam;
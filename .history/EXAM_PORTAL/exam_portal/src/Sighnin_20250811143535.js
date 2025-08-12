import React, { useState } from "react";
import StartExam from "./StartExam"; // Assuming StartExam is in the same directory


function Sighnin(){
    const [username, setusername]=useState("");
    const [password, setpassword]=useState("");
    const [message, setmessage]=useState("");
    const [loggedin, setloggedin] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const response = await fetch('http://localhost:5000/signin', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ username, password }),
            });
            const data = await response.json();
            if (response.ok) {
                localStorage.setItem('token', data.token);
                setmessage(`Signin successful: ${data.message}`);
                console.log("token stored", data.token);
            } else {
                setmessage(`Error: ${data.error}`);
            }
        } catch (error) {
            setmessage(`Error: ${error.message}`);  
            console.error('Error during signin:', error);
        }
    };

    return (<div>
        {!loggedin ? (
        <form onSubmit={handleSubmit}>
            <input type="text" placeholder="username" value={username} onChange={(e)=>setusername(e.target.value)}/>
            <input type="password" placeholder="password" value={password} onChange={(e)=>setpassword(e.target.value)}/>
            <button type="submit">Sighnin</button>
            <p>{message}</p>
        </form>
    ):(<StartExam />
    )}
        </div>
    );
}
export default Sighnin;

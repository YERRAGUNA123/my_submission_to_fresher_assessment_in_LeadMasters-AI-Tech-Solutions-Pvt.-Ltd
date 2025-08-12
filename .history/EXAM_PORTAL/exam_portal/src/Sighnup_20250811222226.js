import React,{useState} from "react";
function Sighup() {
    const [username, setusername] = useState("");
    const [password, setpassword] = useState("");
    const [confirmpassword, setconfirmpassword] = useState("");
    const [message, setmessage] = useState("");

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (password !== confirmpassword) {
            setmessage("password do not match");
            return;
        }
        try {
            const response = await fetch('http://localhost:5000/signup', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ username, password }),
            });
            const data = await response.json();
            if (data) {
                setmessage("user created");
            } else {
                setmessage("error creating user");
            }
        } catch (error) {
            console.error('Error during signup:', error);
            setmessage("error creating user");
        }
    };

    return (
        <form onSubmit={handleSubmit}>
            <label>username</label>
            <input type="text" placeholder="username" value={username} onChange={(e) => setusername(e.target.value)}required />
            <label>password</label>
            <input type="password" placeholder="password" value={password} onChange={(e) => setpassword(e.target.value)}required />
            <label>confirm password</label>
            <input type="password" placeholder="confirm password" value={confirmpassword} onChange={(e) => setconfirmpassword(e.target.value)}required />
            <button type="submit">Signup</button>
            <p>{message}</p>
        </form>
    );
}

export default Sighup;

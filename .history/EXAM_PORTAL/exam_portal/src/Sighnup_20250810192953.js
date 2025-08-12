import React,{useState} from "react";
function Sighup() {
    const [username, setusername] = useState("");
    const [password, setpassword] = useState("");
    const [confirmpassword, setconfirmpassword] = useState("");
    const [message, setmessage] = useState("");

    const handleSubmit = (e) => {
        e.preventDefault();
        if (password !== confirmpassword) {
            setmessage("password do not match");
            return;
        }
        setmessage(`User ${username} registered successfully`);
    };

    return (
        <form onSubmit={handleSubmit}>
            <label>username</label>
            <input type="text" placeholder="username" value={username} onChange={(e) => setusername(e.target.value)} />
            <label>password</label>
            <input type="password" placeholder="password" value={password} onChange={(e) => setpassword(e.target.value)} />
            <label>confirm password</label>
            <input type="password" placeholder="confirm password" value={confirmpassword} onChange={(e) => setconfirmpassword(e.target.value)} />
            <button type="submit">Signup</button>
            <p>{message}</p>
        </form>
    );
}
    
export default Sighup;

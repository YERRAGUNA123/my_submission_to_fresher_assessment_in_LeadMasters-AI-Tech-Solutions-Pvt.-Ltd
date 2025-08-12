import React, { useState } from "react";

function Sighnin(){
    const [username, setusername]=useState("");
    const [password, setpassword]=useState("");
    const [message, setmessage]=useState("");
    const handleSubmit=(e)=>{

        e.preventDefault();
        if(username === "user" && password === "pass"){
            setmessage("Sighnin successful");
        }else{
            setmessage("Invalid username oer password");

    
        }
        
    };
    return (<form onSubmit={handleSubmit}>
        <input type="text" placeholder="username" value={username} onChange={(e)=>setusername(e.target.value)}/>
        <input type="password" placeholder="password" value={password} onChange={(e)=>setpassword(e.target.value)}/>
        <button type="submit">Sighnin</button>
        <p>{message}</p>
    </form>);

    

}
export default Sighnin;

import React, { useState } from "react";

function Sighnin(){
    const [username, setusername]=useState("");
    const [password, setpassword]=useState("");
    const [message, setmessage]=useState("");
    const hndleSubmit=(e)=>{

        e.preventDefault();
        if(username === "user" && password === "pass"){
            setmessage("Sighnin successful");
        }else{
            setmessage("Invalid username oer password");

        
        }
        
    }
}


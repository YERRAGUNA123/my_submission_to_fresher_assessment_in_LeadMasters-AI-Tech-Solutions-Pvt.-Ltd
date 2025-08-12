import React, { UseState } from "react";

function sighnin(){
    const [username, setusername]=UseState("");
    const [password, setpassword]=Usestate("");
    const [message, setmessage]=UseState("");
    const hndleSubmit=(e)=>{

        e.preventDefault();
        if(username === "user" && password === "pass"){
            setmessage("Sighnin successful");
        }else{
            setmessage("Invalid username oer password");

        
        }
    }
}


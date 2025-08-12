import React from "react";
import ReactDOM from "react-dom/client";
import {BrowserRouter as Router,Route,Routes} from "react-router-dom";
import Sighnin from "./Sighnin";
import Sighnup from "./Sighnup";


function App(){
return(
 <div>
<h1>welcome to the exam portal</h1>
<nav>
<Link to="/Sighnin">Sighnin</Link>
<Link to="/sighnup">Sighnup</Link>
</nav>
<hr/>
<Routes>
    <Route path="/sighnin" element={<Sighnin/>}/>
    <Route path="/Sighnup" element={<Sighnup/>}/>
    <Route path="/" element={<h2>Home Page</h2>}/>
    

</Routes>
</div>



)

}

const myroot=ReactDOM.createRoot(document.getElementById("root"));
myroot.render(<App/>)
import React from "react";
import ReactDOM from "react-dom/client";
import {BrowserRouter as Router,Route,Routes} from "react-router-dom";
import Sighnin from "./Sighnin";
import Sighnup from "./Sighnup";


function App(){
return(
   <BrowserRouter>
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
    <Route path="/" element={<p>please select sighnin or sighnup</p>}/>



</Routes>
</div>
</BrowserRouter>



);

}

const myroot=ReactDOM.createRoot(document.getElementById("root"));
myroot.render(<App/>)
import React from "react";
import ReactDOM from "react-dom/client";
import Sighnin from "\Sighnin.js";
import Sighnup from "\Sighnup.js";

function App(){
return(
 <div>
<h1>welcome to the exam portal</h1>
<a href="/Sighnin">Sighn in</a>
<a href="/Sighnup">Sighn up</a>
</div>



)

}

const myroot=ReactDOM.createRoot(document.getElementById("root"));
myroot.render(<App/>)
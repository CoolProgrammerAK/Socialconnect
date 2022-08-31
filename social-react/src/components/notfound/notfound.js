import React from "react";
import './notfound.scss'
function Notfound({error=false}) {
  const PF = process.env.REACT_APP_AVATAR;
  return (
    <>
      <div id="notfound">
        <div className="notfound">
          <div className="notfound-404">
            <img id="imgerror" src={PF + "notfound.svg"}></img>
          </div>
          <p id="connect">{"Profile Not found"}</p>
          <p id="detail">
            {error?"Looks like the page you are looking to visit doesn't exist."
            :"Looks like profile has been deleted or there is no profile with that id."}
          </p>
          <p id="detail">
            { "Please check the url and try again."}
          </p>
         {error &&  <a href={'/'}>{"home page"}</a>}
        </div>
      </div>
    </>
  );
}

export default Notfound;

import React from "react";
import "./Home.css";
import dog1 from "../images/dog1.png";
import dog2 from "../images/dog6.png";
import dog3 from "../images/dog7.png";

export default function Home() {
  return (
    <div className="container">
      <div className="card">
        <img src={dog3} alt="Elokuvia" />
        <p>Hae ja arvostele elokuvia!</p>
      </div>
      <div className="card">
        <img src={dog2} alt="Ryhmiin liittyminen" />
        <p>Liity ryhmiin ja keskustele!</p>
      </div>
      <div className="card">
        <img src={dog1} alt="Näytösaikojen selaaminen" />
        <p>Selaa elokuvien näytösaikoja!</p>
      </div>
    </div>
  );
}

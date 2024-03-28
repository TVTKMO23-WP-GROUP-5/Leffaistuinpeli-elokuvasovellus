import React from "react";
import { Link } from "react-router-dom";
import "./Home.css";
import dog1 from "../images/dog1.png";
import dog2 from "../images/dog6.png";
import dog3 from "../images/dog7.png";

export default function Home() {
  return (
    <div className="container">
      <Link to="/Search" className="card">
        <img src={dog3} alt="Elokuvia" />
        <p>Hae ja arvostele elokuvia!</p>
      </Link>
      <Link to="/AllGroups" className="card">
        <img src={dog2} alt="Ryhmiin liittyminen" />
        <p>Liity ryhmiin ja keskustele!</p>
      </Link>
      <Link to="/Showtimes" className="card">
        <img src={dog1} alt="Näytösaikojen selaaminen" />
        <p>Selaa elokuvien näytösaikoja!</p>
      </Link>
    </div>
  );
}

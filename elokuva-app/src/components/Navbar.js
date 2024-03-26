import React from "react";
import "./Navbar.css";

export default function Navbar() {
  return (
    <nav>
      <ul>
        <li>
          <a>Koti</a>
        </li>
        <li>
          <a>Haku</a>
        </li>
        <li>
          <a>Ryhmät</a>
        </li>
        <li>
          <a>Näytösajat</a>
        </li>
        <li>
          <a>Asetukset</a>
        </li>
        <li>
          <a>Luo tunnus</a>
        </li>
      </ul>
    </nav>
  );
}

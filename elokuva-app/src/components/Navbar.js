import React from "react";
import "./Navbar.css";
import { Link } from "react-router-dom";
import { useUser } from "../context/UseUser";

export default function Navbar() {
  const { user } = useUser();
  return (
    <nav>
      <ul>
        <li>
          <Link to="/">Koti</Link>
        </li>
        <li>
          <Link to="/search">Haku</Link>
        </li>
        <li>
          <Link to="/showtimes">Näytösajat</Link>
        </li>
        <li>
          <Link to="/allgroups">Ryhmät</Link>
        </li>
        <li>
          <Link to="/userpage">Omat tiedot</Link>
        </li>
        <li>
          <Link to="/register">Tee tunnus</Link>
        </li>
      </ul>

      <div>
        {user === null && <Link to="/login">Kirjaudu</Link>}
        {user && <Link to="/logout">Kirjaudu ulos</Link>}
      </div>
    </nav>
  );
}

import React, { useEffect, useState } from "react";
import "./Navbar.css";
import logo1 from "../images/logo1.png";
import { Link } from "react-router-dom";
import { useUser } from "../context/UseUser";
import axios from "axios";

export default function Navbar() {
  const { user } = useUser();
  const [isAdmin, setIsAdmin] = useState(false)

  console.log(user)

  useEffect(() => {
    axios.post('http://localhost:3001/getmembers/checkowner', {username: user})
      .then(response => {
        console.log(response.data)
        setIsAdmin(response.data)
      })
      .catch(error => {
        console.error("Fetching failed", error)
      })
  }, [user]);

  return (
    <nav>
      <div className="logo-container">
        <img src={logo1} alt="Logo" />
      </div>

      <div className="button-container">
        <ul>
          <li>
            <Link to="/" className="navButton">
              Koti
            </Link>
          </li>
          <li>
            <Link to="/search" className="navButton">
              Haku
            </Link>
          </li>
          <li>
            <Link to="/showtimes" className="navButton">
              Näytösajat
            </Link>
          </li>
          <li>
            <Link to="/allgroups" className="navButton">
              Ryhmät
            </Link>
          </li>

          {user && (
            <>
              <li>
                <Link to="/userpage" className="navButton">
                  Omat tiedot
                </Link>
              </li>
            </>
          )}

          {isAdmin && (
            <>
              <li>
                <Link to="/adminpage" className="navButton">
                  Ryhmän ylläpito
                </Link>
              </li>
            </>
          )}
        </ul>
      </div>

      <div className="search-container">
        <input type="text" placeholder="Hae elokuvia tai sarjoja"></input>
      </div>

      <div className="sign-container">
        {user === null && (
          <Link to="/login" className="signButton">
            Kirjaudu sisään
          </Link>
        )}
        {user && (
          <Link to="/logout" className="signButton">
            Kirjaudu ulos
          </Link>
        )}
      </div>
    </nav>
  );
}

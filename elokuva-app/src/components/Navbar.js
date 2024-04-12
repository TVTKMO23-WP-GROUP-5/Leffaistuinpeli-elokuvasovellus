import React, { useEffect, useState } from "react";
import "./Navbar.css";
import logo1 from "../images/logo1.png";
import { Link } from "react-router-dom";
import { useUser } from "../context/UseUser";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faHouse, faMagnifyingGlass, faCalendarDays, faPeopleGroup } from '@fortawesome/free-solid-svg-icons';
import axios from "axios";

export default function Navbar() {
  const { user } = useUser();
  const [isAdmin, setIsAdmin] = useState(false);
  const [burger, setBurger] = useState("Burger unclicked");
  const [menu, setMenu] = useState("Menu hidden");
  const [isMenuClicked, setIsMenuClicked] = useState(false);

  console.log(user)

  useEffect(() => {
    axios
      .post("http://localhost:3001/getmembers/checkowner", { username: user })
      .then((response) => {
        console.log(response.data);
        setIsAdmin(response.data);
      })
      .catch((error) => {
        console.error("Fetching failed", error);
      });
  }, [user]);

  const updateMenu = (event) => {
    event.stopPropagation();
    setBurger(isMenuClicked ? "Burger unclicked" : "Burger clicked");
    setMenu(isMenuClicked ? "hidden" : "visible");
    setIsMenuClicked(!isMenuClicked);
  };

  useEffect(() => {
    const handleOutsideClick = (event) => {
      setMenu("hidden");
      setBurger("Burger unclicked");
      setIsMenuClicked(false);
    };
  
    if (menu === "visible") {
      document.addEventListener('click', handleOutsideClick);
    } else {
      document.removeEventListener('click', handleOutsideClick);
    }
  
    return () => {
      document.removeEventListener('click', handleOutsideClick);
    };
  }, [menu]);

  return (
    <nav>
      <div className="logo-container">
        <img src={logo1} alt="Logo" />
      </div>

      <div className={`burger-menu ${burger}`} onClick={updateMenu}>
        <div className="burger"></div>
        <div className="burger"></div>
        <div className="burger"></div>
      </div>
      <div className={`menu ${menu}`}>
        <ul id="menu">
          <li>
            <Link to="/"><FontAwesomeIcon icon={faHouse} />Etusivu</Link>
          </li>
          <li>
            <Link to="/search"><FontAwesomeIcon icon={faMagnifyingGlass} />Haku</Link>
          </li>
          <li>
            <Link to="/showtimes"><FontAwesomeIcon icon={faCalendarDays} />Näytösajat</Link>
          </li>
          <li>
            <Link to="/allgroups"><FontAwesomeIcon icon={faPeopleGroup} />Ryhmät</Link>
          </li>
          <li>
            <Link to="/search">Haku</Link>
          </li>
          <li>
            <Link to="/search">Haku</Link>
          </li>
          <li>
            <Link to="/search">Haku</Link>
          </li>
          <li>
            <Link to="/search">Haku</Link>
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
                <Link to="/adminpage">Ryhmän ylläpito</Link>
              </li>
            </>
          )}
          {user === null && <Link to="/login">Kirjaudu sisään</Link>}
          {user && <Link to="/logout">Kirjaudu ulos</Link>}
        </ul>
      </div>

      <div className="button-container">
        <ul id="buttons">
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

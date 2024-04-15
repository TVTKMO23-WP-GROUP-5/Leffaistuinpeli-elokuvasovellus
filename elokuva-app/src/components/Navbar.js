import React, { useEffect, useState } from "react";
import "./Navbar.css";
import logo1 from "../images/logo1.png";
import logo2 from "../images/logo2.png";
import { Link } from "react-router-dom";
import { useUser } from "../context/UseUser";
import { useTheme } from "../context/ThemeContext";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import axios from "axios";
import {
  faHouse,
  faMagnifyingGlass,
  faCalendarDays,
  faPeopleGroup,
  faSun,
  faMoon,
  faGear,
  faRightFromBracket,
  faStar,
  faUserGroup,
  faGroupArrowsRotate,
} from "@fortawesome/free-solid-svg-icons";

export default function Navbar() {
  const { user } = useUser();
  const { isAdmin, setIsAdmin} = useUser()
  const [burger, setBurger] = useState("Burger unclicked");
  const [menu, setMenu] = useState("Menu hidden");
  const [isMenuClicked, setIsMenuClicked] = useState(false);
  const { theme, changeTheme } = useTheme();

  const logos = theme === "dark" ? logo1 : logo2;

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
      document.addEventListener("click", handleOutsideClick);
    } else {
      document.removeEventListener("click", handleOutsideClick);
    }

    return () => {
      document.removeEventListener("click", handleOutsideClick);
    };
  }, [menu]);

  return (
    <nav>
      <div className="logo-container">
        <Link to="/">
          <img src={logos} alt="Logo" />
        </Link>
      </div>

      <div className={`burger-menu ${burger}`} onClick={updateMenu}>
        <div className="burger"></div>
        <div className="burger"></div>
        <div className="burger"></div>
      </div>
      <div className={`menu ${menu}`}>
        <ul id="menu">
          <li>
            <Link to="/">
              <FontAwesomeIcon icon={faHouse} className="fa-icon" />
              <span className="link-text">Etusivu</span>
            </Link>
          </li>
          <li>
            <Link to="/search">
              <FontAwesomeIcon icon={faMagnifyingGlass} className="fa-icon" />
              <span className="link-text">Haku</span>
            </Link>
          </li>
          <li>
            <Link to="/showtimes">
              <FontAwesomeIcon icon={faCalendarDays} className="fa-icon" />
              <span className="link-text">Näytösajat</span>
            </Link>
          </li>
          <li>
            <Link to="/allgroups">
              <FontAwesomeIcon icon={faPeopleGroup} className="fa-icon" />
              <span className="link-text">Ryhmät</span>
            </Link>
          </li>
          <li>
            <Link to="/owngroups">
              <FontAwesomeIcon icon={faUserGroup} className="fa-icon" />
              <span className="link-text">Omat ryhmät</span>
            </Link>
          </li>
          {isAdmin && (
            <>
              <li>
                <Link to="/adminpage">
                  <FontAwesomeIcon
                    icon={faGroupArrowsRotate}
                    className="fa-icon"
                  />
                  <span className="link-text">Ryhmän ylläpito</span>
                </Link>
              </li>
            </>
          )}
          <li>
            <Link to="/search">
              <FontAwesomeIcon icon={faStar} className="fa-icon" />
              <span className="link-text">Arvostelut</span>
            </Link>
          </li>
          {user && (
            <>
              <li>
                <Link to="/userpage">
                  <FontAwesomeIcon icon={faGear} className="fa-icon" />
                  <span className="link-text">Omat tiedot</span>
                </Link>
              </li>
            </>
          )}
          <li>
            {user === null && (
              <Link to="/login">
                <FontAwesomeIcon
                  icon={faRightFromBracket}
                  className="fa-icon"
                />
                <span className="link-text">Kirjaudu sisään</span>
              </Link>
            )}
            {user && (
              <Link to="/logout">
                <FontAwesomeIcon
                  icon={faRightFromBracket}
                  className="fa-icon"
                />
                <span className="link-text">Kirjaudu ulos</span>
              </Link>
            )}
          </li>
          <li>
            <Link to="/search">Haku</Link>
          </li>
          <li>
            <Link to="/search">Haku</Link>
          </li>
        </ul>
      </div>

      <div className="navibutton-container">
        <ul className="buttons">
          <li>
            <Link to="/search" className="navButton">
              <FontAwesomeIcon icon={faMagnifyingGlass} className="fa-icon" />
              <span className="link-text">Haku</span>
            </Link>
          </li>
          <li>
            <Link to="/showtimes" className="navButton">
              <FontAwesomeIcon icon={faCalendarDays} className="fa-icon" />
              <span className="link-text">Näytösajat</span>
            </Link>
          </li>
          <li>
            <Link to="/allgroups" className="navButton">
              <FontAwesomeIcon icon={faPeopleGroup} className="fa-icon" />
              <span className="link-text">Ryhmät</span>
            </Link>
          </li>
        </ul>
      </div>

      <div className="theme" onClick={changeTheme}>
        {theme === "dark" ? (
          <FontAwesomeIcon
            icon={faMoon}
            size="3x"
            className="theme-icon"
          />
        ) : (
          <FontAwesomeIcon
            icon={faSun}
            size="3x"
            className="theme-icon"
          />
        )}
      </div>

      <div className="sign-container">
        {user === null && (
          <Link to="/login" className="signButton">
            <FontAwesomeIcon icon={faRightFromBracket} className="fa-icon" />
            <span className="login">Kirjaudu sisään</span>
            <span className="login-small">Kirjaudu</span>
          </Link>
       )}
        {user && (
          <Link to="/logout" className="signButton">
            <FontAwesomeIcon icon={faRightFromBracket} className="fa-icon" />
            <span className="login">Kirjaudu ulos</span>
            <span className="login-small">Kirjaudu</span>
          </Link>
        )}
      </div>
    </nav>
  );
}

import React, { useEffect, useState } from "react";
import { useUser } from "../context/UseUser";
import { Link, useNavigate } from "react-router-dom";
import { useTheme } from "../context/ThemeContext";
import axios from "axios";
import "./UserPage.css";

export default function UserPage() {
  const { theme } = useTheme();
  const { user, setUser } = useUser();
  const [userinfo, setUserinfo] = useState({
    username: user ? user : "",
    fname: "",
    lname: "",
    email: "",
  });

  const navigate = useNavigate();

  useEffect(() => {
    if (!user) {
      navigate("/register");
    }
  }, [user, navigate]);

  // ----- Haetaan käyttäjän tiedot -----
  useEffect(() => {
    if (user) {
      axios
        .get(`/auth/userdata?username=${user}`)
        .then((response) => {
          setUserinfo((userinfo) => ({
            ...userinfo,
            fname: response.data.fname || "",
            lname: response.data.lname || "",
            email: response.data.email || "",
          }));
        })
        .catch((error) => {
          console.error("Virhe käyttäjätietojen hakemisessa");
        });
    }
  }, [user]);

  // ----- Poistetaan käyttäjän data -----
  const handleDeleteUser = () => {
    const confirmDelete = window.confirm(
      "Haluatko varmasti poistaa käyttäjätilin?"
    );

    if (confirmDelete) {
      const username = sessionStorage.getItem("username");
      axios
        .delete("/auth/delete", { data: { username } })
        .then((response) => {
          setUser(null);
          console.log(response.data);
          window.alert("Käyttäjätili ja tiedot poistettu onnistuneesti.");
          navigate("/");
        })
        .catch((error) => {
          console.error("Virhe käyttäjätilin poistamisessa:", error);
          window.alert("Virhe käyttäjätilin poistamisessa.");
        });
    }
  };

  return (
    <>
      {user ? (
        <div className="userpage-container">
          <div className={theme === "dark" ? "dark-theme" : ""}>
            <div className="user-container">
              <h3>Käyttäjätiedot</h3>
              {user && (
                <div className="user-content">
                  <div className="user-info">
                    <p>
                      <strong>Käyttäjätunnus:</strong>
                      <span>{userinfo.username}</span>
                    </p>
                    <p>
                      <strong>Etunimi:</strong>
                      <span>{userinfo.fname}</span>
                    </p>
                    <p>
                      <strong>Sukunimi:</strong>
                      <span>{userinfo.lname}</span>
                    </p>
                    <p>
                      <strong>Sähköposti:</strong>
                      <span>{userinfo.email}</span>
                    </p>
                  </div>
                  <div className="user-actions">
                    <div className="user_favorites_button">
                      <Link to={`/${user}/favorites`}>
                        <button className="userpagebutton">
                          Omat suosikit
                        </button>
                      </Link>
                    </div>
                    <div className="user_own_groups_button">
                      <Link to="/owngroups">
                        <button className="userpagebutton">Omat ryhmät</button>
                      </Link>
                    </div>
                    <button className="button" onClick={handleDeleteUser}>
                      Poista käyttäjätili
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      ) : (
        <Link to="*"></Link>
      )}
    </>
  );
}

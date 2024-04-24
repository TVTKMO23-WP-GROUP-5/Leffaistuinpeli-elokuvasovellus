// UserPage.js

import React, { useEffect, useState } from 'react';
import { useUser } from '../context/UseUser';
import { Link, useNavigate } from 'react-router-dom';
import { useTheme } from '../context/ThemeContext';
import axios from 'axios'; // Lisätty axios-kirjasto
import './UserPage.css'; // Tuodaan CSS-tiedosto

export default function UserPage() {
  const { theme } = useTheme();
  const { user, setUser } = useUser();
  const navigate = useNavigate();
  const [confirmDelete, setConfirmDelete] = useState(false);

  useEffect(() => {
    if (!user) {
      navigate('/register');
    }
  }, [user, navigate]);

  const handleDeleteUser = () => {
    if (confirmDelete) {
      const username = sessionStorage.getItem("username");
      axios.delete('http://localhost:3001/auth/delete', { data: { username } })
        .then(response => {
          setUser(null);
          alert('Käyttäjätili poistettu onnistuneesti.');
        })
        .catch(error => {
          console.error('Virhe käyttäjätilin poistamisessa:', error);
          alert('Virhe käyttäjätilin poistamisessa.');
        });
    }
  };

  const handleCheckboxChange = (e) => {
    setConfirmDelete(e.target.checked);
  };

  return (
  <div className="marginiaYlos">
    <div className={theme === 'dark' ? 'dark-theme' : ''}>
    <>
      <div>
        <h2>Käyttäjätiedot</h2>
        {user && (
          <div className="content">
            <div className="user_favorites_button">
              <Link to={`/${user}/favorites`}>
                <button className="userpagebutton">Omat suosikit</button>
              </Link>
            </div>
            <div>
              <p>Etunimi: {user.fname}</p>
              <p>Sukunimi: {user.lname}</p>
              <p>Sähköposti: {user.email}</p>
              <div>
                <label htmlFor="confirmDeleteCheckbox">
                  <input
                    type="checkbox"
                    id="confirmDeleteCheckbox"
                    checked={confirmDelete}
                    onChange={handleCheckboxChange}
                  />
                  Oletko varma, että haluat poistaa käyttätilin?
                </label>
                <button
                  className="button"
                  onClick={handleDeleteUser}
                  disabled={!confirmDelete}
                >
                  Poista käyttäjätili
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </>
  </div>
  </div>
  ); 
}

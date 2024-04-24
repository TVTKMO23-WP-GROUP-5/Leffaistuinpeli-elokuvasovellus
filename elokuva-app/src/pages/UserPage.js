import React, { useEffect } from 'react';
import { useUser } from '../context/UseUser';
import { Link, useNavigate } from 'react-router-dom';
import { useTheme } from '../context/ThemeContext';
import axios from 'axios';
import './UserPage.css';

export default function UserPage() {
  const { theme } = useTheme();
  const { user, setUser } = useUser(); 
  const navigate = useNavigate();

  useEffect(() => {
    if (!user) {
      navigate('/register');
    }
  }, [user, navigate]);

  const handleDeleteUser = () => {
    const confirmDelete = window.confirm('Haluatko varmasti poistaa käyttäjätilin?');

    if (confirmDelete) {
      const username = sessionStorage.getItem("username");
      axios.delete(process.env.REACT_APP_URL + '/auth/delete', { data: { username } })
        .then(response => {
          setUser(null);
          window.alert('Käyttäjätili ja tiedot poistettu onnistuneesti.');
        })
        .catch(error => {
          console.error('Virhe käyttäjätilin poistamisessa:', error);
          window.alert('Virhe käyttäjätilin poistamisessa.');
        });
    }
  };

  return (
    <div className="marginiaYlos">
      <div className={theme === 'dark' ? 'dark-theme' : ''}>
        <div className="user-container">
          <h2>Käyttäjätiedot</h2>
          {user && (
            <div className="content">
              <div className="user-info">
                <p>Etunimi: {user.fname}</p> 
                <p>Sukunimi: {user.lname}</p>
                <p>Sähköposti: {user.email}</p>
              </div>
              <div className="user-actions">
                <div className="user_favorites_button">
                  <Link to={`/${user}/favorites`}>
                    <button className="userpagebutton">Omat suosikit</button>
                  </Link>
                </div>
                {/* Uusi nappi */}
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
  );
}

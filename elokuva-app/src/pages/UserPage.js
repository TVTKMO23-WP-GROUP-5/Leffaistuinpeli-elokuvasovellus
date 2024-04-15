import React, { useEffect, useState } from 'react';
import { useUser } from '../context/UseUser';
import { useNavigate } from 'react-router-dom';
import axios from 'axios'; // Lisätty axios-kirjasto
import './UserPage.css';

export default function UserPage() {
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
      const username = sessionStorage.getItem("username"); // Hae käyttäjänimi sessionStoragesta
      axios.delete('http://localhost:3001/auth/delete', { data: { username } }) // Lähetä käyttäjänimi DELETE-pyynnön rungossa
        .then(response => {
          setUser(null);
          alert('Käyttäjätili poistettu onnistuneesti.');
        })
        .catch(error => {
          console.error('Error deleting user:', error);
          alert('Virhe käyttäjätilin poistamisessa.');
        });
    }
  };
  

  const handleCheckboxChange = (e) => {
    setConfirmDelete(e.target.checked);
  };

  return (
    <div>
      <h2>Käyttäjätiedot</h2>
      {user && (
        <div>
          <p>Etunimi: {user.fname}</p>
          <p>Sukunimi: {user.lname}</p>
          <p>Sähköposti: {user.email}</p>
          <div>
            <input
              type="checkbox"
              id="confirmDeleteCheckbox"
              checked={confirmDelete}
              onChange={handleCheckboxChange}
            />
            <label htmlFor="confirmDeleteCheckbox">Vahvistan poiston</label>
          </div>
          <button className="button" onClick={handleDeleteUser} disabled={!confirmDelete}>
            Poista käyttäjätili
          </button>
        </div>
      )}
    </div>
  );
}

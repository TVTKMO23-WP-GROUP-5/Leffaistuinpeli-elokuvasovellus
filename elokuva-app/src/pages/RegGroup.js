import React, { useState } from 'react';
import { useUser } from '../context/UseUser';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import './RegGroup.css';

export default function Register() {
  const { registerData, setRegisterData } = useUser({
    groupname: '',
    description: '',
    owner: '',
  });

  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleChange = (e) => {
    setRegisterData((prevRegisterData) => ({
      ...prevRegisterData,
      [e.target.name]: e.target.value,
    }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    try {
      if (!registerData.fname.trim() || !registerData.kuvaus.trim()) {
        setError('Ryhmän nimi ja kuvaus vaaditaan');
        return;
      }

      const response = await axios.post('http://localhost:3001/register', registerData);
      console.log('Server response:', response.data);

      if (response.data && response.data.success) {
        console.log('Group registered successfully:', response.data);
        alert('Ryhmän luonti onnistui');
        navigate('/userpage');
      } else {
        throw new Error('Ryhmän luonti epäonnistui');
      }
    } catch (error) {
      console.error('Error registering group:', error);
      alert('Virhe ryhmän luomisessa: ' + error.message);
    }
  };

  return (
    <div className="main">
      <div className="ryhmäsivu">
        <div className="otsikko">
          <h2>Luo ryhmäsivu</h2>
        </div>
        <form onSubmit={handleSubmit}>
          <div className="ryhmännimi">
            <input
              type="text"
              name="fname"
              placeholder="Ryhmän nimi"
              onChange={handleChange}
            />
          </div>
          <div className="kuvaus">
            <input
              type="text"
              name="kuvaus"
              placeholder="Kuvaus"
              onChange={handleChange}
            />
          </div>
          {error && <div className="error">{error}</div>}
          <div className="nappi">
            <button type="submit">Jatka</button>
          </div>
        </form>
      </div>
    </div>
  );
}

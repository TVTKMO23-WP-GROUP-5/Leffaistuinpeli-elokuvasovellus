import React, { useState } from 'react';
import { useUser } from '../context/UseUser';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import './RegGroup.css';
import { useTheme } from '../context/ThemeContext';

export default function Register() {
  const { user, setIsAdmin, setGroupMembers } = useUser();
  const { theme } = useTheme(); 
  const [groupRegisterData, setGroupRegisterData] = useState({
    groupname: '',
    description: '',
    owner: user,
  });

  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleChange = (e) => {
    setGroupRegisterData((prevGroupRegisterData) => ({
      ...prevGroupRegisterData,
      [e.target.name]: e.target.value,
    }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    if (!groupRegisterData.groupname.trim() || !groupRegisterData.description.trim()) {
      setError('Ryhmän nimi ja kuvaus vaaditaan');
      return;
    }

    try {
      const response = await axios.post('http://localhost:3001/groups/register', groupRegisterData);

      if (response.data.message === 'success') {
        console.log('Group registered successfully:', response.data);
        alert('Ryhmän luonti onnistui');
        setIsAdmin(true);
        if (user !== null) {
          axios
            .post('http://localhost:3001/getmembers', { username: user })
            .then((response) => {
              setGroupMembers(response.data);
              console.log(response.data.application);
            })
            .catch((error) => {
              console.error('Fetching failed', error);
            });
        }
        navigate('/allgroups');
      } else {
        console.log('Something went wrong:', response.data);
        alert('Ryhmän luonti epäonnistui...');
      }
    } catch (error) {
      console.error('Error registering group:', error.response.data);
      alert('Virhe ryhmän luomisessa...');
    }
  };

  return (
    <div className={`main ${theme}`}>
      <div className="ryhmäsivu">
        <div className="otsikko">
          <h2>Luo ryhmäsivu</h2>
        </div>
        <form onSubmit={handleSubmit}>
          <div className="ryhmännimi">
            <input
              type="text"
              name="groupname"
              placeholder="Ryhmän nimi"
              value={groupRegisterData.groupname}
              onChange={handleChange}
            />
          </div>
          <div className="kuvaus">
            <input
              type="text"
              name="description"
              placeholder="Kuvaus"
              value={groupRegisterData.description}
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

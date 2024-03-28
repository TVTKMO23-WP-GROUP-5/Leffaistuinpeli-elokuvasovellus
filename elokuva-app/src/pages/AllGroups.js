import React, { useEffect, useState } from 'react'
import axios from 'axios'
import './AllGroups.css'
import '../index.css'
import { type } from '@testing-library/user-event/dist/type'

export default function AllGroups() {
  const [groups, setGroups] = useState([])

  useEffect(() => {
    axios.get('http://localhost:3001/allgroups')
      .then(response => {
        setGroups(response.data)
      })
      .catch(error => {
        console.error("Fetching failed", error)
      })
  }, []);

  return (
    <div className='container_allgroups'>
      <div className='buttons'>
        <button className='makegroup'>Luo ryhmä</button>
        <button className='mygroups'>Omat ryhmät</button>
      </div>
      <div className='info'>
        <h2>Kaikki ryhmät</h2>
      </div>
      <div className='grouplist'>
        <button className='alph_order'>A-Z ↑↓</button>
        <p className='groupname'>Ryhmän nimi</p>
        <p className='description'>Ryhmän kuvaus</p>
      </div>
      <div className='groups'>
        <ul>
          {groups && groups.map((group, index) => 
            <li key={index}>
              <strong>{group.name}:</strong> {group.description} (perustaja:{group.owner})
            </li>
          )}
        </ul>
      </div>
    </div>
  )
}

import React, { useState } from 'react'
import './AllGroups.css'
import '../index.css'

export default function AllGroups() {
  const [groups, setGroups] = useState([])
  return (
    <div className='container'>
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
          {groups && groups.map((group, index) => (
            <li key={index}>{group.name}</li>
          ))}
        </ul>
      </div>
    </div>
  )
}

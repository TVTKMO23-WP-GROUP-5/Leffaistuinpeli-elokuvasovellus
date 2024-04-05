import React, { useContext, useEffect, useState } from 'react'
import { Link } from "react-router-dom";
import { Navigate, useNavigate } from 'react-router-dom'
import { useUser } from '../context/UseUser'
import axios from 'axios'
import './AllGroups.css'
import '../index.css'

export default function AllGroups() {
  let navigate = useNavigate();
  const { groups, setGroups } = useUser();

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
        <Link to='/reggroup'>
          <button className='makegroup'>Luo ryhmä</button>
        </Link>
        <Link to='/grouppage'>
          <button className='mygroups'>Omat ryhmät</button>
        </Link>
      </div>
      <div className='info'>
        <h2>Kaikki ryhmät</h2>
      </div>
      <div className='orderGroups'>
        <button className='alph_order'>A-Z ↑↓</button>
      </div>
      <div className='groupinfo'>
        <div className='groupname'>
          <p> <strong>Ryhmän nimi</strong></p>
        </div>
        <div className='group_description'>
          <p><strong>Ryhmän kuvaus</strong></p>
        </div>
      </div>
      <div className='groups'>
        <ul>
          {groups && groups.map((group, index) => 
            <li key={index}>
              <div className='list_groupname'>
                <p><strong>{group.name}</strong></p>
              </div>
              <div className='list_groupdescription'>
                <em>{group.description}</em>
              </div>
            <div className='apply_button'>
              <button>Liity ryhmään</button>
            </div>
            </li>
          )}
        </ul>
      </div>
    </div>
  )
}

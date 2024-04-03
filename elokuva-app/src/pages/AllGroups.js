import React, { useContext, useEffect, useState } from 'react'
import { Link } from "react-router-dom";
import { Navigate, useNavigate } from 'react-router-dom'
import { useUser } from '../context/UseUser'
import './AllGroups.css'
import '../index.css'
import { UserContext } from '../context/UserContext'

export default function AllGroups() {
  let navigate = useNavigate();
  const { groups, setGroups } = useUser()
  const { getAllGroups } = useContext(UserContext)

  useEffect(() => {
    getAllGroups();
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
        <button onClick={() => navigate('/reggroup')} className='makegroup'>Luo ryhmä</button>
        <button onClick={() => navigate('/grouppage')} className='mygroups'>Omat ryhmät</button>
      </div>
      <div className='info'>
        <h2>Kaikki ryhmät</h2>
      </div>
      <div className='orderGroups'>
        <button className='alph_order'>A-Z ↑↓</button>
      </div>
      <div className='grouplist'>
        <p className='groupname'> <strong>Ryhmän nimi</strong></p>
        <p className='description'><strong>Ryhmän kuvaus</strong></p>
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
            </li>
          )}
        </ul>
      </div>
    </div>
  )
}

import React, { useContext, useEffect, useState } from 'react'
import { Link } from "react-router-dom";
import { useUser } from '../context/UseUser'
import axios from 'axios'
import './GroupPage.css'
import '../index.css'

export default function AllGroups() {
  const { group, setGroup } = useUser();

  useEffect(() => {
      axios.get('http://localhost:3001/groups/allgroups')
          .then(response => {
              setGroup(response.data)
          })
          .catch(error => {
              console.error("Fetching failed", error)
          })
  }, []);

  return (
    <div className='container_allgroups'>
      <div className='info'>
        <h2>Omat ryhmät</h2>
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
          {group && group.map((group, index) => 
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
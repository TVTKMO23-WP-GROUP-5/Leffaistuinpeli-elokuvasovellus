import React, { useContext, useEffect, useState } from 'react'
import { Link } from "react-router-dom";
import { useUser } from '../context/UseUser'
import axios from 'axios'
import './AllGroups.css'
import '../index.css'

export default function AllGroups() {
  const { user } = useUser();
  const { groups, setGroups } = useUser();
  const [ activeGroup, setActiveGroup ] = useState(null);
  const [ isSortedAsc, setIsSortedAsc ] = useState(true)

  useEffect(() => {
      axios.get('http://localhost:3001/groups/allgroups')
          .then(response => {
              const sortedGroups = response.data.sort((a, b ) => a.name.localeCompare(b.name))
              setGroups(sortedGroups)
          })
          .catch(error => {
              console.error("Fetching failed", error)
          })
  }, [setGroups]);

  const toggleSort = () => {
    const sortedGroups = [...groups].sort((a, b) => {
      return isSortedAsc ? b.name.localeCompare(a.name) : a.name.localeCompare(b.name)
    })
    setGroups(sortedGroups)
    setIsSortedAsc(!isSortedAsc)
  }

  const handleInvitation = (index) => {
    setActiveGroup(index)
  }

  const handleUserResponse = (userChoise) => {
    setActiveGroup(null)
    if (userChoise) {
      alert("Liittymispyyntö lähetetty")
    } else {
      alert("Tapahtuma keskeytetty")
    }
  }

  return (
    <div className='container_allgroups'>
      {user && (
      <div className='buttons'>
        <Link to='/reggroup'>
          <button className='makegroup'>Luo ryhmä</button>
        </Link>
        <Link to='/owngroups'>
          <button className='mygroups'>Omat ryhmät</button>
        </Link>
      </div>
      )}
      <div className='info'>
        <h2>Kaikki ryhmät</h2>
      </div>
      <div className='orderGroups'>
        <button className='alph_order' onClick={toggleSort}>A-Z ↑↓</button>
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
          {groups && groups.map((group, index) => (
            <li key={index}>
              <div className='list_groupname'>
                <p><strong>{group.name}</strong></p>
              </div>
              <div className='list_groupdescription'>
                <em>{group.description}</em>
              </div>
              {user && (
              <div className='apply_button'>
                <button onClick={() => handleInvitation(index)}>Liity ryhmään </button>
                {activeGroup === index && (
                  <div>
                    <p>Haluatko liittyä tähän ryhmään?</p>
                    <button onClick={() => handleUserResponse(true, index)}>Kyllä</button>
                    <button onClick={() => handleUserResponse(false, index)}>Ei</button>
                  </div>
                )}
              </div> )}
            </li>
            ))}
        </ul>
      </div>
    </div>
  )
}

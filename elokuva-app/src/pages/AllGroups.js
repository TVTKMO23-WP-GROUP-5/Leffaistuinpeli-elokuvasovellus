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
    let isMounted = true; //tämä tarkistuksena, ettei async kutsut aseta statea jos komponentti on poistunut domista

    const fetchGroups = axios.get('http://localhost:3001/groups/allgroups')
    const username = sessionStorage.getItem('username')
    const fetchUserGroups = user ? axios.get(`http://localhost:3001/groups/owngroups?username=${username}`) : Promise.resolve({ data: []})

    Promise.all([fetchGroups, fetchUserGroups])
          .then(([groupsResponse, userGroupsResponse]) => {
            if (isMounted) {
              const sortedGroups = groupsResponse.data.sort((a, b ) => a.name.localeCompare(b.name))
              const userGroups = new Set(userGroupsResponse.data.map(group => group.name))
              
              const groupsWithMembership = sortedGroups.map(group => ({
                ...group,
                isMember: userGroups.has(group.name)
              }))
              
              setGroups(groupsWithMembership)
            }
          })
          .catch(error => {
              console.error("Fetching failed", error)
          })

    return () => { isMounted = false; }
  }, [user, setGroups]);

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
/*Jaakko muokkasi, asettaa kirjautuneen käyttäjän pyytämäänsä ryhmään, 
mutta tila on FALSE, niin ei ole jäsen vasta kun hyväksytään */
  const handleUserResponse = (userChoise, groupOwner, groupName, username) => {
    setActiveGroup(null)
    if (userChoise) {
      axios.post("http://localhost:3001/getmembers/insertapplication", {groupOwner: groupOwner,groupName: groupName, username:username})
        .then(response => {
          console.log(response.data)
          alert("Liittymispyyntö lähetetty")
        })
        .catch(error => {
            console.error('Error deleting user:', error.response.data);
            alert("Jotain meni pieleen")
        })  
      
    } else {
      alert("Tapahtuma keskeytetty")
    }
  }

  return (
    <div className='container_allgroups'>
      {user && (
      <div className='group_buttons'>
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
          <p><strong>Ryhmän nimi</strong></p>
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
              {user && !group.isMember && (
              <div className='apply_button'>
                <button onClick={() => handleInvitation(index)}>Liity</button>
                {activeGroup === index && (
                  <div className='confirm_apply'>
                    <p>Haluatko lähettää <br></br> liittymispyynnön <br></br> tähän ryhmään?</p>
                    <button className='confirm_button' onClick={() => handleUserResponse(true, group.owner, group.name, user, index)}>Kyllä</button>
                    <button className='confirm_button' onClick={() => handleUserResponse(false, group.owner, group.name, user, index)}>Ei</button>
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

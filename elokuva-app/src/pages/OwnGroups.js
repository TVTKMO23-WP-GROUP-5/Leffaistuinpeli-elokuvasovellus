import React, { useContext, useEffect, useState } from 'react'
import { Link } from "react-router-dom";
import { useUser } from '../context/UseUser'
import { useTheme } from '../context/ThemeContext';
import axios from 'axios'
import './OwnGroups.css'
import '../index.css'

export default function OwnGroups() {
  const { theme } = useTheme();
  const [ group, setGroup ] = useState([]);
  const [ isSortedAsc, setIsSortedAsc ] = useState(true)
  const { user, isAdmin } = useUser()

  console.log("tämä:", group)

  useEffect(() => {
    const username = sessionStorage.getItem('username')
    axios.get(`/groups/owngroups?username=${(username)}`)
          .then(response => {
            const sortedGroups = response.data.sort((a, b ) => a.name.localeCompare(b.name))
            setGroup(sortedGroups)
          })
          .catch(error => {
              console.error("Fetching failed", error)
          })
  }, [setGroup]);

  const toggleSort = () => {
    const sortedGroups = [...group].sort((a, b) => {
      return isSortedAsc ? b.name.localeCompare(a.name) : a.name.localeCompare(b.name)
    })
    setGroup(sortedGroups)
    setIsSortedAsc(!isSortedAsc)
  }

  return (
    <>
      {user ? (
      <div className={theme === "dark" ? "dark-theme" : ""}>
        <div className="container_owngroups">
          <div className="info">
            <h2>Omat ryhmät</h2>
          </div>
          <div className="content_owngroups">
            <div className="orderGroups">
              <button className="alph_order" onClick={toggleSort}>
                A-Z ↑↓
              </button>
            </div>
            <div className="groupinfo_owngroups">
              <div className="groupname_owngroups">
                <p>
                  {" "}
                  <strong>Ryhmän nimi</strong>
                </p>
              </div>
              <div className="group_description_owngroups">
                <p>
                  <strong>Ryhmän kuvaus</strong>
                </p>
              </div>
            </div>
            <div className="groups_owngroups">
              <ul>
                {group &&
                  group.map((group, index) => (
                    <li key={group.name || index}>
                      <Link to={`/grouppage/${group.name}`}>
                        <div className="list_groupname">
                          <p>
                            <strong>
                              {group.name}
                              {isAdmin && group.owner === user && (
                                <p>(ylläpitäjänä)</p>
                              )}
                            </strong>
                          </p>
                        </div>
                        <div className="list_groupdescription">
                          <em>{group.description}</em>
                        </div>
                      </Link>
                    </li>
                  ))}
              </ul>
            </div>
          </div>
        </div>
      </div>
      ) : (<h1 style={ {marginTop: '4em'} }>404 Sivua ei löytynyt</h1>)}
    </>
  );
}
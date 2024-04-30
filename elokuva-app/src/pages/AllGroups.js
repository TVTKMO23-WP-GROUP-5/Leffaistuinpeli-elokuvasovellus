import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { useUser } from "../context/UseUser";
import axios from "axios";
import { useTheme } from "../context/ThemeContext";
import "./AllGroups.css";

export default function AllGroups() {
  const { user } = useUser();
  const { groups, setGroups } = useUser();
  const { isAdmin } = useUser();
  const { theme } = useTheme();

  const [activeGroup, setActiveGroup] = useState(null);
  const [isSortedAsc, setIsSortedAsc] = useState(true);
  const [applicationStatus, setApplicationStatus] = useState([]);

  // ----- Haetaan kaikki ryhmät -----
  useEffect(() => {
    let isMounted = true;

    const fetchGroups = axios.get("/groups/allgroups");
    const username = sessionStorage.getItem("username");
    const fetchUserGroups = user
      ? axios.get(`/groups/owngroups?username=${username}`)
      : Promise.resolve({ data: [] });

    Promise.all([fetchGroups, fetchUserGroups])
      .then(([groupsResponse, userGroupsResponse]) => {
        if (isMounted) {
          const sortedGroups = groupsResponse.data.sort((a, b) =>
            a.name.localeCompare(b.name)
          );
          const userGroups = new Set(
            userGroupsResponse.data.map((group) => group.name)
          );

          const groupsWithMembership = sortedGroups.map((group) => ({
            ...group,
            isMember: userGroups.has(group.name),
          }));

          setGroups(groupsWithMembership);
        }
      })
      .catch((error) => {
        console.error("Fetching failed", error);
      });

    return () => {
      isMounted = false;
    };
  }, [user, setGroups]);

  // ----- Aakkosjärjestys -----
  const toggleSort = () => {
    const sortedGroups = [...groups].sort((a, b) => {
      return isSortedAsc
        ? b.name.localeCompare(a.name)
        : a.name.localeCompare(b.name);
    });
    setGroups(sortedGroups);
    setIsSortedAsc(!isSortedAsc);
  };

  // ----- Ryhmään liittymis -kutsut -----
  const handleInvitation = (index) => {
    setActiveGroup(index);
  };

  const handleUserResponse = (userChoise, groupOwner, groupName, username) => {
    setActiveGroup(null);
    if (userChoise) {
      axios
        .post("/getmembers/insertapplication", {
          groupOwner: groupOwner,
          groupName: groupName,
          username: username,
        })
        .then((response) => {
          console.log(response.data);
          alert("Liittymispyyntö lähetetty");

          axios
            .post("/getmembers/groupstatus", { username: user })
            .then((response) => {
              setApplicationStatus(response.data);
            })
            .catch((error) => {
              console.error("Error getting user status:", error.response.data);
            });
        })
        .catch((error) => {
          console.error("Error deleting user:", error.response.data);
          alert("Jotain meni pieleen");
        });
    } else {
      alert("Tapahtuma keskeytetty");
    }
  };

  // Tarkistetaan käyttäjän status ryhmään nähden
  useEffect(() => {
    axios
      .post("/getmembers/groupstatus", { username: user })
      .then((response) => {
        setApplicationStatus(response.data);
      })
      .catch((error) => {
        console.error("Error getting user status:", error.response.data);
      });
  }, [user]);

  return (
    <div className={`container_allgroups ${theme}`}>
      {user && (
        <div className="group_buttons">
          <Link to="/reggroup">
            <button className="makegroup">Luo ryhmä</button>
          </Link>
          {isAdmin && (
            <Link to="/adminpage">
              <button className="adminview">Ryhmieni ylläpitosivut</button>
            </Link>
          )}
          <Link to="/owngroups">
            <button className="mygroups">Omat ryhmät</button>
          </Link>
        </div>
      )}
      <div className="info">
        <h2>Kaikki ryhmät</h2>
      </div>
      <div className="content_allgroups">
        <div className="orderGroups">
          <button className={`alph_order ${theme}`} onClick={toggleSort}>
            A-Z ↑↓
          </button>
        </div>
        <div className="groupinfo_allgroups">
          <div className="groupname_allgroups">
            <p>
              <strong>Ryhmän nimi</strong>
            </p>
          </div>
          <div className="group_description_allgroups">
            <p>
              <strong>Ryhmän kuvaus</strong>
            </p>
          </div>
        </div>
      </div>
      <div className="groups_allgroups">
        <ul>
          {groups &&
            groups.map((group, index) => (
              <li key={index}>
                <div className="list_groupname_allgroups">
                  <p>
                    <strong>{group.name}</strong>
                  </p>
                </div>
                <div className="list_groupdescription_allgroups">
                  <em>{group.description}</em>
                </div>
                {user && !group.isMember && (
                  <div className="apply_button">
                    {applicationStatus &&
                    applicationStatus.some(
                      (apply) =>
                        apply.groupname === group.name && !apply.isMember
                    ) ? (
                      <p>Liittymispyyntö lähetetty</p>
                    ) : (
                      <button onClick={() => handleInvitation(index)}>
                        Liity
                      </button>
                    )}
                    {activeGroup === index && (
                      <div className="confirm_apply">
                        <p>
                          Haluatko lähettää <br /> liittymispyynnön <br /> tähän
                          ryhmään?
                        </p>
                        <button
                          className="confirm_button"
                          onClick={() =>
                            handleUserResponse(
                              true,
                              group.owner,
                              group.name,
                              user,
                              index
                            )
                          }
                        >
                          Kyllä
                        </button>
                        <button
                          className="confirm_button"
                          onClick={() =>
                            handleUserResponse(
                              false,
                              group.owner,
                              group.name,
                              user,
                              index
                            )
                          }
                        >
                          Ei
                        </button>
                      </div>
                    )}
                  </div>
                )}
              </li>
            ))}
        </ul>
      </div>
    </div>
  );
}

import React, { useState, useEffect } from 'react'
import { useUser } from '../context/UseUser'
import axios from 'axios'
import './AdminPage.css'

export default function AdminPage() {
    const { user } = useUser()
    const [groupMembers, setGroupMembers] = useState({})
    
    useEffect(() => {
        if (user !== null) {
            axios.post('http://localhost:3001/getmembers', {username: user})
                .then(response => {
                    setGroupMembers(response.data)
                    console.log(response.data.name, response.data.kuvaus, response.data.members, response.data.ID)
                })
                .catch(error => {
                    console.error("Fetching failed", error)
                })
        }
    }, [user]);

    const handleSubmit = (name, admin, id) => {        
        const confirmed = window.confirm("Haluatko varmasti poistaa jäsenen ryhmästä?")
        if (confirmed){
            axios.post('http://localhost:3001/getmembers/deleteuser', {username: name, admin: admin, ID:id})
                .then(response => {
                    setGroupMembers(response.data)
                    console.log('User registered successfully:', response.data);
                    alert("Käyttäjätunnuksen poistaminen onnistui")
        
                })
                .catch(error => {
                    console.error('Error deleting user:', error.response.data);
                    alert("Jotain meni pieleen")
                })  
        } else {
            alert("Ei poistettu käyttäjää")
        }
    };

    const handleGroupDelete =  (admin, id) => {        
        const confirmed = window.confirm("Haluatko varmasti poistaa ryhmän?")
        if (confirmed){
            axios.post('http://localhost:3001/getmembers/deletegroup', {owner: admin, ID:id})
                .then(response => {
                    setGroupMembers(response.data)
                    console.log(admin, id)
                    console.log('User registered successfully:', response.data);
                    alert("Ryhmä poistettu pysyvästi.")
        
                })
                .catch(error => {
                    console.error('Error deleting user:', error.response.data);
                    alert("Jotain meni pieleen")
                })  
        } else {
            alert("Ei poistettu ryhmää")
        }
    };


    return (
        <div className = "members">
            <h1 style={{ color: 'var(--dark-background-color)' }}>Ryhmäsi jäsenet</h1>
            <div className = "admin">
                <p>Ryhmien ylläpitäjä:</p> 
                <p>{user}</p>
            </div>
            <h3 style={{ color: 'var(--dark-background-color)' }}>RYHMÄT</h3>
            {groupMembers.members && groupMembers.members.length > 0 ? (
                groupMembers.members.map((member, index) => (
                    <div className ="groupmembers-list">
                        <div  className = "group-title">
                            <h2>{groupMembers.name[index]}</h2>
                            <button name={groupMembers.name[index]} onClick={() => handleGroupDelete(user, groupMembers.ID[index])}>Poista ryhmä</button>
                        </div>

                    <h4 className =  "group-descripe">{groupMembers.kuvaus[index]}</h4>
                        {member.map((groupmember, innerIndex) => (
                            <div className="members-list" key={innerIndex}>
                                <p>{groupmember.username}</p>
                                <button name={groupmember.username} onClick={() => handleSubmit(groupmember.username, user, groupMembers.ID[index])}>Poista jäsen</button>
                            </div>
                        ))}
                    </div>
                ))
            ) : (
                    <div> Ryhmässäsi ei ole vielä yhtään jäsentä.</div>
            )}
            <h3 style={{ color: 'var(--dark-background-color)' }}>Hakemukset ryhmän jäseniksi</h3>
        </div>
    )
}

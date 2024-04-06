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
                    console.log(response.data.name, response.data.kuvaus, response.data.members)
                })
                .catch(error => {
                    console.error("Fetching failed", error)
                })
        }
    }, [user]);

    const handleSubmit = (name, admin) => {        
        const confirmed = window.confirm("Haluatko varmasti poistaa jäsenen ryhmästä?")
        if (confirmed){
            axios.post('http://localhost:3001/getmembers/delete', {username: name, admin: admin})
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


    return (
        <div className = "members">
            <h1 style={{ color: 'var(--dark-background-color)' }}>{groupMembers.name}</h1>
            <div className = "admin">
                <p>Ryhmän ylläpito:</p> 
                <p>{user}</p>
            </div>
            <p>{groupMembers.kuvaus}</p>
            <h3 style={{ color: 'var(--dark-background-color)' }}>jäsenet</h3>
            {groupMembers.members && groupMembers.members.length > 0 ? (
                groupMembers.members.map((member, index) => (
                    <div className="members-list" key={index}>
                    <p>{member.username}</p><button name={member.username} onClick={() => handleSubmit(member.username, user)}>Poista jäsen</button>

                    </div>
                ))
            ) : (
                    <div> Ryhmässäsi ei ole vielä yhtään jäsentä.</div>
            )}
            <h3 style={{ color: 'var(--dark-background-color)' }}>Hakemukset ryhmän jäseniksi</h3>
        </div>
    )
}

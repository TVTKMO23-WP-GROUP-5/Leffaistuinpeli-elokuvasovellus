import React, { useState, useEffect } from 'react'
import { useUser } from '../context/UseUser'
import axios from 'axios'
import './AdminPage.css'

export default function AdminPage() {
    const { user } = useUser()
    const { groupMembers, setGroupMembers } = useUser({})
    
    const handleSubmit = (name, admin, id) => {        
        const confirmed = window.confirm("Haluatko varmasti suorittaa toiminnon?")
        if (confirmed){
            axios.post('http://localhost:3001/getmembers/deleteuser', {username: name, admin: admin, ID:id})
                .then(response => {
                    setGroupMembers(response.data)
                    console.log('User registered successfully:', response.data);
                    alert("Tehtävä onnistui")
        
                })
                .catch(error => {
                    console.error('Error deleting user:', error.response.data);
                    alert("Jotain meni pieleen")
                })  
        } else {
            alert("Ei suoritettu toimintoa")
        }
    };

    const handleGroupDelete =  (admin, id) => {        
        const confirmed = window.confirm("Haluatko varmasti poistaa ryhmän?")
        console.log(admin)
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

    const handleApplication = (username, group_id, admin) =>{
        const confirmed = window.confirm("Haluatko varmasti hyväksyä pyynnön?")
        if (confirmed){
            axios.post('http://localhost:3001/getmembers/handleapplication', {user: username, ID:group_id, admin:admin})
                .then(response => {
                    setGroupMembers(response.data)
                    alert("Hyväksytty ryhmään.")
                })
                .catch(error => {
                    console.error('Error deleting user:', error.response.data);
                    alert("Jotain meni pieleen")
                })  
        } else {
            alert("Ei hyväksytty pääsyä")
        }
    }

    return (
        <div className = "members">
            <div className = "admin">
                <p>Ryhmien ylläpitäjä:</p> 
                <p>{user}</p>
            </div>
{/*------------------Tästä alkaa koodisilmukat adminin hallitsemiin ryhmiin --------------------------- */}
            <h3 style={{ color: 'var(--dark-background-color)' }}>RYHMÄT</h3>
            <div className = "groups">
                
                {groupMembers.members && groupMembers.members.length > 0 ? (
                    groupMembers.members.map((member, index) => (
                        <div className ="groupmembers-list">
                            <div  className = "group-title">
                                <div className = "gr-title-descripe">
                                    <h1>{groupMembers.name[index]}</h1>
                                    <h4 className =  "group-descripe">{groupMembers.kuvaus[index]}</h4>
                                </div>
                                <button name={groupMembers.name[index]} onClick={() => handleGroupDelete(user, groupMembers.ID[index])}>Poista ryhmä</button>
                            </div>

                                {member.map((groupmember, innerIndex) => (
                                    <div className="members-list" key={innerIndex}>
                                        <p>{groupmember.username}</p>
                                        <button name={groupmember.username} onClick={() => handleSubmit(groupmember.username, user, groupMembers.ID[index])}>Poista jäsen</button>
                                    </div>
                                ))}
                        </div>

                    ))
                ) : (
                        <div className = "emptygroup">
                            <p> Ei jäseniä ryhmässä</p>
                        </div>
                )}
            </div>
{/*------------------Tästä alkaa koodisilmukat ryhmähakemuksiin --------------------------- */}
            <h3 style={{ color: 'var(--dark-background-color)' }}>Hakemukset ryhmän jäseniksi</h3>            
                <div className = "applications">

                {groupMembers.application && groupMembers.application.length > 0 ? (
                    groupMembers.application.map((memberApplication, index) => (
                        <div className ="groupmembers-list">
                            <div  className = "group-title">
                                <h2>{groupMembers.applicationGroupName[index]}</h2>
                            </div>

                            <h5 className =  "group-descripe">Hakemukset ryhmään pääsystä: </h5>
                            {memberApplication && memberApplication.length > 0 ? (
                                memberApplication.map((apply, innerIndex) => (
                                    <div className="members-list" key={innerIndex}>
                                        <p>{apply.username}</p>
                                        <button name={apply.username} onClick={() => handleApplication(apply.username, groupMembers.ID[index], user)}>Hyväksy</button>
                                        <button name={apply.username} onClick={() => handleSubmit(apply.username, user, groupMembers.ID[index])}>Hylkää</button>
                                    </div>
                                ))
                            ) : (
                                <div className = "emptygroup">
                                <p> Ei yhtään hakemusta ryhmiisi</p>
                            </div>
                            )}
                        </div>

                    ))
                ) : (
                        <div className = "emptygroup">
                            <p> Ei yhtään hakemusta ryhmiisi</p>
                        </div>
                )}
            </div>            
        </div>
    )
}


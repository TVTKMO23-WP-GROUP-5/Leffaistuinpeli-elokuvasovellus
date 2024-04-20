import React, { useEffect, useState, useContext } from "react";
import { useParams } from "react-router-dom";
import "./GroupPage.css";
import axios from "axios";
import io from "socket.io-client";
import { UserContext } from "../context/UserContext";

const socket = io("http://localhost:3001");
import React, { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import './GroupPage.css'
import axios from 'axios'
import { useUser } from '../context/UseUser';
import { Link } from "react-router-dom";

export default function GroupPage() {
  let { groupName } = useParams();
  const [owner, setOwner] = useState("");
  const [message, setMessage] = useState("");
  const [chat, setChat] = useState([]);
  const { user } = useContext(UserContext);
  const { isAdmin, user } = useUser()

  groupName = decodeURIComponent(groupName);

  useEffect(() => {
    axios
      .get(`http://localhost:3001/groups/owner?groupname=${groupName}`)
      .then((response) => {
        setOwner(response.data);
      })
      .catch((error) => {
        console.error("Fetching failed", error);
      });

    socket.on("message", (message) => {
      setChat((prevChat) => [...prevChat, message]);
    });

    return () => {
      socket.off("message");
    };
  }, [groupName]);

  const sendMessage = (e) => {
    e.preventDefault();
    if (message.trim()) {
      socket.emit("sendMessage", { text: message, groupName, sender: user });
      setMessage("");
    }
  };

  return (
    <div className="container_grouppage">
      <div className="group_info">
        <h1>{groupName}</h1>
      </div>
      <div className="group_members">
        <div>
          <p>
            <strong>Ryhmän perustaja: </strong>
            {owner}
          </p>
        </div>
        <div>
          <p>
            <strong>Jäsenet:</strong>
          </p>
          <p>testi tepe</p>
          <p>testi repe</p>
          <p>testi hege</p>
          <p>testi mege</p>
          <p>testi veke</p>
        </div>
      </div>
      <div className="group_favorites">
        <div className="group_movies">
          <h3>Ryhmän suosikkielokuvat</h3>
          <p>Tähän tulee ryhmän jäsenten lisäämät elokuvat</p>
        </div>
        <div className="group_series">
          <h3>Ryhmän suosikkisarjat</h3>
          <p>Tähän tulee ryhmän jäsenten lisäämät sarjat</p>
        </div>
        <div className="group_chat">
          <h2>Chat</h2>
          {chat.map((msg, index) => (
            <p key={index}>
              {msg.sender}: {msg.text}
            </p>
          ))}
          <form onSubmit={sendMessage}>
            <input
              type="text"
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              placeholder="Kirjoita viesti..."
            />
            <button type="submit">Lähetä</button>
          </form>
        </div>
      </div>
      <div className = "buttonToAdminPage">
        {isAdmin && user === owner && (<Link to='/adminpage'><button>Ryhmän ylläpitosivuille</button></Link> )}
      </div>
    </div>
  );
}

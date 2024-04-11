import React, { useState } from "react";
import "./Login.css";
import { Link } from "react-router-dom";
import { useUser } from "../context/UseUser";

export default function Login() {
  const { login } = useUser();
  const { user } = useUser();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  const validate = (e) => {
    e.preventDefault();
    if (username.length > 0 && password.length > 0) {
      const data = { user: username, password: password };
      login(data.user, data.password);
    }
  };

  return (
    <div id="login-form">
      <form onSubmit={validate}>
        <h3>Kirjaudu sisään</h3>
        <div id="input">
          <label>Käyttäjä</label>
          <input
            value={username}
            onChange={(e) => setUsername(e.target.value)}
          />
        </div>
        <div id="input">
          <label>Salasana</label>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
        </div>

        <button type="submit" className="loginButton">
          Kirjaudu
        </button>
      </form>
      <div className="or-text">
        <h4>Tai</h4>
      </div>
      {!user && (
        <Link to="/register" className="loginButton">
          Luo tunnus
        </Link>
      )}
    </div>
  );
}

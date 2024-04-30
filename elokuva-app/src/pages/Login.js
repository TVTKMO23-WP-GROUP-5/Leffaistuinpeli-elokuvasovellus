import React, { useState, useRef, useEffect } from "react";
import "./Login.css";
import { Link } from "react-router-dom";
import { useUser } from "../context/UseUser";

export default function Login() {
  const { login } = useUser();
  const { user } = useUser();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const usernameInputRef = useRef(null);
  const passwordInputRef = useRef(null);

  // Focus käyttäjäfieldiin
  useEffect(() => {
    if (usernameInputRef.current) {
      usernameInputRef.current.focus();
    }
  }, []);

  // Entterillä salasanafieldiin
  const handleKeyDown = (event) => {
    if (event.key === "Enter") {
      passwordInputRef.current && passwordInputRef.current.focus();
    }
  };

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
            onKeyDown={handleKeyDown}
            ref={usernameInputRef}
            onChange={(e) => setUsername(e.target.value)}
          />
        </div>
        <div id="input">
          <label>Salasana</label>
          <input
            type="password"
            value={password}
            ref={passwordInputRef}
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

import React, { useEffect } from "react";
import { useUser } from "../context/UseUser";

export default function Logout() {
  const { setUser } = useUser();

  useEffect(() => {
    setUser(null);
    sessionStorage.setItem('username', null)
  }, [])
  
  return <p>You have logged out.</p>;
}

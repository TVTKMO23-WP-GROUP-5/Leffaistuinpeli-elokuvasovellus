import React, { useEffect } from "react";
import { useUser } from "../context/UseUser";

export default function Logout() {
  const { setUser } = useUser();

  useEffect(() => {
    setUser(null);
    sessionStorage.setItem('username', null)
    sessionStorage.setItem('token', null)
  }, [])
  
  return <p className="loggedOut">Olet onnistuneesti kirjautunut ulos.</p>;
}

import React, { useEffect } from "react";
import { useUser } from "../context/UseUser";

export default function Logout() {
  const { setUser, setIsAdmin } = useUser();

  useEffect(() => {
    setUser(null);
    setIsAdmin(false)
    sessionStorage.setItem('username', null)
    sessionStorage.setItem('token', null)
    sessionStorage.setItem('admin', false)
  }, [])
  
  return <p className="loggedOut">Olet onnistuneesti kirjautunut ulos.</p>;
}

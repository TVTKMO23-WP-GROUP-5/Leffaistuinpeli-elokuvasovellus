import { useState } from "react";
import { UserContext } from "./UserContext";

export default function UserProvider({children}) {
    const [user, setUser] = useState(null)
    const [registerData, setRegisterData] = useState() // Jaakon lisäys 27.3. rekisteröintiä varten
    return (
        <UserContext.Provider value={{user,setUser,registerData, setRegisterData}}>
            { children }
        </UserContext.Provider>
    )
}

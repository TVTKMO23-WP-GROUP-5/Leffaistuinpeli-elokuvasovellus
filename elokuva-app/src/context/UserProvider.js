import { useState } from "react"
import { UserContext } from "./UserContext"
import axios from 'axios'

export default function UserProvider({children}) {
    const [user, setUser] = useState(null)
    const [registerData, setRegisterData] = useState() // Jaakon lisäys 27.3. rekisteröintiä varten
    const [groups, setGroups] = useState([])
    
    const getAllGroups = () => {
        axios.get('http://localhost:3001/allgroups')
            .then(response => {
                setGroups(response.data)
            })
            .catch(error => {
                console.error("Fetching failed", error)
            })
    }

    return (
        <UserContext.Provider value={{user,setUser,registerData, setRegisterData,groups,setGroups,getAllGroups}}>
            { children }
        </UserContext.Provider>
    )
}

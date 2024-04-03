import { useState } from "react"
import { UserContext } from "./UserContext"
import axios from 'axios'
import { useNavigate } from 'react-router-dom'
import { jwtToken } from '../components/Auth_signals'

export default function UserProvider({children}) {
    const [user, setUser] = useState(null)
    const [registerData, setRegisterData] = useState() // Jaakon lisäys 27.3. rekisteröintiä varten
    const [groups, setGroups] = useState([])
    const navigate = useNavigate()
    
    const login = async(uname,password) => {
        axios.post('http://localhost:3001/auth/login',
            {username: uname, password: password})
            .then(resp => {
                setUser(uname)
                jwtToken.value = resp.data.jwtToken 
                navigate('/userpage')
                alert("Kirjautuminen onnistui!")
            })
            .catch(err => console.log(err.message))
    }

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
        <UserContext.Provider value={{user,setUser,registerData, setRegisterData,groups,setGroups,getAllGroups,login}}>
            { children }
        </UserContext.Provider>
    )
}

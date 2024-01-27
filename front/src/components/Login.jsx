import { useState } from 'react'

const Login = ({ setUsername }) => {
    const [tempUser, setTempUser] = useState('')

    const handleChange = (e) => {
        setTempUser(e.target.value)
    }

    const login = (e) => {
        e.preventDefault()
        setUsername(tempUser && `Anonymous ${Math.floor(Math.random * 100000)}`)
        setTempUser('')
    }

    return (
        <div>
            <p>Welcome to Star War! Please select a username before continuing your journey: </p>
            <form onSubmit={login}>
                <input type='text' value={tempUser} onChange={handleChange}></input>
                <button type='submit'>Join!</button>
            </form>

        </div>
    )
}

export default Login
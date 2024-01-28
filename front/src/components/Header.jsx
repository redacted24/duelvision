import '../styles/index.css'
import '../styles/header.css'
import { Link } from 'react-router-dom'

const Header = ({ username }) => {
    console.log(username)
    if (username) {
        return (
            <div id="navbar">
                <Link id='home' to='/'>Home</Link>
                <div id="user-panel">
                    <div id='username'>{username}</div>
                    <div id='pfp-container'>
                        <img id='pfp' src='../src/assets/defaultpfp.png'/>
                    </div>
                </div>
            </div>
    )} else {
        return (
            <div id="navbar">
                <Link id='home' to='/'>Home</Link>
            </div>
        )
    }
    }


export default Header

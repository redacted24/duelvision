import '../styles/index.css'
import '../styles/header.css'
import { Link } from 'react-router-dom'

const Header = () => {
    return (
        <div id="navbar">
            <Link id='home' to='/'>Home</Link>
        </div>
    )
}

export default Header

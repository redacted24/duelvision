import '../styles/index.css'
import '../styles/header.css'
import { Link } from 'react-router-dom'

const Header = () => {
    return (
        <div id="navbar">
            <Link to='/leaderboard'>Leaderboard</Link>
            <Link to='/gamepage'>Gamepage</Link>
            <div id="home">
                Home
            </div>
        </div>
    )
}

export default Header

import '../styles/lobby.css'
import { Link } from 'react-router-dom'

const Lobby = () => {
    return (
        <div id="main-container">
            <div className='options-container' id='multiplayer'>Multiplayer</div>
            <div className='options-container' id='statistics'>Statistics</div>
            <div className='options-container' id='leaderboard'>Leaderboard</div>
        </div>
    )
}

export default Lobby

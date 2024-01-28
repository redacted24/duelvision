import '../styles/statistics.css'

const Statistics = ({ win, loss, lossRatio, username }) => {
    return (
        <div>
            <div id='page-title2'>Statistics</div>
            <div id='maine-container'>
                <div id='pfp-container'>
                    <img id='pfp-pfp' src='../src/assets/defaultpfp.png'/>
                </div>
                <div id='nameInfo'>
                    <div className='userName'>{username}</div>
                    <div className='statuses'>Furious player</div>
                    <div className='statuses'>Location: Montreal</div>
                    <div className='statuses'>Medals: 69</div>
                </div>
                <div id='trophy'>
                    <div className='stat-container'>
                        <img className='statistics-icons' src='../src/assets/trophy.svg'/>
                        <div className='statName'>Wins: {win}</div>
                    </div>
                    <div className='stat-container'>
                        <img className='statistics-icons' src='../src/assets/loss.svg'/>
                        <div className='stat-container'>Losses: {loss}</div>
                    </div>
                    <div className='stat-container'>
                        <img className='statistics-icons' src='../src/assets/loss.svg'/>
                        <div className='stat-container'>
                            Win-Loss Ratio: {lossRatio}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default Statistics

import '../styles/statistics.css'

const Statistics = ({ username }) => {
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
                    <div className='statuses'>Location</div>
                    <div className='statuses'>Medals</div>
                </div>
                <div id='trophy'>
                    <div>trophy wins</div>
                    <div>losses icon</div>
                    <div>win-loss ration</div>
                </div>
            </div>
        </div>
    )
}

export default Statistics

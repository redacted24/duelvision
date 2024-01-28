import '../styles/statistics.css'

const Statistics = () => {
    return (
        <div>
            <div id='page-title2'>Statistics</div>
            <div id='main-container'>
                <div>
                    <img id='pfp-pfp' src='../src/assets/defaultpfp.png'/>
                </div>
                <div id='nameInfo'>
                    <div>name</div>
                    <div>Furious player</div>
                    <div>Location</div>
                    <div>Medals</div>
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

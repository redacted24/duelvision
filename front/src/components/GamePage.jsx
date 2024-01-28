import Camera from './Camera'
import Canvas from './Canvas'


const GamePage = () => {
    return (
        <div>
            <Camera sendMessage={sendMessage}/>
            <Canvas/>
        </div>
    )
}

export default GamePage

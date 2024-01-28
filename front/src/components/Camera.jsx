import React from 'react'
import Webcam from 'react-webcam'
import { useEffect } from 'react'
import '../styles/camera.css'

const videoConstraints = {
    width: 1280,
    height: 720,
    facingMode: 'user'
  };
  
const Camera = () => {
    let url = 'ws://192.168.173.38:8001'
	let socket = new WebSocket(url);
    const webcamRef = React.useRef(null)
    const sendMessage = (message) => {
        if (socket.readyState) socket.send(message)
    };

    socket.onmessage = (event) => {
        let incomingMessage = event.data;

        console.log(incomingMessage)
    };
    const capture = React.useCallback(
        () => {
            const imageSrc = webcamRef.current.getScreenshot()
            sendMessage(imageSrc)
        },
        [webcamRef]
    )

    useEffect(() => {
        const interval = setInterval(() => capture(), 1000 / 30);

        return () => clearInterval(interval)
    }, [])


    return (
        <div id='camera-container'>
            {/* <Webcam
                audio={false}
                height={720}
                ref={webcamRef}
                screenshotFormat='image/jpeg'
                width={1280}
                videoConstraints={videoConstraints}
            /> */}
        </div>
    )
}

export default Camera

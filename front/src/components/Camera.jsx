import React from 'react'
import Webcam from 'react-webcam'
import { useEffect } from 'react'
import '../styles/camera.css'

const videoConstraints = {
    width: 1280,
    height: 720,
    facingMode: 'user'
  };
  
const Camera = ({ sendMessage }) => {
    const webcamRef = React.useRef(null)

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
            <div id="liveView" className="videoView">
            <button id="webcamButton" className="mdc-button mdc-button--raised">
                <span className="mdc-button__ripple"></span>
                <span className="mdc-button__label">ENABLE WEBCAM</span>
            </button>
            <div id="webcam-container">
                <video id="webcam" autoPlay playsInline></video>
                <canvas className="output_canvas" id="output_canvas"></canvas>
            </div>
            </div>
        </div>
    )
}

export default Camera

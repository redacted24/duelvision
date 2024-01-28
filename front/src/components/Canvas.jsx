import { HandLandmarker, FilesetResolver, GestureRecognizer } from '@mediapipe/tasks-vision'
import { useEffect } from 'react'

import '../styles/canvasNew.css'

const Canvas = () => {
    let socket = undefined
    let gestureRecognizer = undefined
    let runningMode = null
    let webcamRunning = false
    let [prev_x, prev_y] = [null, null]
    let [ship_x, ship_y] = [null, null]
    let currentGesture = null
    let primed = false
    let shot = false
    let primed_timeout_id = null
    let shot_timeout_id = null
    let balls = []
    let handLandmarker = undefined

    useEffect(() => {
        const url = 'ws://192.168.173.38:8001'
        socket = new WebSocket(url)
        
        socket.onmessage = function(event) {
            let incomingMessage = event.data
    
            if (incomingMessage === 'hello') {
                socket.send('hello')
            } else {
                console.log(incomingMessage)
            }
        }
    
        socket.onclose = event => console.log(`Closed ${event.code}`)

        return () => socket.close()
    }, [])

    if (socket) {
        socket.onmessage = function(event) {
            let incomingMessage = event.data
    
            if (incomingMessage === 'hello') {
                socket.send('hello')
            } else {
                console.log(incomingMessage)
            }
        }
    
        socket.onclose = event => console.log(`Closed ${event.code}`)
    }

    useEffect(() => {
        const init = async () => {
            const vision = await FilesetResolver.forVisionTasks(
                "https://cdn.jsdelivr.net/npm/@mediapipe/tasks-vision@0.10.0/wasm"
            )
            gestureRecognizer = await GestureRecognizer.createFromOptions(vision, {
                baseOptions: {
                    modelAssetPath: `https://storage.googleapis.com/mediapipe-tasks/gesture_recognizer/gesture_recognizer.task`,
                },
                numHands: 1
            })
        }
        init()
    }, [])
  
    useEffect(() => {
		const video = document.getElementById("webcam")
    	const canvasElement = document.getElementById("output_canvas")
        
        const createHandLandmarker = async () => {
            const vision = await FilesetResolver.forVisionTasks(
            "https://cdn.jsdelivr.net/npm/@mediapipe/tasks-vision@0.10.0/wasm"
            )
            handLandmarker = await HandLandmarker.createFromOptions(vision, {
            baseOptions: {
                modelAssetPath: `https://storage.googleapis.com/mediapipe-models/hand_landmarker/hand_landmarker/float16/1/hand_landmarker.task`,
            },
            numHands: 2
            })
        }
        createHandLandmarker()
  
        let lastVideoTime = -1
        let gestureResults = undefined

        // PredictWebcam
        async function predictWebcam() {
            canvasElement.style.width = video.videoWidth
            canvasElement.style.height = video.videoHeight
            canvasElement.width = video.videoWidth
            canvasElement.height = video.videoHeight

            if (runningMode === null) {
                runningMode = "VIDEO";
                await gestureRecognizer.setOptions({ runningMode: "VIDEO "})
            }

            let startTimeMs = performance.now();
            if (lastVideoTime !== video.currentTime) {
                lastVideoTime = video.currentTime;
                gestureResults = gestureRecognizer.recognizeForVideo(video, startTimeMs)
            }

            if (gestureResults.landmarks) {
                for (const landmarks of gestureResults.landmarks) {
                    let [sum_x, sum_y] = [0, 0]
                    landmarks.forEach((landmark) => {
                            const x = landmark.x
                            const y = landmark.y
                            sum_x += x
                            sum_y += y
                    })
                    
                    ship_x = sum_x / landmarks.length
                    ship_y = sum_y / landmarks.length
                }
                if (gestureResults.gestures.length !== 0) currentGesture = gestureResults.gestures[0][0].categoryName
                
                if (currentGesture == 'Closed_Fist') {
                    primed = true
                    clearTimeout(primed_timeout_id)
                    primed_timeout_id = setTimeout(() => {
                            primed = false
                    }, 300)
                }

            } else {
                [ship_x, ship_y] = [null, null]
            }
    
            if (webcamRunning === true) {
                window.requestAnimationFrame(predictWebcam);
            }
        }

        // Enablecam
        const enableCam = (event) => {
            if (!handLandmarker) {
                console.log("Wait! objectDetector not loaded yet.");
                return;
            }
    
            if (webcamRunning === true) {
                webcamRunning = false;
                enableWebcamButton.innerText = "ENABLE PREDICTIONS";
            } else {
                webcamRunning = true;
                enableWebcamButton.innerText = "DISABLE PREDICTIONS";
            }
    
            const constraints = {
                video: true
            };
    
            navigator.mediaDevices.getUserMedia(constraints).then((stream) => {
                video.srcObject = stream;
                video.addEventListener("loadeddata", predictWebcam);
            });
        }
        const enableWebcamButton = document.getElementById("webcamButton");
        enableWebcamButton.addEventListener("click", enableCam);

        // ## ACTUAL DRAWING PART ##
        const canvas = document.getElementById("output_canvas")
        const ctx = canvas.getContext("2d");
        let raf

        // Spaceship object
        const ship = {
            x: 100,
            y: 20,
            width: 150,
            height: 50,
            leftBorder: 0,
            rightBorder: 0,
            vx: 5,
            vy: 0,
            color: 'red',
            draw() {
                ctx.beginPath()
                ctx.fillRect(this.x, this.y, this.width, this.height)
                }
        }

        // Draw a single frame.
        const draw = () => {
            ctx.clearRect(0, 0, canvas.width, canvas.height);
            if (!shot && primed && currentGesture == 'Open_Palm') {
                shot = true
                clearTimeout(shot_timeout_id)
                shot_timeout_id = setTimeout(() => {
                        shot = false
                }, 400)
                balls = balls.concat({
                    x: ship_x * canvas.width,
                    y: ship_y * canvas.height - 50,
                    vx: 0,
                    vy: -30,
                    radius: 25,
                    color: 'blue',
                    draw() {
                        ctx.beginPath()
                        ctx.arc(this.x, this.y, this.radius, 0, 2 * Math.PI, true) // Draws circle
                        ctx.closePath()
                        ctx.fillStyle = this.color
                        ctx.fill()
                    }
                })
            }

            balls.forEach(ball => {
                ball.draw()
                ball.x += ball.vx
                ball.y += ball.vy
            })
            
            balls = balls.filter(ball => ball.y >= 0)


            if (ship.x) ship.draw()

            prev_x = ship.x
            prev_y = ship.y

            ship.x = ship_x * canvas.width - 80
            ship.y = ship_y * canvas.height

            // Request next frame
            raf = window.requestAnimationFrame(draw);
        }
		
			// Activate drawing on mouse over
			canvas.addEventListener('mouseover', (e) => {
				raf = window.requestAnimationFrame(draw);
            })

			canvas.addEventListener('mouseout', (e) => {
				window.cancelAnimationFrame(raf);
			})
    }, [])

    return (
        <div>
            <button onClick={() => {video = null}}>hi</button>
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

export default Canvas

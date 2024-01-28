import { HandLandmarker, FilesetResolver, GestureRecognizer } from '@mediapipe/tasks-vision'
import { useEffect } from 'react'
import { useNavigate } from 'react-router-dom'

import '../styles/canvasNew.css'

const Canvas = () => {
    const navigate = useNavigate()
    let raf
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
    let game_end = false

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
        const url = 'ws://34.125.205.166:80'
        socket = new WebSocket(url)

		const video = document.getElementById("webcam")
    	const canvasElement = document.getElementById("output_canvas")
  
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
            if (!gestureRecognizer) {
                console.log("Wait! objectDetector not loaded yet.");
                return;
            }
    
            if (webcamRunning === true) {
                webcamRunning = false;
            } else {
                webcamRunning = true;
            }
    
            const constraints = {
                video: true
            };
    
            navigator.mediaDevices.getUserMedia(constraints).then((stream) => {
                video.srcObject = stream;
                video.addEventListener("loadeddata", predictWebcam);
            });
        }

        socket.onmessage = function(event) {
            let incomingMessage = event.data
    
            if (incomingMessage === 'hello') {
                socket.send('hello')
            } else {
                const message = JSON.parse(incomingMessage)
                if (message.status_wait === false) {
                    setTimeout(() => {
                        enableCam()
                        raf = window.requestAnimationFrame(draw)
                    }, 1000);
                    enableCam()
                }
                if (message.x >= 0) {
                    balls = balls.concat({
                        x: message.x,
                        y: 10,
                        vx: 0,
                        vy: 10,
                        radius: 25,
                        color: 'red',
                        enemy: true,
                        draw() {
                            ctx.beginPath()
                            ctx.arc(this.x, this.y, this.radius, 0, 2 * Math.PI, true) // Draws circle
                            ctx.closePath()
                            ctx.fillStyle = this.color
                            ctx.fill()
                        }
                    })
                
                }

                if (!game_end && message.hit) {
                    game_end = true
                    alert('You won!!!')
                    navigate('/')
                }
            console.log(incomingMessage)
            }
        }
    
        socket.onclose = event => console.log(`Closed ${event.code}`)

        // ## ACTUAL DRAWING PART ##
        const canvas = document.getElementById("output_canvas")
        const ctx = canvas.getContext("2d");

        // Spaceship object
        const ship = {
            x: null,
            y: null,
            width: 150,
            height: 50,
            leftBorder: 0,
            rightBorder: 0,
            vx: 5,
            vy: 0,
            color: 'black',
            draw() {
                ctx.beginPath()
                ctx.fillStyle = this.color
                ctx.fillRect(this.x, this.y, this.width, this.height)
                ctx.restore()
            }
        }

        // Draw a single frame.
        const draw = () => {
            ctx.clearRect(0, 0, canvas.width, canvas.height)
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
                    vy: -20,
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
                if (ball.y < 0) {
                    const message = {x: ball.x}
                    socket.send(JSON.stringify(message))
                }

                if (ball.enemy) {
                    console.log('enemy detected')
                    if (!game_end && ball.x >= ship.x && ball.x <= ship.x + 150 && ball.y >= ship.y && ball.y <= ship.y + 50) {
                        game_end = true
                        socket.send(JSON.stringify({hit: true}))
                        alert('You lost! :(')
                        navigate('/')
                    }
                }
                ctx.restore()
            })
            
            balls = balls.filter(ball => ball.y >= 0 && ball.y <= canvas.height)


            if (ship.x) ship.draw()

            ctx.restore()

            prev_x = ship.x
            prev_y = ship.y

            ship.x = ship_x * canvas.width - 80
            ship.y = ship_y * canvas.height

            // Request next frame
            raf = window.requestAnimationFrame(draw);
        }
		
			// Activate drawing on mouse over
			canvas.addEventListener('mouseover', (e) => {
				raf = window.requestAnimationFrame(draw)
            })

            return () => socket.close()
    }, [])

    return (
        <div>
            <div id="liveView" className="videoView">
                <div id="webcam-container">
                    <video id="webcam" autoPlay playsInline></video>
                    <canvas className="output_canvas" id="output_canvas"></canvas>
                </div>
            </div>
        </div>
    )
}

export default Canvas

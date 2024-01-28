import { FilesetResolver, GestureRecognizer } from '@mediapipe/tasks-vision'
import { useEffect } from 'react'

import '../styles/canvasNew.css'

const Canvas = () => {
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
    let ball = null

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
    
    const video = document.getElementById("webcam");
    
    const canvasElement = document.getElementById("output_canvas")
    
    const enableCam = (event) => {
        if (!gestureRecognizer) {
            console.log("Wait! objectDetector not loaded yet.")
            return
        }
        
        if (webcamRunning === true) {
            webcamRunning = false;
            enableWebcamButton.innerText = "ENABLE PREDICTIONS"
        } else {
            webcamRunning = true;
            enableWebcamButton.innerText = "DISABLE PREDICTIONS"
        }
    
        const constraints = {
            video: true
        }
    
        navigator.mediaDevices.getUserMedia(constraints).then((stream) => {
            video.srcObject = stream;
            video.addEventListener("loadeddata", predictWebcam);
        })
    }
    
    const enableWebcamButton = document.getElementById("webcamButton");
    enableWebcamButton.addEventListener("click", enableCam);
    
    
    let lastVideoTime = -1
    let gestureResults = undefined
    
    console.log(video);
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
            currentGesture = gestureResults.gestures[0][0].categoryName
            
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

    const circRad = Math.PI * 2

	useEffect(() => {
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
                }, 500)
                ball = {
                    x: ship_x * canvas.width,
                    y: ship_y * canvas.height - 50,
                    vx: 0,
                    vy: -30,
                    radius: 25,
                    color: 'blue',
                    draw() {
                        ctx.beginPath()
                        ctx.arc(this.x, this.y, this.radius, 0, circRad, true) // Draws circle
                        ctx.closePath()
                        ctx.fillStyle = this.color
                        ctx.fill()
                    }
                }
            }

            if (ball) {
                ball.draw()
                ball.x += ball.vx
                ball.y += ball.vy
            }

            if (ship.x) ship.draw()

            prev_x = ship.x
            prev_y = ship.y

			ship.x = ship_x * canvas.width - 80
            ship.y = ship_y * canvas.height

			// Request next frame
			raf = window.requestAnimationFrame(draw);
		}
		
		// Activate drawing
		canvas.addEventListener('mouseover', (e) => {
			raf = window.requestAnimationFrame(draw);
		  });

		canvas.addEventListener('mouseout', (e) => {
			window.cancelAnimationFrame(raf);
		});
	},[])

    return (
        <>
            <button onClick={() => {video = null}}>hi</button>
        </>
    )
}

export default Canvas
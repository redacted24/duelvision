import './index.css'
import Webcam from 'react-webcam'

const App = () => {
	// Debug message
	console.log("Loaded App")

	// Some Rules for the Webcam. Entire object is passed as a prop in the Webcam component
	const videoConstraints = {
		width: { min: 1080},
		height: { min: 720},
		aspectRatio: 0.666666666666666667
	}

	// Canvas frame
	const width = 300
	const height = 300

	// Offset for animations
	let offset = 0

	// Draw function
		// Drawing shapes
			// ctx.beginPath() Path drawing
			// fillRect(x, y, width, height) FULL RECTANGLE
			// strokeRect(x, y, width, height) OUTLINE RECTANGLE (path drawn)
			// clearRect(x, y, width, height) CLEARS RECTANGLE (transparent, or erase)
			// fillStyle = "rgb(r g b alpha)"
			// ctx.stroke() Outline drawing. Must close path beforehand
			// ctx.closePath()
			// arc(x, y, radius, startAngle, endAngle, counterclockwise)
			// arcTo(x1, y1, x2, y2, radius)
			// ctx.fillStyle()
			// ctx.strokeStyle()
	
	const init = () => {
		window.requestAnimationFrame(draw)
	}

	const draw = () => {
		console.log('Drawing...')
		const ctx = document.getElementById('canvas').getContext('2d')
		ctx.globalCompositeOperation = 'destination-over'

		// Clear
		ctx.clearRect(0,0, height, width)

		// Save
		ctx.fillStyle = "#000000"
		ctx.save()

		// Movement
		ctx.translate(1, 1)
		ctx.save()
	
		// New frame content
		ctx.fillRect(0,0,10,10)
		ctx.restore()

		// window.requestAnimationFrame(draw)
	}

	init()

	return (
		<div>
			{/* <div id='webcam-container'>
				<Webcam mirrored={true} imageSmoothing={true} audio={false} videoConstraints={videoConstraints}/>	
			</div> */}
			{/* Canvas */}
			<div> 
				<canvas id="canvas" width={width} height={height}>
					use a different browser
				</canvas>
			</div>
		</div>
	)
}

export default App

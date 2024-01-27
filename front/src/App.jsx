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

	// Offset for animations
	let offset = 0

	// Draw function
	const draw = () => {
		console.log("Draw function called")
		const canvas = document.getElementById("canvas");

		if (canvas.getContext) {

			// Full circle angle in radians
			const circRad = Math.PI*2
			const ctx = canvas.getContext('2d');

			const init = () => {
				window.requestAnimationFrame(draw)
			}

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
				
			ctx.fillStyle = "rgb(200 0 0)";
			ctx.fillRect(0, 1, 20, 50);

			ctx.fillStyle = "rgb(0 0 200 / 50%)"
			ctx.fillRect(30, 30, 50, 50)
			


			// // Circle
			// ctx.beginPath();
			// ctx.arc(75, 75, 50, 0, Math.PI * 2, true); // Outer circle
			// ctx.moveTo(110, 75);
			// ctx.arc(75, 75, 35, 0, Math.PI, false); // Mouth (clockwise)
			// ctx.moveTo(65, 65);
			// ctx.arc(60, 65, 5, 0, Math.PI * 2, true); // Left eye
			// ctx.moveTo(95, 65);
			// ctx.arc(90, 65, 5, 0, Math.PI * 2, true); // Right eye
			// ctx.stroke();

		} else {
			console.log('Canvas not supported')
		}
	}
	setTimeout(() => {
		window.addEventListener('load', draw())
	}, 1)


	return (
		<div>
			{/* <div id='webcam-container'>
				<Webcam mirrored={true} imageSmoothing={true} audio={false} videoConstraints={videoConstraints}/>	
			</div> */}
			{/* Canvas */}
			<div> 
				<canvas id="canvas" width="300" height="300">
					use a different browser
				</canvas>
			</div>
		</div>
	)
}

export default App

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

	// Draw function
	const draw = () => {
		console.log("Draw function called")
		const canvas = document.getElementById("canvas");

		if (canvas.getContext) {
			const ctx = canvas.getContext('2d');

			// Drawing shapes
				// ctx.beginPath() Path drawing
				// fillRect(x, y, width, height) FULL RECTANGLE
				// strokeRect(x, y, width, height) OUTLINE RECTANGLE (path drawn)
				// clearRect(x, y, width, height) CLEARS RECTANGLE (transparent, or erase)
				// fillStyle = "rgb(r g b alpha)"
			ctx.fillStyle = "rgb(200 0 0)";
			ctx.fillRect(0, 1, 20, 50);

			ctx.fillStyle = "rgb(0 0 200 / 50%)"
			ctx.fillRect(30, 30, 50, 50)

			// Triangle
			ctx.beginPath();
			ctx.moveTo(75, 50); // Move origin point
			ctx.lineTo(100, 75);
			ctx.lineTo(100, 25);
			ctx.fill(); // Closes last point to origin point automatically

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
			<div>
				<canvas id="canvas" width="150" height="150">
					use a different browser
				</canvas>
			</div>
		</div>
	)
}

export default App

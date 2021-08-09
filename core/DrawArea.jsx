import React from 'react'
import { Layer, Stage, Image } from 'react-konva'

export default class DrawArea extends React.Component {
	constructor(props) {
		super(props)

		this.state = {
			isDrawing: false,
			canvas: null,
			width: props.width || 300,
			height: props.height || 300
		}

		this.lineWidth = 3

		this.drawContext = null

		this.type = 'image/png'

		this.handleMouseDown = this.handleMouseDown.bind(this)
		this.handleMouseUp = this.handleMouseUp.bind(this)
		this.handleMouseMove = this.handleMouseMove.bind(this)
		this.handleMouseOut = this.handleMouseOut.bind(this)
	}

	componentDidMount() {
		this.setUpCanvasContext()
	}

	get imageType() {
		return this.type
	}

	get imageSrc() {
		return this.image.toDataURL(this.type)
	}

	setUpCanvasContext() {
		const canvas = document.createElement("canvas")
		canvas.width = this.state.width
		canvas.height = this.state.height

		const context = canvas.getContext("2d")
		context.strokeStyle = "#2F2F2F"
		context.lineJoin = "round"
		context.lineWidth = this.lineWidth
		context.globalCompositeOperation = "source-over"

		this.drawContext = context
		this.setState({ canvas })
	}

	drawDot({x, y}) {
		const radius = this.lineWidth / 2
		this.drawContext.beginPath()
		this.drawContext.arc(x, y, radius, 0, 2 * Math.PI, true)
		this.drawContext.fill()
		this.image.getLayer().draw()
	}

	handleMouseDown() {
		this.setState({ isDrawing: true })

		const stage = this.stage.getStage()
		this.lastPointerPosition = stage.getPointerPosition()
		this.drawDot(this.lastPointerPosition)
	}

	handleMouseOut() {
		this.setState({ isDrawing: false })
	}

	handleMouseUp() {
		this.setState({ isDrawing: false })
	}

	handleMouseMove() {
		if (!this.state.isDrawing) return

		this.drawContext.beginPath()

		const localPos = {
			x: this.lastPointerPosition.x - this.image.x(),
			y: this.lastPointerPosition.y - this.image.y()
		}
		this.drawContext.moveTo(localPos.x, localPos.y)

		const stage = this.stage.getStage()
		const pos = stage.getPointerPosition()

		localPos.x = pos.x - this.image.x()
		localPos.y = pos.y - this.image.y()

		this.drawContext.lineTo(localPos.x, localPos.y)
		this.drawContext.closePath()
		this.drawContext.stroke()

		this.lastPointerPosition = pos
		this.image.getLayer().draw()
	}

	render() {
		const canvas = this.state.canvas

		return <div className="draw-image-wrapper">
			 <Stage
				ref={ref => this.stage = ref}
				width={this.state.width}
				height={this.state.height}>
				<Layer>
					<Image
						image={canvas}
						ref={node => (this.image = node)}
						width={this.state.width}
						height={this.state.height}
						onMouseDown={this.handleMouseDown}
						onMouseUp={this.handleMouseUp}
						onMouseMove={this.handleMouseMove}
						onMouseOut={this.handleMouseOut}
					/>
				</Layer>
			</Stage>
		</div>
	}
}

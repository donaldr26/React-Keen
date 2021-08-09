import React from 'react'

import ReactCrop from 'react-image-crop'

import 'react-image-crop/dist/ReactCrop.css'

export default class Cropper extends React.Component {
	constructor(props) {
		super(props)

		this.state = {
			crop: {
				x: 10,
				y: 10,
				width: 80,
				height: 80
			},
			pixelCrop: false,
			cropperImage: false
		}

		this.onCropComplete = this.onCropComplete.bind(this)
		this.onImageLoaded = this.onImageLoaded.bind(this)
	}

	onCropComplete(crop, pixelCrop) {
		this.setState({ crop, pixelCrop })
	}

	onImageLoaded(crop, cropperImage, pixelCrop) {
		this.setState({ crop, pixelCrop, cropperImage })
	}

	get imageContent() {
		const image = document.createElement('img')
		image.src = this.props.src
		const ratio = this.state.cropperImage.width / image.width

		const canvas = document.createElement('canvas')
		canvas.width = this.state.pixelCrop.width / ratio
		canvas.height = this.state.pixelCrop.height / ratio
		const ctx = canvas.getContext('2d')

		const params = [
			this.state.pixelCrop.x / ratio,
			this.state.pixelCrop.y / ratio,
			this.state.pixelCrop.width / ratio,
			this.state.pixelCrop.height / ratio,
			0,
			0,
			this.state.pixelCrop.width / ratio,
			this.state.pixelCrop.height / ratio
		]
		ctx.drawImage(image, ...params)

		return canvas.toDataURL('image/jpeg')
	}

	render() {
		return (<ReactCrop
			ref={ref => this.crop = ref}
			src={this.props.src}
			crop={this.state.crop}
			onComplete={this.onCropComplete}
			onImageLoaded={this.onImageLoaded}
		/>)
	}
}

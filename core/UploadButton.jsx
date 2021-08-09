import React from 'react'
import PropTypes from 'prop-types'

import Lightbox from 'react-image-lightbox'

export default class UploadButton extends React.Component {
	constructor(props) {
		super(props)

		this.state = {
			mime: props.mime,
			file: null,
			value: props.value,
			uri: props.uri,
			content: null,
			showImage: false
		}

		this.clear = this.clear.bind(this)
		this.onChange = this.onChange.bind(this)
	}

	componentWillReceiveProps(nextProps) {
		if (nextProps.value || nextProps.uri) this.setState({ value: nextProps.value, uri: nextProps.uri })
	}

	get content() {
		return this.state.content
	}

	get value() {
		return this.state.value || this.state.file.name
	}

	set filename(value) {
		this.setState({ value })
	}

	set uri(uri) {
		this.setState({ uri })
	}

	clear(e) {
		e.preventDefault()
		this.props.onClear()

		this.setState({ file: null, value: null })
	}

	onChange(e) {
		e.preventDefault()

		const file = e.target.files[0]
		// if (file.type !== 'image/jpeg') {
		// 	alert('Only JPEG images supported')

		// 	return false
		// }
		e.target.value = null

		const reader = new FileReader()
		reader.onloadend = () => {
			const content = reader.result//.split(',')[1]
			this.setState({
				mime: file.type,
				file,
				content,
				value: file.name,
				uri: reader.result
			})
			this.props.onChange(content, file)
		}
		reader.readAsDataURL(file)
	}

	showPreview() {
		if (this.state.mime === 'application/pdf') {
			alert('No preview available')
		} else {
			this.setState({ showImage: true })
		}
	}

	render() {
		return (<div>
			<input
				id={this.props.htmlId}
				disabled={this.props.disabled}
				type="file"
				className="btn-upload"
				onChange={this.onChange}
				// accept="image/jpeg"
			/>
			{
				!this.state.showImage ||
					<Lightbox
						mainSrc={this.state.uri}
						onCloseRequest={() => this.setState({ showImage: false })}
					/>
			}
			{
				this.state.value
					? <div>
						<input
							type="text"
							placeholder={this.state.value}
							readOnly
							className="form-control bg-image-form text-check"
							onClick={this.showPreview.bind(this)}
						/>
						<a className="clos" href="#" onClick={this.clear}>&times;</a>
						{
							true || this.state.mime !== 'application/pdf'
							|| <a href={this.state.uri} target="_blank" className="file-link">View PDF</a>
						}
					</div>
					: <label className="lab-upl-btn" htmlFor={this.props.htmlId}>
						<img src="assets/images/up-arrov.png"/>
						{kst(this.props.title)}
					</label>
			}
		</div>)
	}
}

UploadButton.propTypes = {
	title: PropTypes.string.isRequired,
	value: PropTypes.string,
	uri: PropTypes.string,
	htmlId: PropTypes.string.isRequired,
	onClear: PropTypes.func,
	onChange: PropTypes.func
}

UploadButton.defaultProps = {
	onClear: function () {},
	onChange: function () {}
}

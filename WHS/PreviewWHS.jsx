import React from 'react'
import { hashHistory } from 'react-router'

import Modal from '../core/Modal'
import Content from '../core/Content'

import serviceWhs from '../../services/whs'

export default class PreviewWHS extends React.Component {

	constructor(props) {
		super(props)

		this.state = {
			previewHtml: '',
			isLoading: false
		}
	}

	componentWillReceiveProps(nextProps) {
		if (nextProps.isVisible && nextProps.isVisible !== this.props.isVisible) {
			this.getData()
		}
	}

	getData() {
		this.setState({ previewHtml: '' })

		if (!this.props.whsId) {
			return
		}

		this.setState({ isLoading: true })

		return serviceWhs.getPreviewWhsHtml(this.props.whsId)
			.then(response => {
				this.setState({ previewHtml: response.html, isLoading: false })
			})
			.catch(err => {
				this.setState({ isLoading: false })
			})
	}

	createMarkup () {
	    return {__html: this.state.previewHtml};
	 }

	render() {
		return <Modal
			isVisible={this.props.isVisible}
			size="large"
			static={true}
			onClose={this.props.onClose}>
			<Content isLoading={this.state.isLoading}>
				<div dangerouslySetInnerHTML={this.createMarkup()} />
			</Content>
		</Modal>
	}
}

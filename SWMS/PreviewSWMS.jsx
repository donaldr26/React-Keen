import React from 'react'
import { Document, Page } from 'react-pdf/dist/entry.noworker'

import Modal from '../core/Modal'
import Content from '../core/Content'

import serviceSwms from '../../services/swms'

export default class PreviewSWMS extends React.Component {

	constructor(props) {
		super(props)

		this.state = {
			filename: false,
			numPages: 1,
			isLoading: false
		}

		this.onDocumentLoadSuccess = this.onDocumentLoadSuccess.bind(this)
	}

	componentWillReceiveProps(nextProps) {
		if (nextProps.isVisible && nextProps.isVisible !== this.props.isVisible) {
			this.getData()
		}
	}

	onDocumentLoadSuccess({ numPages }) {
		this.setState({ numPages })
	}

	getData() {
		this.setState({ filename: false })

		if (!this.props.swmsId) {
			return
		}

		this.setState({ isLoading: true })

		serviceSwms.getSwmsPdf(this.props.swmsId)
			.then(response => {
				this.setState({
					filename: response.file_path,
					isLoading: false
				})
			})
			.catch(err => {
				this.setState({ isLoading: false })
			})
	}

	render() {
		const { filename, numPages } = this.state

		return <Modal
			isVisible={this.props.isVisible}
			size="large"
			static={true}
			onClose={this.props.onClose}>
			<Content isLoading={this.state.isLoading}>
				<div>
					<div className="scrollable">
						<Document
							file={filename}
							onLoadSuccess={this.onDocumentLoadSuccess}
						>
							{Array.from(
								new Array(numPages || 1),
								(el, index) => <Page key={`page_${index}`} scale={1} pageNumber={index + 1} />,
							)}
						</Document>
					</div>
				</div>
			</Content>
		</Modal>
	}
}

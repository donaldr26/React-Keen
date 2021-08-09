import React, { PropTypes } from 'react'
import { Modal as BsModal } from 'react-bootstrap'

export default class Modal extends React.Component {
	constructor(props) {
		super(props)

		this.state = {
			isVisible: props.isVisible || false,
			title: props.title || '',
			content: props.children,
			size: props.size,
			static: props.static || false,
			dialogClassName: props.dialogClassName,
			cb: props.onClose || this.emptyFunction
		}

		this.onClose = this.onClose.bind(this)
	}

	componentWillReceiveProps (nextProps) {
		this.setState({
			isVisible: nextProps.isVisible || false,
			title: nextProps.title || '',
			content: nextProps.children,
			size: nextProps.size,
			dialogClassName: nextProps.dialogClassName,
			cb: nextProps.onClose || this.emptyFunction
		})
	}

	emptyFunction() {}

	show(content, title, size, cb) {
		this.setState({ isVisible: true, content, title, size, cb })
	}

	hide() {
		this.onClose()
	}

	onClose () {
		if (typeof this.state.cb === 'function') {
			this.state.cb()
		}

		this.setState({ isVisible: false })
	}

	render() {
		const title = this.state.title
		const attrs = {
			className: 'modal-confirm',
			show: this.state.isVisible,
			onHide: this.onClose,
			animation: !this.state.static,
			dialogClassName: this.state.dialogClassName
		}

		if (this.state.size) attrs.bsSize = this.state.size

		return (<div className="static-modal">
			<BsModal {...attrs}>
				{
					!title || <BsModal.Header closeButton className="modal-hstyle">
						<BsModal.Title id="contained-modal-title-lg" className="modal-hstyle-title">{title}</BsModal.Title>
					</BsModal.Header>
				}
				<BsModal.Body>{this.state.content}</BsModal.Body>
			</BsModal>
		</div>)
	}
}

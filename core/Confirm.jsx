import React from 'react'
import { Modal, Button } from 'react-bootstrap'

export default class Confirm extends React.Component {
	constructor(props) {
		super(props)

		this.state = {
			isVisible: false,
			role: 'success',
			title: '',
			text: '',
			buttons: ['ok'],
			cb: () => {}
		}

		this.buttons = {
			yes: { bsStyle: 'success' },
			no: { bsStyle: 'default' },
			ok: { bsStyle: 'success' },
			cancel: { bsStyle: 'default' }
		}

		this.closeAlert = this.closeAlert.bind(this)
	}

	get isVisible() {
		return this.state.isVisible
	}

	show(title, text, buttons, size, cb) {
		this.setState({ isVisible: true, title, text, buttons, size, cb })
	}

	closeAlert() {
		this.state.cb()
		this.setState({ isVisible: false })
	}

	reply(buttonKey) {
		this.state.cb(buttonKey)
		this.closeAlert()
	}

	render() {
		const attrs = {
			className: 'modal-confirm',
			show: this.state.isVisible,
			onHide: this.closeAlert
		}
		if (this.state.size) attrs.bsSize = this.state.size

		return (<div className="static-modal">
			<Modal {...attrs} backdrop={'static'}>
				<Modal.Header closeButton className="modal-hstyle">
					{!this.state.title || <Modal.Title id="contained-modal-title-lg">{this.state.title}</Modal.Title>}
				</Modal.Header>
				<Modal.Body>
					{this.state.text}
					<div className="modal-confirm-buttons text-right">
						{
							this.state.buttons.map((value, key) => {
								const className = value.class || 'btn-s bgyellow sm noradius'
								const buttonValue = typeof value === 'object' ? value.name : value

								return (<Button className={className}
									bsSize="small"
									key={key}
									onClick={this.reply.bind(this, buttonValue)}
								>
									{buttonValue}
								</Button>)
							})
						}
					</div>
				</Modal.Body>
			</Modal>
		</div>)
	}
}

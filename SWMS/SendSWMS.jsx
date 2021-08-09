import React from 'react'
import { hashHistory } from 'react-router'

import Modal from '../core/Modal'
import Content from '../core/Content'

import serviceSwms from '../../services/swms'
import store from '../../store'

export default class SendSWMS extends React.Component {
	constructor(props) {
		super(props)

		this.state = {
			isLoading: false,
			emails: ['']
		}

		this.send = this.send.bind(this)
		this.close = this.close.bind(this)
	}

	close() {
		if (typeof this.props.onClose === 'function') {
			this.props.onClose()
		}
	}

	send() {
		this.setState({ isLoading: true })

		return serviceSwms.send(this.props.swmsId, JSON.stringify(this.state.emails))
			.then(response => {
				store.layout.alert(response.status, response.message)
				this.setState({ isLoading: false })
				if (typeof this.props.onClose === 'function') {
					this.props.onClose()
				}
			})
			.catch(err => {
				console.log(err.message, err)
				this.setState({ isLoading: false })
			})
	}

	addNew(e) {
		e.preventDefault()
		this.setState({ emails: [...this.state.emails, ''] })
	}

	handleEmailListChange(index, event) {
		const emails = this.state.emails.slice()
		emails[index] = event.target.value
		this.setState({ emails })
	}

	render() {
		return <Modal
			isVisible={this.props.isVisible}
			size="large"
			static={true}
			onClose={this.props.onClose}>
			<Content isLoading={this.state.isLoading}>
				<h5 className="font-bolder">{kst('Enter the email addresses that you would like the SWMS document sent to:')}</h5>
				<p>
					{kst('Please note that the SWMS document is automatically sent to all employees and contractors registered to the site when it is generated.')}'
				</p>
				<div className="contact-form job-contact" style={{backgroundColor: 'white'}}>
					<div className={`form-group sec-5-m`}>
						<div className="">
							{
								this.state.emails.map((email, i) => {
									return <input
										key={`email-${i}`}
										value={email}
										onChange={this.handleEmailListChange.bind(this, i)}
										type="text"
										placeholder="email@domain"
										className="form-control inline-block width_70percent"
									/>
								})
							}
							{
								<button
									className="btn-s sm bgyellow"
									style={{marginTop: "10px"}}
									onClick={this.addNew.bind(this)}
								>
									{kst('ADD ANOTHER')}
								</button>
							}
						</div>
					</div>
				</div>
				<div className="text-right">
					<button className="btn-s bggray sm" onClick={this.close}>{kst('Cancel')}</button>
					<button className="btn-s bgyellow sm" onClick={this.send}>{kst('Send SWMS')}</button>
				</div>
			</Content>
		</Modal>
	}
}

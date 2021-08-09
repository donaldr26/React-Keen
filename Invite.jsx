import React from 'react'
import { FormControl, FormGroup, ControlLabel, HelpBlock } from 'react-bootstrap'

import store from '../store'
import serviceUsers from '../services/users'

export default class Invite extends React.Component {
	constructor(props) {
		super(props)

		this.state = {
			isLoading: false,
			email: '',
			errors: {}
		}

		this.getValidationState = this.getValidationState.bind(this)
		this.errorMessage = this.errorMessage.bind(this)
	}

	handleChange(fieldName, e) {
		const errors = this.state.errors || {}
		delete errors[fieldName]
		delete errors.global

		this.setState({
			[fieldName]: e.target.value,
			errors
		})
	}

	sendInvite(e) {
		if (e) e.preventDefault()

		this.setState({ isLoading: true })

		return serviceUsers.sendFriendInvite(this.state.email)
			.then(response => {
				this.setState({ isLoading: false }, () => {
					if (typeof this.props.onSuccess === 'function') {
						this.props.onSuccess(response)
					}
				})
			})
			.catch(err => {
				const errors = err.errors || {}
				this.setState({ errors, isLoading: false })
			})
	}

	onCancel() {
		if (typeof this.props.onCancel === 'function') {
			this.props.onCancel()
		}
	}

	getValidationState(field) {
		if (typeof this.state.errors[field] === 'undefined') return null

		return 'error'
	}

	errorMessage(field) {
		if (typeof this.state.errors[field] === 'undefined') return null

		return <HelpBlock>{this.state.errors[field]}</HelpBlock>
	}

	render() {
		return (<div className="modal-s">
			<div className="content clearfix">
				<h3 className="yellow_title">{kst('Invite a friend to keen safety')}</h3>
				<p>{kst('If you would like to invite a friend or co-worker to use Keen Safety, just enter their email address below and click send invitation.')}</p>
				<FormGroup controlId="email" validationState={this.getValidationState('email')}>
					<FormControl
						className="fullwidth"
						type="email"
						value={this.state.email}
						placeholder={kst('Email')}
						onChange={this.handleChange.bind(this, 'email')}
					/>
					{this.errorMessage('email')}
				</FormGroup>
				<button
					className="btn-s sm bgyellow pull-left"
					onClick={this.sendInvite.bind(this)}
					disabled={this.state.isLoading}
				>
					{kst('send invitation')}
				</button>
				<button className="btn-s sm bggray pull-right" onClick={this.onCancel.bind(this)}>{kst('cancel')}</button>
			</div>
		</div>)
	}
}

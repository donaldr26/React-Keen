import React, { Component } from 'react'
import { FormControl, FormGroup, ControlLabel, HelpBlock } from 'react-bootstrap'

import store from '../store'
import serviceUsers from '../services/users'

export default class ForgotPassword extends React.Component {
	constructor(props) {
		super(props)
		this.state = {
			isLoading: false,
			identity: store.isGuest ? '' : store.auth.user.email,
			errors: {}
		}

		this.isGuest = store.isGuest
	}

	reset() {
		this.setState({ isLoading: true })

		const payload = {
			identity: this.state.identity,
			redirect_url: `${window.location.origin}/#/auth/forgot_password`
		}

		return serviceUsers.forgotPassword(payload)
			.then(response => {
				this.setState({ isLoading: false, errors: {} })
				if (typeof this.props.onSuccess === 'function') {
					this.props.onSuccess()
				}
			})
			.catch(err => {
				this.setState({ isLoading: false, errors: err.errors })
			})
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

	errorMessage(field) {
		if (typeof this.state.errors[field] === 'undefined') return null

		return <HelpBlock>{this.state.errors[field]}</HelpBlock>
	}

	render() {
		return (
			<div className="modal-s">
				<div className="content">
					<h4 className="font-bolder">{kst('Forgot password?')}</h4>
					{/*<p>If you've forgotten your password, click the reset password button below.</p>
					<p>We will send a new password to your registered email address.</p>*/}
					<p ref={(node) => {
							if (node) {
							node.style.setProperty("color", "#000", "important");
							node.style.setProperty("margin-bottom", "25px");
							}
						}
					}>
						{
							store.isGuest
								? kst('Enter your email address and follow the email instructions to reset your password.')
								: kst('Click Reset Password to change your password.')
						}
					</p>
					{
						!store.isGuest ||
						<FormGroup
							controlId="identity"
							validationState={this.state.errors.identity && 'error'}
						>
							<ControlLabel>{kst('Email address:')}</ControlLabel>
							<FormControl
								className="fullwidth"
								type="text"
								value={this.state.identity}
								placeholder={kst('Email')}
								onChange={this.handleChange.bind(this, 'identity')}
							/>
							{this.errorMessage('identity')}
						</FormGroup>
					}
					<div className="text-right">
						<button className="btn-s bggray sm" onClick={this.props.onCancel}>{kst('Cancel')}</button>
						<button
							className="btn-s bgyellow sm"
							onClick={this.reset.bind(this)}
							disabled={this.state.isLoading}
						>
							{kst('Reset password')}
						</button>
					</div>
				</div>
			</div>
		)
	}
}

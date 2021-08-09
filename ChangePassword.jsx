import React, { Component } from 'react'
import { FormControl, FormGroup, ControlLabel, HelpBlock } from 'react-bootstrap'

import store from '../store'
import serviceUsers from '../services/users'

export default class ChangePassword extends React.Component {
	constructor(props) {
		super(props)

		this.state = {
			isLoading: false,
			data: {},
			errors: {}
		}

		this.handleChange = this.handleChange.bind(this)
		this.getValidationState = this.getValidationState.bind(this)
		this.errorMessage = this.errorMessage.bind(this)
		this.renderContent = this.renderContent.bind(this)
	}

	changePassword(e) {
		if (e) e.preventDefault()

		this.setState({ isLoading: true })
		return serviceUsers.changePassword(this.state.data)
			.then(response => {
				this.setState({ isLoading: false, errors: {} })
				if (typeof this.props.onSuccess === 'function') {
					this.props.onSuccess()
				}
			})
			.catch(err => {
				console.log(err.message, err)
				let stateErrors = err.errors
				if (err.code === store.constants.ERROR_CODE_BAD_PASSWORD_CODE) {
					stateErrors = { old_password: err.message }
				}
				this.setState({ isLoading: true, errors: stateErrors })
			})
	}

	handleChange(e) {
		const field = e.target.getAttribute('name')
		const value = e.target.value

		const data = this.state.data
		data[field] = value
		this.setState({ data })
	}

	getValidationState(field) {
		if (typeof this.state.errors[field] !== 'undefined') return 'error'

		return null
	}

	errorMessage(field) {
		if (typeof this.state.errors[field] === 'undefined') return null

		return <HelpBlock>{this.state.errors[field]}</HelpBlock>
	}

	renderContent(data) {
		return (<div className="content">
			<h4 className="font-bolder">{kst('Change password:')}</h4>
			<FormGroup validationState={this.getValidationState('old_password')}>
				<ControlLabel>{kst('Old password:')}</ControlLabel>
				<FormControl
					name="old_password"
					type="password"
					value={data.old_password || ''}
					onChange={this.handleChange}
				/>
				{this.errorMessage('old_password')}
			</FormGroup>
			<FormGroup validationState={this.getValidationState('new_password')}>
				<ControlLabel>{kst('New password:')}</ControlLabel>
				<FormControl
					name="new_password"
					type="password"
					value={data.new_password || ''}
					onChange={this.handleChange}
				/>
				{this.errorMessage('new_password')}
			</FormGroup>
			<div className="text-right">
				<button onClick={this.props.onCancel} className="btn-s bggray sm">{kst('Cancel')}</button>
				<button onClick={this.changePassword.bind(this)} className="btn-s bgyellow sm">Change password</button>
			</div>
		</div>)
	}

	render() {
		const data = this.state.data
		if (this.props.noWrap) return this.renderContent(data)

		return (<div className="modal-s">{this.renderContent(data)}</div>)
	}
}

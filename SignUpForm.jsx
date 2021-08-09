/* eslint-disable camelcase */
/*global kst */
import React from 'react'
import { hashHistory, Link } from 'react-router'
import { Document, Page } from 'react-pdf/dist/entry.noworker'

import { FormControl, FormGroup, HelpBlock, ControlLabel, Row, Col } from 'react-bootstrap'

import store from '../store'
import serviceAuth from '../services/auth'

export default class SignUpForm extends React.Component {
	constructor(props) {
		super(props)

		this.state = {
			isLoading: false,
			data: {},
			errors: {},
			showPassword: false,
			userAgree: false,
			userReadPrivacy: false,
			passwordsEquals: true,
			badCode: false,
			inviter: false
		}

		this.handleChange = this.handleChange.bind(this)
	}

	componentWillMount() {
		if (!this.props.code) return true

		return serviceAuth.checkInviteCode(this.props.code)
			.then(response => {
				const { inviter, invitee } = response
				this.setState({ inviter, data: invitee })
			})
			.catch(err => {
				if (err.code === store.constants.ERROR_CODE_NOT_FOUND) {
					this.setState({ stateErrors: { badCode: true } })
					store.layout.alert('error', err.message)
				}
			})
	}

	handleChange(e) {
		const field = e.target.getAttribute('name')
		if (['password', 'password_confirm'].indexOf(field) > -1) {
			const state = {
				passwordsEquals: this.refPassword.value === this.refPasswordConfirm.value
			}
			if (field === 'password_confirm') {
				state.errors = this.state.errors
				if (state.passwordsEquals) {
					delete state.errors.password_confirm
				} else {
					state.errors.password_confirm = 'Passwords do not match'
				}
			}
			this.setState(state)
		}
	}

	signup (e) {
		e.preventDefault()

		this.setState({ errors: {}, isLoading: true })

		const payload = this.props.dataPass || {}
		payload.first_name = this.refFirstName.value
		payload.last_name = this.refLastName.value
		payload.identity = this.refIndentity.value
		payload.password = this.refPassword.value
		payload.redirect_url = `${window.location.origin}/#/auth/signup/confirm`
		payload.capacity = Number(this.props.capacity)

		return serviceAuth.signup(payload)
			// .then(() => hashHistory.push('/auth/signup/confirm'))
			.then(() => {
				const content = <div>
					<p><strong>Thanks for signing up!</strong></p>
					<p>
						A confirmation email has been sent to your email address.
						Please follow the included link to activate your account.
					</p>
				</div>

				return store.layout.confirm('Thanks for signing up!', content, ['ok'])
					.then(() => hashHistory.push('/auth/login'))
			})
			.catch(err => {
				if (err.code === store.constants.ERROR_CODE_EMAIL_ALREADY_REGISTERED) {
					const errors = {
						identity: <span>
							It seems you already registered here, please <Link to={'/auth/login'}>Login</Link>
						</span>
					}
					this.setState({ errors, isLoading: false })
				} else {
					this.setState({ errors: err.errors, isLoading: false })
				}
			})
	}

	signupByInvite(e) {
		if (e) e.preventDefault()

		this.setState({ errors: {}, isLoading: true })

		return serviceAuth.emailConfirmSAH(this.props.code, this.refPassword.value, this.refFirstName.value || null, this.refLastName.value || null)
			.then(response => {
				store.layout.alert(response.status, response.message)
				this.setState({ errors: {}, isLoading: false }, () => hashHistory.push('/auth/login'))
			})
			.catch(err => {
				if (err.code === store.constants.ERROR_CODE_EMAIL_ALREADY_REGISTERED) {
					const errors = {
						identity: <span>
							It seems you already registered here, please <Link to={'/auth/login'}>Login</Link>
						</span>
					}
					this.setState({ errors, isLoading: false })
				} else {
					this.setState({ errors: err.errors, isLoading: false })
				}
			})
	}

	getValidationState(field) {
		if (typeof this.state.errors[field] === 'undefined') return null

		return 'error'
	}

	errorMessage(field) {
		if (typeof this.state.errors[field] === 'undefined') return null

		return <HelpBlock>{this.state.errors[field]}</HelpBlock>
	}

	showTerms(e) {
		e.preventDefault()

		const content = (<div>
			<div className="scrollable">
				<Document
					file="/assets/legal/tos.pdf"
				>
					{Array.from(
						new Array(6),
						(el, index) => <Page key={`page_${index}`} scale={1.4} pageNumber={index + 1} />,
					)}
				</Document>
			</div>
		</div>)

		store.layout.confirm('TERMS & CONDITIONS', content,
			[
				{
					name: 'cancel',
					class: 'btn-s bggray sm noradius'
				},
				{
					name: 'ACCEPT',
					class: 'btn-s bgyellow sm noradius'
				}
			], 'large')
			.then(answer => {
				this.setState({ userAgree: answer === 'ACCEPT' })
			})
	}

	showPrivacy(e) {
		e.preventDefault()

		const content = (<div>
			<div className="scrollable">
				<Document
					file="/assets/legal/pp.pdf"
				>
					{Array.from(
						new Array(8),
						(el, index) => <Page key={`page_${index}`} scale={1.4} pageNumber={index + 1} />,
					)}
				</Document>
			</div>
		</div>)

		store.layout.confirm('Privacy Policy', content,
			[
				{
					name: 'cancel',
					class: 'btn-s bggray sm noradius'
				},
				{
					name: 'ACCEPT',
					class: 'btn-s bgyellow sm noradius'
				}
			], 'large')
			.then(answer => {
				this.setState({ userReadPrivacy: answer === 'ACCEPT' })
			})
	}

	renderForm(data, width = 370) {
		return <form>
			<div className="sign-up-form" style={{ maxWidth: `${width}px`, width: `${width}px` }}>
				<Row>
					<Col lg={6}>
						<FormGroup controlId="firstName" validationState={this.getValidationState('first_name')}>
							<ControlLabel>{kst('First name')}</ControlLabel>
							<FormControl
								name="firstName"
								inputRef={ref => { this.refFirstName = ref }}
								type="text"
								value={data.firstName}
								onChange={this.handleChange}
							/>
							{this.errorMessage('first_name')}
						</FormGroup>
					</Col>
					<Col lg={6}>
						<FormGroup controlId="lastName" validationState={this.getValidationState('last_name')}>
							<ControlLabel>{kst('Last name')}</ControlLabel>
							<FormControl
								name="lastName"
								inputRef={ref => { this.refLastName = ref }}
								type="text"
								value={data.lastName}
								onChange={this.handleChange}
							/>
							{this.errorMessage('last_name')}
						</FormGroup>
					</Col>
				</Row>
				{
					Boolean(this.props.code)
					|| <FormGroup controlId="identity" validationState={this.getValidationState('identity')}>
						<ControlLabel>{kst('Email address')}:</ControlLabel>
						<FormControl
							name="identity"
							inputRef={ref => (this.refIndentity = ref)}
							type="identity"
							value={data.identity}
							placeholder="Email"
							onChange={this.handleChange}
						/>
						{this.errorMessage('identity')}
					</FormGroup>
				}
				<FormGroup controlId="password" validationState={this.getValidationState('password')}>
					<ControlLabel>{kst('Password')}:</ControlLabel>
					<FormControl
						name="password"
						inputRef={ref => { this.refPassword = ref }}
						type={this.state.showPassword ? 'text' : 'password'}
						value={data.password}
						onChange={this.handleChange}
					/>
					{this.errorMessage('password')}
				</FormGroup>
				<FormGroup controlId="password_confirm" validationState={this.getValidationState('password_confirm')}>
					<ControlLabel>{kst('Confirm Password')}:</ControlLabel>
					<FormControl
						name="password_confirm"
						inputRef={ref => { this.refPasswordConfirm = ref }}
						type={this.state.showPassword ? 'text' : 'password'}
						value={data.password_confirm}
						onChange={this.handleChange}
					/>
					{this.errorMessage('password_confirm')}
				</FormGroup>
				<div className="form-group checkbox labl-stac">
					<input type="checkbox" name="" value="" id="show_pass" checked={this.state.showPassword} onChange={e => this.setState({ showPassword: e.target.checked })} />
					<label className="labl-chec" htmlFor="show_pass">{kst('Show Password')}</label>
				</div>
				<div className="form-group checkbox labl-stac">
					<input type="checkbox" name="" value="" id="userReadPrivacy" checked={this.state.userReadPrivacy} onChange={e => this.setState({ userReadPrivacy: e.target.checked })} />
					<label className="labl-chec" htmlFor="userReadPrivacy">{kst('I have read and agree to the')} <a href="#" onClick={this.showPrivacy.bind(this)}>{kst('Privacy Policy')}</a></label>
				</div>
				<div className="form-group checkbox labl-stac">
					<input type="checkbox" name="" value="" id="userAgree" checked={this.state.userAgree} onChange={e => this.setState({ userAgree: e.target.checked })} />
					<label className="labl-chec" htmlFor="userAgree">{kst('I have read and agree to the')} <a href="#" onClick={this.showTerms.bind(this)}>{kst('Terms and Conditions')}</a></label>
				</div>
				<button
					disabled={this.state.isLoading || !this.state.userAgree || !this.state.userReadPrivacy || !this.state.passwordsEquals}
					type="submit"
					className="btn-s lg bgyellow v-margin fullwidth"
					onClick={this.props.code ? this.signupByInvite.bind(this) : this.signup.bind(this)}
				>
					{kst('COMPLETE')}
				</button>
			</div>
		</form>
	}

	render () {
		if (this.state.badCode) {
			return (<div className="content-section user-signup">
				<h1>{kst('SIGN UP')}</h1>
				<p>{kst('Wrong invitation code')}</p>
			</div>)
		}

		const data = this.state.data

		if (this.props.nude) return this.renderForm(data, 410)

		return (<div className="content-section user-signup">
			<h1>{kst('SIGN UP')}</h1>
			{
				this.state.inviter
					? <div>
						<p>{kst('[1] has invited you to join Keen Safety!', [[this.state.inviter.first_name, this.state.inviter.last_name].join(' ')])}</p>
						<p>{kst('Please complete your Sign Up process to access your account')}</p>
					</div>
					: <div>
						<p>{kst('After sign up you will be able to add all the staff & contractors you would like to manage through the app')}</p>
					</div>
			}
			{ this.renderForm(data) }
		</div>)
	}
}

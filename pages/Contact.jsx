import React from 'react'
import { Link } from 'react-router'
import { FormControl, FormGroup, HelpBlock, ControlLabel, Checkbox } from 'react-bootstrap'

import serviceMisc from '../../services/misc'
import store from '../../store'

export default class Contact extends React.Component {
	constructor (props) {
		super(props)

		this.state = this.getDefaultState()

		this.onSubmit = this.onSubmit.bind(this)
		this.showSocialsPopup = this.showSocialsPopup.bind(this)
	}

	getDefaultState () {
		return {
			name: '',
			phone: '',
			email: '',
			message: '',
			isLoading: false,
			showModalSocials: false,
			errors: {}
		}
	}

	handleChange (fieldName, e) {
		const errors = this.state.errors || {}
		delete errors[fieldName]
		delete errors.global

		this.setState({
			[fieldName]: e.target.value,
			errors
		})
	}

	showSocialsPopup(e) {
		if (e) e.preventDefault()

		this.setState({ showModalSocials: true })
	}

	onSubmit (e) {
		e.preventDefault()

		if (this.state.isLoading) {
			return
		}

		const data = {
			name: this.state.name,
			phone: this.state.phone,
			email: this.state.email,
			message: this.state.message
		}

		this.setState({isLoading: true})

		return serviceMisc.contact(data)
			.then(response => {
				store.layout.alert('success', 'Thank you for contacting us!')

				this.setState(this.getDefaultState())
			})
			.catch(err => {
				this.setState({isLoading: false})

				if (err.code === store.constants.ERROR_CODE_VALIDATION) {
					return this.setState({errors: err.errors})
				}

				return store.layout.alert('error', 'Sorry, you haven\'t been contacted to us. Please try again.')
			})
	}

	errorMessage(field) {
		if (typeof this.state.errors[field] === 'undefined') return null

		return <HelpBlock>{this.state.errors[field]}</HelpBlock>
	}

	render () {
		return <div className="content-section contact_section contact">
			<h1>{kst('CONTACT US')}</h1>
			<p className="cwhite">{kst('Contact Keen Safety using the form or direct contact details below.')}</p>
			<div className="row row--small-indents">
			<div className="col-md-5">
					<form onSubmit={this.onSubmit} className="validate">
						<div className="contact-form contact-form--contact">
							<FormGroup
								controlId="name"
								validationState={this.state.errors.name && 'error'}>
								<ControlLabel>{kst('Full name')}:</ControlLabel>
								<FormControl
									type="text"
									value={this.state.name}
									placeholder={kst('Name')}
									onChange={this.handleChange.bind(this, 'name')}
								/>
								{this.errorMessage('name')}
							</FormGroup>
							<FormGroup
								controlId="phone"
								validationState={this.state.errors.phone && 'error'}>
								<ControlLabel>{kst('Contact number')}:</ControlLabel>
								<FormControl
									type="text"
									value={this.state.phone}
									placeholder={kst('Phone')}
									onChange={this.handleChange.bind(this, 'phone')}
								/>
								{this.errorMessage('phone')}
							</FormGroup>
							<FormGroup
								controlId="email"
								validationState={this.state.errors.email && 'error'}>
								<ControlLabel>{kst('Email address')}:</ControlLabel>
								<FormControl
									type="text"
									value={this.state.email}
									placeholder={kst('Email')}
									onChange={this.handleChange.bind(this, 'email')}
								/>
								{this.errorMessage('email')}
							</FormGroup>
							<FormGroup
								controlId="message"
								validationState={this.state.errors.message && 'error'}>
								<ControlLabel>{kst('Message')}:</ControlLabel>
								<FormControl
									componentClass="textarea"
									rows="5"
									value={this.state.message}
									onChange={this.handleChange.bind(this, 'message')}
								/>
								{this.errorMessage('message')}
							</FormGroup>
						</div>
						<button
							type="submit"
							disabled={this.state.isLoading}
							className="btn-s lg bgyellow v-margin contact-form">
							{kst('SEND')}
						</button>
					</form>
				</div>
				<div className="col-md-5">
					<div className="contact-details">
						<p className="address">Keen Safety<br />
							137 Bage Street,<br />
							Nundah, Brisbane,<br />
							4012</p>
						<p className="email">admin@keensafety.com.au</p>
						<p className="phone">(07) 3103 3665</p>
					</div>
					<div className="contact-details contact-details--second m_top_20">
						<a href="https://www.facebook.com/KeenSafety" target="_blank" rel="noopener noreferrer" className="f-facebook f-soc">facebook.com/keensafety</a>
						<a href="#" onClick={this.showSocialsPopup} className="f-twitter f-soc">twitter.com/keensafety</a>
						<a href="#" onClick={this.showSocialsPopup} className="f-youtube f-soc">Keen Safety Youtube channel</a>
					</div>
				</div>
				{
					!this.state.showModalSocials
					|| <div className="modal-s">
						<div className="content">
							<h3 className="yellow_title">{kst('Social media coming soon')}</h3>
							<p>{kst('Keen Safety will be on social media in the near future.')}</p>
							<p>{kst('Stay tuned for updates!')}</p>
							<p>{kst('If you need to get in touch, please do not hesitate to contact us using the details on our contact page.')}</p>
							<div className="text-center">
								<button className="btn-s bggray sm" onClick={() => this.setState({ showModalSocials: false })}>{kst('Close')}</button>
							</div>
						</div>
					</div>
				}
			</div>
		</div>
	}
}

import _ from 'lodash'

import React from 'react'
import PropTypes from 'prop-types'
import { FormControl, FormGroup, HelpBlock, ControlLabel } from 'react-bootstrap'

import UploadButton from './core/UploadButton'

import Address from './core/form/Address'

import { serviceMisc } from '../services'

export default class CompanyForm extends React.Component {
	constructor(props) {
		super(props)
		this.state = {
			data: { ...(props.company || {}) },
			errors: {}
		}
		this.handleChange = this.handleChange.bind(this)
		this.getValidationState = this.getValidationState.bind(this)
		this.errorMessage = this.errorMessage.bind(this)

		this.onLogoDelete = this.onLogoDelete.bind(this)
		this.onLogoChange = this.onLogoChange.bind(this)
	}

	get data() {
		return _.assign(this.state.data, this.address.data)
	}

	set errors(errors) {
		this.setState({ errors })

		this.address.errors = Object.keys(errors)
			.filter(key => this.address.fields.includes(key))
			.reduce((obj, key) => {
				obj[key] = errors[key]

				return obj
			}, {})
	}

	handleChange(e) {
		const field = e.target.getAttribute('name')
		const value = e.target.value

		const data = this.state.data
		data[field] = value
		this.setState({ data })
	}

	getValidationState(field) {
		if (typeof this.state.errors[field] === 'undefined') return null

		return 'error'
	}

	errorMessage(field) {
		if (typeof this.state.errors[field] === 'undefined') return null

		return <HelpBlock>{this.state.errors[field]}</HelpBlock>
	}

	onLogoDelete() {
		const data = this.state.data
		data.company_logo_file_id = null
		data.company_logo_file_name = null
		data.company_logo_file_uri = null

		this.setState({ data })
	}

	onLogoChange(content, file) {
		this.setState({ isUploading: true })

		if (typeof this.props.onReadyChange === 'function') {
			this.props.onReadyChange(false)
		}

		const fileInfo = {
			content: content.split(',')[1],
			filename: this.logoButton.value,
			type: 'company-logo'
		}

		return serviceMisc.createFile(fileInfo)
			.then(response => {

				const data = this.state.data

				data.company_logo_file_id = response.file.id
				data.company_logo_file_name = response.file.name
				data.company_logo_file_uri = response.file.uri

				this.logoButton.filename = response.file.name
				this.logoButton.uri = response.file.uri

				const errors = this.state.errors
				delete errors.company_logo_file_id

				this.setState({
					data,
					errors,
					isUploading: false
				})
				if (typeof this.props.onReadyChange === 'function') {
					this.props.onReadyChange(true)
				}
			})
			.catch(err => {
				console.log(err.message, err)
				this.setState({ isUploading: false })
				if (typeof this.props.onReadyChange === 'function') {
					this.props.onReadyChange(true)
				}
			})
	}

	render() {
		const data = this.state.data

		return (<form>
			<div className="contact-form">
				<h3>{kst('Company Details:')}</h3>

				<FormGroup controlId="company_name" validationState={this.getValidationState('company_name')}>
					<ControlLabel>{kst('Company name:')}</ControlLabel>
					<FormControl
						name="company_name"
						type="text"
						value={data.company_name || ''}
						placeholder={kst('Company name')}
						onChange={this.handleChange}
					/>
					{this.errorMessage('company_name')}
				</FormGroup>

				<FormGroup validationState={this.getValidationState('company_logo_file_id')}>
					<ControlLabel>{kst('Company logo:')}</ControlLabel>
					<UploadButton
						htmlId="logoFile"
						title="Upload Logo"
						ref={ref => this.logoButton = ref}
						value={data.company_logo_file_name || ''}
						uri={data.company_logo_file_uri || ''}
						onClear={this.onLogoDelete}
						onChange={this.onLogoChange}
					/>
					{this.errorMessage('company_logo_file_id')}
				</FormGroup>

				<FormGroup controlId="company_trading_name" validationState={this.getValidationState('company_trading_name')}>
					<ControlLabel>{kst('Trading name (optional):')}</ControlLabel>
					<FormControl
						name="company_trading_name"
						type="text"
						value={data.company_trading_name || ''}
						placeholder={kst('Trading name')}
						onChange={this.handleChange}
					/>
					{this.errorMessage('company_trading_name')}
				</FormGroup>

				<FormGroup controlId="company_abn" validationState={this.getValidationState('company_abn')}>
					<ControlLabel>{kst('ABN (optional):')}</ControlLabel>
					<FormControl
						name="company_abn"
						type="text"
						value={data.company_abn || ''}
						placeholder="00000000000"
						onChange={this.handleChange}
					/>
					{this.errorMessage('company_abn')}
				</FormGroup>

				<FormGroup controlId="company_acn" validationState={this.getValidationState('company_acn')}>
					<ControlLabel>{kst('ACN (optional):')}</ControlLabel>
					<FormControl
						name="company_acn"
						type="text"
						value={data.company_acn || ''}
						placeholder={kst('ACN')}
						onChange={this.handleChange}
					/>
					{this.errorMessage('company_acn')}
				</FormGroup>

				<Address ref={ref => this.address = ref} prefix="company_" data={data}/>

				<FormGroup controlId="company_office_phone" validationState={this.getValidationState('company_office_phone')}>
					<ControlLabel>{kst('Office phone number:')}</ControlLabel>
					<FormControl
						name="company_office_phone"
						type="phone"
						value={data.company_office_phone || ''}
						placeholder={kst('Phone number')}
						onChange={this.handleChange}
					/>
					{this.errorMessage('company_office_phone')}
				</FormGroup>

				<FormGroup controlId="company_contact_phone" validationState={this.getValidationState('company_contact_phone')}>
					<ControlLabel>{kst('Contact number (mobile):')}</ControlLabel>
					<FormControl
						name="company_contact_phone"
						type="phone"
						value={data.company_contact_phone || ''}
						placeholder={kst('Phone number')}
						onChange={this.handleChange}
					/>
					{this.errorMessage('company_contact_phone')}
				</FormGroup>

				<FormGroup controlId="company_email" validationState={this.getValidationState('company_email')}>
					<ControlLabel>{kst('Email address:')}</ControlLabel>
					<FormControl
						name="company_email"
						type="email"
						value={data.company_email || ''}
						placeholder={kst('Email address')}
						onChange={this.handleChange}
					/>
					{this.errorMessage('company_email')}
				</FormGroup>
			</div>
		</form>)
	}
}

CompanyForm.propTypes = {
	company: PropTypes.object.isRequired
}

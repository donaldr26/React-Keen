import _ from 'lodash'
import Promise from 'bluebird'
import Schema from 'validate'

import React from 'react'
import PropTypes from 'prop-types'
import { FormControl, FormGroup, HelpBlock, ControlLabel } from 'react-bootstrap'

import Address from './form/Address'
import UploadButton from './UploadButton'
import Modal from './Modal'
import Cropper from './Cropper'

import LicenseForm from '../LicenseForm'
import UserInsuranceForm from '../UserInsuranceForm'

import { serviceUsers, serviceMisc } from '../../services'
import store from '../../store'

const validationFields = {
	first_name: {
		type: String,
		required: true,
		message: {
			required: 'Please enter First Name'
		},
	},
	last_name: {
		type: String,
		required: true,
		message: {
			required: 'Please enter Last Name'
		},
	},
	phone: {
		type: String,
		required: true,
		message: {
			required: 'Please enter Phone'
		},
	},
	email: {
		type: String,
		required: true,
		message: {
			required: 'Please enter Email'
		},
	},
	emergency_contact_name: {
		type: String,
		required: true,
		message: {
			required: 'Please enter Name'
		},
	},
	emergency_contact_number: {
		type: String,
		required: true,
		message: {
			required: 'Please enter Phone'
		},
	},
	photo_file_id: {
		required: true,
		message: {
			required: 'Please upload Photo'
		},
	},
	driver_license_file_id: {
		required: true,
		message: {
			required: 'Please upload Driver License photo'
		},
	},
	country: {
		type: String,
		required: true,
		message: {
			required: 'Please provide Country',
		},
	},
	address_1: {
		type: String,
		required: true,
		message: {
			required: 'Please provide Address Line 1',
		},
	},
	address_2: {
		type: String,
		message: {
			required: 'Please provide Address Line 2',
		},
	},
	state: {
		type: String,
		required: true,
		message: {
			required: 'Please provide State',
		},
	},
	suburb: {
		type: String,
		required: true,
		message: {
			type: '',
			required: 'Please provide Suburb',
		},
	},
	postcode: {
		type: String,
		required: true,
		message: {
			required: 'Please provide Postcode',
		},
	},
	leading_hand: {
		type: String,
	},
}

const Container = (props) => props.naked ?
	<div>
		{props.children}
	</div> :
	<form>
		<div className="contact-form">
			<h3>{props.title}</h3>
			{props.children}
		</div>
	</form>

export default class WorkerForm extends React.Component {
	constructor(props) {
		super(props)

		this.hasLicenses = true
		this.hasInsuranses = true
		this.hasLeadingHand = false
		this.fields = []
		this.skipValidation = []

		this.state = {
			data: {...(props.data || {})},

			qualifications: [],
			newQualification: '',
			isOtherQualification: false,

			insurances: [],
			newInsurance: '',
			isOtherInsurance: false,

			errors: {}
		}

		this.licenseForms = []
		this.newQualificationPrefix = 'new-qualification-'

		this.userInsuranceForms = []
		this.newInsurancePrefix = 'new-insurance-'

		this.files = {
			photo: {
				idField: 'photo_file_id',
				nameField: 'photo_file_name',
				uriField: 'photo_file_uri',
				type: 'user-photo',
			},
			driverLicense: {
				idField: 'driver_license_file_id',
				nameField: 'driver_license_file_name',
				uriField: 'driver_license_file_uri',
				type: 'd_license-photo',
			},
		}

		this.handleChange = this.handleChange.bind(this)
		this.onLeadingHandChange = this.onLeadingHandChange.bind(this)

		this.onNewQualificationKeyPress = this.onNewQualificationKeyPress.bind(this)
		this.onNewQualificationChange = this.onNewQualificationChange.bind(this)
		this.onAddQualification = this.onAddQualification.bind(this)
		this.onOtherQualificationChange = this.onOtherQualificationChange.bind(this)

		this.onNewInsuranceKeyPress = this.onNewInsuranceKeyPress.bind(this)
		this.onNewInsuranceChange = this.onNewInsuranceChange.bind(this)
		this.onAddInsurance = this.onAddInsurance.bind(this)
		this.onOtherInsuranceChange = this.onOtherInsuranceChange.bind(this)

		this.getValidationState = this.getValidationState.bind(this)
		this.errorMessage = this.errorMessage.bind(this)

		this.createFile = this.createFile.bind(this)
		this.onPhotoFileChange = this.onPhotoFileChange.bind(this)
		this.onDriverLicenseFileChange = this.onDriverLicenseFileChange.bind(this)
		this.onPhotoFileDelete = this.onPhotoFileDelete.bind(this)
		this.onDriverLicenseFileDelete = this.onDriverLicenseFileDelete.bind(this)
		this.onResizePopupClose = this.onResizePopupClose.bind(this)

		this.saveLicenses = this.saveLicenses.bind(this)
		this.saveInsurances = this.saveInsurances.bind(this)
	}

	isValid() {
		let valid = true
		if (this.hasInsuranses) {
			this.state.insurances.forEach(x => {
				if (this.userInsuranceForms[x.id].validateData()) {
					valid = false
				}
			})
		}
		if (this.hasLicenses) {
			this.state.qualifications.forEach(x => {
				if (this.licenseForms[x.id].validateData()) {
					valid = false
				}
			})
		}

		const rules = Object.keys(validationFields)
			.filter(x => !this.skipValidation.includes(x))
			.reduce((all, current) => Object.assign(all, { [current]: validationFields[current] }), {})

		const validationSchema = new Schema(rules)

		const result = validationSchema.validate(this.state.data)
		const errors = result.reduce((acc, x) => Object.assign(acc, { [x.path]: x.message}), {})

		if (Object.keys(errors).length) {
			valid = false
		}

		console.log('errors', errors);

		this.errors = errors

		return valid
	}

	get data() {
		return _.assign(this.state.data, this.address.data)
	}

	set data(data) {
		const qualifications = this.getAllQualifications(this.state.qualifications, data)
		this.setState({ data, qualifications })
	}

	set errors(errData) {
		const errors = errData || {}
		this.setState({ errors })
	}

	componentWillMount () {
		this.getPublicQualifications()
			.then(() => {
				if (!this.hasInsuranses) return true

				return this.getInsurances()
			})
	}

	getPublicQualifications () {
		return serviceUsers.getQualifications()
			.then(response => {
				const qualifications = this.getAllQualifications(response.qualifications, this.state.data)
				this.setState({qualifications})
			})
			.catch(err => {
				console.log(err.message, err)
				return store.layout.alert('error', 'Sorry, we can not receive the list of qualifications.')
			})
	}
	getInsurances () {
		return serviceUsers.getInsurances()
			.then(response => {
				const insurances = this.getAllInsurances(response.insurances, this.state.data)
				this.setState({insurances})
			})
			.catch(err => {
				console.log(err.message, err)
				return store.layout.alert('error', 'Sorry, we can not receive the list of insurances.')
			})
	}

	handleChange(e) {
		const field = e.target.getAttribute('name')
		const value = e.target.value

		const data = this.state.data
		data[field] = value
		this.setState({ data })
	}

	onLeadingHandChange(e) {
		const data = this.state.data
		data.leading_hand = String(e.currentTarget.value)
		this.setState({ data })
	}

	getAllQualifications (publicQualifications, savedData) {
		const savedQualifications = (savedData.licenses || []).map(x => ({
				id: x.qualification_id,
				name: x.qualification
			})).filter(y => y.id)

		return _.unionBy(publicQualifications, savedQualifications, 'id')
	}

	onNewQualificationKeyPress (e) {
		if (e.key === 'Enter') {
			this.onAddQualification(e)
		}
	}

	onNewQualificationChange (e) {
		const newQualification = e.target.value
		this.setState({newQualification})
	}

	onAddQualification (e) {
		e.preventDefault()

		if (!this.state.newQualification) return

		const newQualification = {
			id: _.uniqueId(this.newQualificationPrefix),
			name: this.state.newQualification,
			isNew: true
		}
		const qualifications = this.state.qualifications
		qualifications.push(newQualification)

		this.setState({qualifications, newQualification: '', isOtherQualification: false})
	}

	onOtherQualificationChange (e) {
		this.setState({isOtherQualification: e.target.checked})
	}

	getAllInsurances(publicInsurances, savedData) {
		const savedInsurances = (savedData.insurances || []).map(x => ({
				id: x.insurance_id,
				name: x.insurance
			})).filter(y => y.id)

		return _.unionBy(publicInsurances, savedInsurances, 'id')
	}

	onNewInsuranceKeyPress (e) {
		if (e.key === 'Enter') {
			this.onAddInsurance(e)
		}
	}

	onNewInsuranceChange (e) {
		const newInsurance = e.target.value
		this.setState({newInsurance})
	}

	onAddInsurance (e) {
		e.preventDefault()

		if (!this.state.newInsurance) return

		const newInsurance = {
			id: _.uniqueId(this.newInsurancePrefix),
			name: this.state.newInsurance,
			isNew: true
		}
		const insurances = this.state.insurances
		insurances.push(newInsurance)

		this.setState({insurances, newInsurance: '', isOtherInsurance: false})
	}

	onOtherInsuranceChange (e) {
		this.setState({isOtherInsurance: e.target.checked})
	}

	getValidationState(field) {
		if (typeof this.state.errors[field] === 'undefined') return null

		return 'error'
	}

	errorMessage(field) {
		if (typeof this.state.errors[field] === 'undefined') return null

		return <HelpBlock>{this.state.errors[field]}</HelpBlock>
	}

	saveLicenses(userId) {
		if (!this.hasLicenses) return Promise.resolve()
		return Promise.map((this.state.qualifications || []), q => this.licenseForms[q.id].save(userId))
	}

	saveInsurances(userId) {
		if (!this.hasInsuranses) return Promise.resolve()
		return Promise.map((this.state.insurances || []), q => this.userInsuranceForms[q.id].save(userId))
	}

	onPhotoFileChange(content) {
		this.setState({
			imageContent: content,
			activeFileField: 'photo',
			showResizePopup: true
		})
	}

	onDriverLicenseFileChange(content) {
		this.setState({
			imageContent: content,
			activeFileField: 'driverLicense',
			showResizePopup: true
		})
	}

	onPhotoFileDelete() {
		const data = this.state.data
		data[this.files.photo.idField] = null
		data[this.files.photo.nameField] = null
		this.setState({ data, showResizePopup: false })
	}

	onDriverLicenseFileDelete() {
		const data = this.state.data
		data[this.files.driverLicense.idField] = null
		data[this.files.driverLicense.nameField] = null
		this.setState({ data, showResizePopup: false })
	}

	onResizePopupClose() {
		const data = _.omit(this.state.data, this.state.activeFileField)
		this.refs[this.state.activeFileField].filename = ''

		this.setState({data, imageContent: '', showResizePopup: false})
	}

	createFile() {
		const activeFileField = this.state.activeFileField

		this.setState({ isLoading: true })
		const fileInfo = {
			content: this.cropper.imageContent.split(',')[1],
			filename: this.refs[activeFileField].value,
			type: this.files[activeFileField].type
		}

		return serviceMisc.createFile(fileInfo)
			.then(response => {

				const data = this.state.data
				const { idField, nameField, uriField } = this.files[activeFileField]

				data[idField] = response.file.id
				data[nameField] = response.file.name
				data[uriField] = response.file.uri

				this.refs[activeFileField].filename = response.file.name
				this.refs[activeFileField].uri = response.file.uri

				const errors = this.state.errors
				delete errors[idField]

				this.setState({
					data,
					errors,
					showResizePopup: false,
					isLoading: false
				})
			})
			.catch(err => {
				console.log(err.message, err)
				this.setState({ isLoading: false })
			})
	}

	render() {
		const { data, errors } = this.state
		const fields = this.fields
		const isReadOnly = this.props.isReadOnly || false

		const addressErrors = Object.keys(errors)
			.filter(key => this.address.fields.includes(key))
			.reduce((obj, key) => Object.assign(obj, { [key]: errors[key] }), {})

		return (<Container
				title={this.props.title || kst('Personal details:')}
				naked={this.props.naked}>
			{
				fields.indexOf('first_name') === -1
				|| <FormGroup controlId="first_name" validationState={this.getValidationState('first_name')}>
					<ControlLabel>{kst('First name:')}</ControlLabel>
					<FormControl
						name="first_name"
						type="text"
						value={data.first_name || ''}
						placeholder={kst('First name')}
						onChange={this.handleChange}
						readOnly={isReadOnly}
					/>
					{this.errorMessage('first_name')}
				</FormGroup>
			}
			{
				fields.indexOf('last_name') === -1
				|| <FormGroup controlId="last_name" validationState={this.getValidationState('last_name')}>
					<ControlLabel>{kst('Last name:')}</ControlLabel>
					<FormControl
						name="last_name"
						type="text"
						value={data.last_name || ''}
						placeholder={kst('Last name')}
						onChange={this.handleChange}
						readOnly={isReadOnly}
					/>
					{this.errorMessage('last_name')}
				</FormGroup>
			}

			{
				fields.indexOf('contact_number') === -1
				|| <FormGroup controlId="email" validationState={this.getValidationState('contact_number')}>
					<ControlLabel>Contact number:</ControlLabel>
					<FormControl
						name="contact_number"
						type="contact_number"
						value={data.contact_number || ''}
						placeholder=""
						onChange={this.handleChange}
						readOnly={isReadOnly}
					/>
					{this.errorMessage('email')}
				</FormGroup>
			}

			{
				fields.indexOf('email') === -1
				|| <FormGroup controlId="email" validationState={this.getValidationState('email')}>
					<ControlLabel>{kst('Email:')}</ControlLabel>
					<FormControl
						name="email"
						type="email"
						value={data.email || ''}
						placeholder="staffname@domain.com"
						onChange={this.handleChange}
						readOnly={isReadOnly}
					/>
					{this.errorMessage('email')}
				</FormGroup>
			}

			{
				fields.indexOf('address') === -1
				|| <Address ref={ref => this.address = ref} prefix="" data={data} readOnly={isReadOnly} errors={addressErrors}/>
			}
			{
				fields.indexOf('phone') === -1
				|| <FormGroup controlId="phone" validationState={this.getValidationState('phone')}>
					<ControlLabel>{kst('Phone number:')}</ControlLabel>
					<FormControl
						name="phone"
						type="phone"
						value={data.phone || ''}
						placeholder={kst('Phone number')}
						onChange={this.handleChange}
						readOnly={isReadOnly}
					/>
					{this.errorMessage('phone')}
				</FormGroup>
			}

			{
				fields.indexOf('emergency_contact_name') === -1
				|| <FormGroup controlId="emergency_contact_name" validationState={this.getValidationState('emergency_contact_name')}>
					<ControlLabel>{kst('Emergency contact name:')}</ControlLabel>
					<FormControl
						name="emergency_contact_name"
						type="text"
						value={data.emergency_contact_name || ''}
						placeholder={kst('Contact Name')}
						onChange={this.handleChange}
						readOnly={isReadOnly}
					/>
					{this.errorMessage('emergency_contact_name')}
				</FormGroup>
			}
			{
				fields.indexOf('emergency_contact_number') === -1
				|| <FormGroup controlId="emergency_contact_number" validationState={this.getValidationState('emergency_contact_number')}>
					<ControlLabel>{kst('Emergency contact number:')}</ControlLabel>
					<FormControl
						name="emergency_contact_number"
						type="phone"
						value={data.emergency_contact_number || ''}
						placeholder={kst('Phone number')}
						onChange={this.handleChange}
						readOnly={isReadOnly}
					/>
					{this.errorMessage('emergency_contact_number')}
				</FormGroup>
			}
			{
				fields.indexOf('abn') === -1
				|| <FormGroup controlId="abn" validationState={this.getValidationState('abn')}>
					<ControlLabel>ABN:</ControlLabel>
					<FormControl
						name="abn"
						type="text"
						value={data.abn || ''}
						placeholder=""
						onChange={this.handleChange}
						readOnly={isReadOnly}
					/>
				{this.errorMessage('abn')}
				</FormGroup>
			}
			{
				fields.indexOf('photo') === -1
				|| <FormGroup validationState={this.getValidationState(this.files.photo.idField)}>
					<ControlLabel>{kst('Photo of employee:')}</ControlLabel>
					<UploadButton
						htmlId="photo"
						ref="photo"
						title="Upload Photo"
						value={data[this.files.photo.nameField] || ''}
						uri={data[this.files.photo.uriField] || ''}
						onClear={this.onPhotoFileDelete}
						onChange={this.onPhotoFileChange}
					/>
					{this.errorMessage(this.files.photo.idField)}
				</FormGroup>
			}
			{
				fields.indexOf('driver_license') === -1
				|| <FormGroup validationState={this.getValidationState(this.files.driverLicense.idField)}>
					<ControlLabel>{kst('Photographic ID (Driver License):')}</ControlLabel>
					<UploadButton
						htmlId="driverLicense"
						ref="driverLicense"
						title="Upload Photographic ID"
						value={data[this.files.driverLicense.nameField] || ''}
						uri={data[this.files.driverLicense.uriField] || ''}
						onClear={this.onDriverLicenseFileDelete}
						onChange={this.onDriverLicenseFileChange}
					/>
					{this.errorMessage(this.files.driverLicense.idField)}
				</FormGroup>
			}

			{
				!this.hasLicenses
				|| <div className="sub-form">
				<ControlLabel>{kst('Qualifications:')}</ControlLabel>
				{
					(this.state.qualifications).map((q, i) =>
						<LicenseForm
							key={q.id}
							ref={ref => this.licenseForms[q.id] = ref}
							license={_.find(data.licenses, l => l.qualification_id === q.id) || {}}
							qualification={q}
						/>
				)}
				<FormGroup className="checkbox labl-stac">
					<input
						type="checkbox"
						id="qualificationOther"
						checked={this.state.isOtherQualification}
						onChange={this.onOtherQualificationChange}
					/>
					<label className='labl-chec' htmlFor="qualificationOther">{kst('Other')}</label>
				</FormGroup>
				{ this.state.isOtherQualification &&
					<div>
						<FormControl
							value={this.state.newQualification}
							type="text"
							placeholder="License name/description"
							className="text-chek"
							onKeyPress={this.onNewQualificationKeyPress}
							onChange={this.onNewQualificationChange}
						/>
						<a className="add-link" onClick={this.onAddQualification}>ADD</a>
					</div>
				}
				</div>
			}
			{
				!this.hasInsuranses
				|| <div className="sub-form">
				<ControlLabel>{kst('Insurances (optional):')}</ControlLabel>
				{
					(this.state.insurances || []).map((q, i) =>
						<UserInsuranceForm
							key={q.id}
							ref={ref => this.userInsuranceForms[q.id] = ref}
							user_insurance={_.find(data.insurances, ui => ui.insurance_id === q.id) || {}}
							insurance={q}
						/>
				)}
				<FormGroup className="checkbox labl-stac">
					<input
						type="checkbox"
						id="insuranceOther"
						checked={this.state.isOtherInsurance}
						onChange={this.onOtherInsuranceChange}
					/>
					<label className='labl-chec' htmlFor="insuranceOther">{kst('Other')}</label>
				</FormGroup>
				{ this.state.isOtherInsurance &&
					<div>
						<FormControl
							value={this.state.newInsurance}
							type="text"
							placeholder={kst('Insurance name/description')}
							className="inline-block text-chek"
							onKeyPress={this.onNewInsuranceKeyPress}
							onChange={this.onNewInsuranceChange}
						/>
					<a className="add-link" onClick={this.onAddInsurance}>{kst('ADD')}</a>
					</div>
				}
				</div>
			}
			{
				this.hasLeadingHand &&
				<FormGroup className="m_top_20 rad-job" validationState={this.getValidationState('leading_hand')}>
					<p className="radio-tt">{kst('Is this employee a Leading Hand?')}</p>
					<div className="radio-wrapp">
						<input
							type="radio"
							name="yn"
							onChange={this.onLeadingHandChange}
							value="1"
							checked={Number(data.leading_hand)}
							id="radio-1"
						/>
						<label className="radio-label" htmlFor="radio-1">{kst('Yes')}</label>
						<input
							type="radio"
							name="yn"
							onChange={this.onLeadingHandChange}
							value="0"
							checked={!Number(data.leading_hand)}
							id="radio-2"
						/>
						<label className="radio-label" htmlFor="radio-2">{kst('No')}</label>
					</div>
					{this.errorMessage('leading_hand')}
				</FormGroup>
			}

			<Modal
				isVisible={this.state.showResizePopup}
				title="Image crop"
				onClose={this.onResizePopupClose}>
				<Cropper src={this.state.imageContent} ref={ref => this.cropper = ref}/>
				<div className="margin_20_0 text-right">
					<button
						className="btn-s party-btn1 bgyellow"
						disabled={this.state.isLoading}
						onClick={this.createFile}
					>
						{this.state.isLoading ? 'Uploading' : 'Save'}
					</button>
				</div>
			</Modal>
		</Container>)
	}
}

WorkerForm.propTypes = {
	data: PropTypes.object.isRequired
}

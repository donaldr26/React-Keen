import _ from 'lodash'
import moment from 'moment'
import Schema from 'validate'

import React from 'react'
import PropTypes from 'prop-types'
import { FormGroup, HelpBlock, ControlLabel } from 'react-bootstrap'

import UploadButton from './core/UploadButton'
import Cropper from './core/Cropper'
import DateTimePicker from './core/DateTimePicker'
import Modal from './core/Modal'

import serviceUsers from '../services/users'
import serviceMisc from '../services/misc'

const validationSchema = new Schema({
	id: {
		// type: Number,
		required: false
	},
	photo_file_id: {
		type: Number,
		required: true,
		message: {
			type: 'Wrong file ID format',
			required: 'Please upload License photo'
		},
	},
	expire_date: {
		type: String,
		match: /^[0-9]{4}\-[0-9]{2}\-[0-9]{2}$/,
		// required: true,
		message: {
			type: 'Wrong file Date format',
			match: 'Wrong file Date format',
			required: 'Please specify License expiration date'
		},
	}
})

export default class LicenseForm extends React.Component {
	constructor(props) {
		super(props)

		const license = props.license || {}
		const qualification = props.qualification || {}
		const method = _.isEmpty(license) ? 'create' : 'update'

		this.state = {
			isLoading: false,
			method,
			data: license,
			errors: {},
			qualification,
			isSelected: !_.isEmpty(license) || qualification.isNew || false,
			hasChanges: false,
			showResizePopup: false
		}

		this.initialMethod = method
		this.dateFormat = 'MMM DD, YYYY'

		this.handleChange = this.handleChange.bind(this)
		this.onExpirationDateChange = this.onExpirationDateChange.bind(this)
		this.onQualificationChange = this.onQualificationChange.bind(this)
		this.onResizePopupClose = this.onResizePopupClose.bind(this)
		this.getValidationState = this.getValidationState.bind(this)
		this.errorMessage = this.errorMessage.bind(this)

		this.save = this.save.bind(this)
		this.delete = this.delete.bind(this)

		this.createFile = this.createFile.bind(this)
	}

	componentWillReceiveProps (nextProps) {
		if (this.state.hasChanges) return
		if (_.isEmpty(nextProps.license)) return

		const data = nextProps.license || {}
		const qualification = nextProps.qualification || {}
		const method = _.isEmpty(data) ? 'create' : 'update'

		this.initialMethod = method
		this.setState({
			data,
			qualification,
			isSelected: this.state.isSelected || !_.isEmpty(data) || qualification.isNew || false
		})
	}

	validateData() {
		if (!this.state.hasChanges) return

		const result = validationSchema.validate(this.state.data)
		const errors = result.reduce((acc, x) => Object.assign(acc, { [x.path]: x.message }), {})

		this.setState({ errors })

		return Object.keys(errors).length
	}

	delete() {
		const data = this.state.data
		delete data.photo_file_id
		delete data.file_name
		delete data.file_uri

		const method = this.getMethod(false)
		const hasChanges = method !== this.initialMethod

		this.setState({ data, method, hasChanges: true })
	}

	save(userId) {
		if (!this.state.hasChanges) return true

		this.setState({ isLoading: true })

		const fields = ['photo_file_id', 'expire_date']
		const sendData = _.pick(this.state.data, fields)

		if (this.state.qualification.isNew) {
			sendData.qualification = this.state.qualification.name
		} else {
			sendData.qualification_id = this.state.qualification.id
		}

		return Promise.resolve()
			.then(() => {
				if (this.state.method === 'create') return serviceUsers.createLicense(userId, sendData)
				if (this.state.method === 'update') return serviceUsers.updateLicense(userId, this.state.data.id, sendData)
				if (this.state.method === 'delete') return serviceUsers.deleteLicense(userId, this.state.data.id)
				throw new Error('Unexpected method')
			})
			.then(response => {
				this.initialMethod = this.state.method
				const data = this.state.data

				if (this.state.method === 'create') {
					this.initialMethod = 'update'
					data.id = response.license.id
				}
				this.setState({
					data,
					isLoading: false,
					method: this.initialMethod,
					hasChanges: false,
					errors: {}
				})

				return response.license
			})
			.catch(err => {
				console.log(err.message, err)
				this.setState({ isLoading: false, errors: err.errors })

				throw new Error(err.message)
			})
	}

	get data() {
		return this.state.data
	}

	handleChange(e) {
		const field = e.target.getAttribute('name')
		const value = e.target.value

		const data = this.state.data
		data[field] = value
		this.setState({ data, hasChanges: true })
	}

	onExpirationDateChange (dateTime) {
		const data = this.state.data

		data.expire_date = ''
		if (dateTime instanceof moment) {
			data.expire_date = dateTime.format('YYYY-MM-DD')
		}

		const errors = this.state.errors
		delete errors.expire_date

		this.setState({ data, errors, hasChanges: true })
	}

	getFormattedDate (date) {
		if (!date) return null

		return moment(date).format(`${this.dateFormat}`)
	}

	onQualificationChange (e) {
		const isSelected = e.target.checked
		const method = this.getMethod(!isSelected)
		const hasChanges = isSelected && method === 'create' || method !== this.initialMethod

		this.setState({ isSelected, hasChanges, method })
	}

	getMethod (needDelete) {
		const hasInitialLicense = this.initialMethod === 'update'

		if (hasInitialLicense) {
			return needDelete ? 'delete' : 'update'
		}

		return this.initialMethod
	}

	onResizePopupClose () {
		const fields = ['photo_file_id', 'file_mime', 'file_name', 'file_uri']
		const data = _.omit(this.state.data, fields)
		this.refs.photo_file.filename = ''

		this.setState({ data, imageContent: '', showResizePopup: false })
	}

	getValidationState(field) {
		if (typeof this.state.errors[field] === 'undefined') return null

		return 'error'
	}

	errorMessage(field) {
		if (typeof this.state.errors[field] === 'undefined') return null

		return <HelpBlock>{this.state.errors[field]}</HelpBlock>
	}

	createFile(content) {
		this.setState({ isLoading: true })
		const fileInfo = {
			content: content || this.cropper.imageContent.split(',')[1],
			filename: this.refs.photo_file.value,
			type: 'license-photo'
		}

		return serviceMisc.createFile(fileInfo)
			.then(response => {

				const data = this.state.data
				data.photo_file_id = Number(response.file.id)
				data.file_mime = response.file.mime
				data.file_name = response.file.name
				data.file_uri = response.file.uri

				this.refs.photo_file.filename = response.file.name

				const errors = this.state.errors
				delete errors.photo_file_id

				this.setState({
					data,
					errors,
					hasChanges: true,
					showResizePopup: false,
					isLoading: false
				})
			})
			.catch(err => {
				console.log(err.message, err)
				this.setState({ isLoading: false })
			})
	}

	onFileUpload(content) {
		const [head, body] = content.split(',')
		if (head.includes('application/pdf')) {
			this.createFile(body)
		} else {
			this.setState({ imageContent: content, showResizePopup: true })
		}
	}

	render() {
		const qualification = this.state.qualification
		const data = this.state.data

		return (<div>
			<Modal
				isVisible={this.state.showResizePopup}
				title="Image crop"
				onClose={this.onResizePopupClose}>
				<Cropper src={this.state.imageContent} ref={ref => this.cropper = ref}/>
				<div className="margin_20_0 text-right">
					<button
						className="btn-s party-btn1 bgyellow"
						disabled={this.state.isLoading}
						onClick={e => this.createFile()}
					>
						{this.state.isLoading ? 'Uploading' : 'Save'}
					</button>
				</div>
			</Modal>
			<FormGroup className="checkbox labl-stac">
				<input
					type="checkbox"
					id={`qualification-${qualification.id}`}
					checked={this.state.isSelected}
					onChange={this.onQualificationChange}
				/>
				<label
					className="labl-chec"
					htmlFor={`qualification-${qualification.id}`}>
					{qualification.name}
				</label>
			</FormGroup>
			{this.state.isSelected &&
				<div className="form-groups-indented">
					<FormGroup controlId="photo_file" validationState={this.getValidationState('photo_file_id')}>
						<UploadButton
							htmlId={`photo_file-license-${qualification.id}`}
							ref="photo_file"
							disabled={this.state.isLoading}
							title={this.state.isLoading ? 'Uploading' : 'Upload an Image'}
							value={data.file_name}
							uri={data.file_uri}
							mime={data.file_mime}
							onClear={this.delete}
							onChange={this.onFileUpload.bind(this)}
						/>
						{this.errorMessage('photo_file_id')}
					</FormGroup>
					{ qualification.name === "White Card" ? "" :
						<FormGroup controlId="expire_date" validationState={this.getValidationState('expire_date')}>
							<ControlLabel>Expire date:</ControlLabel>
							<DateTimePicker
								value={this.getFormattedDate(data.expire_date)}
								dateFormat={this.dateFormat}
								timeFormat={false}
								onChange={this.onExpirationDateChange}
							/>
							{this.errorMessage('expire_date')}
						</FormGroup>
					}
				</div>
			}
		</div>)
	}
}

LicenseForm.propTypes = {
	license: PropTypes.object.isRequired,
	qualification: PropTypes.object.isRequired,
	value: PropTypes.string
}

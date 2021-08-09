import _ from 'lodash'
import Schema from 'validate'

import React from 'react'
import PropTypes from 'prop-types'
import { FormControl, FormGroup, HelpBlock, ControlLabel, Row, Col } from 'react-bootstrap'

import UploadButton from './core/UploadButton'
import Cropper from './core/Cropper'
import Modal from './core/Modal'

import store from '../store'
import serviceUsers from '../services/users'
import serviceMisc from '../services/misc'

const validationSchema = new Schema({
	photo_file_id: {
		required: true,
		message: {
			required: 'Please upload License photo'
		},
	},
})

export default class UserInsuranceForm extends React.Component {
	constructor(props) {
		super(props)

		const user_insurance = props.user_insurance || {}
		const insurance = props.insurance || {}
		const method = _.isEmpty(user_insurance) ? 'create' : 'update'

		this.state = {
			isLoading: false,
			method: method,
			data: user_insurance,
			errors: {},
			insurance: insurance,
			isSelected: !_.isEmpty(user_insurance) || insurance.isNew || false,
			hasChanges: false,
			showResizePopup: false
		}

		this.initialMethod = method

		this.handleChange = this.handleChange.bind(this)
		this.onInsuranceChange = this.onInsuranceChange.bind(this)
		this.onResizePopupClose = this.onResizePopupClose.bind(this)
		this.getValidationState = this.getValidationState.bind(this)
		this.errorMessage = this.errorMessage.bind(this)

		this.save = this.save.bind(this)
		this.delete = this.delete.bind(this)

		this.createFile = this.createFile.bind(this)
	}

	componentWillReceiveProps (nextProps) {
		if (this.state.hasChanges) return

		const data = nextProps.user_insurance || {}
		const insurance = nextProps.insurance || {}
		const method = _.isEmpty(data) ? 'create' : 'update'

		this.initialMethod = method
		this.setState({
			data,
			insurance,
			isSelected: this.state.isSelected || !_.isEmpty(data) || insurance.isNew || false
		})
	}

	validateData() {
		if (!this.state.hasChanges) return

		const result = validationSchema.validate(this.state.data)
		const errors = result.reduce((acc, x) => Object.assign(acc, { [x.path]: x.message}), {})

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

		const fields = ['photo_file_id']
		const sendData = _.pick(this.state.data, fields)

		if (this.state.insurance.isNew) {
			sendData.insurance = this.state.insurance.name
		} else {
			sendData.insurance_id = this.state.insurance.id
		}

		return Promise.resolve()
			.then(() => {
				if (this.state.method === 'create') return serviceUsers.createUserInsurance(userId, sendData)
				if (this.state.method === 'update') return serviceUsers.updateUserInsurance(userId, this.state.data.id, sendData)
				if (this.state.method === 'delete') return serviceUsers.deleteUserInsurance(userId, this.state.data.id)
				throw new Error('Unexpected method')
			})
			.then(response => {
				this.initialMethod = this.state.method
				const data = this.state.data

				if (this.state.method === 'create') {
					this.initialMethod = 'update'
					data.id = response.insurance.id
				}
				this.setState({
					data,
					isLoading: false,
					method: this.initialMethod,
					hasChanges: false,
					errors: {}
				})

				return response.insurance
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

	onInsuranceChange (e) {
		const isSelected = e.target.checked
		const method = this.getMethod(!isSelected)
		const hasChanges = isSelected && method === 'create' || method !== this.initialMethod

		this.setState({isSelected, hasChanges, method})
	}

	getMethod (needDelete) {
		const hasInitialUserInsurance = this.initialMethod === 'update'

		if (hasInitialUserInsurance) {
			return needDelete ? 'delete' : 'update'
		}

		return this.initialMethod
	}

	onResizePopupClose () {
		const fields = ['photo_file_id', 'file_mime', 'file_name', 'file_uri']
		const data = _.omit(this.state.data, fields)
		this.refs.photo_file.filename = ''

		this.setState({data, imageContent: '', showResizePopup: false})
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
			type: 'insurance-photo'
		}

		return serviceMisc.createFile(fileInfo)
			.then(response => {

				const data = this.state.data
				data.photo_file_id = response.file.id
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
		const insurance = this.state.insurance
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
					id={`insurance-${insurance.id}`}
					checked={this.state.isSelected}
					onChange={this.onInsuranceChange}
				/>
				<label className='labl-chec' htmlFor={`insurance-${insurance.id}`}>{insurance.name}</label>
			</FormGroup>
			{this.state.isSelected &&
				<div>
					<FormGroup controlId="photo_file_insurance" validationState={this.getValidationState('photo_file_id')}>
						<UploadButton
							htmlId={`photo_file-insurance-${insurance.id}`}
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
				</div>
			}
		</div>)
	}
}

UserInsuranceForm.propTypes = {
	user_insurance: PropTypes.object.isRequired,
	insurance: PropTypes.object.isRequired,
	value: PropTypes.string
}

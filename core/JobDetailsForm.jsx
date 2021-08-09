import React from 'react'
import PropTypes from 'prop-types'
import { Alert, FormControl, FormGroup, HelpBlock, ControlLabel } from 'react-bootstrap'
import _ from 'lodash'
import moment from 'moment'

import Address from './form/Address'
import DateTimePicker from './DateTimePicker'
import UploadButton from '../core/UploadButton'
import { serviceJobs, serviceMisc } from '../../services'
import store from '../../store'

const Container = (props) => props.naked ?
	<div>
		{props.children}
	</div> :
	<form>
		<div className="width_720 contact-form job-contact">
			<h3>{props.title}</h3>
			{props.children}
		</div>
	</form>

export default class JobDetailsForm extends React.Component {
	constructor(props) {
		super(props)

		this.state = {
			jobTypes: [],
			selectedJobTypes: _.keyBy(props.data.types, 'id'),
			newJobType: '',
			data: props.data || {},
			isUploading: false,
			errors: {}
		}

		this.newJobPrefix = 'new-job-'
		this.dateFormat = 'MMM DD, YYYY'
		this.timeFormat = 'h:mm a'

		const tomorrow = moment().add(1, 'days')
		this.defaultStartDate = tomorrow.format('YYYY-MM-DD 06:00:00')
		this.defaultEndDate = tomorrow.format('YYYY-MM-DD 17:00:00')

		this.handleChange = this.handleChange.bind(this)
		this.errorMessage = this.errorMessage.bind(this)
		this.onJobTypeChange = this.onJobTypeChange.bind(this)
		this.onStartChange = this.onStartChange.bind(this)
		this.onEndChange = this.onEndChange.bind(this)
		this.onNewTypeKeyPress = this.onNewTypeKeyPress.bind(this)
		this.onNewTypeChange = this.onNewTypeChange.bind(this)
		this.onAddJobType = this.onAddJobType.bind(this)

		this.onFileChange = this.onFileChange.bind(this)
		this.onFileSWMSChange = this.onFileSWMSChange.bind(this)
		this.onFileDelete = this.onFileDelete.bind(this)
	}

	get isUploading() {
		return this.state.isUploading
	}

	get data() {
		const jobTypes = _.map(this.state.selectedJobTypes, type => type.isNew ? type.name : type.id)

		return {
			...this.state.data,
			...this.address.data,
			job_type: jobTypes
		}
	}

	set data(data) {
		const selectedJobTypes = _.keyBy(data.types, 'id')
		const jobTypes = _.unionBy(this.state.jobTypes, (data.types || []).filter(x => x.id), 'id')
		if (!data.start_date) data.start_date = this.defaultStartDate
		if (!data.end_date) data.end_date = this.defaultEndDate
		this.setState({ data, selectedJobTypes, jobTypes })
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

	componentWillMount () {
		this.getPublicJobTypes()
	}

	getPublicJobTypes () {
		return serviceJobs.getJobTypes('public')
			.then(response => {
				const jobTypes = _.unionBy(response.job_types, (this.state.data.types || []).filter(x => x.id), 'id')
				this.setState({ jobTypes })
			})
			.catch(err => {
				console.error(err)

				return store.layout.alert('error', 'Sorry, we can not receive the list of job types.')
			})
	}

	handleChange(e) {
		const field = e.target.getAttribute('name')
		const value = e.target.value

		const data = this.state.data
		data[field] = value

		const errors = this.state.errors
		delete errors[field]

		this.setState({ data, errors })
	}

	onStartChange (dateTime) {
		this.onDateChange(dateTime, 'start_date')
	}

	onEndChange (dateTime) {
		this.onDateChange(dateTime, 'end_date')
	}

	onDateChange (dateTime, field) {
		if (!(dateTime instanceof moment)) return

		const data = this.state.data
		data[field] = moment(dateTime).format('YYYY-MM-DD HH:mm:ss')

		const errors = this.state.errors
		delete errors[field]

		this.setState({ data, errors })
	}

	getFormattedDate (date) {
		if (!date) return null

		return moment(date).format(`${this.dateFormat} ${this.timeFormat}`)
	}

	onNewTypeKeyPress (e) {
		if (e.key === 'Enter') {
			this.onAddJobType(e)
		}
	}

	onNewTypeChange (e) {
		const newJobType = e.target.value
		this.setState({ newJobType })
	}

	onAddJobType (e) {
		e.preventDefault()

		if (!this.state.newJobType) return

		const newJobType = {
			id: _.uniqueId(this.newJobPrefix),
			name: this.state.newJobType,
			isNew: true
		}
		const jobTypes = this.state.jobTypes
		jobTypes.push(newJobType)

		const selectedJobTypes = this.state.selectedJobTypes
		selectedJobTypes[newJobType.id] = newJobType

		this.setState({jobTypes, selectedJobTypes, newJobType: ''})
	}

	onJobTypeChange (e) {
		const selectedJobTypes = this.state.selectedJobTypes
		const id = e.target.getAttribute('id')

		if (e.target.checked) {
			const type = this.state.jobTypes.find(x => x.id === id)
			selectedJobTypes[id] = type
		} else {
			delete selectedJobTypes[id]
		}

		const errors = this.state.errors
		delete errors.job_type

		this.setState({
			selectedJobTypes,
			errors
		})
	}

	errorMessage(field) {
		if (typeof this.state.errors[field] === 'undefined') return null

		return <HelpBlock>{this.state.errors[field]}</HelpBlock>
	}

	onFileChange(content) {
		this.setState({ isUploading: true })
		if (typeof this.props.onReadyChange === 'function') {
			this.props.onReadyChange(false)
		}

		const fileInfo = {
			content: content.split(',')[1],
			filename: this.scopeFileButton.value,
			type: 'job-scope'
		}

		return serviceMisc.createFile(fileInfo)
			.then(response => {

				const data = this.state.data

				data.scope_file_id = response.file.id
				data.scope_file_name = response.file.name
				data.scope_file_uri = response.file.uri

				this.scopeFileButton.filename = response.file.name
				this.scopeFileButton.uri = response.file.uri

				const errors = this.state.errors
				delete errors.scopeFile

				this.setState({
					data,
					errors,
					isUploading: false
				})
				this.props.onReadyChange(true)
			})
			.catch(err => {
				console.log(err.message, err)
				this.setState({ isUploading: false })
				this.props.onReadyChange(true)
			})
	}

	onFileSWMSChange(content) {
		this.setState({ isUploading: true })
		if (typeof this.props.onReadyChange === 'function') {
			this.props.onReadyChange(false)
		}

		const fileInfo = {
			content: content.split(',')[1],
			filename: this.scopeFileSWMSButton.value,
			type: 'job-scope'
		}

		return serviceMisc.createFile(fileInfo)
			.then(response => {

				const data = this.state.data

				data.swms_file_id = response.file.id
				data.swms_file_name = response.file.name
				data.swms_file_uri = response.file.uri

				this.scopeFileSWMSButton.filename = response.file.name
				this.scopeFileSWMSButton.uri = response.file.uri

				const errors = this.state.errors
				delete errors.scopeFileSWMS

				this.setState({
					data,
					errors,
					isUploading: false
				})
				this.props.onReadyChange(true)
			})
			.catch(err => {
				console.log(err.message, err)
				this.setState({ isUploading: false })
				this.props.onReadyChange(true)
			})
	}

	onFileDelete() {
		console.log('Delete file')

		const data = this.state.data
		data.scope_file_id = null
		data.scope_file_name = null
		data.scope_file_uri = null

		this.setState({ data })
	}

	render() {
		const { data } = this.state

		return <Container
			title={this.props.title || 'Job information:'}
			naked={this.props.naked}
		>
			<div className="job-contact-content">
				{
					// !this.state.errors['job_id'] || <Alert bsStyle="danger">{this.state.errors['job_id']}</Alert>
				}
				<FormGroup validationState={this.state.errors.start_date && 'error'}>
					<ControlLabel>Start date and time:</ControlLabel>
					<DateTimePicker
						value={this.getFormattedDate(data.start_date)}
						dateFormat={this.dateFormat}
						timeFormat={this.timeFormat}
						onChange={this.onStartChange}
						timeConstraints={{ minutes: { step: 15 } }}
					/>
					{this.errorMessage('start_date')}
				</FormGroup>

				<FormGroup validationState={this.state.errors.end_date && 'error'}>
					<ControlLabel>Finish date:</ControlLabel>
					<DateTimePicker
						value={this.getFormattedDate(data.end_date)}
						dateFormat={this.dateFormat}
						timeFormat={this.timeFormat}
						onChange={this.onEndChange}
						timeConstraints={{ minutes: { step: 15 } }}
					/>
					{this.errorMessage('end_date')}
				</FormGroup>

				<Address
					ref={ref => this.address = ref}
					prefix="site_"
					errors={this.state.errors}
					data={data}
					title="Site address"
				/>

				<FormGroup validationState={this.state.errors.preapproved_limit && 'error'}>
					<ControlLabel>Pre-approved value of work threshold (optional):</ControlLabel>
					<FormControl
						name="preapproved_limit"
						type="text"
						value={data.preapproved_limit || ''}
						placeholder="Limit"
						onChange={this.handleChange}
					/>
					{this.errorMessage('preapproved_limit')}
				</FormGroup>

				<FormGroup validationState={this.state.errors.workorder_number && 'error'}>
					<ControlLabel>Work order number:</ControlLabel>
					<FormControl
						name="workorder_number"
						type="text"
						value={data.workorder_number || ''}
						placeholder="Number"
						onChange={this.handleChange}
					/>
					{this.errorMessage('workorder_number')}
				</FormGroup>

				<FormGroup validationState={this.state.errors.scope_of_works && 'error'}>
					<ControlLabel>Scope of works:</ControlLabel>
					<FormControl
						name="scope_of_works"
						componentClass="textarea"
						rows="5"
						value={data.scope_of_works || ''}
						onChange={this.handleChange}
					/>
					{this.errorMessage('scope_of_works')}
					<UploadButton
						allow={['docs', 'images']}
						htmlId="scopeFile"
						title="Upload File"
						ref={ref => this.scopeFileButton = ref}
						value={data.scope_file_name || ''}
						uri={data.scope_file_uri || ''}
						onClear={this.onFileDelete}
						onChange={this.onFileChange}
					/>
				</FormGroup>
				<FormGroup
					className="checkbox labl-stac"
					validationState={this.state.errors.job_type && 'error'}>
					<p>Description of works (select all that apply):</p>
					{this.errorMessage('job_type')}
				</FormGroup>

				<FormGroup
					className="checkbox labl-stac"
					validationState={this.state.errors.job_type && 'error'}>
					{this.state.jobTypes.map((type, index) =>
						<div key={index}>
							<input
								type="checkbox"
								checked={Boolean(this.state.selectedJobTypes[type.id])}
								id={type.id}
								onChange={this.onJobTypeChange.bind(type.id)}
							/>
							<label className='labl-chec' htmlFor={type.id}>
								{type.name.charAt(0).toUpperCase() + type.name.slice(1)}
							</label>
						</div>
					)}

					<FormControl
						value={this.state.newJobType}
						type="text"
						placeholder="Other description of works"
						className="inline-block text-chek"
						onKeyPress={this.onNewTypeKeyPress}
						onChange={this.onNewTypeChange}
					/>
					<a className="add-link" onClick={this.onAddJobType}>ADD</a>
				</FormGroup>
			</div>
		</Container>
	}
}

JobDetailsForm.propTypes = {
	data: PropTypes.object.isRequired
}

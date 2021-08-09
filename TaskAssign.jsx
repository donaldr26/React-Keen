import React from 'react'
import PropTypes from 'prop-types'
import { FormControl, FormGroup, ControlLabel, HelpBlock } from 'react-bootstrap'

import serviceUsers from '../services/users'
import serviceJobs from '../services/jobs'

export default class TaskAssign extends React.Component {
	constructor(props) {
		super(props)

		this.state = {
			isLoading: false,
			employees: [],
			errors: {}
		}

		this.getValidationState = this.getValidationState.bind(this)
		this.errorMessage = this.errorMessage.bind(this)
	}

	componentWillMount() {
		this.setState({ isLoading: true })

		return serviceUsers.getStaff()
			.then(response => {
				this.setState({ employees: response.staff, isLoading: false })
			})
			.catch(err => {
				this.setState({ employees: [], isLoading: false })
				console.log(err.message, err)
			})
	}

	onCancel() {
		if (typeof this.props.onCancel === 'function') {
			this.props.onCancel()
		}
	}

	assign(e) {
		if (e) e.preventDefault()

		const data = {
			assignee_user_id: this.employee.value,
			priority: this.priority,
			assign_text: this.assignText.value
		}

		return serviceJobs.assignTask(this.props.task.id, data)
			.then(response => {
				if (typeof this.props.onSuccess === 'function') {
					this.props.onSuccess(response.task)
				}
			})
			.catch(err => {
				console.log('ERROR', err.errors)
				this.setState({ errors: err.errors, isLoading: false })
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

	render() {
		const priorities = {
			urgent: 'Urgent - requires immediate action',
			high: 'High - as soon as possible',
			moderate: 'Moderate',
			low: 'Low',
			none: 'Very low'
		}

		return (<div className="modal-s">
			<div className="content">
				<h4 className="font-bolder">{kst('Quick assign to employee:')}</h4>
				<FormGroup validationState={this.getValidationState('assignee_user_id')}>
					<ControlLabel>{kst('Select employee:')}</ControlLabel>
					<FormControl componentClass="select" placeholder={kst('Staff Name')} inputRef={ref => this.employee = ref}>
						<option checked>{kst('Please select employee')}</option>
						{
							(this.state.employees || []).map(x =>
								<option key={x.id} value={x.id}>{[x.first_name, x.last_name].join(' ')}</option>
							)
						}
					</FormControl>
					{this.errorMessage('assignee_user_id')}
				</FormGroup>
				<FormGroup validationState={this.getValidationState('priority')}>
					<ControlLabel>{kst('Job priority:')}</ControlLabel>
					{
						Object.keys(priorities).map(x => <div key={x}>
							<input type="radio" name="priority" id={`priority-${x}`} onChange={() => this.priority = x} />
							<label className="radio-label" htmlFor={`priority-${x}`}>{priorities[x]}</label>
						</div>)
					}
					{this.errorMessage('priority')}
				</FormGroup>
				<FormGroup>
					<ControlLabel>{kst('Details of work required:')}</ControlLabel>
					<br />
					<div className="text f_size_13">{this.props.task.issue_text}</div>
				</FormGroup>
				<FormGroup controlId="formControlsTextarea" validationState={this.getValidationState('assign_text')}>
					<ControlLabel>{kst('Additional job instructions:')}</ControlLabel>
					<FormControl componentClass="textarea" inputRef={ref => this.assignText = ref} />
					{this.errorMessage('assign_text')}
				</FormGroup>
				<button className="btn-s sm bggray" onClick={this.onCancel.bind(this)}>{kst('Cancel')}</button>
				<button className="btn-s sm bgyellow pull-right" onClick={this.assign.bind(this)}>{kst('Assign')}</button>
			</div>
		</div>)
	}
}

TaskAssign.propTypes = {
	task: PropTypes.object.isRequired,
	onCancel: PropTypes.func.isRequired,
	onSuccess: PropTypes.func
}

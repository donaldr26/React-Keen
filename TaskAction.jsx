import React from 'react'
import PropTypes from 'prop-types'
import { FormControl, FormGroup, ControlLabel, HelpBlock } from 'react-bootstrap'

import serviceJobs from '../services/jobs'

export default class TaskAaction extends React.Component {
	constructor(props) {
		super(props)

		this.state = {
			isLoading: false,
			errors: {}
		}

		this.getValidationState = this.getValidationState.bind(this)
	}

	onCancel() {
		if (typeof this.props.onCancel === 'function') {
			this.props.onCancel()
		}
	}

	save(e) {
		if (e) e.preventDefault()

		const data = {
			description_text: this.description.value
		}
		console.log('Action data', data)

		return serviceJobs.storeActionTask(this.props.task.id, data)
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

	complete(e) {
		if (e) e.preventDefault()

		const data = {
			fix_text: this.description.value
		}
		console.log('Complete data', data)

		return serviceJobs.completeTask(this.props.task.id, data)
			.then(response => {
				if (typeof this.props.onSuccess === 'function') {
					this.props.onSuccess(response.task)
				}
			})
			.catch(err => {
				console.log('ERROR', err.errors)
				if (typeof err.errors.fix_audio_file_id !== 'undefined') {
					err.errors.description = err.errors.fix_audio_file_id
				}
				this.setState({ errors: err.errors, isLoading: false })
			})
	}

	getValidationState(field) {
		if (typeof this.state.errors[field] === 'undefined') return null

		return 'error'
	}

	render() {
		return (<div className="modal-s">
			<div className="content">
				<h4 className="font-bolder">{kst('Take other action:')}</h4>
				<p>{kst('Record details of the actions which have been taken for this job.')}</p>
				<p>{kst('Choosing Record Action will keep the job in your pending jobs list until the job has been marked as completed.')}</p>
				<FormGroup
					controlId="description"
					validationState={this.getValidationState('description')}
				>
					<FormControl componentClass="textarea" inputRef={ref => this.description = ref}/>
				</FormGroup>
				<div className="row">
					<div className="col-xs-4">
						<button className="btn-s xsm bggray fullwidth" onClick={this.onCancel.bind(this)}>{kst('Cancel')}</button>
					</div>
					<div className="col-xs-4">
						<button className="btn-s xsm bggray fullwidth" onClick={this.save.bind(this)}>
							{kst('Record action')}
						</button>
					</div>
					<div className="col-xs-4">
						<button className="btn-s xsm bgyellow fullwidth" onClick={this.complete.bind(this)}>
							{kst('Complete Job')}
						</button>
					</div>
				</div>
			</div>
		</div>)
	}
}

TaskAaction.propTypes = {
	task: PropTypes.object.isRequired,
	onCancel: PropTypes.func.isRequired,
	onSuccess: PropTypes.func
}

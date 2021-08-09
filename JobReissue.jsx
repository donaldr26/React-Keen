import React from 'react'
import { hashHistory } from 'react-router'
import { FormControl, FormGroup, HelpBlock, ControlLabel, Checkbox } from 'react-bootstrap'

import ContractorForm from './ContractorForm'
import { IssuedJobMessage } from '../components/core/messages'

import { serviceJobs, serviceUsers } from '../services'
import store from '../store'

export default class JobReissue extends React.Component {
	constructor(props) {
		super(props)

		this.state = {
			contractors: [],
			contractorId: 0
		}

		this.jobId = this.props.jobId

		this.onExistingContractorSelect = this.onExistingContractorSelect.bind(this)
		this.onCancelClick = this.onCancelClick.bind(this)
		this.onSaveClick = this.onSaveClick.bind(this)
		this.onSubmitClick = this.onSubmitClick.bind(this)
	}

	componentWillMount () {
		this.getData()
	}

	getData () {
		this.getCompanies()
	}

	getCompanies () {
		return serviceJobs.getCompanyAssociates()
			.then(({ associates_companies }) => {
				this.setState({ contractors: associates_companies })
			})
			.catch(err => {
				console.log(err.message, err)

				return store.layout.alert('error', 'Sorry, we can not receive the list of existing company associations.')
			})
	}

	// getCompanies () {
	// 	return serviceJobs.getContractors()
	// 		.then(({contractors}) => {
	// 			this.setState({ contractors })
	// 		})
	// 		.catch(err => {
	// 			console.log(err.message, err)
	// 			return store.layout.alert('error', 'Sorry, we can not receive the list of contractors.')
	// 		})
	// }

	onExistingContractorSelect (e) {
		e.preventDefault()

		this.setState({ contractorId: e.target.value })
	}

	onSubmitClick (e) {
		e.preventDefault()

		const contractorId = Number(this.state.contractorId)
		if (contractorId === -1) {
			const data = this.contractorForm && this.contractorForm.data
			if (!data) {
				return store.layout.alert('error', 'Please, select a contractor')
			}
		}

		return Promise.resolve()
			.then(() => {
				if (contractorId > 0) return contractorId

				return this.saveContractor()
					.then(contractor => contractor.id)
			})
			.then(contractorId => {
				this.setState({ contractorId })
				// const isPrincipalContractor = this.principalCheck && this.principalCheck.checked

				return serviceJobs.createJobOrganisation(this.jobId, contractorId)
			})
			.then(response => {
				const title = `You've successfully issued a job`
				const content = <IssuedJobMessage onButtonClick={this.onSubmitCb} />

				store.layout.modal(content, title, null, this.onSubmitCb)
			})
			.then(response => {
				const cb = (this.props.callbacks || {}).onSubmit
				if (typeof cb === 'function') {
					cb()
				}
			})
			.catch(err => {
				if (err.code === store.constants.ERROR_CODE_VALIDATION && this.contractorForm) {
					return this.contractorForm.errors = err.errors || {}
				}
				return store.layout.alert('error', err.message)
			})
	}

	saveContractor(e) {
		if (e) e.preventDefault()

		this.setState({ isLoading: true })

		const payload = this.contractorForm.data
		payload.redirect_url = `${window.location.origin}/#/auth/signup/pah`

		return serviceUsers.createContractor(payload)
			.then(response => {
				this.contractorForm.errors = {}

				return this.contractorForm.saveLicenses(response.contractor.id)
			})
			.then(response => {
				scope.contractor.licenses = response.licenses

				return scope.contractor
			})
	}

	onSaveClick () {
		e.preventDefault()

		const cb = (this.props.callbacks || {}).onSave
		if (typeof cb === 'function') {
			cb()
		}
	}

	onCancelClick (e) {
		e.preventDefault()

		const cb = (this.props.callbacks || {}).onCancel
		if (typeof cb === 'function') {
			cb()
		}
	}

	emptyButton () {
		return null
	}

	render() {
		const CancelButton = this.props.buttons.cancel || this.emptyButton
		const SaveButton = this.props.buttons.save || this.emptyButton
		const SubmitButton = this.props.buttons.submit || this.emptyButton

		return <form>
			<div className="width_720 contact-form job-contact">
				<div className="job-contact-content">
					<h3>{kst('Select an existing contractor:')}</h3>
					<FormGroup>
						<ControlLabel>{kst('Existing contractor:')}</ControlLabel>
						<FormControl
							value={this.state.contractorId || 0}
							componentClass="select"
							placeholder={kst('select')}
							onChange={this.onExistingContractorSelect}
						>
							{
								// disabled due to screen 45a
								// <option value={-1}>New company</option>
								<option value={0} disabled>{kst('Select contractor')}</option>
							}
							{this.state.contractors.map((contractor) =>
								<option key={contractor.id} value={contractor.contractor_id}>{contractor.company_name}</option>
							)}
						</FormControl>
					</FormGroup>
				</div>

				{
					+this.state.contractorId !== -1
					|| <div className="job-contact-content">
						<ContractorForm
							ref={ref => this.contractorForm = ref}
							data={{}}
							naked
						/>
					</div>
				}

			</div>
			<div className="margin_40_0">
				<CancelButton onClick={this.onCancelClick} />
				<SaveButton onClick={this.onSaveClick} />
				<SubmitButton onClick={this.onSubmitClick} />
			</div>
		</form>
	}
}

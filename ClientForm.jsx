import React from 'react'
import PropTypes from 'prop-types'
import { FormControl, FormGroup, HelpBlock, ControlLabel } from 'react-bootstrap'
import _ from 'lodash'

import Address from './core/form/Address'
import { serviceClients } from '../services'
import store from '../store'

export default class Client extends React.Component {
	constructor(props) {
		super(props)
		this.state = {
			clientId: props.clientId || -1,
			clients: [],
			data: {},
			errors: {}
		}

		this.onExistingClientSelect = this.onExistingClientSelect.bind(this)
		this.handleChange = this.handleChange.bind(this)
		this.errorMessage = this.errorMessage.bind(this)
	}

	componentWillMount () {
		this.getClients()
	}

	getClients () {
		return serviceClients.getClients()
			.then(response => {
				const clients = response.clients
				const data = clients.find(x => x.id === this.state.clientId) || {}
				this.setState({clients, data})
			})
			.catch(err => {
				return store.layout.alert('error', 'Sorry, we can not receive the list of existing clients.')
			})
	}

	get clientId() {
		return this.state.clientId
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

		const errors = this.state.errors
		delete errors[field]

		this.setState({ data, errors })
	}

	onExistingClientSelect (e) {
		e.preventDefault()

		const clientId = e.target.value
		const data = this.state.clients.find(x => x.id === clientId) || {}

		this.setState({clientId, data})
	}

	errorMessage(field) {
		if (typeof this.state.errors[field] === 'undefined') return null

		return <HelpBlock>{this.state.errors[field]}</HelpBlock>
	}

	render() {
		const data = this.state.data
		const isReadOnly = Number(this.state.clientId) !== -1

		return <form>
			<div className="width_720 contact-form job-contact clearfix">
				<h3 className="m_left_-5">Select an existing client or enter details below:</h3>
				<div className="job-contact-content">
					<FormGroup>
						<ControlLabel>{kst('Existing client:')}</ControlLabel>
						<FormControl
							value={this.state.clientId}
							componentClass="select"
							placeholder={kst('select')}
							onChange={this.onExistingClientSelect}
							>
							<option value="-1">{kst('New client')}</option>
							{this.state.clients.map((client) =>
								<option
									key={client.id}
									value={client.id}>
									{client.name}
								</option>
							)}
						</FormControl>
					</FormGroup>
					<FormGroup
						validationState={this.state.errors.name && 'error'}>
						<ControlLabel>{kst('Client name:')}</ControlLabel>
						<FormControl
							name="name"
							type="text"
							value={data.name || ''}
							placeholder={kst('Name')}
							onChange={this.handleChange}
							readOnly={isReadOnly}
						/>
						{this.errorMessage('name')}
					</FormGroup>
					<FormGroup
						validationState={this.state.errors.trading_name && 'error'}>
						<ControlLabel>{kst('Trading name (optional):')}</ControlLabel>
						<FormControl
							name="trading_name"
							type="text"
							value={data.trading_name || ''}
							placeholder={kst('Trading name')}
							onChange={this.handleChange}
							readOnly={isReadOnly}
						/>
						{this.errorMessage('trading_name')}
					</FormGroup>
					<FormGroup
						validationState={this.state.errors.abn && 'error'}>
						<ControlLabel>{kst('ABN (optional):')}</ControlLabel>
						<FormControl
							name="abn"
							type="text"
							value={data.abn || ''}
							placeholder={kst('ABN')}
							onChange={this.handleChange}
							readOnly={isReadOnly}
						/>
						{this.errorMessage('abn')}
					</FormGroup>
					<FormGroup
						validationState={this.state.errors.acn && 'error'}>
						<ControlLabel>{kst('ACN (optional):')}</ControlLabel>
						<FormControl
							name="acn"
							type="text"
							value={data.acn || ''}
							placeholder={kst('ACN')}
							onChange={this.handleChange}
							readOnly={isReadOnly}
						/>
						{this.errorMessage('acn')}
					</FormGroup>

					<Address
						ref={ref => this.address = ref}
						errors={this.state.errors}
						data={data}
						readOnly={isReadOnly}
					/>

					<FormGroup
						validationState={this.state.errors.email && 'error'}>
						<ControlLabel>{kst('Email address:')}</ControlLabel>
						<FormControl
							name="email"
							type="text"
							value={data.email || ''}
							placeholder={kst('Email')}
							onChange={this.handleChange}
							readOnly={isReadOnly}
						/>
						{this.errorMessage('email')}
					</FormGroup>

					<FormGroup
						validationState={this.state.errors.office_phone && 'error'}>
						<ControlLabel>{kst('Office phone number:')}</ControlLabel>
						<FormControl
							name="office_phone"
							type="text"
							value={data.office_phone || ''}
							placeholder={kst('Number')}
							onChange={this.handleChange}
							readOnly={isReadOnly}
						/>
						{this.errorMessage('office_phone')}
					</FormGroup>

					<FormGroup
						validationState={this.state.errors.mobile_phone && 'error'}>
						<ControlLabel>{kst('Mobile phone number:')}</ControlLabel>
						<FormControl
							name="mobile_phone"
							type="text"
							value={data.mobile_phone || ''}
							placeholder={kst('Number')}
							onChange={this.handleChange}
							readOnly={isReadOnly}
						/>
						{this.errorMessage('mobile_phone')}
					</FormGroup>
				</div>
			</div>
		</form>
	}
}

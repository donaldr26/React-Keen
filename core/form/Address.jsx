import React from 'react'
import PropTypes from 'prop-types'
import { FormControl, FormGroup, HelpBlock, ControlLabel, Row, Col } from 'react-bootstrap'
import _ from 'lodash'

const countries = {
	au: {
		name: 'Australia',
		states: [
			'QLD',
			'NSW',
			'TAS',
			'VIC',
			'WA',
			'NT',
			'ACT',
			'SA',
		]
	},
	nz: {
		name: 'New Zealand',
		states: [
			'NTL',
			'AUK',
			'WKO',
			'BOP',
			'GIS',
			'HKB',
			'TKI',
			'MWT',
			'WGN',
			'TAS',
			'NSN',
			'MBH',
			'WTC',
			'CAN',
			'OTA',
			'STL',
		]
	},
	co: {
		name: 'Colombia',
		states: [
			'ANT',
			'ARA',
			'ATL',
			'BOL',
			'BOY',
			'CAL',
			'CAQ',
			'CAS',
			'CAU',
			'CES',
			'CHO',
			'COR',
			'CUN',
			'DC',
			'GUA',
			'GUV',
			'HUI',
			'LAG',
			'MAG',
			'MET',
			'NAR',
			'NSA',
			'PUT',
			'QUI',
			'RIS',
			'SAP',
			'SAN',
			'SUC',
			'TOL',
			'VAC',
			'VAU',
			'VID',
		]
	}
}

export default class Address extends React.Component {
	constructor(props) {
		super(props)

		this.state = {
			data: props.data,
			errors: props.errors,
			isReadOnly: props.readOnly,
		}

		if (props.data[`${this.props.prefix}country`]) {
			this.state.states = countries[props.data[`${this.props.prefix}country`]].states || []
		}

		this.handleChange = this.handleChange.bind(this)
		this.getValidationState = this.getValidationState.bind(this)
		this.errorMessage = this.errorMessage.bind(this)
	}

	get data() {
		return this.getDataFields(this.state.data)
	}

	get fields() {
		return [
			'country',
			'address_1',
			'address_2',
			'state',
			'suburb',
			'postcode'
		].map(x => `${this.props.prefix}${x}`)
	}

	set errors(errors) {
		this.setState({ errors })
	}

	componentWillReceiveProps (nextProps) {
		const state = {
			data: nextProps.data,
			errors: nextProps.errors,
			isReadOnly: nextProps.readOnly
		}
		if (nextProps.data[`${nextProps.prefix}country`] && nextProps.data[`${nextProps.prefix}country`] !== this.state.data[`${this.props.prefix}country`]) {
			state.states = countries[nextProps.data[`${nextProps.prefix}country`]].states || []
		}
		this.setState(state)
	}

	getDataFields(data) {
		return _.pick(data, this.fields)
	}

	handleChange(e) {
		const field = e.target.getAttribute('name')
		const value = e.target.value

		const data = this.state.data
		data[field] = value

		const errors = this.state.errors
		delete errors[field]

		const state = { data, errors }

		if (field === `${this.props.prefix}country`) {
			state.states = countries[value].states || []
			state.data.state = null
		}

		this.setState(state)
	}

	getValidationState() {
		if (Object.keys(this.state.errors).length) return 'error'

		return null
	}

	errorMessage(field) {
		if (typeof this.state.errors[field] === 'undefined') return null

		return <HelpBlock>{this.state.errors[field]}</HelpBlock>
	}

	render() {
		const { data, states } = this.state

		return (<FormGroup controlId="address" validationState={this.getValidationState()} className="address-form">
			<ControlLabel>{this.props.title || kst('Address')}:</ControlLabel>
			<div className="clearfix">
				<div className="address-form__country">
					<FormControl
						name={`${this.props.prefix}country`}
						value={data[`${this.props.prefix}country`] || ''}
						componentClass="select"
						placeholder={kst('Country')}
						className="col-lg-6 address-form__select"
						onChange={this.handleChange}
						readOnly={this.state.isReadOnly}
					>
						<option className="cdarkgray">{kst('Country')}</option>
						{Object.keys(countries).map(c => <option key={c} value={c}>{countries[c].name}</option>)}
					</FormControl>
				</div>
				<div className="address-form__state">
					<FormControl
						name={`${this.props.prefix}state`}
						value={data[`${this.props.prefix}state`] || ''}
						componentClass="select"
						placeholder={kst('State')}
						className="col-lg-6 address-form__select"
						onChange={this.handleChange}
						readOnly={this.state.isReadOnly}
					>
						<option className="cdarkgray">{kst('State')}</option>
						{(states || []).map(s => <option key={s} value={s}>{s}</option>)}
					</FormControl>
				</div>
			</div>
			{this.errorMessage(`${this.props.prefix}suburb`)}
			{this.errorMessage(`${this.props.prefix}state`)}

			<FormControl
				name={`${this.props.prefix}address_1`}
				type="text"
				value={data[`${this.props.prefix}address_1`] || ''}
				placeholder={kst('Line 1')}
				onChange={this.handleChange}
				readOnly={this.state.isReadOnly}
			/>
			{this.errorMessage(`${this.props.prefix}address_1`)}
			<FormControl
				name={`${this.props.prefix}address_2`}
				type="text"
				value={data[`${this.props.prefix}address_2`] || ''}
				placeholder={kst('Line 2')}
				onChange={this.handleChange}
				readOnly={this.state.isReadOnly}
			/>
			{this.errorMessage(`${this.props.prefix}address_2`)}

			<div className="clearfix">
				<div className="address-form__suburb">
					<FormControl
						name={`${this.props.prefix}suburb`}
						type="text"
						value={data[`${this.props.prefix}suburb`] || ''}
						placeholder={kst('Suburb')}
						onChange={this.handleChange}
						readOnly={this.state.isReadOnly}
					/>
				</div>
				<div className="address-form__postcode">
					<FormControl
						name={`${this.props.prefix}postcode`}
						type="text"
						value={data[`${this.props.prefix}postcode`] || ''}
						placeholder={kst('Post code')}
						onChange={this.handleChange}
						readOnly={this.state.isReadOnly}
					/>
				</div>
			</div>
			{this.errorMessage(`${this.props.prefix}suburb`)}
			{this.errorMessage(`${this.props.prefix}postcode`)}
		</FormGroup>)
	}
}

Address.propTypes = {
	prefix: PropTypes.string.isRequired,
	data: PropTypes.object.isRequired,
	errors: PropTypes.object.isRequired,
	isReadOnly: PropTypes.bool
}

Address.defaultProps = {
	prefix: '',
	data: {},
	errors: {},
	isReadOnly: false
}

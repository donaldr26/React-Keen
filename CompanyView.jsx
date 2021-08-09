import React from 'react'
import PropTypes from 'prop-types'

import { countryName } from '../lib/helper'

export default class CompanyView extends React.Component {
	constructor(props) {
		super(props)
		this.state = {}
		this.getValue = this.getValue.bind(this)
	}

	getValue(key) {
		return this.props.company[`${this.props.keyPrefix}${key}`]
	}

	render() {
		if (this.props.isLoading) {
			return <div>Loading...</div>
		}

		const data = this.props.company

		return (<form>
			<div className="contact-form">
				<h3>{this.props.title || kst('Company details:')}</h3>
				<div className="form-group">
					<span className="headerspan">{kst('Company Logo:')}</span>
					<span className="block margin_0_15"><img style={{ maxHeight: '50px' }} src={this.getValue('logo_file_uri')} /></span>
				</div>
				<div className="form-group">
					<span className="headerspan">{kst('Company Name:')}</span>
					<span className="block margin_0_15">{this.getValue('name')}</span>
				</div>
				<div className="form-group">
					<span className="headerspan">{kst('Trading name:')}</span>
					<span className="block margin_0_15">{this.getValue('trading_name')}</span>
				</div>
				<div className="form-group">
					<span className="headerspan">{kst('Address:')}</span>
					<span className="block margin_0_15">{this.getValue('address_1')}</span>
					<span className="block margin_0_15">{this.getValue('address_2')}</span>
					<span className="block margin_0_15">{this.getValue('suburb')}</span>
					<span className="block margin_0_15">{this.getValue('state')}, {countryName(this.getValue('country'))}</span>
					<span className="block margin_0_15">{this.getValue('postcode')}</span>
				</div>
				<div className="form-group">
					<span className="headerspan">{kst('ABN:')}</span>
					<span className="block margin_0_15">{this.getValue('abn')}</span>
				</div>
				<div className="form-group">
					<span className="headerspan">{kst('ACN (optional):')}</span>
					<span className="block margin_0_15">{this.getValue('acn')}</span>
				</div>
				<div className="form-group">
					<span className="headerspan">{kst('Phone number (office):')}</span>
					<span className="block margin_0_15">{this.getValue('office_phone')}</span>
				</div>
				<div className="form-group">
					<span className="headerspan">{kst('Phone number (mobile):')} </span>
					<span className="block margin_0_15">{this.getValue('contact_phone')}</span>
				</div>
				<div className="form-group">
					<span className="headerspan">{kst('Email address:')}</span>
					<span className="block margin_0_15">{this.getValue('email')}</span>
				</div>
			</div>
		</form>)
	}
}

CompanyView.propTypes = {
	isLoading: PropTypes.bool.isRequired,
	company: PropTypes.object.isRequired,
	keyPrefix: PropTypes.string.isRequired
}
CompanyView.defaultProps = {
	keyPrefix: ''
}

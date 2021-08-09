import React from 'react'
import PropTypes from 'prop-types'

import ScopeFile from './core/ScopeFile'

import { tFormat, countryName } from '../lib/helper'

const JobDetails = ({ job }) => (<div>
	<div className="form-group">
		<span className="headerspan">{kst('Client Name:')}</span>
		<span className="block margin_0_15">{job.client_name || job.company_name}</span>
	</div>
	<div className="form-group">
		<span className="headerspan">{kst('Trading name:')}</span>
		<span className="block margin_0_15">{job.trading_name || job.company_trading_name}</span>
	</div>
	<div className="form-group">
		<span className="headerspan">{kst('Address:')}</span>
		<span className="block margin_0_15">{job.site_address_1}</span>
		<span className="block margin_0_15">{job.site_address_2}</span>
		<span className="block margin_0_15">{job.site_state}, {countryName(job.site_country)}</span>
		<span className="block margin_0_15">{job.site_postcode}</span>
	</div>
	<div className="form-group">
		<span className="headerspan">{kst('Work order number:')}</span>
		<span className="block margin_0_15">{job.workorder_number}</span>
	</div>
	<div className="form-group">
		<span className="headerspan">{kst('Date of issue:')}</span>
		<span className="block margin_0_15">{tFormat(job.created_on)}</span>
	</div>
	<div className="form-group">
		<span className="headerspan">{kst('Start date & time:')}</span>
		<span className="block margin_0_15">{tFormat(job.start_date)}</span>
	</div>
	<div className="form-group">
		<span className="headerspan">{kst('Finish date & time:')}</span>
		<span className="block margin_0_15">{tFormat(job.end_date)}</span>
	</div>
	<div className="form-group">
		<span className="headerspan">{kst('Pre-approved value of work threshold')}</span>
		<span className="block margin_0_15">{job.preapproved_limit || 'none'}</span>
	</div>
	<div className="form-group">
		<span className="headerspan">{kst('Scope of works:')}</span>
		<span className="block margin_0_15" dangerouslySetInnerHTML={{ __html: job.scope_of_works }} />
		{
			!job.scope_file_id || <span className="block margin_0_15">
				<ScopeFile uri={job.scope_file_uri} name={job.scope_file_name} size={job.scope_file_size} />
			</span>
		}
	</div>
	{
		!job.swms_file_id
		|| <div className="form-group">
			<span className="headerspan">{kst('SWMS file:')}</span>
			<span className="block margin_0_15">
				<ScopeFile uri={job.swms_file_uri} name={job.swms_file_name} size={job.swms_file_size} />
			</span>
		</div>
	}
	<div className="form-group">
		<span className="headerspan">{kst('Description of works:')}</span>
		{(job.types || []).length ?
			job.types.map(type => <span key={type.id} className="block margin_0_15">{type.name}</span>) :
			<span className="block margin_0_15">{kst('No description')}</span>
		}
	</div>
</div>)

JobDetails.propTypes = {
	job: PropTypes.object.isRequired
}

export default JobDetails

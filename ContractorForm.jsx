import React from 'react'

import WorkerForm from './core/WorkerForm'

export default class ContractorForm extends WorkerForm {
	constructor(props) {
		super(props)

		this.hasLicenses = true
		this.hasInsuranses = true
		this.hasLeadingHand = false

		this.fields = [
			'first_name',
			'last_name',
			'email',

			'phone',
			'address',
			'emergency_contact_name',
			'emergency_contact_number',
			// 'abn',
			'photo',
			'driver_license',
		//	'contact_number'
		]

		this.skipValidation = []

		if ((props.noFields || []).length) {
			this.fields = _.difference(this.fields, props.noFields)
			this.skipValidation = props.noFields
		}
	}
}

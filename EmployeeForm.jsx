import React from 'react'

import WorkerForm from './core/WorkerForm'

export default class EmployeeForm extends WorkerForm {
	constructor(props) {
		super(props)

		this.hasLicenses = true
		this.hasInsuranses = false
		this.hasLeadingHand = true

		this.fields = [
			'first_name',
			'last_name',
			'phone',
			'email',
			'address',
			'emergency_contact_name',
			'emergency_contact_number',
			'photo',
			'driver_license'
		]
	}
}

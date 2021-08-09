import React from 'react'

import WorkerForm from './core/WorkerForm'

export default class NAHForm extends WorkerForm {
	constructor(props) {
		super(props)

		this.hasLicenses = false
		this.hasInsuranses = false

		this.fields = [
			'first_name',
			'last_name',
			'phone',
			'email',
			'address',
			'emergency_contact_name',
			'emergency_contact_number'
		]
	}
}

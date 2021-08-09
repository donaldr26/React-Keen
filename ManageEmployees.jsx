import React from 'react'
import { Link } from 'react-router'

export default class ManageEmployees extends React.Component {
	constructor(props) {
		super(props)
	}

	onCancel() {
		if (typeof this.props.onCancel === 'function') {
			this.props.onCancel()
		}
	}
	render() {
		return (<div className="modal-s">
			<div className="content large clearfix">
				<h1 className="text-uppercase">{kst('Manage your employees')}</h1>
				<p>{kst('You can start setting up subscriptions for employees and contractors and connecting them to your Keen Safety account.')}</p>
				<p>{kst('Employees and contractors you connect to your account will receive an invitation to join Keen Safety.')}</p>
				<p>{kst('You can then begin managing your registered employees and contractors both online and through the Keen Safety app.')}</p>
				<br/>
				<Link to="/staff/employees" className="btn-s sm bgyellow pull-left">{kst('add employees')}</Link>
				<Link to="/staff/contractors" className="btn-s sm bgyellow pull-left">{kst('add contractors')}</Link>
				<button className="btn-s sm bggray pull-right" onClick={this.onCancel.bind(this)}>{kst('not now')}</button>
			</div>
		</div>)
	}
}


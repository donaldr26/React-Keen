import React from 'react'

export default class CompleteRegistration extends React.Component {
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
				<h1 className="text-uppercase">{kst('Complete your registration')}</h1>
				<p>{kst('Click the link sent to your email inbox to confirm your email address and complete your registration.')}</p>
				<p>{kst('If you have not received an email, click the resend button bellow.')}</p>
				<br/>
				<br/>
				<br/>
				<button className="btn-s sm bggray pull-left">{kst('Re-send confirmation email')}</button>
				<button className="btn-s sm bggray pull-right" onClick={this.onCancel.bind(this)}>{kst('not now')}</button>
			</div>
		</div>)
	}
}


import React from 'react'

export default class GetStarted extends React.Component {
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
				<h1 className="text-uppercase">{kst('Let\'s get started')}</h1>
				<p>{kst('You\'ll need to enter your company details to begin using Keen Safety.')}</p>
				<p>{kst('Once your details have been saved, this will save time when issuing jobs, generating SWMS, and more.')}</p>
				<br/>
				<br/>
				<button className="btn-s sm bgyellow pull-left">{kst('Add details')}</button>
				<button className="btn-s sm bggray pull-right" onClick={this.onCancel.bind(this)}>{kst('not now')}</button>
			</div>
		</div>)
	}
}


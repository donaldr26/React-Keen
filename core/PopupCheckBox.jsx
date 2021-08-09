import React from 'react'

import serviceUsers from '../../services/users'
import store from '../../store'

export default class PopupCheckBox extends React.Component {
	constructor(props) {
		super(props)
		this.state = {
			isLoading: false,
			checked: false
		}

		this.onValueChange = this.onValueChange.bind(this)
	}

	onValueChange(event) {
		let checked = event.target.checked
		this.setState({ isLoading: true })

		return serviceUsers.dontShowThisPopUpAgain(this.props.type)
			.then(response => {
				if (response.status === 'success') {
					store.setNotificationSettings(response.notification_settings)
					store.layout.setState({ store })
				}
				this.setState({ checked, isLoading: false })
			})
			.catch(err => {
				console.log(err)
			})
	}

	render_old() {
		return (
			<div className="form-group checkbox labl-stac" style={{ display: 'block', position: 'relative' }}>
				{
					this.state.isLoading
						? <img src="/assets/images/loading.gif" width="25" alt="loading..." style={{ position: 'absolute', top: 18 }} />
						: <div style={{ position: 'absolute', top: 0 }}>
							<input type="checkbox"
								name={this.props.name}
								checked={this.state.checked}
								id={this.props.name}
								onChange={this.onValueChange}
							/>
							<label className="labl-chec" htmlFor={this.props.name}>{kst('Do not show this again')}</label>
						</div>
				}
			</div>
		)
	}

	render() {
		return (
			<div className="form-group checkbox labl-stac" style={{ display: 'block' }}>
				{
					this.state.isLoading
						? <img src="/assets/images/loading.gif" width="25" alt="loading..." />
						: <div>
							<input type="checkbox"
								name={this.props.name}
								checked={this.state.checked}
								id={this.props.name}
								onChange={this.onValueChange}
							/>
							<label className="labl-chec" htmlFor={this.props.name}>{kst('Do not show this again')}</label>
						</div>
				}
			</div>
		)
	}
}

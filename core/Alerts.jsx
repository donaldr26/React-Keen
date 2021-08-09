import React from 'react'
import { AlertList } from 'react-bs-notifier'

export default class Alerts extends React.Component {
	constructor(props) {
		super(props)

		this.state = {
			position: 'top-right',
			alerts: [],
			timeout: 5000
		}
	}

	newAlert(type, message, headline = '') {
		const titles = {
			danger: 'Error'
		}
		const newAlert = {
			id: (new Date()).getTime(),
			type,
			headline: headline || titles[type],
			message
		}

		this.setState({ alerts: [...this.state.alerts, newAlert] })
	}

	onAlertDismissed(alert) {
		const alerts = this.state.alerts
		const idx = alerts.indexOf(alert)

		if (idx >= 0) {
			this.setState({ alerts: [...alerts.slice(0, idx), ...alerts.slice(idx + 1)] })
		}
	}

	render() {
		return (<AlertList
			position={this.state.position}
			alerts={this.state.alerts}
			timeout={this.state.timeout}
			dismissTitle="Begone!"
			onDismiss={this.onAlertDismissed.bind(this)}
		/>)
	}
}

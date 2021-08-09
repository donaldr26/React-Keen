import React from 'react'
import PropTypes from 'prop-types'
import { Link, hashHistory } from 'react-router'

import LeftMenu from './layout/LeftMenu'
import TopSection from './layout/TopSection'

import ActionConfirm from './core/Confirm'
import Modal from './core/Modal'
import Alerts from './core/Alerts'

import store from '../store'

export default class Layout extends React.Component {
	constructor(props) {
		super(props)
		this.state = {
			store
		}
		this.confirm = this.confirm.bind(this)
		this.modal = this.modal.bind(this)
		this.modalClose = this.modalClose.bind(this)
		store.layout = this
	}

	componentWillReceiveProps(nextProps) {
		const freeLocations = [
			'/user/cart',
			'/successful-payment',
			'/home'
		]
		// if (store.isAuthenticated && !store.isPaid && freeLocations.indexOf(nextProps.location.pathname) < 0) {
		if (store.isAuthenticated && freeLocations.indexOf(nextProps.location.pathname) < 0) {
			// this.askForPayment()
		}
	}

	log() {
		store.login()
		this.setState({ store })
	}

	logout() {
		store.logout()
		this.setState({ store })
	}

	showInvite() {
		this.refs.topsection.showInvite()
	}

	confirm(title, content, buttons, size) {
		// if (this.refs.confirm.isVisible) return true

		return new Promise(resolve => {
			this.refs.confirm.show(title, content, buttons, size, answer => resolve(answer))
		})
	}

	confirmClose() {
		this.refs.confirm.closeAlert()
	}

	modal(content, title, size, cb) {
		this.refs.modal.show(content, title, size, cb)
	}

	modalClose() {
		this.refs.modal.hide()
	}

	alert(type, message, headline) {
		// types conversion
		const types = { error: 'danger' }
		this.refs.alerts.newAlert(types[type] || type, message, headline)
	}

	askForPayment() {
		const content = <div>
			{/* <h2>{kst('Payment Required')}</h2> */}
			<h4>{kst('Welcome to Keen Safety!')}</h4>
			<p>{kst('Before you start please confirm what Business Pack suits you best and how many employees and notification acccounts you would like.')}</p>
			<p>{kst('You will then be redirected to the payment gateway.')}</p>
		</div>

		return store.layout.confirm('Payment required', content, ['ok'])
			.then(answer => {
				hashHistory.push('/user/cart')
			})
	}

	render() {
		return (<div className="container-fluid">
			<div className="row">
				<ActionConfirm ref="confirm"/>
				<Modal ref="modal"/>
				<Alerts ref="alerts"/>
				<div className="col-sm-2 main-window">
					<div className="left-section">
						<Link to="/"><img src="/assets/images/logo_01.jpg" /></Link>
						<LeftMenu path={this.props.location.pathname} role={this.state.store.role} />
					</div>
				</div>
				<div className={`col-sm-10 main-window bgwhite ${this.state.store.isGuest ? 'guest' : ''}`}>
					{ this.state.store.isGuest || <TopSection ref="topsection" isGuest={this.state.store.isGuest} /> }
					{React.cloneElement(this.props.children, {
						isAuthenticated: this.state.store.isAuthenticated,
						isPaid: this.state.store.isPaid,
						role: this.state.store.role
					})}
				</div>

				<small className="patent">
					<div className="left-menu-socials">
						<a href="https://www.facebook.com/KeenSafety" target="_blank" rel="noopener noreferrer"><i className="fa fa-facebook-square" /></a>
					</div>
					AU Pat Appln No 2019903375
				</small>
			</div>

		</div>)
	}
}

Layout.propTypes = {
	children: PropTypes.any,
	location: PropTypes.object.isRequired
}

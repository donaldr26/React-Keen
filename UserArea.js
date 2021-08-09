import React from 'react'
import { hashHistory } from 'react-router'

import store from '../store'

export function requireAuth(Component, requiresRole = false) {

	return class UserArea extends React.Component {

		componentWillMount () {
			this.checkAuth(this.props.isAuthenticated)

			if (this.props.isAuthenticated) {
				if (this.props.isAuthenticated && this.props.role === 'pah') {
					this.checkPaid(this.props.isPaid)
				}

				if (requiresRole) {
					this.checkRole(this.props.role)
				}
			}
		}

		componentWillReceiveProps (nextProps) {
			this.checkAuth(nextProps.isAuthenticated)

			if (nextProps.isAuthenticated) {
				this.checkPaid(nextProps.isPaid, nextProps.location.pathname)

				if (requiresRole) {
					this.checkRole(nextProps.role)
				}
			}
		}

		checkAuth (isAuthenticated) {
			if (!isAuthenticated) {
				let redirectAfterLogin = this.props.location.pathname
				hashHistory.push(`/auth/login?next=${redirectAfterLogin}`)
			}
		}

		checkPaid(isPaid, pathname) {
			if (isPaid) return true

			const freeLocations = [
				'/user/cart',
				'/successful-payment',
				'/home',
				'/worksite'
			]
			if (freeLocations.indexOf(pathname) < 0) {
				return hashHistory.push('/user/cart')
			}

			return true
		}

		checkRole(role) {
			if (role !== requiresRole) {
				hashHistory.push(`/403`)
			}
		}

		render () {
			return (<div>
				{this.props.isAuthenticated === true
					? <Component {...this.props}/>
					: null
				}
			</div>)
		}
	}
}

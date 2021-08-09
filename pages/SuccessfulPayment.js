import React from 'react'
import { hashHistory } from 'react-router'

import store from '../../store'
import serviceUsers from '../../services/users'

class SuccessfullPayment extends React.Component {
	componentDidMount() {
		return serviceUsers.getUserData()
			.then(response => {
				store.updateUserData(response.user)
				setTimeout(() => hashHistory.push('/'), 3000)
			})
			.catch(err => {
				console.log(err)
			})
	}

	render() {
		return (
			<div className="spayment__container">
				<div className="spayment__wrapper">
					<h1 className="spayment__title">Successfull Payment</h1>
					<h3>
						We received your payment!
						<br /> You can continue use Keen Safety.
					</h3>
					<small className="spayment__description">
						You will be redirected to mail page in couple of seconds
					</small>
				</div>
			</div>
		)
	}
}

export default SuccessfullPayment

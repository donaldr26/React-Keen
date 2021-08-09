import React from 'react'
import numeral from 'numeral'

// import store from '../../store'
// import { LimitedTimeOffer } from '../popups'

import serviceStripe from '../../services/stripe'

// const stripeKey = 'pk_test_IOgCVfa9zb1YgAyB7ICYDIx000KFONOVtZ'
const stripeKey = 'pk_live_8BcXUCL2atmxxNcboC0Xe6AG00vOqsUmxW'

const stripeProductVersion = 4

export default class Pricing extends React.Component {
	constructor(props) {
		super(props)

		this.state = {
			loadingData: true,
			products: []
		}

		this.stripe = false
	}

	componentDidMount() {
		// eslint-disable-next-line
		this.stripe = Stripe(stripeKey)

		const state = { loadingData: false }

		return serviceStripe.getProducts()
			.then(({ data: products }) => {
				state.products = products.filter(x => Number(x.metadata.v) === stripeProductVersion)
				state.products.sort((a, b) => {
					const left = Number(a.metadata.capacity)
					const right = Number(b.metadata.capacity)

					if (left > right) return 1
					if (left < right) return -1

					return 0
				})

				return serviceStripe.getPlans()
			})
			.then(({ data: plans }) => {
				// state.plans = {}
				plans.forEach(plan => {
					// state.plans[plan.id] = plan
					const product = state.products.find(x => x.id === plan.product)
					if (product) {
						if (typeof product.plans === 'undefined') product.plans = {}
						product.plans[plan.metadata.group] = plan
					}
				})

				return true
			})
			.catch(e => {
				console.log('e', e.message)
			})
			.finally(() => {
				console.log('state', state)
				this.setState(state)
			})
	}

	render() {
		const { products } = this.state

		return (<div className="content-section pricing">
			<div>
				<h1>{kst('PRICING')}</h1>
			</div>

			<div className="price-detail__wrapper">
				<div>
					<span className="price-detail__title">Control sites remotely</span>
					<span className="price-detail__title">Track labor costs</span>
				</div>
				<div>
					<span className="price-detail__title">Create compliance records</span>
					<span className="price-detail__title">Safety Inspections</span>
				</div>
				<div>
					<span className="price-detail__title">Prevent expensive defects</span>
					<span className="price-detail__title">Simple to use on-site</span>
				</div>
				<div>
					<span className="price-detail__title">WHS Compliance</span>
					<span className="price-detail__title">Generate SWMS</span>
				</div>
			</div>


			<div className="price-detail__wrapper-title-box">
				<h1>{kst('PICK THE RIGHT BUSINESS PACK')}</h1>
			</div>

			<div className="price-detail__grid">
				{
					products.map(product => <div key={product.id} className="price-detail__box">
						<h3 className="price-detail__item-title">{product.name}</h3>
						<div className="price-detail__item">
							<span className="price-detail__item-info">Up to {product.metadata.capacity} Staff</span>
							<h3 className="price-detail__item-subtitle">{numeral(product.plans.pah.amount / 100).format('$0.00')} P/M</h3>
							<a className="btn-s business-pack-btn bgyellow small price-detail__item-btn" href={`/#/auth/signup/pah/capacity/${product.metadata.capacity}`}>Sign Up</a>
							<hr className="price-detail__item-hr" />
							<h3 className="price-detail__item-subtitle stick">+</h3>
							<h3 className="price-detail__item-subtitle stick">{ Number(product.metadata.sah) ? `${product.metadata.sah} Staff` : `${numeral(product.plans.sah.amount / 100).format('$0.00')} P/M` }</h3>
							<span className="price-detail__item-info">{ Number(product.metadata.sah) ? 'Included in pack' : 'Per user' }</span>
							<hr className="price-detail__item-hr" />
							<span className="price-detail__item-info">Have Keen setup your new system</span>
							<h3 className="price-detail__item-subtitle">{numeral(product.metadata.cost_setup / 100).format('$0')}</h3>
							<hr className="price-detail__item-hr" />
							<span className="price-detail__item-info">Onsite Training</span>
							{
								Number(product.metadata.training)
									? <div>
										<h3 className="price-detail__item-subtitle">{product.metadata.training} hrs FREE*</h3>
										<small className="price-detail__item-info-small">Additional training costs by negotiation</small>
									</div>
									: <h3 className="price-detail__item-subtitle">{numeral(product.metadata.cost_training / 100).format('$0')}/Per Hr**</h3>
							}
						</div>
					</div>)
				}
			</div>

			<div className="price-detail__pack">
				<div className="price-detail__pack-title">
					ENTERPRISE PACK
				</div>
				<div className="price-detail__pack-info">
					Over 51 Staff contact us via admin@keensafety.com.au or Phone (07) 3103 3665
				</div>
			</div>

			<div className="price-detail__pack">
				<div className="price-detail__pack-title">
					SAFETY NOTIFICATION ACCOUNT
				</div>
				<div className="price-detail__pack-info">
					<div className="price-detail__pack-info-item">
						<p>Allows any team member to log safety issues - Immediately reported to nominated supervisers.</p>
					</div>
					<div className="price-detail__pack-info-item">
						<h3 className="price-detail__price">$2.95 P/M</h3>
						<span>Per User</span>
					</div>
				</div>
			</div>
			<div className="price__copy">
				* All prices are not inclusive of any sales tax pr GST applicable in your country
				<br />
				** Minimum 3 hours of charge
			</div>
		</div>)
	}
}

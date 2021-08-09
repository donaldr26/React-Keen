import React from 'react'
import PropTypes from 'prop-types'
import { Link, hashHistory } from 'react-router'

import Invite from '../Invite'
import { NowFreePopup } from '../popups'

import store from '../../store'

export default class TopSection extends React.Component {
	constructor(props) {
		super(props)

		this.state = {
			showModalSocials: false,
			showModalInvite: false
		}
		this.showSocialsPopup = this.showSocialsPopup.bind(this)
		this.showInvite = this.showInvite.bind(this)
	}

	showInvite() {
		this.setState({ showModalInvite: true })
	}

	showSocialsPopup(e) {
		if (e) e.preventDefault()

		this.setState({ showModalSocials: true })
	}

	goContactUs(e) {
		if (e) e.preventDefault()

		this.setState({ showModalSocials: false }, () => hashHistory.push('/contact'))
	}

	render() {
		return (<div className="right-section-top">
			<Link to="/help" className="pull-left"><img className="height_60px" src="/assets/images/need-help.png" alt="" /></Link>
			<div className="inline-block pointer" onClick={ () => this.setState({ showModalInvite: true })}><img src="/assets/images/invite.png" /></div>

			<a href="https://www.facebook.com/KeenSafety" target="_blank" rel="noopener noreferrer" className="f-facebook f-soc"><img src="/assets/images/face-book_02.jpg" /></a>

			{
				// ['t_02.jpg', 'face-book_02.jpg', 'y_02.jpg']
				// 	.map((i, index) => <a href="#" key={index} onClick={this.showSocialsPopup}>
				// 		<img src={`/assets/images/${i}`} />
				// 	</a>)
			}

			<Link
				to="/auth/checkout"
				className="m_left_10"
				onClick={e => {
					e.preventDefault()

					store.layout.confirm(kst('Thank you for using Keen Safety!'), NowFreePopup, [])
				}}
			><img src="/assets/images/cart_04.jpg" /></Link>
			{
				!this.state.showModalSocials
				|| <div className="modal-s">
					<div className="content">
						<h3 className="yellow_title">{kst('Social media coming soon')}</h3>
						<p>{kst('Keen Safety will be on social media in the near future.')}</p>
						<p>{kst('Stay tuned for updates!')}</p>
						<p>{kst('If you need to get in touch, please do not hesitate to contact us using the details on our contact page.')}</p>
						<button className="btn-s bgyellow sm" onClick={this.goContactUs.bind(this)}>{kst('Contact Us')}</button>
						<button className="btn-s bggray sm" onClick={() => this.setState({ showModalSocials: false })}>{kst('Close')}</button>
					</div>
				</div>
			}
			{
				this.state.showModalInvite
					? <Invite
						onCancel={() => this.setState({ showModalInvite: false })}
						onSuccess={() => this.setState({ showModalInvite: false })}
					/>
					: null
			}
		</div>)
	}
}

TopSection.propTypes = { isGuest: PropTypes.bool.isRequired }

import React from 'react'
import { Link } from 'react-router'
import { Row, Col } from 'react-bootstrap'

import store from '../../store'
import serviceUsers from '../../services/users'

import CompleteRegistration from '../CompleteRegistration'
import GetStarted from '../GetStarted'
import ManageEmployees from '../ManageEmployees'

import PopupCheckBox from '../core/PopupCheckBox'
import { WelcomePopup } from '../popups'

const getAppPopupContent = <div className="pad_bot p_bottom_50">
	<div className="max_width_500">
		<h1>{kst('GET THE KEEN SAFETY APP')}</h1>
		<p>
			{kst('Download the Keen Safety app for Android or iOS to remotely manage worksites, generate SWMS, and more!')}
		</p>
		<PopupCheckBox name="dontShow" type="home"/>
	</div>
	<div className="app">
		<div className="right_img rimg_lg">
			<img className="phone-img" src="/assets/images/phones.png" alt="Phones"/>
		</div>
		<div className="download_buttons">
			<Link to={'home'} className="m_right_20 disabled"><img className="soc-icon-img" src="/assets/images/google-play.png" alt="Google play"/></Link>
			<Link to={'home'} className="disabled"><img className="soc-icon-img" src="/assets/images/app-store.png" alt="App store"/></Link>
		</div>
		<div className="right_img rimg_mb">
			<img className="phone-img" src="/assets/images/phones.png" alt="Phones"/>
		</div>
	</div>
</div>

export default class Home extends React.Component {
	constructor(props) {
		super(props)
		this.state = {
			showCompleteRegistration: false,
			showGetStarted: false,
			showManageEmployees: false
		}
	}

	componentDidMount() {
		if (store.isPAH && store.justLoggedIn && store.showPopup('welcome')) {
			store.layout.confirm(kst('Welcome To Keen Safety!'), WelcomePopup, [], 'large')
			store.justLoggedIn = false
			store.layout.setState({ store })
		}
	}

	render() {
		if (store.isGuest) {
			return (<div className="content-section text-center home">
				<h1>{kst('SITE MANAGEMENT AND OHS')}</h1>
				<h1 className="h1-big-size">{kst('MADE EASY')}</h1>
				<div className="home-icons">
					<Row>
						<Col md={3}>
							<img src="/assets/images/home1.png" />
							<br />{kst('Mobile App Tracking')}
						</Col>
						<Col md={3}>
							<img src="/assets/images/home2_03.png" />
							<br />{kst('Files Saved to the Cloud')}
						</Col>
						<Col md={3}>
							<img src="/assets/images/home3_03.png" />
							<br />{kst('Issue & Manage Jobs')}
						</Col>
						<Col md={3}>
							<img src="/assets/images/home4_03.png" />
							<br />{kst('Generate SWMS')}
						</Col>
					</Row>
				</div>
				<Link to={'/auth/signup'} className="btn-s logout-home-btn1 bgyellow">{kst('Sign Up Now')}</Link>
				<div className="home-btn2-group">
					<Link to={'how_it_works'} className="btn-s logout-home-btn2 bgwhite-cblack no-margin pull-left">{kst('How It Works')}</Link>
					<Link to={'auth/login'} className="btn-s logout-home-btn2 bgwhite-cblack no-margin pull-right">{kst('Log In')}</Link>
				</div>
			</div>)
		}

		if (store.isPAH) {
			return (
				<div className="content-section">
					<h1 className="m_bottom_0">{kst('WELCOME TO KEEN SAFETY')}</h1>
					<p>{kst('Begin by selecting one of the options below, or choose from the main menu.')}</p>
					<div>
						<div className="home-item-wrapper">
							<img src="/assets/images/home-1.jpg" alt=""/>
							<div className="btn-wrapper">
								<Link to="/jobs/issue" className="btn-s login-home-btn bgyellow">{kst('Issue job')}</Link>
							</div>
						</div>
						<div className="home-item-wrapper margin_0_20">
							<img src="/assets/images/home-2.jpg" alt=""/>
							<div className="btn-wrapper">
								<Link to="/swms" className="btn-s login-home-btn bgyellow">{kst('GENERATE SWMS')}</Link>
							</div>
						</div>
						<div className="home-item-wrapper margin_20_0">
							<img src="/assets/images/home-3.jpg" alt=""/>
							<div className="btn-wrapper">
								<Link to="/jobs/list" className="btn-s login-home-btn bgyellow">{kst('View all jobs')}</Link>
							</div>
						</div>
						<div className="home-item-wrapper margin_20">
							<img src="/assets/images/home-4.jpg" alt=""/>
							<div className="btn-wrapper">
								<Link to="/staff/employees" className="btn-s login-home-btn bgyellow">{kst('view all staff')}</Link>
							</div>
						</div>
					</div>
					{
						this.state.showCompleteRegistration
							? <CompleteRegistration
								onCancel={() => this.setState({ showCompleteRegistration: false })}
							/>
							: null
					}
					{
						this.state.showGetStarted
							? <GetStarted
								onCancel={() => this.setState({ showGetStarted: false })}
							/>
							: null
					}
					{
						this.state.showManageEmployees
							? <ManageEmployees
								onCancel={() => this.setState({ showManageEmployees: false })}
							/>
							: null
					}
				</div>
			)
		}

		if (store.isSAH) {
			return <div className="content-section">
				<div className="pad_bot p_bottom_50">
					<div>
						<h1>{kst('WELCOME TO KEEN SAFETY')}</h1>
						<p>{kst('Manage your account using the options to the left, or download the Keen Safety app below to begin work.')}</p>
					</div>
					<div className="app">
						<div className="right_img rimg_lg">
							<img className="phone-img" src="/assets/images/phones.png" alt="Phones"/>
						</div>
						<div className="download_buttons download_buttons--lg-margin">
							<Link to={'home'} className="m_right_20 disabled"><img className="soc-icon-img" src="/assets/images/google-play.png" alt="Google play"/></Link>
							<Link to={'home'} className="disabled"><img className="soc-icon-img" src="/assets/images/app-store.png" alt="App store"/></Link>
						</div>
						<div className="right_img right_img--work-site rimg_mb">
							<img className="phone-img" src="/assets/images/phones.png" alt="Phones"/>
						</div>
					</div>
				</div>
			</div>
		}

		return <div className="content-section">{getAppPopupContent}</div>
	}
}

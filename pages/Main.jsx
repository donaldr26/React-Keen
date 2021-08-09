import React from 'react'
import { Link } from 'react-router'

import store from '../../store'

import CompleteRegistration from '../CompleteRegistration'
import GetStarted from '../GetStarted'
import ManageEmployees from '../ManageEmployees'

import PopupCheckBox from '../core/PopupCheckBox'
import { WelcomePopup } from '../popups'

const blocks = [
	{
		backgroundImage: '/assets/images/photo-header-01.jpg',
		title: 'Site managment and whs made easy',
		link: [
			{ title: 'Find out more', href: '/#/construction-commercial' },
			{ title: 'Sign up', href: '/#/pricing' },
			{ title: 'Log in', href: '/#/auth/login' }
		]
	},

	{
		backgroundImage: '/assets/images/photo-header-02.jpg',
		title: 'Government and commercial',
		link: [
			{ title: 'Find out more', href: '/#/government-commercial' },
			{ title: 'Sign up', href: '/#/pricing' },
			{ title: 'Log in', href: '/#/auth/login' }
		]
	},

	{
		backgroundImage: '/assets/images/photo-header-03.jpg',
		title: 'Education',
		link: [
			{ title: 'Find out more', href: '/#/education-commercial' },
			{ title: 'Sign up', href: '/#/pricing' },
			{ title: 'Log in', href: '/#/auth/login' }
		]
	},

	{
		backgroundImage: '/assets/images/photo-header-04.jpg',
		title: 'Health services',
		link: [
			{ title: 'Find out more', href: '/#/health-commercial' },
			{ title: 'Sign up', href: '/#/pricing' },
			{ title: 'Log in', href: '/#/auth/login' }
		]
	}
]

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


const MainNavigationBlock = ({ data }) => <div className="home-box__item" style={{ backgroundImage: `url(${data.backgroundImage})` }}>
	<div className="home-box__shadow">
		<h3 className="home-box__shadow-subtitle">{ data.title }</h3>
	</div>
	<div className="home-box__menu">
		<h3 className="home-box__menu-title">{ data.title }</h3><br />
		{ data.link.map((url, index) => <div key={index}><a className="home-box__menu-link" key={index} href={ url.href }>{ url.title }</a><br /></div>) }
	</div>
</div>


class Main extends React.Component {
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
			return (<div className="home-box__grid">
				<h1 className="home-box__title">A whs tool for every sector</h1>

				{ blocks.map((block, i) => <MainNavigationBlock key={i} data={ block } />)}
			</div>)
		}

		if (store.isPAH) {
			return (<div>
				<div className="home-box__grid">
					<h1 className="home-box__title">A whs tool for every sector</h1>

					{ blocks.map((block, i) => <MainNavigationBlock key={i} data={ block } />)}
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

export default Main

import React from 'react'
import { hashHistory } from 'react-router'
import PropTypes from 'prop-types'
import { Navbar, Nav, NavItem } from 'react-bootstrap'

import Modal from '../core/Modal'

export default class LeftMenu extends React.Component {
	constructor(props) {
		super(props)

		this.state = {
			showSignOut: false,
			showMenu: false
		}

		this.menuItems = {
			admin: {
				'Master Admin': '/admin-master',
				'Sign out': {
					'onClick': () => this.setState({ showSignOut: true })
				}
			},
			guest: {
				'Home': '/home',
				// 'Getting Started': '/getting-started',
				// 'Construction': '/construction-commercial',
				// 'Commercial': '/government-commercial',
				// 'Education': '/education-commercial',
				// 'Health': '/health-commercial',
				'How it works': '/how_it_works',
				'Pricing': '/pricing',
				'Why use us': '/why_use_us',
				'Contact': '/contact',
				// 'Sign Up': '/auth/signup',
				'Login': '/auth/login'
			},
			pah: {
				'Admin': '/admin',
				'Home': '/home',
				'Issue job': '/jobs/issue',
				'Accept a job': '/jobs/accept',
				'View all jobs': '/jobs/list',
				'Manage employees': '/staff/employees',
				'Manage contractors': '/staff/contractors',
				'Manage notification': '/staff/notifications',
				'Work site sign on': '/worksite',
				'Audit Tool': '/audits',
				'Generate SWMS': '/swms',
				'Worksite Info & Docs': '/documents',
				'My account': '/user/account',
				'Contact us': '/contact',
				'Help': '/help',
				'Sign out': {
					'onClick': () => this.setState({ showSignOut: true })
				}
			},
			sah: {
				'Home': '/home',
				'Work site sign on': '/worksite',
				'My account': '/user/account',
				'Contact us': '/contact',
				'Help': '/help',
				'Sign out': {
					'onClick': () => this.setState({ showSignOut: true })
				}
			},
			nah: {
				'Home': '/home',
				'My account': '/user/account',
				'Contact us': '/contact',
				'Help': '/help',
				'Sign out': {
					'onClick': () => this.setState({ showSignOut: true })
				}
			}
		}
	}

	logout() {
		this.setState({ showSignOut: false })
		hashHistory.push('/auth/logout')
	}

	render() {
		const menuItems = this.menuItems[this.props.role]
		const pathName = this.props.path

		return (
			<nav className="navbar navbar-inverse left-menu" role="navigation">
				<Navbar inverse collapseOnSelect>
					<Navbar.Header>
						<Navbar.Toggle />
					</Navbar.Header>
					<Navbar.Collapse>
						<Nav>
							{
								Object.keys(menuItems || []).map((title, i) => {
									const path = menuItems[title]
									const active = pathName.indexOf(path) === 0
									let onClick = typeof path === 'string' ? () => hashHistory.push(path) : path.onClick;

									return <NavItem className={active ? 'active' : ''} key={i} onClick={onClick}>{kst(title)}</NavItem>
								})
							}
							{/* <NavItem href="/"><span>English</span></NavItem>
							<NavItem href="/es"><span>Espanol</span></NavItem> */}
						</Nav>
					</Navbar.Collapse>
				</Navbar>

				<Modal
					isVisible={this.state.showSignOut}
					dialogClassName="text-center"
					onClose={() => this.setState({ showSignOut: false })}>
					<div className="margin_20_0">
						<p className="font-bolder">
							{kst('Are you sure you want to sign out of Keen Safety?')}
						</p>
						<div className="m_top_20">
							<button
								onClick={() => this.setState({ showSignOut: false })}
								className="btn-s bggray sm">
								{kst('Cancel')}
							</button>
							<button
								onClick={this.logout.bind(this)}
								className="btn-s bgyellow sm">
								{kst('Sign out')}
							</button>
						</div>
					</div>
				</Modal>
			</nav>
		)
	}
}
LeftMenu.defautlProps = {
	role: 'guest'
}
LeftMenu.propTypes = {
	role: PropTypes.string.isRequired,
	path: PropTypes.string.isRequired
}

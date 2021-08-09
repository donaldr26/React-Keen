import React from 'react'
import { hashHistory } from 'react-router'

import store from '../../store'

import PopupCheckBox from '../core/PopupCheckBox'

const navigateUrl = (url, replace) => {
	store.layout.confirmClose()
	if (replace) {
		hashHistory.replace(url)
	} else {
		hashHistory.push(url)
	}
}

const WelcomePopup = <div className="popup">
	<p>{kst('To get started please click the My Account > Edit Company button and enter your company details before selecting Save Changes.')}</p>
	<p>{kst('These details are used when issuing jobs, connecting with other businesses associated with Keen Safety and generating SWMS.')}</p>
	<p>{kst('You can return to the My Account page at any time to edit your company / personal details and to view your account summary.')}</p>
	<div className="row">
		<div className="col-lg-6">
			<PopupCheckBox name="dontShow" type="welcome"/>
		</div>
		<div className="col-lg-6">
			<button onClick={() => navigateUrl('/user/account')} className="btn-s party-btn1 bgyellow pull-right">{kst('Continue')}</button>
		</div>
	</div>
</div>

const deleteContractorPopup = <div className="popup">
	<p>{kst('To Delete a Contractor, select the contractor you wish to delete on the Manage Contractors page.')}</p>
	<p>{kst('The contractor will be selected when the row is highlighted orange.')}</p>
	<p>{kst('The Delete a Contractor button will then turn orange, allowing you to select it and prompting a confirmation popup.')}</p>
	<p>{kst('Confirm you want to Delete the Contractor by clicking Delete, the go back to the Manage Contractors page, select Cancel.')}</p>
	<div className="row">
		<div className="col-lg-6">
			<PopupCheckBox name="dontShow" type="deleteContractor"/>
		</div>
		<div className="col-lg-6">
			<button
				onClick={() => {
					store.layout.confirmClose()
				}}
				className="btn-s party-btn1 bgyellow pull-right">{kst('Okay')}</button>
		</div>
	</div>
</div>

const ComingSoonQuickAssign = <div className="popup">
	<p>{kst('The Quick Assign Employee feature is in development and will be coming soon.')}</p>
	<div className="row">
		<div className="col-lg-12 text-center">
			<button
				onClick={() => { store.layout.confirmClose() }}
				className="btn-s party-btn1 bgyellow">{kst('Okay')}</button>
		</div>
	</div>
</div>

const viewContractorPopup = <div className="popup">
	<p>{kst('To view a contractor, select the contractor you wish to view on the Manage Contractors page.')}</p>
	<p>{kst('The contractor will be selected when the row is highlighted orange.')}</p>
	<p>{kst('The View Contractor button will then turn orange, allowing you to select it and view the contractor details.')}</p>
	<p>{kst('Please Note: Only Orange Buttons perform functions.')}</p>
	<div className="row">
		<div className="col-lg-6">
			<PopupCheckBox name="dontShow" type="viewContractor"/>
		</div>
		<div className="col-lg-6">
			<button
				onClick={() => {
					store.layout.confirmClose()
					store.layout.confirm('Delete Contractor', deleteContractorPopup, [], 'large')
				}}
				className="btn-s party-btn1 bgyellow pull-right">{kst('Continue')}</button>
		</div>
	</div>
</div>

const existingContractorPopup = <div className="popup">
	<p>{kst('To add a contractor who has an existing Keen Safety account:')}</p>
	<p>
		<ol>
			<li>{kst('On the Manage Contractors page click Find Existing Contractor')}</li>
			<li>{kst('Enter their email address registered with Keen Safety')}</li>
			<li>{kst('Press Add Contractor')}</li>
			<li>{kst('An invitation popup will appear confirming that an invitation has been sent to the contractor')}</li>
			<li>{kst('Click Close to be sent back to the Manage Contractors page where the contractor will be pending in your contractors list')}</li>
			<li>{kst('The contractor logs into their Keen Safety account and the invitation will appear in their Manage Contractors list')}</li>
			<li>{kst('The Contractor will then select the Business or Contractor who issued the invitation in their Manage Contractors list')}</li>
			<li>{kst('Click Accept Contractor to accept the invitation')}</li>
			<li>{kst('The newly invited contractor will now appear in the inviting contractors Manage Contractors list without the word `pending`')}</li>
		</ol>
	</p>
	<div className="row">
		<div className="col-lg-6">
			<PopupCheckBox name="dontShow" type="existingContractor"/>
		</div>
		<div className="col-lg-6">
			<button
				onClick={() => {
					store.layout.confirmClose()
					store.layout.confirm('View Contractor', viewContractorPopup, [], 'large')
				}}
				className="btn-s party-btn1 bgyellow pull-right"
			>{kst('Continue')}</button>
		</div>
	</div>
</div>

const newContractorPopup = <div className="popup">
	<p>{kst('To add a new contractor under your Keen Safety account:')}</p>
	<p>
		<ol>
			<li>{kst('On the Manage Contractors page click Add New Contractor')}</li>
			<li>{kst('Select Add New Business Pack')}</li>
			<li>{kst('Enter the details of the new contractor you would like to add and select Add Contractor')}</li>
			<li>{kst('Enter payment details and click confirm')}</li>
			<li>{kst('The newly invited contractor will receive an email asking them to join Keen Safety by selecting the Join Keen Safety button')}</li>
			<li>{kst('After clicking the button a new browser window will open and the new contractor will create a password, and in doing so confirm their registration with Keen Safety')}</li>
		</ol>
	</p>
	<div className="row">
		<div className="col-lg-6">
			<PopupCheckBox name="dontShow" type="newContractor"/>
		</div>
		<div className="col-lg-6">
			<button
				onClick={() => {
					store.layout.confirmClose()
					store.layout.confirm('Add an Existing Contractor', existingContractorPopup, [], 'large')
				}}
				className="btn-s party-btn1 bgyellow pull-right">{kst('Continue')}</button>
		</div>
	</div>
</div>

const manageContractorsOverviewPopup = <div className="popup">
	<p>{kst('Keen Safety allows you to issue and subcontract work to Contractors who are linked to your account.')}</p>
	<p>{kst('You can manage the contractors linked to your account on the Manage Contractors page where you can:')}</p>
	<p>
		<ol>
			{/* <li>{kst('Add a new Contractor/Business Pack to your account,')}</li> */}
			<li>{kst('Add an Existing Contractor to your account,')}</li>
			<li>{kst('View Contractor details, and')}</li>
			<li>{kst('Delete a Contractor.')}</li>
		</ol>
	</p>
	<div className="row">
		<div className="col-lg-6">
			<PopupCheckBox name="dontShow" type="contractorsOverview"/>
		</div>
		<div className="col-lg-6">
			<button
				onClick={() => {
					store.layout.confirmClose()
					store.layout.confirm('Add an Existing Contractor', existingContractorPopup, [], 'large')
					// store.layout.confirm('Add a New Contractor', newContractorPopup, [], 'large')
				}}
				className="btn-s party-btn1 bgyellow pull-right"
			>{kst('Continue')}</button>
		</div>
	</div>
</div>

const SetupContractorPopup = <div className="popup">
	<p>{kst('To Issue a Job to a contractor you can either:')}</p>
	<ol>
		{/* <li>{kst('add a new contractor onto your account and you will pay for their account,')}</li> */}
		<li>{kst('invite a contractor to join Keen Safety and set up their own account which they will have to pay for, or')}</li>
		<li>{kst('search for an existing contractor on Keen Safety who has already shared their details with you')}</li>
	</ol>
	<div className="row">
		<div className="col-lg-4 text-center">
			<button onClick={() => navigateUrl('/staff/contractors/new')} className="btn-s party-btn1 bgyellow">{kst('New Contractor')}</button>
		</div>
		<div className="col-lg-4 text-center">
			<button onClick={() => {
				store.layout.confirmClose()
				store.layout.showInvite()
			}} className="btn-s party-btn1 bgyellow">{kst('Invite Contractor')}</button>
		</div>
		<div className="col-lg-4 text-center">
			<button onClick={() => navigateUrl('/staff/contractors/find')} className="btn-s party-btn1 bgyellow">{kst('Find Contractor')}</button>
		</div>
	</div>
</div>

const IssueJobPopup = <div className="popup">
	<p>{kst('To start issuing jobs, you need to have set up Employees and Contractors to issue them to')}</p>
	<div className="row">
		<div className="col-lg-6 text-center">
			<button onClick={() => navigateUrl('/staff/employees/new')} className="btn-s party-btn1 bgyellow">{kst('Set Up Employees')}</button>
		</div>
		<div className="col-lg-6 text-center">
			<button
				onClick={() => {
					store.layout.confirmClose()
					store.layout.confirm(kst('How to Issue a job to a contractor'), SetupContractorPopup, [], 'large')
				}}
				className="btn-s party-btn1 bgyellow"
			>{kst('Set Up Contractor')}</button>
		</div>
	</div>
</div>

const AccountCard = ({ image, title, children }) => <div className="card account-description">
	<div className="row no-gutters">
		<div className="col-md-3">
			<img src={`/assets/images/${image}`} className="card-img" alt="Contractor" />
		</div>
		<div className="col-md-9">
			<div className="card-body">
				<h5 className="card-title">{title}</h5>
				<p className="card-text">{children}</p>
			</div>
		</div>
	</div>
</div>

const accountsPopup = <div className="popup">
	<p>{kst('To start issuing jobs, you must have registered employees or contractors.')}</p>
	<p>{kst('Keen Safety provides four different account types to suit your needs:')}</p>
	<AccountCard image="ContractorAcc.png" title="Business/Contractor Accounts:">
		{kst('Perfect for businesses and sole traders alike, these account holders have full access to all of Keen Safety\'s functions and are able to issue and subcontract jobs, remotely manage employees and create job reports.')}
	</AccountCard>
	<AccountCard image="EmployeeAcc.png" title="Employee Accounts:">
		{kst('Employee accounts are designed to be used on our Keen Safety app. Businesses and Contractors can issue jobs to their staff on site and allow them to: sign on and off a worksite, issue job notifications, sign and view SWMS, record purchases and record when they start and end their breaks.')}
	</AccountCard>
	<AccountCard image="LeadingHandAcc.png" title="Leading Hand Employees:">
		{kst('Leading hand employees have all the functions of regular employees but are able to be assigned supervisor responsibilities and carry out start/end of day safety inspections, generate SWMS, and send employees to site. To register a Leading Hand employee, tick Yes to the "Is this employee a Leading Hand" question when setting up an employee account.')}
	</AccountCard>
	<AccountCard image="NotificationAcc.png" title="Notification Accounts:">
		{kst('Notification account holders can issue safety hazard and job notifications to business/contractor accounts.')}
	</AccountCard>
	<hr />
	<div className="row">
		<div className="col-lg-12 text-right">
			<button onClick={() => navigateUrl('/staff/employees')} className="btn-s party-btn1 bgyellow">{kst('Set Up Employees')}</button>
			<button onClick={() => navigateUrl('/staff/contractors')} className="btn-s party-btn1 bgyellow">{kst('Add Contractors')}</button>
		</div>
	</div>
</div>

const NowFreePopup = <div className="popup text-center">
	<p>{kst('To upgrade or Cancel your subscription Contact Us')}</p>
	<div className="row">
		<div className="col-lg-12 text-center">
			<button onClick={() => navigateUrl('/contact')} className="btn-s party-btn1 bgyellow">{kst('Contact Us')}</button>
		</div>
	</div>
</div>

const LimitedTimeOffer = <div className="popup text-center">
	{/* <p>{kst('Sign Up Today and get 1 Month Free Trial - No Lock in Contract')}</p>
	<p>{kst('Limited introductory pricing, sign up now!')}</p>
	<p>{kst('Prices are locked for a guaranteed two years')}</p>
	<p>{kst('No fixed contract, cancel anytime!')}</p> */}
	<p>{kst('Sign Up Today!')}</p>
	<p>{kst('First 4 weeks FREE!')}</p>
	<p>{kst('No lock in contract.')}</p>
	<div className="row">
		<div className="col-lg-12 text-center">
			<button onClick={() => store.layout.confirmClose()} className="btn-s party-btn1 bgyellow">{kst('Okay')}</button>
		</div>
	</div>
</div>

const NoBusinessPackSelected = <div className="popup text-center">
	<p>{kst('An employee pack needs to be associated with a business.')}</p>
	<p>{kst('If you\'re an employee, contact your employer to have them add you to their business pack.')}</p>
	<p>{kst('If you\'re an employer and new to Keen Safety select a business pack to add employee and notification accounts now.')}</p>
	<p>{kst('If you\'re an employer and have existing Keen Safety business pack, click Log In to add more employees and notification accounts now.')}</p>
	<div className="row">
		<div className="col-lg-6 text-right">
			<button onClick={() => navigateUrl('/auth/login', true)} className="btn-s party-btn1 bggray">{kst('Log In')}</button>
		</div>
		<div className="col-lg-6 text-left">
			<button onClick={() => store.layout.confirmClose()} className="btn-s party-btn1 bgyellow">{kst('Okay')}</button>
		</div>
	</div>
</div>


export {
	PopupCheckBox,
	ComingSoonQuickAssign,

	WelcomePopup,
	IssueJobPopup,
	SetupContractorPopup,
	manageContractorsOverviewPopup,
	accountsPopup,
	NowFreePopup,
	LimitedTimeOffer,
	NoBusinessPackSelected
}

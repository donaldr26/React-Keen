import React from 'react'

const HelpBlock = ({ uri }) => <div className="col-md-6">
	<div className="contact-details">
		<p className="address">{uri}<br />
			137 Bage Street,<br />
			Nundah, Brisbane,<br />
			4012</p>
		<p className="email">admin@keensafety.com.au</p>
		<p className="phone">(07) 3103 3665</p>
	</div>
</div>

const HelpCard =  ({ title, uri, image, buttons = [] }) => {
	if (!buttons.length) buttons = [{ title: 'DOWNLOAD', uri }]

	return <div className="col-md-6 help-card text-center">
		<img src={image} className="thumbnail card-img-top" alt="..." style={{ marginBottom: '13px', border: 'none' }}/>
		<div className="card-body help-text-block">
			<h4 className="card-title">{title}</h4>
			{ buttons.map((x, i) => <a key={i} href={x.uri} target="_blank" className="btn-s bgyellow party-btn1" style={{ width: 'auto', paddingLeft: '15px', paddingRight: '15px' }}>{x.title}</a>) }
		</div>
	</div>
}

const businessButtons = [
	{
		title: 'Office user guide',
		uri: '/assets/legal/business_account_office_user_guide.pdf'
	},
	{
		title: 'Onsite user guide',
		uri: '/assets/legal/business_app_keen_safety_user_guide.pdf'
	}
]

const Help = () => <div className="content-section contact_section">
	<h1>{kst('HELP')}</h1>
	<p>{kst('Keen Safety provides in-depth user guides for all account types accessible here and through the app via the Help tab in side menu.')}</p>
	<div className="row">
		<HelpCard
			title="Business Account User Guide"
			buttons={businessButtons}
			image="/assets/images/help-business.png"
		/>
		<HelpCard
			title="Leading Hand Account User Guide"
			uri="/assets/legal/ks-user-guide-lh.pdf"
			image="/assets/images/help-leading-hand.png"
		/>
	</div>
	<br/>
	<div className="row">
		<HelpCard
			title="General Hand Account User Guide"
			uri="/assets/legal/ks-user-guide-gh.pdf"
			image="/assets/images/help-general-hand.png"
		/>
		<HelpCard
			title="Notifications Account User Guide"
			uri="/assets/legal/ks-user-guide-notification.pdf"
			image="/assets/images/help-notification.png"
		/>
	</div>
</div>

export default Help

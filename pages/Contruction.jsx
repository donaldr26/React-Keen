import React from 'react'
import { Link } from 'react-router'

import TitleCommercial from '../TitleCommercial'
import IconsCommercial from '../IconsCommercial'

const title = {
	name: 'SITE MANAGEMENT AND WHS MADE EASY',
	subtitle: 'Once your business is a member of Keen Safety you will be able to:'
}

const options = [
	{ title: 'REMOTELY ISSUE JOBS', description: 'To staff and contractors', icon: 1 },
	{ title: 'RECORD STAFF & CONTRACTOR DETAILS', description: 'Including all licenses and tickets', icon: 2 },
	{ title: 'ACCEPT AND SUBCONTRACT JOBS', description: 'That have been issued to you', icon: 3 },
	{ title: 'PRODUCE VIDEO AND PHOTO RECORDS', description: 'Safety compliance evidence stored on the cloud', icon: 4 },
	{ title: 'RECORD SITE SAFETY PRACTICES', description: 'Keep secure records of safety initiatives', icon: 5 },
	{ title: 'RECORD ALL SAFETY MEETINGS', description: 'Records to protect your business', icon: 6 },
	{ title: 'GENERATE SWMS AND WHS PLANS', description: 'Add produces and distributes safety plans', icon: 7 },
	{ title: 'TIME AND GPS STAMPING', description: 'Manage your labor costs remotely', icon: 8 }
]

const Construction = () => <div className="clearfix">
	<div className="content-section commercial-construction">

		<TitleCommercial title={ title } />

		<div className="clearfix bgwhite-cblack media-project-details">
			{ options.map((item, i) => <IconsCommercial key={i} options={ item } />)}
		</div>
	</div>
	<div className="content-section bgwhite how-it-work-info">
		<h2 className="cgray">{kst('The keen safety app in action')}</h2>
		<img src="../assets/images/commercial-con.jpg" alt="Smiley face" />
		<div className="padding_30_0 text-center">
			<Link to={'/auth/signup'} className="content-section__btn">{kst('Sign Up')}</Link>
		</div>
	</div>
</div>

export default Construction

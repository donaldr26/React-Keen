import React from 'react'
import { Link } from 'react-router'

import TitleCommercial from '../TitleCommercial'
import IconsCommercial from '../IconsCommercial'

const title = {
	name: 'MAKE SAFETY A PRIORITY AT YOUR SCHOOL',
	subtitle: `Once you're business is a member of Keen Safety you will be able to:`
}

const options = [
	{ title: 'SEND AND RECEIVE NOTIFICATIONS OF WHS ISSUES', description: 'Send notifications from your phone in the classroom and receive them instantly on the website in the office', icon: 1 },
	{ title: 'RECORD SITE SAFETY PRACTICES AND WORK PROGRESS UPDATES', description: 'Keep secure records of onsite safety initiatives and request work progress updates', icon: 2 },
	{ title: 'QUICK ASSIGN AND ISSUES JOBS TO CONTACTORS', description: 'Receive notifications and quick assign work to an employee or create a job and issue it to contactors', icon: 3 },
	{ title: 'PRODUCE PHOTO AND AUDIO RECORDS', description: 'Safety compliance evidence stored on the cloud', icon: 4 },
	{ title: 'RECORD SITE CONTRACTOR DETAILS', description: 'Have all staff and contractor details available from the click of a button including all licences, tickets and', icon: 5 },
	{ title: 'RECORD PRE START TALKS GENERATE SWMS AND WHS MANAGMENT PLANS', description: 'Record Pre Start Talks and generate SWMS and WHS Management Plans from the app, saved on the cloud and available fro review on the website', icon: 6 },
	{ title: 'REMOTELY MANAGE WORK AND STAFF/CONTACTORS ONSITE', description: 'All data recorded onsite is immediately available though the Admin menu on the Keen Safety website', icon: 7 },
	{ title: 'TIME AND GPS STAMPING', description: 'Manage your labor costs remotely', icon: 8 }
]

const Education = () => <div className="clearfix">
	<div className="content-section commercial-edu">

		<TitleCommercial title={ title } />

		<div className="clearfix bgwhite-cblack media-project-details">
			{ options.map((item, i) => <IconsCommercial key={i} options={ item } />)}
		</div>
	</div>
	<div className="content-section bgwhite how-it-work-info">
		<h2 className="cgray">{kst('The keen safety app in action')}</h2>
		<img src="../assets/images/commercial-edu.jpg" alt="Smiley face" />
		<div className="padding_30_0 text-center">
			<Link to={'/auth/signup'} className="content-section__btn">{kst('Sign Up')}</Link>
		</div>
	</div>
</div>

export default Education

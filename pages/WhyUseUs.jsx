import React from 'react'

const Card = ({ title, icon, text }) => <div className="panel wuu-card col-lg-6">
	<div className="panel-body no-padding">
		<div className="col-lg-3 icon">
			<img src={`/assets/icons/${icon}`} className="thumbnail" />
		</div>
		<div className="col-lg-9" style={{ padding: '0' }}>{text}</div>
	</div>
	<div className="panel-footer">{title.toUpperCase()}</div>
</div>

const cards = [
	{
		title: 'Generate SWMS',
		icon: 'wuu-generate_audit.png',
		text: 'Quickly and easily generate site specific SWMS. Choose from the Keen Safety standard control measures and adjust them to suit your site or input customised control measures specific to your business. Only set up control measures once and then they are always available for future use.'
	},
	{
		title: 'Supports Social Distancing',
		icon: 'wuu-social_distancing.png',
		text: 'Promote Social Distancing by Managing both local and remote work using the suite of tools in Keen Safety which allow work allocation, progress monitoring and safety auditing.  All records are immediately available from any net connected device.'
	},
	{
		title: 'Audit Sites & Equipment',
		icon: 'wuu-audit_tool.png',
		text: 'Create customized audits using the Keen Safety Web Portal and then distribute them through the Keen Safety App. Write pre-start audits for heavy machinery or a check for all tagged electrical equipment on a site; whenever you need consistent processes and recording use the Audit Tool.'
		//  Records can include photos and voice, all immediately live for review from any web connected device.
	},
	{
		title: 'Issue Hazard Notifications',
		icon: 'wuu-hazard_notification.png',
		text: 'All Users can raise hazard notifications, including images and voice recordings, which are immediately available to Site Safety Managers or any other authorised party.'
	},
	{
		title: 'Document Make Safe Actions',
		icon: 'wuu-make_safe.png',
		text: 'When field staff respond to hazards they can record all of their actions, including photos, voice records and notes, creating electronic compliance records.'
	},
	{
		title: 'Record Safety Meetings',
		icon: 'wuu-record_safety_meetings.png',
		text: 'Create records of safety meetings such as pre-start talks and include an electronic record of attendance. Additionally you can require staff and contractors who attend a safety briefing to record their agreement to act in accord with the briefing.'
	},
	{
		title: 'Create Safety Records',
		icon: 'wuu-safety_records.png',
		text: 'Whether you are generating site specific SWMS and signing them electronically, hazard notifications or hazard management responses all of your safety reports are saved electronically and available to Administrators on any web connected device.'
	},
	{
		title: 'Take 5s',
		icon: 'wuu-take_5.png',
		text: 'Create customised TAKE 5.s to suit each of your company\'s sites and then have staff complete them electronically on site. Access the completed TAKE 5.s from any net connected device no more lost forms and know immediately when TAKE 5.s are completed'
	},
	{
		title: 'Handover Reports',
		icon: 'wuu-handover_report.png',
		text: 'Site staff can prepare an end of shift report including images and voice recordings creating an electronic record of progress during a shift and handover notes for the next team.'
	},
	{
		title: 'Centralised Communication Tool',
		icon: 'wuu-centralised_tool.png',
		text: 'Cut down on paperwork and increase the efficiency of your site management. Our innovative WebPortal and user-friendly app bridge the gap between Project Managers, Safety Mangers, Accounts and Field Staff.'
	},
	{
		title: 'Site Documents Sharing',
		icon: 'wuu-site_document_sharing.png',
		text: 'Share emergency evacuation plans, contact lists, site rules, plans and technical drawings or anything else relevant to a site that you need to share. Immediately available to other Users logged onto a site or job on a site.'
	},
	{
		title: 'Record Staff & Contractor Details',
		icon: 'wuu-record_staff_details.png',
		text: 'Centralise your staff and contractor records and access them from any net connected device including: site safety qualification, trade qualifications, operator tickets. Check at any time to make sure qualified people are operating equipment on your sites.'
	},
	{
		title: 'Issue & Manage Jobs',
		icon: 'wuu-issue_jobs.png',
		text: 'Remote Site Management made easy: assign staff and contractors to sites and jobs, move people between sites, log start and finish times and have field staff raise progress reports and handover reports on demand - all remotely.'
	},
	{
		title: 'Timekeeping',
		icon: 'wuu-time_keeping.png',
		text: 'Time keeping is made simple with electronic time, date and GPS records available for all contractors and staff. Know who is on site if you have an emergency and ensure no one is left in peril.'
	},
	{
		title: 'Produce Photo, Text & Voice Records',
		icon: 'wuu-produce_audio.png',
		text: 'Easily have site staff and contractors create safety compliance, quality assurance and project management records on site and then access from any net connected device.'
	}
]

export default class WhyUseUs extends React.Component {
	render() {
		return (<div className="content-section" style={{ backgroundColor: 'black', color: 'white' }}>
			<h1 style={{ color: 'white' }}>{kst('WHY USE KEEN SAFETY')}</h1>
			<p style={{ color: 'white' }}>{kst('Workplace Health and Safety Obligations can be complicated and compilance can be difficult.')}</p>
			<p style={{ color: 'white' }}>{kst('Keen Safety was designed to steamline and simplify the process of compilance.')}</p>
			{ cards.map((x, i) => <Card key={i} {...x} />) }
			<div className="panel wuu-card col-lg-6">
				<div className="panel-body no-padding">
					<img src={`/assets/icons/wuu-logo.png`} style={{ maxWidth: '341px' }} />
				</div>
			</div>
		</div>)
	}
}

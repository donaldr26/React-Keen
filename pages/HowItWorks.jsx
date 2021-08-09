import React from 'react'
import { Link } from 'react-router'

const HowItWorks = () => <div className="clearfix">
	<div className="content-section how-it-works hidden">
		<h1>{kst('HOW IT WORKS')}</h1>
		<p>{kst('Once your business is a member of Keen Safety you will be able to:')}</p>
		<div className="clearfix bgwhite-cblack media-project-details">
			<div className="how-box">
				<h3>{kst('REMOTELY ISSUE JOBS')}</h3>
				<p>{kst('To staff and contractors')}</p>
			</div>
			<div className="how-box icon2">
				<h3>{kst('RECORD STAFF & CONTRACTOR')} {kst('DETAILS')}</h3>
				<p>{kst('Including all licenses and tickets')}</p>
			</div>
			<div className="how-box icon3">
				<h3>{kst('ACCEPT AND SUBCONTRACT JOBS')}</h3>
				<p>{kst('That have been issued to you')}</p>
			</div>
			<div className="how-box icon4">
				<h3>{kst('PRODUCE VIDEO AND PHOTO RECORDS')}</h3>
				<p>{kst('Safety compliance evidence stored on the cloud')}</p>
			</div>
			<div className="how-box icon5">
				<h3>{kst('RECORD SITE SAFETY PRACTICES')}</h3>
				<p>{kst('Keep secure records of safety initiatives')}</p>
			</div>
			<div className="how-box icon6">
				<h3>{kst('RECORD ALL SAFETY MEETINGS')}</h3>
				<p>{kst('Records to protect your business')}</p>
			</div>
			<div className="how-box icon7">
				<h3>{kst('GENERATE SWMS AND WHS PLANS')}</h3>
				<p>{kst('App produces and distributes safety plans')}</p>
			</div>
			<div className="how-box icon8">
				<h3>{kst('TIME AND GPS STAMPING')}</h3>
				<p>{kst('Manage your labor costs remotely')}</p>
			</div>
		</div>
	</div>
	<div className="content-section bgwhite how-it-work-info">
		<h1 className="text-center">{kst('HOW IT WORKS')}</h1>
		<img src="../assets/images/hiw.png" alt="How it works diagram" />
		<div className="padding_30_0 text-center">
			<Link to={'/pricing'} className="btn-s party-btn1 bggray">{kst('Pricing')}</Link>
			<Link to={'/auth/signup'} className="btn-s party-btn2 bgyellow">{kst('Sign Up')}</Link>
		</div>
	</div>
</div>

export default HowItWorks

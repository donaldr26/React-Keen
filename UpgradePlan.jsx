import React from 'react'
import { hashHistory } from 'react-router'

const UpgradePlan = (props) => <div>
	<div>
		<h2>{kst('UPGRADE YOUR ACCOUNT')}</h2>
		<p>
			{kst('You\'ve reached your current registered employee limit, and will not be able to manage this employee until your subscription has been updated.')}
		</p>
		<p>{kst('This employee account has been added to your cart for purchase.')}</p>
		<p>{kst('Would you like to continue adding staff members, or check out now?')}</p>
	</div>
	{
		props.buttons ||
		<div className="margin_40_0">
			<button className="btn-s party-btn1 bggray" onClick={() => hashHistory.goBack()}>{kst('BACK')}</button>
			<button className="btn-s party-btn2 bgyellow" onClick={() => hashHistory.push('/user/cart')}>{kst('Check out')}</button>
		</div>
	}
</div>

export default UpgradePlan

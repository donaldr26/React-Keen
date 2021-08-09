import React from 'react'

const TitleCommercial = ({ title: { name, subtitle } }) => <div>
	<h1 className="content-section__title">{ kst(`${name}`) }</h1>
	<p className="content-section__subtitle">{ kst(`${subtitle}`) }</p>
</div>

export default TitleCommercial

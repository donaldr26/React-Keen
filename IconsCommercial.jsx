import React from 'react'

const IconsCommercial = ({ options: item, key: i }) => <div
	key={i} className={ `how-box ${i === 0 ? '' : `icon${  item.icon}`}`}>
	<h3>{kst(`${item.title}`)}</h3>
	<p>{kst(`${item.description}`)}</p>
</div>

export default IconsCommercial

import filesize from 'filesize'
import React from 'react'

const ScopeFile = ({ name, size, uri }) => <span>
	<a href={uri} target="_blank">{name}</a> <small className="text-muted ml-2">{filesize(size)}</small>
</span>

export default ScopeFile

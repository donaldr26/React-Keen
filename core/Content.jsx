import React from 'react'
import PropTypes from 'prop-types'
import Spinner from 'react-spinkit'
import classNames from 'classnames'

export default class Content extends React.Component {
	render() {
		const {className, isLoading, tag, ...props} = this.props
		const Tag = tag || 'div'

		return <Tag className={classNames([className, {'sk-loading': isLoading}])} {...props}>
			{isLoading && <Spinner name="folding-cube" color="#fbaf17" fadeIn="quarter" />}
			{this.props.children}
		</Tag>
	}
}

Content.propTypes = {
	tag: PropTypes.string.isRequired,
	isLoading: PropTypes.bool.isRequired
}

Content.defaultProps = {
	tag: 'div',
	isLoading: false
}

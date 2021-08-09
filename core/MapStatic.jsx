import React from 'react'
import PropTypes from 'prop-types'
import querystring from 'query-string'

// https://developers.google.com/maps/documentation/static-maps/intro#top_of_page
export default class MapStatic extends React.Component {
	render() {
		const params = {
			center: this.props.center || this.props.markers[0].geo,
			zoom: this.props.zoom,
			size: this.props.size,
			maptype: this.props.mapType,
			key: 'AIzaSyAohJud_FvlijK7cVsdiWTiMNXYMUoxyp0'
		}

		let uri = `https://maps.googleapis.com/maps/api/staticmap?${querystring.stringify(params)}`
		// &markers=color:red%7C${data.geo_lat},${data.geo_lng}
		this.props.markers.forEach(x => {
			const markerParams = Object.keys(x).reduce((all, key) => {
				if (key !== 'geo') all.push([key, x[key]])

				return all
			}, [])
			const urlParams = markerParams.map(p => p.join(':'))
			// Adding center
			urlParams.push([x.geo.lat, x.geo.lng].join(','))
			uri += `&markers=${encodeURI(urlParams.join('|'))}`
		})

		return <img src={uri}/>
	}
}

MapStatic.propTypes = {
	center: PropTypes.string,
	zoom: PropTypes.number,
	size: PropTypes.string,
	mapType: PropTypes.string,
	markers: PropTypes.array.isRequired
}

MapStatic.defaultProps = {
	// zoom: 13,
	size: '600x300',
	mapType: 'roadmap',
	markers: []
}

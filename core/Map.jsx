import React from 'react'
import PropTypes from 'prop-types'

import { compose, withStateHandlers } from 'recompose'

import { withGoogleMap, withScriptjs, GoogleMap, InfoWindow, Marker } from 'react-google-maps'

const MapComponent = compose(
	withStateHandlers(() => ({
		isOpen: false
	}), {
		onToggleOpen:() => (i) => ({ isOpen: i }),
		closeAll: () => () => ({ isOpen: false })
	}),
	withScriptjs,
	withGoogleMap
)(props =>
    <GoogleMap
		defaultZoom={props.zoom || 14}
		defaultCenter={props.center}
	>
		{
            
			props.markers.filter(x => Number(x.position.lng)).map((x, i) => {
				return <Marker key={i} {...x} onClick={props.onToggleOpen.bind(this, i)}>
					{props.isOpen === i && <InfoWindow onCloseClick={props.closeAll}>
						<span>{x.info}</span>
					</InfoWindow>}
				</Marker>
			})
		}
	</GoogleMap>
)

export default class Map extends React.Component {
	render() {
		return (<MapComponent
		  googleMapURL="https://maps.googleapis.com/maps/api/js?v=3.exp&key=AIzaSyAohJud_FvlijK7cVsdiWTiMNXYMUoxyp0&libraries=geometry,drawing,places"
		  loadingElement={<div style={{ height: `100%` }} />}
		  containerElement={<div style={{ height: `400px` }} />}
		  mapElement={<div style={{ height: `100%` }} />}
		  {...this.props}
		/>)
	}
}

Map.propTypes = {
	markers: PropTypes.array.isRequired
}

Map.defaultProps = {
	markers: []
}

import React, { Component } from 'react';
import { View } from 'react-native';
import MapboxGL from "@react-native-mapbox-gl/maps";
import Marker from '~/assets/room-2x.png'
import {featureCollection, feature} from '@turf/helpers';
import WF_Off from '~/Wayfinder_Offline';
import { cornerCoordinates } from './Utils'

const styles = {
    icon: {
        iconImage: Marker,
        iconAllowOverlap: true,
    },
}

const overlay = {
    url: "",
    coordinates: [[0,0], [0,0], [0,0], [0,0]],
}
Object.freeze(overlay)

/**
 * Map component smaller than <Main /> in size and functionality. Intended for Location or Event details.
 */
export class Mini extends Component {
    constructor(props) {
        super(props)

        this.renderMap = true;

        // Sanity check our location id prop
        if (typeof props.locationId === 'undefined' || props.locationId == null) {
            this.renderMap = false;
        } else {
            // Find a suitable place in the map to center to based on the location id
            this.location = this.findSuitableLocations(props.locationId);

            // Build a GeoJSON feature based on the suitable location and set our map image overlay
            this.state = {
                location: featureCollection([feature({
                    "coordinates": [parseFloat(this.location.mp_lng), parseFloat(this.location.mp_lat)],
                    "type": "Point"
                })]),
                overlay: this.buildOverlayState(props.locationId)
            };
        }
    }

    /**
     * Create state parameters for an overlay if the location is a room (type 2)
     * 
     * @param {integer} locationId location's Id to look up
     * @returns {object} overlay props that can be used in the component's state
     */
    buildOverlayState = (locationId) => {
        const location = WF_Off.findLocationById(locationId)
        let overlayDraft = { ...overlay }

        if (location.type === 2) {
            const floor = WF_Off.findFloorById(location.floor_id)

            if (location.floor_id !== null) {
                // Get corners and image url and set to overlay parameters draft
                overlayDraft = {
                    coordinates: cornerCoordinates(
                        [floor.ne_lng, floor.ne_lat],
                        [floor.sw_lng, floor.sw_lat]
                    ),
                    url: floor.overlay_url
                }
            }

        }

        return overlayDraft
    }

    /**
     * Find a suitable location to center in the map as there may be locations that do not have
     * coordinates set. If the current location does not have coordinates, it looks up on its
     * parent location and iterates until one is found.
     * 
     * @param {integer} locationId location Id to look up for a suitable location
     * @return {object} a suitable location object
     */
    findSuitableLocations(locationId)
    {
        let location = WF_Off.findLocationById(locationId)

        if (location.mp_lng && location.mp_lat) {
            return location;
        } else {
            return this.findSuitableLocations(location.parent_id);
        }
    }

    render() {
        if (this.renderMap) {
            return (
                <View style={{width: '100%', height: 400}}>
                    <MapboxGL.MapView style={{flex: 1}}>
                        <MapboxGL.Camera centerCoordinate={[parseFloat(this.location.mp_lng), parseFloat(this.location.mp_lat)]} zoomLevel={17} />
                        <MapboxGL.UserLocation visible={true} />
    
                        <MapboxGL.ShapeSource id="locationSource" hitbox={{width: 36, height: 36}} shape={this.state.location}>
                            <MapboxGL.SymbolLayer id="locationSymbols" minZoomLevel={0} style={styles.icon} />
                        </MapboxGL.ShapeSource>

                        <MapboxGL.ImageSource 
                            id="mapOverlaySource"
                            coordinates={this.state.overlay.coordinates}
                            url={this.state.overlay.url}>
                            <MapboxGL.RasterLayer id="mapOverlayLayer" belowLayerID="locationSymbols" />
                        </MapboxGL.ImageSource>
                    </MapboxGL.MapView>
                </View>
            );
        }
        else {
            // Don't render
            return(null);
        }
    }
}
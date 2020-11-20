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

export class Mini extends Component {
    constructor(props) {
        super(props)

        this.renderMap = true;

        if (typeof props.locationId === 'undefined' || props.locationId == null) {
            this.renderMap = false;
        } else {
            this.location = this.findSuitableLocations(props.locationId);

            this.state = {
                location: featureCollection([feature({
                    "coordinates": [parseFloat(this.location.mp_lng), parseFloat(this.location.mp_lat)],
                    "type": "Point"
                })]),
                overlay: this.buildOverlayState(props.locationId)
            };
        }
    }

    buildOverlayState = (locationId) => {
        const location = WF_Off.findLocationById(locationId)
        let overlayDraft = { ...overlay }

        if (location.type === 2) {
            const floor = WF_Off.findFloorById(location.floor_id)

            if (location.floor_id !== null) {
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
                <View>
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
            return(null);
        }
    }
}
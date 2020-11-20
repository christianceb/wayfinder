import React, { Component } from 'react';
import { View } from 'react-native';
import { MapView, Camera, UserLocation, ShapeSource, SymbolLayer } from "@react-native-mapbox-gl/maps";
import Marker from '~/assets/room-2x.png'
import {featureCollection, feature} from '@turf/helpers';
import WF_Off from '~/Wayfinder_Offline';

const styles = {
    icon: {
        iconImage: Marker,
        iconAllowOverlap: true,
    },
};

export class Mini extends Component {
    constructor(props) {
        super(props)

        this.renderMap = true;

        // TODO: do not render if location is not set (done), and if there is no coordinates data

        if (typeof props.locationId === 'undefined' || props.locationId == null) {
            this.renderMap = false;
        } else {
            this.location = this.findSuitableLocations(props.locationId);

            this.state = {
                location: featureCollection([feature({
                    "coordinates": [parseFloat(this.location.mp_lng), parseFloat(this.location.mp_lat)],
                    "type": "Point"
                })])
            };
        }
    }

    findSuitableLocations(location_id)
    {
        let location = WF_Off.findLocationById(location_id)

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
                    <MapView style={{flex: 1}}>
                        <Camera centerCoordinate={[parseFloat(this.location.mp_lng), parseFloat(this.location.mp_lat)]} zoomLevel={17} />
                        <UserLocation visible={true} />
    
                        <ShapeSource id="locationSource" hitbox={{width: 36, height: 36}} shape={this.state.location}>
                            <SymbolLayer id="locationSymbols" minZoomLevel={0} style={styles.icon} />
                        </ShapeSource>
                    </MapView>
                </View>
            );
        }
        else {
            return(null);
        }
    }
}
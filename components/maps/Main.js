import React, { Component } from 'react';
import { View } from 'react-native';
import MapboxGL, { MapView, Camera, UserLocation } from "@react-native-mapbox-gl/maps";
import { FAB } from 'react-native-paper';
import Baseline from './Baseline'
import LocationsData from '~/locations/data.json'
import Marker from '~/assets/room-2x.png'
import {featureCollection, feature} from '@turf/helpers';

const styles = {
    icon: {
      iconImage: Marker,
      iconAllowOverlap: true,
    },
  };

export class Main extends Component {
    constructor(props) {
        super(props)

        const features = this.buildFeatures();

        this.state = {
            timestamp: 0,
            latitude: Baseline.Lat,
            longitude: Baseline.Lng,
            campuses: featureCollection([...features.campuses]),
            buildings: featureCollection([...features.buildings]),
        };

        this.onUserLocationUpdate = this.onUserLocationUpdate.bind(this);
        this.onRegionDidChange = this.onRegionDidChange.bind(this);
        this.centerPosition = this.centerPosition.bind(this);
    }

    buildFeatures() {
        const grouped = {'campuses': [], 'buildings': [], 'rooms': []};

        for (const location of LocationsData) {
            let group = null

            if (location.type === 0) {
                group = 'campuses'
            }
            else if (location.type === 1) {
                group = 'buildings'
            }

            // Only show locations that have coordinates in them
            if (group && location.mp_lat && location.mp_lng) {
                let feat = this.buildFeature(location)
                console.log(feat);
                grouped[group].push(feat);
            }
        }

        return grouped;
    }

    buildFeature(location) {
        const geometry = {
            "coordinates": [parseFloat(location.mp_lng), parseFloat(location.mp_lat)],
            "type": "Point"
        }

        return feature(geometry, null, {id: location.id});
    }

    centerPosition() {
        this._camera.setCamera({
            centerCoordinate: [this.state.longitude, this.state.latitude],
            zoomLevel: 17,
            animationDuration: 2000,
        });
    }

    async onRegionDidChange() {
        // const visibleBounds = await this._map.getVisibleBounds();
        // const zoom = await this._map.getZoom();
    }

    onUserLocationUpdate(location) {
        this.setState({
            timestamp: location.timestamp,
            latitude: location.coords.latitude,
            longitude: location.coords.longitude,
        });
    }

    componentDidMount() {
        MapboxGL.setAccessToken("pk.eyJ1IjoiY2hyaXN0aWFuY2ViIiwiYSI6ImNrZDN4MzQyODEwcTMyc251ZGJnY3R2aDYifQ.Iip2TLYYP-vYS145IdHWXQ")
        MapboxGL.setTelemetryEnabled(false)
    }

    render() {
        return (
            <View style={{flex: 1}}>
                <MapView style={{flex: 1}} ref={(map) => (this._map = map)} onRegionDidChange={this.onRegionDidChange}>
                    <UserLocation visible={true} onUpdate={this.onUserLocationUpdate} />
                    <Camera ref={(camera) => (this._camera = camera)} centerCoordinate={[Baseline.Lng, Baseline.Lat]} zoomLevel={10} />

                    <MapboxGL.ShapeSource id="campusesSource" hitbox={{width: 36, height: 36}} shape={this.state.campuses}>
                        <MapboxGL.SymbolLayer id="campusesSymbols" minZoomLevel={0} maxZoomLevel={14} style={styles.icon} />
                    </MapboxGL.ShapeSource>
                    <MapboxGL.ShapeSource id="buildingsSource" hitbox={{width: 36, height: 36}} shape={this.state.buildings}>
                        <MapboxGL.SymbolLayer id="buildingsSymbols" minZoomLevel={14} maxZoomLevel={18} style={styles.icon} />
                    </MapboxGL.ShapeSource>

                </MapView>
                <FAB icon="map-marker" large onPress={this.centerPosition} style={{position: 'absolute', right: 0, bottom: 0, margin: 16, backgroundColor: "#da272d"}} />
            </View>
        );
    }
}
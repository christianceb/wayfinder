import React, { Component } from 'react';
import { View } from 'react-native';
import MapboxGL, { MapView, Camera, UserLocation } from "@react-native-mapbox-gl/maps";
import { FAB } from 'react-native-paper';
import Baseline from './Baseline'

export class Main extends Component {
    constructor(props) {
        super(props)

        this.state = {
            timestamp: 0,
            latitude: Baseline.Lat,
            longitude: Baseline.Lng,
        };

        this.onUserLocationUpdate = this.onUserLocationUpdate.bind(this);
        this.onRegionDidChange = this.onRegionDidChange.bind(this);
        this.centerPosition = this.centerPosition.bind(this);
    }

    centerPosition() {
        this._camera.setCamera({
            centerCoordinate: [this.state.longitude, this.state.latitude],
            zoomLevel: 17,
            animationDuration: 2000,
        });
    }

    async onRegionDidChange() {
        const visibleBounds = await this._map.getVisibleBounds();
        console.log(visibleBounds)
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
                </MapView>
                <FAB icon="map-marker" large onPress={this.centerPosition} style={{position: 'absolute', right: 0, bottom: 0, margin: 16, backgroundColor: "#da272d"}} />
            </View>
        );
    }
}
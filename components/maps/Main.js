import React, { Component } from 'react';
import { View, Text } from 'react-native';
import MapboxGL, { MapView, Camera } from "@react-native-mapbox-gl/maps";

MapboxGL.setAccessToken("pk.eyJ1IjoiY2hyaXN0aWFuY2ViIiwiYSI6ImNrZDN4MzQyODEwcTMyc251ZGJnY3R2aDYifQ.Iip2TLYYP-vYS145IdHWXQ")

export class Main extends Component {
    constructor(props) {
        super(props)
    }

    componentDidMount() {
        MapboxGL.setTelemetryEnabled(false)
    }

    render() {
        return (
            <View style={{flex: 1}}>
                <Text>Well</Text>
                <MapView style={{flex: 1}}>
                    <Camera centerCoordinate={[115.8605, -31.9529]} zoomLevel={10} />
                </MapView>
            </View>
        );
    }
}
import React, { Component } from 'react';
import { View, Text } from 'react-native';
import MapboxGL, { MapView, Camera, UserLocation } from "@react-native-mapbox-gl/maps";
import { ToggleButton, FAB } from 'react-native-paper';
import Baseline from './Baseline'
import Marker from '~/assets/room-2x.png'
import {featureCollection, feature} from '@turf/helpers';
import WF_Off from "~/Wayfinder_Offline"

export class Main extends Component {
    constructor(props) {
        super(props)

        const features = this.buildFeatures(WF_Off.locations.grouped);

        this.state = {
            timestamp: 0,
            latitude: Baseline.Lat,
            longitude: Baseline.Lng,
            campuses: featureCollection([...features[0]]),
            buildings: featureCollection([...features[1]]),
            focus: {
                isFocused: false,
                building: null,
                level: null,
            },
            pendingCampusFly: false,
            processingFly: false,
            queueVisibleMapScan: false,
            processingVisibleMapScan: false,
        };

        this.onUserLocationUpdate = this.onUserLocationUpdate.bind(this);
        this.onRegionDidChange = this.onRegionDidChange.bind(this);
        this.centerPosition = this.centerPosition.bind(this);
        this.floorChange = this.floorChange.bind(this);
    }

    buildFeatures(locations) {
        const grouped = [
            [],  // Campuses
            [],  // Buildings
            [],  // Rooms
        ]

        for (const type in locations) {
            if (type === 2) {
                continue;
            }

            for (const location of locations[type]) {
                if (location.mp_lat && location.mp_lng) {
                    grouped[type].push(this.buildFeature(location));
                }
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
            animationDuration: 1000,
        });
    }

    async onRegionDidChange(e) {
        this.findClosestCampus([e.geometry.coordinates[1], e.geometry.coordinates[0]]);
    }

    findClosestCampus(center) {
        let distance;
        const closest = {
            campus: null,
            distance: null
        }

        for (const campus of WF_Off.locations.grouped[0]) {
            distance = this.haversineDistance(
                center,
                [campus.mp_lat, campus.mp_lng]
            );

            /**
             * Joondalup has campuses as close as 900m apart. So we put a hard border how close
             * from the center of the screen should we determine the closest campus
             */
            if (distance < 0.8)
            {
                if (closest.distance === null || distance < closest.distance)
                {
                    closest.campus = campus;
                    closest.distance = distance;

                    // TODO: Do overlay shit here
                    WF_Off.getChildrenByParent(closest.campus.id)
                    
                    break;  // No need to waste further iterations when we found a campus less than 800m away
                }
            }
        }
    }

    floorChange(value) {
        this.setState({
            focus: {
                level: value
            }
        })
    }

    haversineDistance([lat_a, lng_a], [lat_b, lng_b]) {
        const toRadian = angle => (Math.PI / 180) * angle;
        const distance = (a, b) => (Math.PI / 180) * (a - b);

        const distance_lat = distance(lat_b, lat_a);
        const distance_lng = distance(lng_b, lng_a);

        lat_a = toRadian(lat_a);
        lat_b = toRadian(lat_b);

        // Haversine Formula
        const a = Math.pow(Math.sin(distance_lat / 2), 2)
            + Math.pow(Math.sin(distance_lng / 2), 2)
            * Math.cos(lat_a)
            * Math.cos(lat_b);

        const c = 2 * Math.asin(Math.sqrt(a));

        return Baseline.EARTH_RADIUS * c;
    };  

    onUserLocationUpdate(location) {
        if (location) {
            this.setState({
                timestamp: location.timestamp,
                latitude: location.coords.latitude,
                longitude: location.coords.longitude,
            });
        }
    }

    componentDidUpdate(prevProps) {
        // Fly camera to location if all flags are up
        if (this.state.pendingCampusFly && this.state.processingFly === false && typeof this._camera !== "undefined") {
            this.setState({processingFly: true});
            
            const campus = WF_Off.findCampusById(this.props.campus);

            if (campus) {
                this._camera.setCamera({
                    centerCoordinate: [campus.mp_lng, campus.mp_lat],
                    zoomLevel: 17,
                    animationDuration: 2000,
                });

                this.setState({
                    processingFly: false,
                    pendingCampusFly: false
                });
            }
        }

        // Listen to changes in props so we can run the routine defined earlier.
        if (prevProps.campus != this.props.campus) {
            this.setState({pendingCampusFly: true});
        }

        // Listen to queued scans and only run once
        if (this.state.queueVisibleMapScan && !this.state.processingVisibleMapScan) {
            // Raise map scan flag up to prevent next componentDidUpdate to run this block
            this.setState({ processingVisibleMapScan: true });

            // Completed routine. Release map scan locks to make way for the next scan
            this.setState({
                processingVisibleMapScan: false,
                queueVisibleMapScan: false
            });
        }
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

                <FAB icon="map-marker" large onPress={this.centerPosition} style={styles.fab} />

                <View style={styles.tbGroup}>
                    <ToggleButton.Group value={this.state.focus.level} onValueChange={this.floorChange}>
                        {/* {this.state.focus.isFocused && this.renderLevelSelect()} */}

                        {this.state.focus.isFocused &&
                            <>
                                <ToggleButton style={[styles.tb, styles.tbSelected]} icon={()=> (<Text style={styles.tbText}>G</Text>)} value="left" />
                                <ToggleButton style={[styles.tb]} icon={()=> (<Text style={styles.tbText}>B1</Text>)} value="rito" />
                            </>
                        }
                    </ToggleButton.Group>
                </View>
            </View>
        );
    }
}

const styles = {
    icon: {
        iconImage: Marker,
        iconAllowOverlap: true,
    },
    tbGroup: {
        position: 'absolute',
        left: 0,
        bottom: 0,
        margin: 16,
        marginBottom: 32
    },
    tb: {
        backgroundColor: "skyblue"
    },
    tbSelected: {
        backgroundColor: "#da272d"
    },
    tbText: {
        color: 'white'
    },
    fab: {
        position: 'absolute',
        right: 0,
        bottom: 0,
        margin: 16,
        backgroundColor: "#da272d"
    }
};
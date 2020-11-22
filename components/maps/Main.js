import React, { Component } from 'react'
import { View, Text } from 'react-native'
import MapboxGL, { MapView, Camera, UserLocation } from "@react-native-mapbox-gl/maps"
import { featureCollection, feature } from '@turf/helpers'
import { ToggleButton, FAB } from 'react-native-paper'
import Baseline from './Baseline'
import Marker from '~/assets/room-2x.png'
import WF_Off from "~/Wayfinder_Offline"
import BuildingSelect from './BuildingSelect'

/**
 * Map component for Home. Contains logic for pins, levels, buildings and campus mode
 */
export class Main extends Component
{
    constructor(props) {
        super(props)

        // Build map features needed to visualise our locations
        const features = this.buildFeatures(WF_Off.locations.grouped)

        this.maxEnterBuildingModeRadius = 0.5 // 500 meters
        this.roomZoomMinBreakpoint = 18 // Zoom level to display location pins whose type is 2 (room)

        this.state = {
            timestamp: 0,
            latitude: Baseline.Lat,
            longitude: Baseline.Lng,
            campuses: featureCollection([...features[0]]),
            buildings: featureCollection([...features[1]]),
            rooms: featureCollection([...features[2]]),
            focus: { ...focus },
            overlay: { ...overlay },
            pendingCampusFly: false,
            processingFly: false,
            queueVisibleMapScan: false,
            processingVisibleMapScan: false,
        };

        this.onUserLocationUpdate = this.onUserLocationUpdate.bind(this);
        this.onRegionDidChange = this.onRegionDidChange.bind(this);
        this.onBuildingUpdate = this.onBuildingUpdate.bind(this);
        this.centerPosition = this.centerPosition.bind(this);
        this.floorChange = this.floorChange.bind(this);
        this.unsetFocusOverlay = this.unsetFocusOverlay.bind(this);
    }

    /**
     * Iterate through our massive list of locations, group by type and create their pins
     * 
     * @param {object} locations object of locations to build features with
     * @returns {array} grouped locations by type and their GeoJSON features.
     */
    buildFeatures(locations) {
        const grouped = [
            [],  // Campuses
            [],  // Buildings
            [],  // Rooms
        ]

        for (const type in locations) {
            for (const location of locations[type]) {
                if (location.mp_lat && location.mp_lng) {
                    grouped[type].push(this.buildFeature(location));
                }
            }
        }

        return grouped;
    }

    /**
     * Build our deterministic GeoJSON feature for our location pins.
     * 
     * @param {*} location 
     * @returns {object} a GeoJSON feature in an object
     */
    buildFeature(location) {
        const geometry = {
            "coordinates": [parseFloat(location.mp_lng), parseFloat(location.mp_lat)],
            "type": "Point"
        }

        let properties = null;

        // Add floor_id property for rooms so we can easily filter them later.
        if (location.type === 2) {
            properties = { floor_id: location.floor_id }
        }

        // Generate GeoJSON feature based on our parameters.
        return feature(geometry, properties, { id: location.id });
    }

    /**
     * Given the lon/lat in the current state of the component, fly to that coordinate
     * 
     * Coordinates are updated by user location. So yes, this is basically flying
     * to the device's current location
     */
    centerPosition() {
        this._camera.setCamera({
            centerCoordinate: [this.state.longitude, this.state.latitude],
            zoomLevel: 17,
            animationDuration: 1000,
        });
        console.log('PRESS: The user tapped on the locate icon on the map')
    }

    /**
     * Callback function for whenever map view changes (pan, tilt, zoom)
     */
    async onRegionDidChange(e) {
        const center = [e.geometry.coordinates[1], e.geometry.coordinates[0]];

        // If zoom level is zoomed out enough outside breakpoint, turn off campus mode
        if (e.properties.zoomLevel < this.roomZoomMinBreakpoint) {
            this.unsetFocusOverlay()
            console.log('EVENT: The user not in campus mode or building mode')
        }
        else {
            // Currently focused, but do we need a re-render?
            if (this.state.focus.isFocused)
            {
                const building = WF_Off.findLocationById(this.state.focus.building)
                const campus = WF_Off.findLocationById(building.parent_id)
    
                // If distance from center to building is now outside the radius, find the nearest campus or bust
                if (this.haversineDistance(center, [campus.mp_lat, campus.mp_lng]) > this.maxEnterBuildingModeRadius) {
                    this.findClosestCampus(center)
                }
            }
            // Currently in campus mode zoom levels, but still haven't found a campus to stick to. Lets find one.
            else
            {
                this.findClosestCampus(center)
            }
        }
    }

    /**
     * REDUNDANT: use components/maps/Utils version of this method instead.
     * 
     * Helper function to get the remaining corners of two coordinates.
     * 
     * @param {array} ne north eastern coordinates. Not a strict requirement, but preferred
     * @param {array} sw south western coordinates. Not a strict requirement, but preferred
     * 
     * @returns {array} all corners in an array starting from NW, NE, SE, and SW
     */
    cornerCoordinates(ne, sw) {
        return [
            [parseFloat(sw[0]), parseFloat(ne[1])],
            [parseFloat(ne[0]), parseFloat(ne[1])],
            [parseFloat(ne[0]), parseFloat(sw[1])],
            [parseFloat(sw[0]), parseFloat(sw[1])]
        ];
    }

    /**
     * Unsets properties used for campus mode, essentially turning it off.
     */
    unsetFocusOverlay() {
        this.setState({
            overlay: { ...overlay },
            focus: { ...focus }
        })
    }

    /**
     * Given the coordinate which is the center of the map on screen, find the closest campus
     * and if it is within radius, enable campus mode.
     * 
     * @param {array} center latitude and longitude pairs in array to be used in determining proximity
     */
    findClosestCampus(center) {
        let distance;
        const closest = {
            campus: null,
            distance: null
        }

        // Iterate though campuses and see how close they are from center of map to their locations
        for (const campus of WF_Off.locations.grouped[0]) {
            distance = this.haversineDistance(
                center,
                [campus.mp_lat, campus.mp_lng]
            );

            /**
             * Joondalup has campuses as close as 900m apart. So we put a hard border how close
             * from the center of the screen should we determine the closest campus
             */
            if (distance < this.maxEnterBuildingModeRadius)
            {
                // Only run this block if previous state did not have campus mode open
                if (closest.distance === null || distance < closest.distance)
                {
                    //TODO: ensure that we do not reapply focus flags and the overlay
                    closest.campus = campus;
                    closest.distance = distance;

                    // Get buildings of a given campus
                    const children_ids = WF_Off.getChildrenIdsByParentLocationId(closest.campus.id)
                    
                    // Pick first child in the list no matter how sensical it is
                    const floor_data = this.buildFloorDataByBuilding(children_ids[0])
                    const current_floor = floor_data.floors.find(f => f.id == floor_data.level)

                    this.setState({
                        focus: {
                            isFocused: true,
                            building: children_ids[0],
                            floors: floor_data.floors,
                            level: floor_data.level,
                        },
                        overlay: {
                            filter: this.buildFloorFilterParams(current_floor),
                            url: current_floor.overlay_url,
                            coordinates: this.cornerCoordinates(
                                [current_floor.ne_lng, current_floor.ne_lat],
                                [current_floor.sw_lng, current_floor.sw_lat]
                            )
                        }
                    })
                    break;  // No need to waste further iterations when we found a campus less than 800m away
                }
            }
        }

        // Sanely turn off focus
        if (closest.campus === null && this.state.focus.isFocused === true) {
            this.unsetFocusOverlay()
        }
        console.log('EVENT: The user enters campus mode or building mode')
    }

    /**
     * Build floors data based on a location Id, presumably a building
     * 
     * @param {integer} id location (building) Id to create a floor data from
     * @returns {object} floor(s) data and the level it should default to
     */
    buildFloorDataByBuilding(id) {
        const floors = WF_Off.getFloorsByLocation(id)
        const level_zero = floors.find(x => x.order === 0)

        return {
            floors: floors,
            level: level_zero?.id
        }
    }

    /**
     * Helper function to set filters for MapboxGL.ShapeSource on room location pins based on floor Id
     * 
     * @param {integer} floor floor Id to filter to. Locations matching this floor will be visible. Hidden otherwise
     * @returns {array} floor parameters readable by MapboxGL.ShapeSource
     */
    buildFloorFilterParams(floor) {
        return ['==', ['get', 'floor_id'], floor.id];
    }

    /**
     * Callback for whenever a floor in level select is chosen. Renders new map overlay image and
     * toggles location pins as needed
     * 
     * @param {integer} value the floor Id to set to selected
     */
    floorChange(value) {
        // Ignore null value returned by floorChange event
        if (value !== null) { 
            const floor = WF_Off.findFloorById(value);

            this.setState({
                focus: {
                    ...this.state.focus,
                    level: value
                },
                overlay: {
                    coordinates: this.cornerCoordinates(
                        [floor.ne_lng, floor.ne_lat],
                        [floor.sw_lng, floor.sw_lat]
                    ),
                    url: floor.overlay_url,
                    filter: this.buildFloorFilterParams(floor)
                }
            })
        }
        console.log('PRESS: The user is changing the building level on campus mode')
    }

    /**
     * Render Level Select <ToggleButton /> components based on state's focus.floor values
     * 
     * @returns {array} array of <ToggleButton /> components
     */
    renderLevelSelect() {
        const toggle_buttons = []

        // Iterate through floors in focus
        for (const floor of this.state.focus.floors) {
            toggle_buttons.push(
                <ToggleButton
                    key={floor.id}
                    style={this.state.focus.level === floor.id ? styles.tbSelected : styles.tb}
                    icon={() => (<Text style={styles.tbText}>{floor.name}</Text>)}
                    value={floor.id} />
            )
        }

        return toggle_buttons;
    }

    /**
     * Haversine formula function to determine distance between two coordinates
     * 
     * @returns {float} distance in kilometers
     */
    haversineDistance([lat_a, lng_a], [lat_b, lng_b]) {
        lat_a = parseFloat(lat_a)
        lng_a = parseFloat(lng_a)
        lat_b = parseFloat(lat_b)
        lng_b = parseFloat(lng_b)

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
    }

    /**
     * Listen to changes in device's location and set them on state to move current location marker on map
     */
    onUserLocationUpdate(location) {
        if (location) {
            this.setState({
                timestamp: location.timestamp,
                latitude: location.coords.latitude,
                longitude: location.coords.longitude,
            });
        }
    }

    /**
     * Fly camera to location if all flags are up
     */
    componentDidUpdate(prevProps) {
        if (this.state.pendingCampusFly && this.state.processingFly === false && typeof this._camera !== "undefined") {
            this.setState({processingFly: true});
            
            const campus = WF_Off.findLocationById(this.props.campus);

            if (campus) {
                // Fly to coordinates
                this._camera.setCamera({
                    centerCoordinate: [campus.mp_lng, campus.mp_lat],
                    zoomLevel: 17,
                    animationDuration: 2000,
                });

                // Turn off flags to allow succeeding camera fly to campuses to run
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

    /**
     * Callback for BuildingSelect whenever the context building changes
     */
    onBuildingUpdate(building_id) {
        const floors_data = this.buildFloorDataByBuilding(building_id)
        const building = WF_Off.findLocationById(building_id)

        // Fly to building coordinates
        this._camera.setCamera({
            centerCoordinate: [building.mp_lng, building.mp_lat],
            zoomLevel: 18,
            animationDuration: 200,
        });

        this.setState({
            focus: {
                ...this.state.focus,
                building: building_id,
                floors: floors_data.floors,
                level: floors_data.level
            }
        });
    }

    render() {
        return (
            <View style={{flex: 1}}>
                {/* Mapbox Map */}
                <MapView
                    style={{flex: 1}}
                    ref={(map) => (this._map = map)}
                    onRegionDidChange={this.onRegionDidChange}
                    compassViewPosition={3} compassViewMargins={{x: 24, y: 96}}
                    >
                    <UserLocation visible={true} onUpdate={this.onUserLocationUpdate} />
                    <Camera ref={(camera) => (this._camera = camera)} centerCoordinate={[Baseline.Lng, Baseline.Lat]} zoomLevel={10} />

                    {/* Location Pins */}
                    <MapboxGL.ShapeSource id="campusesSource" hitbox={{width: 36, height: 36}} shape={this.state.campuses}>
                        <MapboxGL.SymbolLayer id="campusesSymbols" minZoomLevel={0} maxZoomLevel={14} style={styles.icon} />
                    </MapboxGL.ShapeSource>
                    <MapboxGL.ShapeSource id="buildingsSource" hitbox={{width: 36, height: 36}} shape={this.state.buildings}>
                        <MapboxGL.SymbolLayer id="buildingsSymbols" minZoomLevel={14} maxZoomLevel={19} style={styles.icon} />
                    </MapboxGL.ShapeSource>
                    <MapboxGL.ShapeSource id="roomsSource" hitbox={{width: 36, height: 36}} shape={this.state.rooms}>
                        <MapboxGL.SymbolLayer id="roomsSymbols" minZoomLevel={this.roomZoomMinBreakpoint} filter={this.state.overlay.filter} style={styles.icon} />
                    </MapboxGL.ShapeSource>

                    {/* Floor Image Overlay */}
                    <MapboxGL.ImageSource 
                        id="mapOverlaySource"
                        coordinates={this.state.overlay.coordinates}
                        url={this.state.overlay.url}>
                        <MapboxGL.RasterLayer id="mapOverlayLayer" belowLayerID="roomsSymbols" />
                    </MapboxGL.ImageSource>
                </MapView>

                {/* Center map on device location */}
                <FAB icon="map-marker" large onPress={this.centerPosition} style={styles.fab} />

                {/* Level Select */}
                <View style={styles.tbGroup}>
                    <ToggleButton.Group value={this.state.focus.level} onValueChange={this.floorChange}>
                        {this.state.focus.isFocused &&
                            <>{this.renderLevelSelect()}</>
                        }
                    </ToggleButton.Group>
                </View>

                <BuildingSelect building={this.state.focus.building} onBuildingUpdate={this.onBuildingUpdate} />
            </View>
        );
    }
}

// Default focus states
const focus = {
    isFocused: false,
    building: null,
    floors: null,
    level: null
}
Object.freeze(focus)

// Default overlay states
const overlay = {
    url: "",
    coordinates: [[0,0], [0,0], [0,0], [0,0]],
    filter: null
}
Object.freeze(overlay)

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
        marginBottom: 32,
        flexDirection: "column-reverse"
    },
    tb: {
        backgroundColor: "#414141"
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
/**
 * @format
 */

import {AppRegistry} from 'react-native';
import App from './App';
import {name as appName} from './app.json';
import LocationsData from '~/locations/data.json'
import MapboxGL from "@react-native-mapbox-gl/maps";

MapboxGL.setAccessToken("pk.eyJ1IjoiY2hyaXN0aWFuY2ViIiwiYSI6ImNrZDN4MzQyODEwcTMyc251ZGJnY3R2aDYifQ.Iip2TLYYP-vYS145IdHWXQ")
MapboxGL.setTelemetryEnabled(false)

global.locationsData = LocationsData

AppRegistry.registerComponent(appName, () => App);

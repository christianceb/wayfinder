import LocationsJSON from '~/map_data/locations.json'
import FloorsJSON from '~/map_data/floors.json'

/**
 * Singleton class to handle offline location and floor data of Wayfinder
 */
class Wayfinder_Offline {
    constructor()
    {
        if (Wayfinder_Offline._instance) {
            throw new Error("Only one true Wayfinder_Offline")
        }

        Wayfinder_Offline._instance = this;

        this.locations = {
            all: null,
            grouped: null,
            map: null
        }

        this.floors = {
            all: null,
            map: null
        }

        this._init()
    }

    /**
     * Build our dataset and group them as needed
     */
    _init() {
        this.floors.all = FloorsJSON
        this.locations.all = LocationsJSON
        this._segregateLocations()
        this._groupFloorsByBuildings()
    }

    /**
     * Segregate locations by type and parent locations
     * 
     * Map is a two-dimensional "array" (actually an object on the first dimension, then array
     * on the next) where indices are parent locations and its value is an array of its
     * 'child' locations. This is meant to save the application very expensive linear search
     * of child and parent locations by memoising predictable queries in the app.
     * 
     * Grouped is as simple as it gets. Because there are only 3 predictable location types,
     * they can conveniently be used as keys and its values as containers for locations
     * belonging to that type. 0 are campuses, 1 are buildings and 2 are rooms.
     */
    _segregateLocations() {
        this.locations.map = {};
        this.locations.grouped = [
            [],  // Campuses
            [],  // Buildings
            [],  // Rooms
        ]

        for (const id in this.locations.all) {
            // To chuck it to its parent
            let parent = this.locations.all[id].parent_id;
            if (this.locations.all[id].parent_id === null || this.locations.all[id].parent_id === 0) {
                parent = 0;
            }

            // Create a new parent or add it to an existing parent
            if (!this.locations.map.hasOwnProperty(parent)) {
                this.locations.map[parent] = [];
            }
            
            this.locations.map[parent].push(id);

            // To segregate by type
            this.locations.grouped[this.locations.all[id].type].push(this.locations.all[id])
        }
    }

    /**
     * Similar to _segregateLocations, but the keys are the location Ids. This is very useful
     * to trim down iterations on searching for floors based on a location Id (usually a
     * building).
     */
    _groupFloorsByBuildings() {
        this.floors.map = {}

        for (const id in this.floors.all) {
            let parent = this.floors.all[id].location_id;

            // Create a new parent if it doesnt exist yet in the map
            if (!this.floors.map.hasOwnProperty(parent)) {
                this.floors.map[parent] = [];
            }

            this.floors.map[parent].push(id);
        }
    }

    /**
     * Get all locations. Why would you do that?
     * 
     * @param {boolean} asArray always false. If true, returns you all the locations but in an array
     * @returns {object|array}
     */
    getAllLocations(asArray = false) {
        return asArray ? Object.values(this.locations.all) : this.locations.all;
    }

    /**
     * Get a location by Id, duh?
     * 
     * @param {integer} id the Id of the location to match
     * @returns {object|boolean} The location object if found. False if the location Id did not match
     */
    findLocationById(id) {
        if (id in this.locations.all) {
            return this.locations.all[id];
        }

        return false
    }

    /**
     * Get locations by type
     * 
     * @param {array|boolean} type The locations in an array. False if it has failed validation
     */
    getLocationsByType(type) {
        // Verify our type so we don't access an index in the array that does not exist
        if (type >= 0 && type <= 2) {
            return this.locations.grouped[type]
        }

        return false
    }

    /**
     * Get child locations Ids only of the given parent location Id
     * 
     * @param {integer} id the Id of the location to match
     * @returns {array} List of child locations' Ids in an array
     */
    getChildrenIdsByParentLocationId(id) {
        if (this.locations.map.hasOwnProperty(id)) {
            return this.locations.map[id];
        }

        return [];
    }

    /**
     * Get child locations and its object given a parent location Id
     * 
     * @param {integer} id the Id of the location to match
     * @returns {array} List of child locations in an array as objects
     */
    getChildrenByParentLocationId(id) {
        const children = []
        
        for (const child_id of this.getChildrenIdsByParentLocationId(id)) {
            children.push(this.findLocationById(child_id))
        }
        
        return children;
    }

    /**
     * Get the floors tied to a location Id. Sorted by its floor order property
     * 
     * @param {integer} id the Id of the location to match.
     * @returns {array} List of floors in an array as objects
     */
    getFloorsByLocation(id) {
        if (this.floors.map.hasOwnProperty(id)) {
            let floors = this.floors.map[id]

            floors = floors.map( x => this.floors.all[x] )
            floors = floors.sort( (a, b) => a.order - b.order )

            return floors;
        }

        return [];
    }

    /**
     * Get floor object by Id
     * 
     * @param {integer} id id of the floor to match
     * @returns {object|boolean} The floor object if found. False if the flood Id did not match
     */
    findFloorById(id) {
        if (id in this.floors.all) {
            return this.floors.all[id];
        }

        return false
    }

    /**
     * Recursively gets the name of locations and its hierarchy given a location Id
     * 
     * @param {integer} parent_id the location to begin with. Note that this is inclusive in the routine
     * @returns {string} the stringed hierarchy of locations
     */
    getParentName(parent_id) {
        let parentLocation = this.findLocationById(parent_id)
        let parentsString = parentLocation.name

        if (parentLocation.parent_id) {
            parentsString += ", " + this.getParentName(parentLocation.parent_id)
        }

        return parentsString
    }

    /**
     * Recursively finds a suitable address of a location. Useful for locations whose types are rooms
     * 
     * @param {integer} id location to start finding an address
     */
    getAddress(id) {
        let location = this.findLocationById(id)

        address = location.address

        if (location.type > 1) {
            address = this.getAddress(location.parent_id)
        }

        return address
    }
}

const WF_Off = new Wayfinder_Offline();

export default WF_Off;
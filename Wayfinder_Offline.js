import LocationsJSON from '~/map_data/locations.json'
import FloorsJSON from '~/map_data/floors.json'

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

    _init() {
        this.floors.all = FloorsJSON
        this.locations.all = LocationsJSON
        this._segregateLocations()
        this._groupFloorsByBuildings()
    }

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

    findLocationById(id) {
        if (id in this.locations.all) {
            return this.locations.all[id];
        }

        return false
    }

    getChildrenIdsByParentLocationId(id) {
        if (this.locations.map.hasOwnProperty(id)) {
            return this.locations.map[id];
        }

        return [];
    }

    getChildrenByParentLocationId(id) {
        const children = []
        
        for (const child_id of this.getChildrenIdsByParentLocationId(id)) {
            children.push(this.findLocationById(child_id))
        }
        
        return children;
    }

    getFloorsByLocation(id) {
        if (this.floors.map.hasOwnProperty(id)) {
            let floors = this.floors.map[id]

            floors = floors.map( x => this.floors.all[x] )
            floors = floors.sort( (a, b) => a.order - b.order )

            return floors;
        }

        return [];
    }

    findFloorById(id) {
        if (id in this.floors.all) {
            return this.floors.all[id];
        }

        return false
    }
}

const WF_Off = new Wayfinder_Offline();

export default WF_Off;
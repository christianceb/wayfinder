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

        this.floors = null

        this._init()
    }

    _init() {
        this.floors = FloorsJSON
        this.locations.all = LocationsJSON
        this._segregateLocations()
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

            if (!this.locations.map.hasOwnProperty(parent)) {
                this.locations.map[parent] = [];
            } else {
                this.locations.map[parent].push(id);
            }


            // To segregate by type
            this.locations.grouped[this.locations.all[id].type].push(this.locations.all[id])
        }
    }

    findCampusById(id) {
        if (id in this.locations.all) {
            return this.locations.all[id];
        }

        return false
    }

    getChildrenByParent(id) {
        if (this.locations.map.hasOwnProperty(id)) {
            return this.locations.map[id];
        }

        return [];
    }
}

const WF_Off = new Wayfinder_Offline();

export default WF_Off;
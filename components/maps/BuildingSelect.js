import React, { Component } from 'react';
import { View } from 'react-native';
import { List } from 'react-native-paper';
import WF_Off from "~/Wayfinder_Offline"

/**
 * Component to handle building select in campus mode
 */
export default class BuildingSelect extends Component {
    constructor(props) {
        super(props)

        this.state = {
            buildings: [],
            current: null,
            campus: null,
            expanded: false
        }
    }

    componentDidUpdate(prevProps) {
        // Handle toggling off of this component by blanking its state
        if (prevProps.building !== null && this.props.building === null) {
            this.setState({
                current: null,
                campus: null,
                buildings: []
            })
        }
        // Render our list
        else if (
            prevProps.building === null && this.props.building !== null
            || prevProps.building != this.props.building
        )
        {
            this.rebuildList(this.props.building)
        }
    }

    /**
     * Given a building, find its parent campus and build data of its parent and sibling buildings
     */
    rebuildList(building_id) {
        const building = WF_Off.findLocationById(building_id)
        const buildings = []
        const parent = WF_Off.findLocationById(building.parent_id)
        
        // We now have our parent location. Now we iterate through its child locations (buildings)
        for (const sibling of WF_Off.getChildrenByParentLocationId(building.parent_id)) {
            // Don't include current building
            if (sibling.id !== building.id) {
                buildings.push(sibling)
            }
        }

        this.setState({
            current: building,
            campus: parent,
            buildings: buildings
        })
    }

    /**
     * List press callback
     * 
     * @param {object} selected building object
     */
    handlePress(building) {
        this.props.onBuildingUpdate(building.id);

        this.setState({
            expanded: false
        })
        console.log('PRESS: On campus mode, the user selected a building')
    }

    /**
     * Render list item components based on buildings in an array
     * 
     * @param {array} buildings 
     * @returns {array} array of <List.Item /> components
     */
    renderBuildingItems(buildings) {
        return buildings.map(building => {
            return <List.Item titleStyle={styles.color} key={building.id} title={building.name} onPress={() => this.handlePress(building)} />
        })
    }

    render() {
        return ( this.state.current !== null &&
            <View style={styles.view}>
                <List.Section>
                    <List.Accordion
                        style={styles.accordion}
                        titleStyle={styles.color} 
                        descriptionStyle={styles.color}
                        title={this.state.current?.name}
                        description={this.state.campus?.name}
                        expanded={this.state.expanded}
                        onPress={() => this.setState({expanded: !this.state.expanded})}
                        >
                        {this.renderBuildingItems(this.state.buildings)}
                    </List.Accordion>
                </List.Section>
            </View>
        );
    }
}

const styles = {
    view: {
        position: "absolute",
        top: 0,
        left: 0,
        right: 0,
        margin: 8,
        backgroundColor: "#da272d"
    },
    color: {
        color: "#ffffff",
        padding: 0
    },
    accordion: {
        color: "#ffffff",
        paddingVertical: 0,
        paddingHorizontal: 8
    }
}
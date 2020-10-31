import React, { Component } from 'react';
import { View } from 'react-native';
import { List } from 'react-native-paper';
import WF_Off from "~/Wayfinder_Offline"

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
        if (prevProps.building !== this.props.building && this.props.building > 0) {
            this.rebuildList(this.props.building)
        }
    }

    rebuildList(building_id) {
        const building = WF_Off.findLocationById(building_id)
        const buildings = []
        const parent = WF_Off.findLocationById(building.parent_id)
        
        for (const sibling of WF_Off.getChildrenByParentLocationId(building.parent_id)) {
            if (sibling.id !== building.id) {
                buildings.push(
                    <List.Item key={sibling.id} title={sibling.name} onPress={() => this.handlePress(sibling)} />
                )
            }
        }

        this.setState({
            current: building,
            campus: parent,
            buildings: buildings
        })
    }

    handlePress(building) {
        this.props.onBuildingUpdate(building.id);

        this.setState({
            // current: building,
            expanded: false
        })
    }

    render() {
        return ( this.state.current !== null &&
            <View style={styles.view}>
                <List.Section>
                    <List.Accordion
                        title={this.state.current?.name}
                        description={this.state.campus?.name}
                        expanded={this.state.expanded}
                        onPress={() => this.setState({expanded: !this.state.expanded})}
                        >
                        {this.state.buildings}
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
        margin: 16,
        backgroundColor: "#da272d"
    }
}
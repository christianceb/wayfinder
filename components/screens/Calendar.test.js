/**
 * @format
 */

import 'react-native';
import React from 'react';
import Calendar from './Calendar';

// Note: test renderer must be required after react-native.
import renderer from 'react-test-renderer';


it('Calendar renders correctly and safely', () => {
    const tree = renderer.create(<Calendar />).toJSON();
    expect(tree).toMatchSnapshot()
});
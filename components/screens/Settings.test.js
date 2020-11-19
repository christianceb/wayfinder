/**
 * @format
 */

import 'react-native';
import React from 'react';
import Settings from './Settings';

import { fireEvent, render } from '@testing-library/react-native';

// Note: test renderer must be required after react-native.
import renderer from 'react-test-renderer';

global.locationsData = [
  {"id":1,"name":"Northbridge","type":0,"parent_id":null,"upload_id":null,"address":"25 Aberdeen Street, Perth Western Australia 6000, Australia","mp_id":"address.2121005564981030","mp_lng":"115.86094053","mp_lat":"-31.94802897","created_at":"2020-07-21T02:35:00.000000Z","updated_at":"2020-10-05T05:57:55.000000Z"},
  {"id":2,"name":"Leederville","type":0,"parent_id":null,"upload_id":null,"address":"43 Richmond Street, Leederville Western Australia 6007, Australia","mp_id":"address.3814715266816138","mp_lng":"115.84257784","mp_lat":"-31.93396092","created_at":"2020-07-21T02:35:00.000000Z","updated_at":"2020-10-05T06:03:45.000000Z"}
];

it('renders correctly', () => {
  renderer.create(<Settings />);
});

test("Test if buildRadioButtonItems() works", () => {
  const { getByText, getAllByText } = render(<Settings />)
  fireEvent.press(getByText('Default Campus'))

  const leederville = getAllByText('Leederville')
  expect(leederville).toHaveLength(1)
})
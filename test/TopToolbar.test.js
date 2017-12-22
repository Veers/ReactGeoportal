
import React from 'react';
import renderer from 'react-test-renderer';
import {shallow} from 'enzyme';

import TopToolbar from '../src/components/TopToolbar'


test('Test toptoolbar for correct component', () => {
  const component = renderer.create(
    <TopToolbar/>,
  )
  
  let tree = component.toJSON()
  expect(tree).toMatchSnapshot()

})


/**
 * TODO fix dom testing
 */
// test('test dom of toptoolbar', () => {
// 	const component = shallow(<TopToolbar/>)

// 	console.log(component.text())
	
// })
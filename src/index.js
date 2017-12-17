import React from 'react';
import ReactDOM from 'react-dom';

import { Provider } from 'react-redux'
import { createStore } from 'redux'

import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';

import TopToolbar from './components/TopToolbar'
import LayerComponent from './components/LayerComponent'

import geoportalReducers from './reducers/geoportalReducers'

const Geoportal = () => (
	<div>
		<MuiThemeProvider>
			<TopToolbar />
		</MuiThemeProvider>
		<MuiThemeProvider>
			<LayerComponent />
		</MuiThemeProvider>
	</div>
)

let store = createStore(geoportalReducers)

ReactDOM.render(<Provider store={store}><Geoportal/></Provider>, document.getElementById('app'));
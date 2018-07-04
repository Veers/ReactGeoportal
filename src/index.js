import React from 'react'
import { render } from 'react-dom'
import injectTapEventPlugin from 'react-tap-event-plugin'
import { Provider } from 'react-redux'

import configureStore from './store/configureStore'

import fetchLayers from './actions/mapActions'

import getMuiTheme from 'material-ui/styles/getMuiTheme'
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider'

import App from './containers/App'

injectTapEventPlugin()

const store = configureStore()

render(
  <Provider store={store}>
  	<MuiThemeProvider muiTheme={getMuiTheme()}>
    	<App />
    </MuiThemeProvider>
  </Provider>,
  document.getElementById('root')
)
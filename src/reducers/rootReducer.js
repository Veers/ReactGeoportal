import { reducer as reduxFormReducer } from 'redux-form'
import { combineReducers } from 'redux'

import {
    INVALIDATE_LAYERS,
    REQUEST_LAYERS,
    RECEIVE_LAYERS
} from '../actions'

const layers = (state = {
    layers:[], 
    activeLayer:{}, 
    statue: 'SUCCESS'
}, action) => {
    switch (action.type) {
        case REQUEST_LAYERS:
            return Object.assign({}, state)
        case RECEIVE_LAYERS:
            return Object.assign({}, state, {
                layers: action.layers,
                activeLayer: action.activeLayer,
                status: action.status
            })            
        default:
            return state
    }
}

const mapLayers = (state = {}, action) => {
  switch (action.type) {
    case RECEIVE_LAYERS:
        return Object.assign({}, state, layers(state[action], action))
    case REQUEST_LAYERS:
        return Object.assign({}, state)
    case INVALIDATE_LAYERS:
        return Object.assign({}, state, {status: 'ERROR'})
    default:
     return state
  }
}


const rootReducer = combineReducers({
    mapLayers,
    form: reduxFormReducer
})

export default rootReducer
import { combineReducers } from 'redux'
import {
    REQUEST_LAYERS,
    RECEIVE_LAYERS
} from '../actions'

const layers = (state = {}, action) => {
    switch (action.type) {
        case REQUEST_LAYERS:
            return Object.assign({}, state)
        case RECEIVE_LAYERS:
            return Object.assign({}, state, {
                layers: action.layers,
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
    default:
     return state
  }
}


const rootReducer = combineReducers({
    mapLayers
})

export default rootReducer
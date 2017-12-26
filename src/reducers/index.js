import { combineReducers } from 'redux'
import {
    REQUEST_LAYERS,
    RECEIVE_LAYERS
} from '../actions'

const layers = (state = {}, action) => {
    switch (action.type) {
        case REQUEST_LAYERS:
            return {
                ...state
            }
        case RECEIVE_LAYERS:
            return {
                ...state,
                layers: action.layers,
                status: action.status
            }
        default:
            return state
    }
}

const mapLayers = (state = {}, action) => {
  switch (action.type) {
    case RECEIVE_LAYERS:
    case REQUEST_LAYERS:
      return {
        ...state,
        ...layers(state[action], action)
      }
    default:
     return state
  }
}


const rootReducer = combineReducers({
    mapLayers
})

export default rootReducer
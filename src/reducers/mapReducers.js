import {
    REQUEST_LAYERS, RECEIVE_LAYERS, INVALIDATE_LAYERS
  } from '../actions/mapActions'
  
  
  function mapLayers(state = {
    isFetching: false,
    didInvalidate: false,
    items: []
  }, action) {
    switch (action.type) {
      case REQUEST_LAYERS:
        return Object.assign({}, state, {
          isFetching: true,
          didInvalidate: false
        })
      case RECEIVE_LAYERS:
        return Object.assign({}, state, {
          isFetching: false,
          didInvalidate: false,
          items: action.layers
        })
      default:
        return state
    }
  }
  
  export function fetchLayersReducer(state = { }, action) {
    switch (action.type) {
      case INVALIDATE_LAYERS:
      case RECEIVE_LAYERS:
      case REQUEST_LAYERS:
        return Object.assign({}, state, {
          [action.layers]: mapLayers(state[action.layers], action)
        })
      default:
        return state
    }
  }
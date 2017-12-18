import { SELECT_LAYERS, REQUEST_LAYERS, RECEIVE_LAYERS } from '../actions/layersActions'

const selectedLayers = (state, action) => {
	switch (action.type) {
		case SELECT_LAYERS:
			return action.layers
		default:
			return state
	}
}

const layers = (
  state = {
    isFetching: false,
    items: []
  },
  action
) => {
  switch (action.type) {
    case REQUEST_LAYERS:
      return Object.assign({}, state, {
        isFetching: true
      })
    case RECEIVE_LAYERS:
      return Object.assign({}, state, {
        isFetching: false,
        items: action.layers,
        lastUpdated: action.receivedAt
      })
    default:
      return state
  }
}

function getLayers(state= {}, action) {
  switch (action.type) {
    case: SELECT_LAYERS:
    case: RECEIVE_LAYERS:
    case: REQUEST_LAYERS:
      return Object.assign({}, state, {
        [action.layers]: layers(state[action.layers], action)
      })
    default:
      return state
  }
}

export default selectLayers
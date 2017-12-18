export const SELECT_LAYERS = 'SELECT_LAYERS'

export function selectLayers(layers) {
	return {
		type: SELECT_LAYERS,
		layers
	}
}


export const REQUEST_LAYERS = 'REQUEST_LAYERS'

function requestLayers(layers) {
  return {
    type: REQUEST_LAYERS,
    layers
  }
}


export const RECEIVE_LAYERS = 'RECEIVE_LAYERS'

function receiveLayers(layers, json) {
  return {
    type: RECEIVE_LAYERS,
    layers,
    posts: json.data.children.map(child => child.data),
    receivedAt: Date.now()
  }
}
import fetch from 'isomorphic-fetch'

export const REQUEST_LAYERS = 'REQUEST_LAYERS'
export const RECEIVE_LAYERS = 'RECEIVE_LAYERS'
export const INVALIDATE_LAYERS = 'INVALIDATE_LAYERS'

export function invalidateLayers(layers) {
  return {
    type: INVALIDATE_LAYERS,
    layers
  }
}

function requestLayers(layers) {
  return {
    type: REQUEST_LAYERS,
    layers
  }
}

function receiveLayers(json) {
  console.log(json.data[0].templates[0].layers)
  return {
    type: RECEIVE_LAYERS,
    layers: json.data[0].templates[0].layers
  }
}

function fetchLayers() {
  return dispatch => {
    dispatch(requestLayers())
    return fetch(`https://gptl.ru/api/map/public/maps.ext-json`)
      .then(response => response.json())
      .then(json => dispatch(receiveLayers(json)))
  }
}

export function fetchMapLayers() {
  return (dispatch) => {
      return dispatch(fetchLayers())
  }
}
export const REQUEST_LAYERS = 'REQUEST_LAYERS'
export const RECEIVE_LAYERS = 'RECEIVE_LAYERS'

export const requestLayers = () => ({
  type: REQUEST_LAYERS
})

export const receiveLayers = (json, status) => ({
  type: RECEIVE_LAYERS,
  layers: Object.assign({}, json[0].templates[0].layers),
  status: status
})

export const fetchLayers = () => (dispatch) => {
  dispatch(requestLayers)
  return fetch(`https://gptl.ru/api/map/public/maps.json`)    
    .then(response => response.json())
    .then(json => dispatch(receiveLayers(json, status)))
}
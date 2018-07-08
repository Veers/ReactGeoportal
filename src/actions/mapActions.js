import fetch from 'cross-fetch'

export const LAYERS_HAS_ERRORED = 'ITEMS_HAS_ERRORED'
export const LAYERS_IS_LOADING = 'LAYERS_IS_LOADING'
export const LAYERS_FETCH_DATA_SUCCESS = 'LAYERS_FETCH_DATA_SUCCESS'

export function layersHasErrored(bool) {
  return {type: LAYERS_HAS_ERRORED, hasErrored: bool};
}

export function layersIsLoading(bool) {
  return {type: LAYERS_IS_LOADING, isLoading: bool};
}

export function layersFetchDataSuccess(items) {
  return {type: LAYERS_FETCH_DATA_SUCCESS, items};
}

export function layersFetchData(url) {
  return (dispatch) => {
    dispatch(layersIsLoading(true));

    fetch(url).then((response) => {
      if (!response.ok) {
        throw Error(response.statusText);
      }

      dispatch(layersIsLoading(false));

      return response;
    })
    .then((response) => response.json())
    .then((items) => dispatch(layersFetchDataSuccess(items)))
    .catch(() => dispatch(layersHasErrored(true)));
  };
}

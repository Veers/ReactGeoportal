import { LAYERS_HAS_ERRORED, LAYERS_IS_LOADING, LAYERS_FETCH_DATA_SUCCESS } from '../actions/mapActions'

export function layersHasErrored(state = false, action) {
    switch (action.type) {
        case LAYERS_HAS_ERRORED:
            return action.hasErrored;

        default:
            return state;
    }
}

export function layersIsLoading(state = false, action) {
    switch (action.type) {
        case LAYERS_IS_LOADING:
            return action.isLoading;

        default:
            return state;
    }
}

export function layers(state = [], action) {
    switch (action.type) {
        case LAYERS_FETCH_DATA_SUCCESS:
            return action.items;

        default:
            return state;
    }
}
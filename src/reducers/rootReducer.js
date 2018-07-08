import { combineReducers } from 'redux';
import { layers, layersHasErrored, layersIsLoading } from './mapReducers';

export default combineReducers({
    layers,
    layersHasErrored,
    layersIsLoading
});
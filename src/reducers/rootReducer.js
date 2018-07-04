import { combineReducers } from 'redux';
import { items, itemsHasErrored, itemsIsLoading } from './mapReducers';

export default combineReducers({
    items,
    itemsHasErrored,
    itemsIsLoading
});
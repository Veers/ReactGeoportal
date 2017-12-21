import { combineReducers } from 'redux'
import {
    SELECT_SUBREDDIT,
    INVALIDATE_SUBREDDIT,
    REQUEST_POSTS,
    RECEIVE_POSTS,
    REQUEST_LAYERS,
    RECEIVE_LAYERS
} from '../actions'

const selectedSubreddit = (state = 'reactjs', action) => {
    switch (action.type) {
        case SELECT_SUBREDDIT:
            return action.subreddit
        default:
            return state
    }
}

const posts = (state = {
    isFetching: false,
    didInvalidate: false,
    items: []
}, action) => {
    switch (action.type) {
        case INVALIDATE_SUBREDDIT:
            return {
                ...state,
                didInvalidate: true
            }
        case REQUEST_POSTS:
            return {
                ...state,
                isFetching: true,
                didInvalidate: false
            }
        case RECEIVE_POSTS:
            return {
                ...state,
                isFetching: false,
                didInvalidate: false,
                items: action.posts,
                lastUpdated: action.receivedAt
            }
        default:
            return state
    }
}

const postsBySubreddit = (state = {}, action) => {
    switch (action.type) {
        case INVALIDATE_SUBREDDIT:
        case RECEIVE_POSTS:
        case REQUEST_POSTS:
            return {
                ...state,
                [action.subreddit]: posts(state[action.subreddit], action)
            }
        default:
            return state
    }
}


const layers = (state = {
    items: []
}, action) => {
    switch (action.type) {
        case REQUEST_LAYERS:
            return {
                ...state,
                isFetchingLayers: true,
                didInvalidate: false
            }
        case RECEIVE_LAYERS:
            return {
                ...state,
                isFetchingLayers: false,
                items: action.layers
            }
        default:
            return state
    }
}

const getLayers = (state = {}, action) => {
  switch (action.type) {
    case RECEIVE_LAYERS:
    case REQUEST_LAYERS:
      return {
        ...state,
        [action]: layers(state[action], action)
      }
    default:
     return state
  }
}


const rootReducer = combineReducers({
    postsBySubreddit,
    selectedSubreddit,
    getLayers
})

export default rootReducer
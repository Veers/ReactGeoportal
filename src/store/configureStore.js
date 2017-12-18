import { createStore, applyMiddleware } from 'redux'
import thunkMiddleware from 'redux-thunk'
import { createLogger } from 'redux-logger'
import geoportalReducers from '../reducers/geoportalReducers'

const loggerMiddleware = createLogger()

export default function configureStore(preloadedState) {
  return createStore(
    geoportalReducers,
    preloadedState,
    applyMiddleware(
      thunkMiddleware,
      loggerMiddleware
    )
  )
}
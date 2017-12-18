import { combineReducers } from 'redux'
import visibilityFilter from './visibilityFilter'
import selectLayers from './layersReducers'

const geoportalReducers = combineReducers({
  visibilityFilter,
  selectLayers
})

export default geoportalReducers
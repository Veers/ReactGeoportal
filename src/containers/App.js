import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import { selectSubreddit, fetchPostsIfNeeded, invalidateSubreddit, requestLayers, receiveLayers, fetchLayers } from '../actions'
import { mapLayers } from '../reducers/rootReducer'
import Picker from '../components/Picker'
import Posts from '../components/Posts'
import TopToolbar from '../components/TopToolbar'
import LayerComponent from '../components/LayerComponent'
import MapComponent from '../components/MapComponent'
import SearchComponent from '../components/SearchComponent'
import OlMapComponent from '../components/OlMapComponent'

import '../../node_modules/react-checkbox-tree/src/scss/react-checkbox-tree.scss'
import '../style/main.scss'

class App extends Component {
  static propTypes = {
    dispatch: PropTypes.func.isRequired,
    layers: PropTypes.object.isRequired
  }

  constructor(props) {
    super(props)

    this.state = {
      location: 'external',
      coveragesLayers: [],
      activeLayer: {}
    }

    this.onLayerChange = this.onLayerChange.bind(this)
  }

  componentDidMount() {
    // const { dispatch, selectedSubreddit } = this.props
    // const { dispatch, layers } = this.props
    // dispatch(fetchPostsIfNeeded(selectedSubreddit))
    // dispatch(fetchLayers())
    
    fetch(`http://gptl.ru/api/map/public/maps.json`)
      .then(response => response.json())
      .then(json => {
        let layersArray = json[0].templates[0].layers 
        this.setState(Object.assign({}, this.state, {
          coveragesLayers: layersArray,
          activeLayer: layersArray.find(function(layer){if (!layer.layers && layer.config.options.visibility) return layer})
        }))
      })
  }

  componentDidUpdate(prevProps) {
    const { dispatch, layers } = this.props
  }

  componentWillReceiveProps(nextProps) {
    const { dispatch, layers } = this.props
    // if (nextProps.selectedSubreddit !== this.props.selectedSubreddit) {
    //   const { dispatch, selectedSubreddit } = nextProps
    //   dispatch(fetchPostsIfNeeded(selectedSubreddit))
    // }
  }

  onLayerChange(layer) {
    console.debug(layer)
    this.setState({ activeLayer: layer })
  }
  
  render() {
    const { layers } = this.props
    //<MapComponent coveragesLayers={this.state.coveragesLayers} activeLayer={this.state.activeLayer} onLayerChange={this.onLayerChange} />

    return (
      <div>
        <TopToolbar />
        <LayerComponent coveragesLayers={this.state.coveragesLayers} activeLayer={this.state.activeLayer} onLayerChange={this.onLayerChange} />
        <SearchComponent/>
        <OlMapComponent/>        
      </div>
    )
  }
}

App.defaultProps = {
  layers: Object.create(null)
}

const mapStateToProps = state => {
  const { layers, mapLayers } = state
  const {
    layers: {}
  } = mapLayers[requestLayers] || {
    layers: {},
    status: "error"
  }

  return {
    layers
  }
}

export default connect(mapStateToProps)(App)  
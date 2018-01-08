import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import { selectSubreddit, fetchPostsIfNeeded, invalidateSubreddit, requestLayers, receiveLayers, fetchLayers } from '../actions'
import { mapLayers } from '../reducers'
import Picker from '../components/Picker'
import Posts from '../components/Posts'
import TopToolbar from '../components/TopToolbar'
import LayerComponent from '../components/LayerComponent'
import MapComponent from '../components/MapComponent'

class App extends Component {
  static propTypes = {
    dispatch: PropTypes.func.isRequired,
    layers: PropTypes.object.isRequired
  }

  constructor(props) {
    super(props)
    this.state = {
      location: 'external',
      layersData: {}
    }
  }

  componentDidMount() {
    // const { dispatch, selectedSubreddit } = this.props
    // const { dispatch, layers } = this.props
    // dispatch(fetchPostsIfNeeded(selectedSubreddit))
    // dispatch(fetchLayers())
    const getActiveLayer = layers => { layers.map = (layer) => { return 23 } }

    fetch(`http://gptl.ru/api/map/public/maps.json`)
      .then(response => response.json())
      .then(json => {
        let layersArray = json[0].templates[0].layers 
        this.setState(Object.assign({}, this.state, {
          layersData: {
            layers: layersArray,
            activeLayer: layersArray.find(function(layer){if (!layer.layers && layer.config.options.visibility) return layer})
          }
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

  
  render() {
    const { layers } = this.props

    return (
      <div>
        <TopToolbar />        
        <LayerComponent layersData={this.state.layersData} />
        <MapComponent/>
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
import React, { Component } from 'react'
import PropTypes from 'prop-types'

import MapUtils from './MapUtils'
import Globe from './Globe'

import '../style/map.scss'

import '../../node_modules/cesium/Build/Cesium/Widgets/widgets.css'

class MapComponent extends Component {
  static propTypes = {    
    coveragesLayers: PropTypes.array.isRequired,
    onLayerChange: PropTypes.func.isRequired,
    activeLayer: PropTypes.object.isRequired
  }

  constructor(props) {
    super(props)
    this.state = {
      coveragesLayers: [],
      activeLayer: {}
    }
  }

  componentWillReceiveProps = (nextProps) => {
    this.setState({
      coveragesLayers: nextProps.coveragesLayers,
      activeLayer: nextProps.activeLayer
    })
    let mapLayers = []
    nextProps.coveragesLayers.forEach(function(layer){
      if (layer.type != 'Group') {
        let mapLayer = Object.assign({}, {
          uid: layer.idLayer, 
          name: layer.name,
          url: layer.config ? layer.config.options.url : ""
        })
        mapLayers.push(mapLayer)
      }
    })
    this.setState({
      viewLayers: mapLayers
    })
  }

  componentDidMount() {
  }

  render() {
    return (
      <div id="cesiumContainer">
        <Globe layers={this.state.viewLayers} activeLayer={this.state.activeLayer} />
      </div>
    )
  }
}

export default MapComponent
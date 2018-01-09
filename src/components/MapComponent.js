import React, {Component} from 'react'
import PropTypes from 'prop-types'

import Cesium from 'cesium/Cesium';

import '../../node_modules/cesium/Build/Cesium/Widgets/widgets.css'
import '../style/map.scss'

class MapComponent extends Component {
  static propTypes = {    
    
  }

  constructor(props) {
    super(props)
  }

  componentDidMount() {
    let viewer = new Cesium.Viewer('cesiumContainer')
  }


  render() {    
    return (
      <div id="cesiumContainer">
      </div>
    );
  }
}

export default MapComponent
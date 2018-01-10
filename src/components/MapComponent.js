import React, {Component} from 'react'
import PropTypes from 'prop-types'

// import Cesium from 'cesium/Cesium';

// import '../../node_modules/cesium/Build/Cesium/Widgets/widgets.css'
import '../style/map.scss'

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
  }

  componentDidMount() {
    // let viewer = new Cesium.Viewer('cesiumContainer')
  }


  render() {    
    return (
      <div id="cesiumContainer">
          {this.state.activeLayer.name}
      </div>
    )
  }
}

export default MapComponent
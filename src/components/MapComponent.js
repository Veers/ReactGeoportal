import React, {Component} from 'react'
import PropTypes from 'prop-types'

import Cesium from 'cesium/Cesium';

import '../../node_modules/cesium/Build/Cesium/Widgets/widgets.css'
import MapUtils from './MapUtils'
import Gator from 'Gator'
import './Globe'

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
      <div className="container">
            <div className="globe"></div>
            <div className="toolbar toolbar-top">
                <div className="toolbar-inner">
                    <div className="toolbar-item">
                        <div className="tile-buttons button-group">
                            <button className="button button-active" data-id="sputnik">Спутник</button>
                            <button className="button" data-id="map">Карта</button>
                            <button className="button" data-id="osm">OSM</button>
                        </div>
                        <button className="cadastre-button button">Кадастр</button>
                        <button className="terrain-button button">Рельеф</button>
                    </div>
                    <div className="toolbar-item">
                        <div className="wms-buttons button-group">
                            <button className="button" data-id="meteor-m1-kmss">Meteor M1 (KMSS)</button>
                            <button className="button" data-id="meteor-m2-kmss">Meteor M2 (KMSS)</button>
                            <button className="button" data-id="resurs-dk1-geoton">Resurs DK1 (Geoton)</button>
                        </div>
                    </div>
                </div>
            </div>
            <div className="toolbar toolbar-bottom">
                <div className="toolbar-inner">
                    <div className="toolbar-item">
                        <form className="geocoding-form">
                            <div className="button-group">
                                <input className="geocoding-input control" type="text" />
                                <button className="button">Искать</button>
                            </div>
                        </form>
                    </div>
                    <div className="toolbar-item">
                        <div className="tracer tracer-hidden">
                            <div className="tracer-latitude"></div>
                            <div className="tracer-longitude"></div>
                        </div>
                        <div className="copyright">2017 &copy; Все права защищены</div>
                    </div>
                </div>
            </div>
            <div className="toolbar toolbar-left">
                <div className="toolbar-inner">
                    <div className="toolbar-item">
                        <div className="zoom-buttons button-group button-group-vertical">
                            <button className="button" data-id="zoom-in">+</button>
                            <button className="button" data-id="zoom-out">−</button>
                        </div>
                        <button className="north-button button">N</button>
                    </div>
                </div>
            </div>
            <div className="toolbar toolbar-right">
                <div className="toolbar-inner">
                    <div className="toolbar-item"></div>
                    <div className="toolbar-item"></div>
                </div>
            </div>
            <div className="overlay overlay-hidden"></div>
        </div>
    )
  }
}

export default MapComponent
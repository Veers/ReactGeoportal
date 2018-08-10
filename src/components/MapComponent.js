import React, { Component } from 'react'
import PropTypes from 'prop-types'

import MapUtils from './MapUtils'

import ol from 'ol-cesium/dist/ol.js'

import 'ol/ol.css';
import Map from 'ol/Map';
import View from 'ol/View';
import TileLayer from 'ol/layer/Tile';
import TileWMS from 'ol/source/TileWMS';
import OSM from 'ol/source/OSM';
import XYZ from 'ol/source/XYZ';
import WMTS from 'ol/source/WMTS';
import WMTSTileGrid from 'ol/tilegrid/WMTS';
import {get as getProjection} from 'ol/proj';
import {getWidth, getTopLeft} from 'ol/extent';

import '../style/map.scss'
import '../../node_modules/cesium/Build/Cesium/Widgets/widgets.css'

class MapComponent extends Component {
    static propTypes = {
        projection: PropTypes.string.isRequired,
        activeLayer: PropTypes.string.isRequired
    }

    createOSMLayer = () => {
        return new TileLayer({
            source: new OSM()
        })
    }

    createXYZLayer = (layerData) => {
        let source = new XYZ({
            url: 'https://server.arcgisonline.com/ArcGIS/rest/services/' +
                  'World_Topo_Map/MapServer/tile/{z}/{y}/{x}'
        })
        return new TileLayer({
            source: source
        })
    }

    createWMSLayer = (layerData) => {
        var wmsSource = new TileWMS({
            url: 'https://ahocevar.com/geoserver/wms',
            params: {'LAYERS': 'ne:ne', 'TILED': true},
            serverType: 'geoserver',
            crossOrigin: 'anonymous'
        });

        return new TileLayer({
            source: wmsSource
        });
    }

    createWMTSLayer = (layerData) => {
        var projection = getProjection('EPSG:3857');
        var projectionExtent = projection.getExtent();
        var size = getWidth(projectionExtent) / 256;
        var resolutions = new Array(14);
        var matrixIds = new Array(14);
        for (var z = 0; z < 14; ++z) {
            resolutions[z] = size / Math.pow(2, z);
            matrixIds[z] = z;
        }


        return new TileLayer({
            opacity: 0.7,
            source: new WMTS({
                attributions: 'Tiles © <a href="https://services.arcgisonline.com/arcgis/rest/' +
                  'services/Demographics/USA_Population_Density/MapServer/">ArcGIS</a>',
                url: 'https://services.arcgisonline.com/arcgis/rest/' +
                  'services/Demographics/USA_Population_Density/MapServer/WMTS/',
                layer: '0',
                matrixSet: 'EPSG:3857',
                format: 'image/png',
                projection: projection,
                tileGrid: new WMTSTileGrid({
                    origin: getTopLeft(projectionExtent),
                    resolutions: resolutions,
                    matrixIds: matrixIds
                }),
                style: 'default',
                wrapX: true
            })
        })
    }

    constructor(props) {
        super(props)
    }

    componentDidMount = () => {        
        let proj = this.props.projection;
        let xyzLayer = this.createXYZLayer();
        let wmsLayer = this.createWMSLayer();
        let wmtsLayer = this.createWMTSLayer();
        const map = new Map({
            target: 'cesiumContainer',
            layers: [
                // new TileLayer({
                //     source: new OSM()
                // }),
                // xyzLayer,
                wmsLayer,
                wmtsLayer
            ],
            view: new View({
              center: [0, 0],
              zoom: 4,
              projection: proj
            })
        });

        this.setState({map: map});
    }

    componentDidUpdate = (prevProps, prevState, snapshot) => {
        if (this.props.activeLayer !== prevProps.activeLayer) {
            this.setState({test: this.props.activeLayer})
            let map = this.state.map;
            switch(this.props.activeLayer) {
                case 'xyz':
                    console.log('xyz')
                    break;
                case 'wms':
                    console.log('wms')
                    break;
                case 'wmts':
                    console.log('wmts')
                    break;
            }
        }
    }

    render() {
        return false
    }
}

export default MapComponent
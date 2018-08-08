import React, { Component } from 'react'
import PropTypes from 'prop-types'

import MapUtils from './MapUtils'

import Cesium from 'cesium/Cesium'

import '../style/map.scss'

import '../../node_modules/cesium/Build/Cesium/Widgets/widgets.css'

class MapComponent extends Component {
    // static propTypes = {
    //     coveragesLayers: PropTypes.array.isRequired,
    //     onLayerChange: PropTypes.func.isRequired,
    //     activeLayer: PropTypes.object.isRequired
    // }

    constructor(props) {
        super(props)

        let widget = new Cesium.CesiumWidget('cesiumContainer', {
            terrainProvider: new Cesium.CesiumTerrainProvider({
                url: 'https://assets.agi.com/stk-terrain/v1/tilesets/world/tiles'
            }),
            // Show Columbus View map with Web Mercator projection
            mapProjection: new Cesium.WebMercatorProjection()
        })

        this.state = {
            coveragesLayers: [],
            activeLayer: {},
            cesiumWidget: widget,
            loadBasicLayers: false
        }
    }

    componentWillReceiveProps = (nextProps) => {
        this.setState({
            coveragesLayers: nextProps.coveragesLayers,
            activeLayer: nextProps.activeLayer
        })
        let mapLayers = []
        // nextProps.coveragesLayers.forEach(function(layer) {
        //     if (layer.type != 'Group') {
        //         let mapLayer = Object.assign({}, {
        //             uid: layer.idLayer,
        //             name: layer.name,
        //             url: layer.config ? layer.config.options.url : ""
        //         })
        //         mapLayers.push(mapLayer)
        //     }
        // })
        this.setState({
            viewLayers: mapLayers
        })
        if (!this.state.loadBasicLayers) {

            const basicImageries = {
                'Мозаика (Landsat)': {
                    uid: 'images_landsat',
                    url: 'http://tiles.maps.sputnik.ru/',
                    northPoleUrl: 'static/geoportal/release/img/sputnik-north-pole.png',
                    southPoleUrl: 'static/geoportal/release/img/sputnik-south-pole.png'
                },
                'Карта (РИАС РКД)': {
                    uid: 'worldmap',
                    url: 'http://basemap.rekod.ru/worldmap/',
                    northPoleUrl: 'static/geoportal/release/img/map-north-pole.png',
                    southPoleUrl: 'static/geoportal/release/img/map-south-pole.png'
                },
                'Карта (OSM)': {
                    uid: 'osm',
                    url: 'http://a.tile.openstreetmap.org/',
                    northPoleUrl: 'static/geoportal/release/img/osm-north-pole.png',
                    southPoleUrl: 'static/geoportal/release/img/osm-south-pole.png'
                },
                'Карта Спутник': {
                    uid: 'sputnik',
                    url: 'http://tiles.maps.sputnik.ru/',
                    northPoleUrl: 'static/geoportal/release/img/sputnik-north-pole.png',
                    southPoleUrl: 'static/geoportal/release/img/sputnik-south-pole.png'
                }
            }
            const basicImageryIds = Object.keys(basicImageries)

            let layers = this.state.cesiumWidget.scene.imageryLayers

            if (nextProps.coveragesLayers) {
                console.warn(232)
                nextProps.coveragesLayers.forEach(layer => {
                    let layerName = layer.name
                    if (basicImageryIds.includes(layerName)) {
                        console.log(basicImageries[layerName].url)
                        let imageryProvider = new Cesium.createOpenStreetMapImageryProvider({
                            url: basicImageries[layerName].url,
                            name: layerName,
                            visibility: layerName === nextProps.activeLayer.name
                        })
                        layers.addImageryProvider(imageryProvider)
                    }
                })

                this.setState({ loadBasicLayers: true })
            }
        }
    }

    componentDidMount() {}

    render() {
        return false
    }
}

export default MapComponent
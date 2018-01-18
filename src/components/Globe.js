import React, { Component } from 'react'
import PropTypes from 'prop-types'

import Cesium from 'cesium/Cesium'

class Globe extends Component {

    constructor(props) {
        super(props)
        // init constants
        this.state = {
            basicLayers: [],
            activeBasicLayer: {},
            wmsCoverages: [],
            activeWmsCoverages: []
        }

        let gmlNamespace = 'http://www.opengis.net/gml'
        let isRendered = false

        let basicImageries = {
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

        let cadastreServiceUrl = 'https://pkk5.rosreestr.ru/arcgis/rest/services/Cadastre/Cadastre/MapServer/export'
        let cadastreLayerNames = [
            '0', '1', '2', '4', '5', '6', '7', '8', '9', '10', '11', '12', '13', '14', '15', '16',
            '17', '18', '19', '20', '23', '24', '29', '30', '31', '32', '33', '34', '35', '38', '39'
        ]

        let wmsServices = {
            'Канопус-В ПСС': 'http://gptl.ru/wms/kv_pss/service',
            // 'Канопус-В ПСС': 'http://tb-pod-ext.sec45.ccr.dep4.niitp:8001/wms/kv_pss/service',
            'Канопус-В МСС': 'http://gptl.ru/wms/kv_mss/service',
            'Метеор-М1 КМСС': 'http://gptl.ru/wms/mm1_msu/service',
            'Метеор-М2 КМСС': 'http://gptl.ru/wms/mm2_msu/service',
            'Ресурс-ДК1 Геотон': 'http://gptl.ru/wms/rdk1_gtn/service',
            'Ресурс-П ШМСАВР': 'http://gptl.ru/wms/rp_svr/service',
            'Ресурс-П ШМСАСР': 'http://gptl.ru/wms/rp_ssr/service',
            'Ресурс-П Гиперспектрометр': 'http://gptl.ru/wms/rp_gsa/service',
            'Ресурс-П Геотон Мультиспектр': 'http://gptl.ru/wms/rp_gtnl1/service'
        }

        let wmsBasicLayerNames = ['imageries', 'boundaries']

        let basicLayers = {}
        let wms = {}

        let wmsFeatureGeoJsonDataSources = {}

        let searchFeatureDataSource = {}

        let featureCount = 100

        let minZoom = 100.0
        let maxZoom = 15000000.0

        let minZoomAmount = 50000.0
        let maxZoomAmount = 800000.0

        var geocodingUrl = 'http://geocode-maps.yandex.ru/1.x/'

        let isFetching = false


        let addedFeatures = {}

        let syncronizedFeatures = []

        let geoJsonTransferFeatures = []

        let wmsImageryLayers = {}
        let wmsFeatureImageryLayers = {}
        let wmsFeatureBoundImageryLayers = {}

        let isSyncCoverages = false

        let infoPopup = null

        let activeWmsLayers = []

        let isInitialize = false

    }

    componentWillReceiveProps = (nextProps) => {

        // let ellipsoidTerrainProvider = new Cesium.EllipsoidTerrainProvider()
        // let cesiumTerrainProvider = new Cesium.CesiumTerrainProvider({
        //     url: 'https://assets.agi.com/stk-terrain/world'
        // })

        // let cesiumWidget = new Cesium.CesiumWidget(document.querySelector('#container'), {
        //     imageryProvider: false,
        //     terrainProvider: ellipsoidTerrainProvider,
        //     // creditContainer: document.createElement('div'),
        //     orderIndependentTranslucency: true,
        //     useDefaultRenderLoop: false
        // })


        // let scene = cesiumWidget.scene
        // let cameraController = scene.screenSpaceCameraController

        // let wmsFeatureGeoJsonDataSources = {}
        // let dataSourceCollection = new Cesium.DataSourceCollection()
        // let dataSourceDisplay = new Cesium.DataSourceDisplay({
        //     scene: scene,
        //     dataSourceCollection: dataSourceCollection
        // })

        // new Cesium.EventHelper().add(cesiumWidget.clock.onTick, (function (clock) {
        //     this.dataSourceDisplay.update(clock.currentTime)
        // }), this)

        // let camera = cesiumWidget.camera
        // camera.setView({
        //     destination: Cesium.Cartesian3.fromDegrees(74.4, 58.7, 15000000.0)
        // })

        // let imageryLayers = scene.imageryLayers
        // // let basicImageryProvider = new Cesium.SingleTileImageryProvider({
        // //     url: 'static/geoportal/release/img/earth.jpg'
        // // })
        // let basicImageryProvider = Cesium.createOpenStreetMapImageryProvider({
        //     url: nextProps.activeLayer.config.options.url
        // })
        // let basicImageryLayer = new Cesium.ImageryLayer(basicImageryProvider);
        // imageryLayers.add(basicImageryLayer)

        // Cesium.requestAnimationFrame(animate)

        // function animate() {
        //     cesiumWidget.resize()
        //     cesiumWidget.render()
        //     Cesium.requestAnimationFrame(animate)
        // }

        console.log(nextProps.activeLayer)

        let widget = new Cesium.CesiumWidget('cesiumContainer', {
            imageryProvider: Cesium.createOpenStreetMapImageryProvider(),
            terrainProvider: new Cesium.CesiumTerrainProvider({
                url: 'https://assets.agi.com/stk-terrain/v1/tilesets/world/tiles'
            }),
            skyBox: new Cesium.SkyBox({
                sources: {
                    positiveX: 'stars/TychoSkymapII.t3_08192x04096_80_px.jpg',
                    negativeX: 'stars/TychoSkymapII.t3_08192x04096_80_mx.jpg',
                    positiveY: 'stars/TychoSkymapII.t3_08192x04096_80_py.jpg',
                    negativeY: 'stars/TychoSkymapII.t3_08192x04096_80_my.jpg',
                    positiveZ: 'stars/TychoSkymapII.t3_08192x04096_80_pz.jpg',
                    negativeZ: 'stars/TychoSkymapII.t3_08192x04096_80_mz.jpg'
                }
            }),
            // Show Columbus View map with Web Mercator projection
            mapProjection: new Cesium.WebMercatorProjection()
        })
    }

    componentDidMount = () => {}

    render() {
        return false
    }

}

export default Globe
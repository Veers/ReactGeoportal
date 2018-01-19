Ext.define('Globe',
    {
        constructor: function (config) {
            this.map = config;
            // init constants
            this.cesiumWidget = null;
            this.gmlNamespace = 'http://www.opengis.net/gml';
            this.isRendered = false;

            this.basicImageries = {
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
            };


            this.basicImageryIds = Object.keys(this.basicImageries);

            this.cadastreServiceUrl = 'https://pkk5.rosreestr.ru/arcgis/rest/services/Cadastre/Cadastre/MapServer/export';
            this.cadastreLayerNames = [
                '0', '1', '2', '4', '5', '6', '7', '8', '9', '10', '11', '12', '13', '14', '15', '16',
                '17', '18', '19', '20', '23', '24', '29', '30', '31', '32', '33', '34', '35', '38', '39'
            ];

            this.wmsServices = {
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

            };
            this.wmsIds = Object.keys(this.wmsServices);
            this.wmsBasicLayerNames = ['imageries', 'boundaries'];

            this.basicLayers = {};
            this.wms = {};

            this.wmsFeatureGeoJsonDataSources = {};

            this.searchFeatureDataSource = {};

            this.ellipsoidTerrainProvider = new Cesium.EllipsoidTerrainProvider();
            this.cesiumTerrainProvider = new Cesium.CesiumTerrainProvider({
                url: 'https://assets.agi.com/stk-terrain/world'
            });

            this.featureCount = 100;

            this.minZoom = 100.0;
            this.maxZoom = 15000000.0;

            this.minZoomAmount = 50000.0;
            this.maxZoomAmount = 800000.0;

            var geocodingUrl = 'http://geocode-maps.yandex.ru/1.x/';

            this.isFetching = false;


            this.addedFeatures = {};

            this.syncronizedFeatures = [];

            this.geoJsonTransferFeatures = [];

            this.wmsImageryLayers = {};
            this.wmsFeatureImageryLayers = {};
            this.wmsFeatureBoundImageryLayers = {};

            this.isSyncCoverages = false;

            this.infoPopup = null;

            this.activeWmsLayers = [];

            this.currentZoom = this.maxZoom;

            this.isInitialize = false;
        },

        syncronizeLayers: function(layers) {
        // console.log("synchronize layers");
        this.syncronizedFeatures = [];
        var basicImageries = {};
        var wmsCoverages = {};
        var th = this;
        layers.map(function (item) {
            if (item.options.layerType === "CoverageWMSServer") {
                wmsCoverages[item.name] = new Object();
                wmsCoverages[item.name].url = item.url;
                var summaryVisibility = (item.imageriesLayer.visibility || item.boundariesLayer.visibility) && item.visibility;
                wmsCoverages[item.name].visibility = summaryVisibility;
                if (item.imageriesLayer && item.imageriesLayer.children)
                    th.addSelectedFeatures(item.imageriesLayer.children);
            } else {

                // if (item.url.indexOf('images_landsat'))

                basicImageries[item.name] = new Object();
                basicImageries[item.name].url = item.url;
                basicImageries[item.name].visibility = item.visibility;
            }
        });
        if (!this.isSyncCoverages) {
            this.wms = wmsCoverages;
            this.isSyncCoverages = true;
        }
        this.basicLayers = basicImageries;
    },

    addSelectedFeatures: function(features) {
        for (var i = 0; i < features.length; i++) {
            this.syncronizedFeatures.push(features[i]);
        }
    },

    showGlobe: function(elementId) {
        if (this.cesiumWidget == null) {
            this.cesiumWidget = new Cesium.CesiumWidget(document.querySelector("#" + elementId), {
                imageryProvider: false,
                terrainProvider: this.ellipsoidTerrainProvider,
                creditContainer: document.createElement('div'),
                orderIndependentTranslucency: true,
                useDefaultRenderLoop: false
            });
            this._mapTag = document.querySelector("#" + elementId);
            this.initControls();
            this.initGlobeControls(elementId);
        }
        this.isRendered = true;
        this.normalizeLayersTree();
        this.addSelectedFeaturesFromOlMap();
        var zoomLevelHeights = this.getZoomLevelHeights(1);
        this.isInitialize = true;

        // for (var i = 0; i < zoomLevelHeights.length; i++) {
        //     console.log('Level: ' + zoomLevelHeights[i].level + ', camera height: ' + zoomLevelHeights[i].height);
        // }
    },

    getGlobeTag: function() {
        return this._mapTag;
    },

    initGlobeControls: function(elementId) {
        var parentEl = document.querySelector("#" + elementId).parentNode;
        var a = document.createElement('div');
        a.className = "toolbar toolbar-left";
        var b = document.createElement('div');
        b.className = "toolbar-inner";
        var c = document.createElement('div');
        c.className = "toolbar-item";
        var d = document.createElement('div');
        d.className = "zoom-buttons button-group button-group-vertical";

        var zoomInButton = document.createElement('button');
        zoomInButton.className = "button";
        zoomInButton.innerHTML = "+";
        zoomInButton.setAttribute('data-id', "zoom-in");

        var homeButton = document.createElement('button');
        homeButton.className = "button";
        homeButton.innerHTML = "D";
        homeButton.setAttribute('data-id', "zoom-home");

        var zoomOutButton = document.createElement('button');
        zoomOutButton.className = "button";
        zoomOutButton.innerHTML = "-";
        zoomOutButton.setAttribute('data-id', "zoom-out");

        var normalizeButton = document.createElement('button');
        normalizeButton.className = "north-button button";
        normalizeButton.innerHTML = "N";
        normalizeButton.setAttribute('data-id', "zoom-n");

        var aa = document.createElement('div');
        aa.className = "toolbar toolbar-bottom";
        var bb = document.createElement('div');
        bb.className = "toolbar-bottom-info";
        var cc = document.createElement('div');
        cc.className = "toolbar-item";
        var dd = document.createElement('div');
        dd.className = "tracer tracer-hidden";
        var tracerLat = document.createElement('div');
        tracerLat.className = "tracer-latitude";
        var tracerLong = document.createElement('div');
        tracerLong.className = "tracer-longitude";
        var copyright = document.createElement('div');
        copyright.className = "copyright";
        copyright.innerHTML = "Поиск &copy; <u><a class='cpHref' target='blank' href='http://www.openstreetmap.org/copyright'>OpenStreepMap</a></u>, ";
        copyright.innerHTML += "&copy; <u><a class='cpHref' target='blank' href='http://www.geonames.org/'>GeoNames</a></u>";

        parentEl.appendChild(a);
        a.appendChild(b);
        b.appendChild(c);
        c.appendChild(d);
        d.appendChild(zoomInButton);
        d.appendChild(homeButton);
        d.appendChild(zoomOutButton);
        c.appendChild(normalizeButton);

        parentEl.appendChild(aa);
        aa.appendChild(bb);
        bb.appendChild(cc);
        cc.appendChild(dd);
        cc.appendChild(copyright);
        dd.appendChild(tracerLat);
        dd.appendChild(tracerLong);

        $(document.querySelector('.north-button')).on('click', this.restoreNorthOrientation.bind(this));

        $(document).on('mousedown', '.button', (function (event) {
            var id = event.target.getAttribute('data-id');
            if (id == 'zoom-in')
                this.zoomIn();
            if (id == 'zoom-out')
                this.zoomOut();
            if (id == 'zoom-home')
                this.flyHome();
        }).bind(this));
    },

    hideGlobeControls: function() {
        document.querySelector('.toolbar-item').style.display = 'none';
    },

    showGlobeControls: function() {
        document.querySelector('.toolbar-item').style.display = 'block';
    },

    initControls: function() {

        var cesiumWidget = this.cesiumWidget;
        // Swapping drag and tilt events' sources
        this.scene = cesiumWidget.scene;
        var scene = this.scene,
            cameraController = scene.screenSpaceCameraController;

        // Initializing vector data sources
        this.wmsFeatureGeoJsonDataSources = {};
        this.dataSourceCollection = new Cesium.DataSourceCollection();
        this.dataSourceDisplay = new Cesium.DataSourceDisplay({
            scene: scene,
            dataSourceCollection: this.dataSourceCollection
        });

        new Cesium.EventHelper().add(cesiumWidget.clock.onTick, (function (clock) {
            this.dataSourceDisplay.update(clock.currentTime);
        }), this);



        // cameraController.zoomEventTypes = [
        //     Cesium.CameraEventType.MIDDLE_DRAG,
        //     Cesium.CameraEventType.WHEEL,
        //     Cesium.CameraEventType.PINCH
        // ];
        // cameraController.tiltEventTypes = Cesium.CameraEventType.RIGHT_DRAG;

        // Limiting camera position
        cameraController.minimumZoomDistance = this.minZoom;
        cameraController.maximumZoomDistance = this.maxZoom;

        // Setting initial view
        var camera = cesiumWidget.camera;
        camera.setView({
            destination: Cesium.Cartesian3.fromDegrees(74.4, 58.7, 15000000.0)
        });

        // Loading basic imagery layers
        this.imageryLayers = scene.imageryLayers;
        var imageryLayers = this.imageryLayers;
        var basicImageryProvider = new Cesium.SingleTileImageryProvider({
            url: 'static/geoportal/release/img/earth.jpg'
        });
        var basicImageryLayer = new Cesium.ImageryLayer(basicImageryProvider);
        imageryLayers.add(basicImageryLayer);

        this.basicImageryLayers = {};
        for (var i = 0; i < Object.keys(this.basicLayers).length; i++) {
            var id = Object.keys(this.basicLayers)[i];
            var values = Object.values(this.basicLayers)[i];
            this.addBasicImageryLayer(id, values);
        }

        // Loading cadastre layer
        var comma = encodeURIComponent(',');
        var cadastreImageryProvider = new Cesium.UrlTemplateImageryProvider({
            url: this.cadastreServiceUrl + '?layers=' + encodeURIComponent('show:' + this.cadastreLayerNames.join(',')) + '&' +
            'dpi=96&format=png&transparent=true&size256' + comma + '256&' +
            'bboxSR=4326&imageSR=4326&' +
            'bbox={westProjected}' + comma + '{southProjected}' + comma + '{eastProjected}' + comma + '{northProjected}&' +
            'f=image',
            tilingScheme: new Cesium.GeographicTilingScheme()
        });
        var cadastreImageryLayer = new Cesium.ImageryLayer(cadastreImageryProvider, {
            show: false
        });
        imageryLayers.add(cadastreImageryLayer);

        // Loading WMS layers
        for (var i = 0; i < Object.keys(this.wms).length; i++) {
            this.addWmsImageryLayer(Object.keys(this.wms)[i]);
        }

        // Adding canvas event listeners
        var canvas = cesiumWidget.canvas;
        var canvasEventHandler = new Cesium.ScreenSpaceEventHandler(canvas);
        // canvasEventHandler.setInputAction(
        //     this.onMouseCtrlClick.bind(this),
        //     Cesium.ScreenSpaceEventType.LEFT_CLICK,
        //     Cesium.KeyboardEventModifier.CTRL
        // );

        canvasEventHandler.setInputAction(
            this.onMouseCtrlClick.bind(this),
            Cesium.ScreenSpaceEventType.LEFT_CLICK
        );

        canvasEventHandler.setInputAction(
            this.onMouseWheelMove.bind(this),
            Cesium.ScreenSpaceEventType.WHEEL
        );

        // Adding point primitive collection for search
        this.points = scene.primitives.add(new Cesium.PointPrimitiveCollection());



        // TODO add func
        canvasEventHandler.setInputAction(onMouseMove, Cesium.ScreenSpaceEventType.MOUSE_MOVE);
        function onMouseMove(event) {
            var tracer = document.querySelector('.tracer');
            var tracerLatitude = tracer.querySelector('.tracer-latitude');
            var tracerLongitude = tracer.querySelector('.tracer-longitude');

            var position = event.endPosition,
                ellipsoid = scene.globe.ellipsoid,
                cartesian = camera.pickEllipsoid(position, ellipsoid);

            tracer.className = classNames({
                tracer: true,
                'tracer-hidden': !cartesian
            });

            if (!cartesian) {
                // Point is outside the globe
                return;
            }

            var cartographic = Cesium.Cartographic.fromCartesian(cartesian, ellipsoid);
            tracerLatitude.innerHTML = formatLatitude(cartographic.latitude);

            tracerLongitude.innerHTML = formatLongitude(cartographic.longitude); // + " : " + cartographic.height;

            function formatAngle(value, isDegrees) {
                isDegrees = isDegrees || false;
                if (!isDegrees) {
                    value = value / Math.PI * 180;
                }

                var sign = Math.sign(value);

                value = Math.abs(value);

                var real = value % 1;
                var degree = value - real;
                var primes = Math.round(real * 3600);

                var doublePrime = primes % 60;
                var prime = (primes - doublePrime) / 60;

                return {
                    degree: degree,
                    prime: prime,
                    doublePrime: doublePrime,
                    sign: sign
                };
            }

            function formatLatitude(value, isDegrees) {
                var f = formatAngle(value, isDegrees);
                return (f.degree < 10 ? '0' : '') + f.degree + '°' +
                    (f.prime < 10 ? '0' : '') + f.prime + '′' +
                    (f.doublePrime < 10 ? '0' : '') + f.doublePrime + '″' +
                    (f.sign > 0 ? 'N' : 'S');
            }

            function formatLongitude(value, isDegrees) {
                var f = formatAngle(value, isDegrees);
                return (f.degree < 10 ? '0' : '') + (f.degree < 100 ? '0' : '') + f.degree + '°' +
                    (f.prime < 10 ? '0' : '') + f.prime + '′' +
                    (f.doublePrime < 10 ? '0' : '') + f.doublePrime + '″' +
                    (f.sign > 0 ? 'E' : 'W');
            }
        }


        // Starting render loop
        Cesium.requestAnimationFrame(animate);

        function animate() {
            cesiumWidget.resize();
            cesiumWidget.render();
            Cesium.requestAnimationFrame(animate);
        }
    },

    onMouseCtrlClick: function(event) {
        if (this.isFetching) {
            return;
        }

        this.getVisibleWmsImageryLayerIds();
        var ids = this.activeWmsLayers;
        var transferredFeatures = this.wmsFeatureGeoJsonDataSources;
        if (ids.length < 1 || !event.position) {// && transferredFeatures.length <= 0) {
            return;
        }

        var ellipsoid = this.scene.globe.ellipsoid;
        var camera = this.cesiumWidget.camera;
        var cartesian = camera.pickEllipsoid(event.position, ellipsoid);
        if (!cartesian) {
            // Point is outside the globe
            return;
        }

        var ray = camera.getPickRay(event.position);
        var featuresPromise = this.imageryLayers.pickImageryLayerFeatures(ray, this.scene);
        if (!featuresPromise) {
            return;
        }

        var mapTagElement = new Ext.Element(this.getGlobeTag());
        mapTagElement.mask(l10n.t("Загрузка...", "Loading..."), "x-mask-loading");


        // this.removeWmsFeatureLayers();
        this.setFetching(true);
        featuresPromise.then((function (features) {
            this.setFetching(false);
            this.featureList = features;
            // this.showFeaturesTooltip(features, event.position);
            if (features.length > 0)
                this.createPopup(features, event.position);
            else
                Ext.Msg.alert('Сообщение', 'Не найдено ни одного снимка');
            mapTagElement.unmask();
        }).bind(this)).otherwise(function (e) {
            this.setFetching(false);
            mapTagElement.unmask();
            console.error(e);
            // alert('Не удалось распарсить ответ WMS!');
        });
    },

    onMouseWheelMove: function(event) {
        // if (event < 0) {
        //     console.log(event);
        // } else {
        //     console.log(event);
        // }
        this.currentZoom = this.cesiumWidget.camera.getMagnitude();
        this.zoomLevel = this.detectZoomLevel(this.getZoomAmount());
        // console.log(this.detectZoomLevel(this.getZoomAmount()));
    },

    addBasicImageryLayer: function(id, values) {
        var layers = [];
        if (id !== 'Публичная кадастровая карта') {

            var params = null;

            var vals = Object.values(this.basicImageries);
            for (var i = 0; i<vals.length; i++) {
                if (values.url.indexOf(vals[i].uid) > -1)
                    params = this.basicImageries[Object.keys(this.basicImageries)[i]];
                if (values.url instanceof Array && this.basicImageries[id])
                    var params = this.basicImageries[id];
            }

            // var params = this.basicImageries[id];

            var layerOptions = (values.url.indexOf('images_landsat') > -1) ? { show: false } : { show: this.basicLayers[id].visibility };
            if (params && params.hasOwnProperty('url')) {
                var imageryProvider = Cesium.createOpenStreetMapImageryProvider({
                    url: params.url
                });
                var imageryLayer = new Cesium.ImageryLayer(imageryProvider, layerOptions);
                this.imageryLayers.add(imageryLayer);
                layers.push(imageryLayer);

                if (params.northPoleUrl) {
                    var northPoleImageryProvider = new Cesium.SingleTileImageryProvider({
                        url: params.northPoleUrl,
                        rectangle: Cesium.Rectangle.fromDegrees(-180.0, 84.9, 180.0, 90.0)
                    });
                    var northPoleImageryLayer = new Cesium.ImageryLayer(northPoleImageryProvider, layerOptions);
                    this.imageryLayers.add(northPoleImageryLayer);
                    layers.push(northPoleImageryLayer);
                }

                if (params.southPoleUrl) {
                    var southPoleImageryProvider = new Cesium.SingleTileImageryProvider({
                        url: params.southPoleUrl,
                        rectangle: Cesium.Rectangle.fromDegrees(-180.0, -90.0, 180.0, -84.9)
                    });
                    var southPoleImageryLayer = new Cesium.ImageryLayer(southPoleImageryProvider, layerOptions);
                    this.imageryLayers.add(southPoleImageryLayer);
                    layers.push(southPoleImageryLayer);
                }
                this.basicImageryLayers[id] = layers;
            }
        } else {
            var comma = encodeURIComponent(',');
            var cadastreImageryProvider = new Cesium.UrlTemplateImageryProvider({
                url: this.cadastreServiceUrl + '?layers=' + encodeURIComponent('show:' + this.cadastreLayerNames.join(',')) + '&' +
                'dpi=96&format=png&transparent=true&size256' + comma + '256&' +
                'bboxSR=4326&imageSR=4326&' +
                'bbox={westProjected}' + comma + '{southProjected}' + comma + '{eastProjected}' + comma + '{northProjected}&' +
                'f=image',
                // tilingScheme: new Cesium.GeographicTilingScheme()
                tilingScheme: new Cesium.WebMercatorTilingScheme()
            });
            var cadastreImageryLayer = new Cesium.ImageryLayer(cadastreImageryProvider, {
                show: this.basicLayers[id].visibility
            });
            this.cadastreImageryLayer = cadastreImageryLayer;
            this.scene.imageryLayers.add(cadastreImageryLayer);
        }
    },

    changeVisibility: function (name, visibility) {
        if (this.cesiumWidget) {
            if (name === 'Публичная кадастровая карта')
                this.cadastreImageryLayer.show = visibility;
            else {
                if (name.replace(/\W/g, '') === 'Мозаика (Landsat)'.replace(/\W/g, '') && visibility) {
                    var ids = Object.keys(this.basicImageryLayers);
                    for (var i = 0; i < ids.length; i++) {
                        var id = ids[i];
                        var layers = this.basicImageryLayers[id];
                        for (var i = 0; i < layers.length; i++) {
                            layers[i].show = false;
                        }
                    }
                } else {
                    var layers = this.basicImageryLayers[name];
                    for (var i = 0; i < layers.length; i++) {
                        layers[i].show = visibility;
                    }
                }
            }
        }
    },

    setWMSLayerVisibility: function(layer, visibility) {
        if (this.wms[layer.layer.name])
            this.wms[layer.layer.name].show = visibility;
    },

    addWmsImageryLayer: function(id) {
        var url = this.wms[id].url;
        var visibility = this.wms[id].visibility;

        var imageryProvider = new Cesium.WebMapServiceImageryProvider({
            url: url,
            layers: this.wmsBasicLayerNames.join(','),
            tilingScheme: new Cesium.WebMercatorTilingScheme(),
            enablePickFeatures: true,
            getFeatureInfoFormats: [
                new Cesium.GetFeatureInfoFormat('xml', 'application/vnd.ogc.gml', this.parseWmsFeatures.bind(this))
            ],
            parameters: {
                transparent: 'true',
                format: 'image/png',
                srs: 'EPSG:3857'
                // srs: 'EPSG:4326'
            },
            getFeatureInfoParameters: {
                id: id,
                'feature_count': this.featureCount
            }
        });

        var imageryLayer = new Cesium.ImageryLayer(imageryProvider, {
            show: visibility
        });
        this.imageryLayers.add(imageryLayer);
        // this.wmsImageryLayers[id] = imageryLayer;
        this.wms[id] = imageryLayer;
    },

    addSelectedFeaturesFromOlMap: function() {
        // console.log("TEST");
        var layersTreeAdapther = this.map.layersTreeAdapther;
        var imageryLayers = layersTreeAdapther.getImageryLayers();
        for (var i = 0; i < imageryLayers.length; i++) {
            var layer = imageryLayers[i];
            layer.bound ? this.wmsFeatureBoundImageryLayers[layer.name] = layer : this.wmsFeatureImageryLayers[layer.name] = layer;
            if (!this.scene.imageryLayers.contains(layer))
                this.scene.imageryLayers.add(layer);
        }


        var geoJson = layersTreeAdapther.getGeoJsonDataSources();
        var keys = Object.keys(geoJson);
        for (var i = 0; i < keys.length; i++) {
            var key = keys[i];
            geoJson[key].geoJson.show = geoJson[key].visibility;
            if (!this.dataSourceCollection.contains(geoJson[key].geoJson)) {
                this.dataSourceCollection.add(geoJson[key].geoJson);
                this.wmsFeatureGeoJsonDataSources[key] = geoJson[key].geoJson;
            }
        }

        // this.dataSourceCollection.add(geoJsonDataSource);
        // this.wmsFeatureGeoJsonDataSources[name] = geoJsonDataSource;


        // var olFormatGeoJson = new OpenLayers.Format.GeoJSON();
        // var len = this.syncronizedFeatures.length;

        // if (len <= 0)
        //     return;
        // this.featureList = this.syncronizedFeatures;
        // for (var i = 0; i < len; i++) {
        //     var feature = this.featureList[i];
        //     var geometry = feature.feature.geometry;
        //     if (geometry) {
        //         geometry = geometry.transform(new OpenLayers.Projection("EPSG:3857"), new OpenLayers.Projection("EPSG:4326"));
        //         var geoJsonFeature = olFormatGeoJson.write(feature.feature);
        //         var idFeature = feature.feature.data.id_element;
        //         this.geoJsonTransferFeatures.push(geoJsonFeature);
        //         feature.geoJson = geoJsonFeature;
        //     }
        // this.addWmsFeatureGeoJsonDataSource(idFeature, JSON.parse(geoJsonFeature));
        // }
        // this.transferWmsFeatureLayers();

    },

    addFeatureFromOlMap: function(treeNode) {
        // console.log(treeNode);
        var newCoordinates = [];
        var components = treeNode.attributes.layer.feature.geometry.components;
        var len = components.length;
        if (len <= 0)
            return;
        for (var i = 0; i < len; i++) {
            var childComponents = components[i].components;
            var childLen = childComponents.length;
            var arr = [];
            for (var j = 0; j < childLen; j++) {
                arr.push(childComponents[j]);//.transform(new OpenLayers.Projection("EPSG:3857"), new OpenLayers.Projection("EPSG:4326")));
            }
            newCoordinates.push(arr);
        }
        // console.log(newCoordinates);
    },

    parseWmsFeatures: function(document) {
        // console.log("parse features");
        var layer = document.querySelector('service_boundaries_layer'),
            features = layer.querySelectorAll('service_boundaries_feature');

        var regex = new RegExp(("[?&]id(=([^&#]*)|&|#|$)"));
        var result = regex.exec(document.URL);
        var name = decodeURIComponent(regex.exec(document.URL)[2]);


        var items = [];
        for (var i = 0; i < features.length; i++) {
            var feature = features[i];
            items.push({
                id: feature.querySelector('id_element').innerHTML,
                surveyDate: feature.querySelector('survey_date').innerHTML,
                minLevel: feature.querySelector('min_level').innerHTML,
                maxLevel: feature.querySelector('max_level').innerHTML,
                resolution: feature.querySelector('resolution').innerHTML,
                boundingBox: this.parseWmsFeatureBoundingBox(feature),
                geoJson: this.parseWmsFeatureGeoJson(feature),
                satellite: name
            });
        }
        return items;
    },

    parseWmsFeatureBoundingBox: function(feature) {
        var boundedBy = feature.getElementsByTagNameNS(this.gmlNamespace, 'boundedBy')[0],
            coordinatesString = boundedBy.getElementsByTagNameNS(this.gmlNamespace, 'coordinates')[0].innerHTML.trim();

        var parts = coordinatesString.split(' '),
            southWest = parts[0].split(','),
            northEast = parts[1].split(',');

        return {
            west: parseFloat(southWest[0]),
            south: parseFloat(southWest[1]),
            east: parseFloat(northEast[0]),
            north: parseFloat(northEast[1])
        };
    },

    parseWmsFeatureGeoJson: function(feature) {
        var coordinates;
        for (var i = 0; i < feature.childNodes.length; i++) {
            var node = feature.childNodes[i];
            if (node.nodeType === 1 && node.tagName === 'coordinates') {
                coordinates = node;
                break;
            }
        }
        if (!coordinates) {
            return null;
        }

        var polygons = coordinates.getElementsByTagNameNS(this.gmlNamespace, 'Polygon');
        if (polygons.length === 0) {
            return null;
        }

        var coordinatesString = polygons[0].getElementsByTagNameNS(this.gmlNamespace, 'coordinates')[0].innerHTML.trim(),
            parts = coordinatesString.split(' ');

        coordinates = [];
        for (var j = 0; j < parts.length; j++) {
            var pointCoordinates = parts[j].split(',');
            coordinates.push([parseFloat(pointCoordinates[0]), parseFloat(pointCoordinates[1])]);
        }

        return {
            type: 'Feature',
            geometry: {
                type: 'Polygon',
                coordinates: [coordinates]
            }
        };
    },

    setLandscapeVisibility: function(visible) {
        this.cesiumWidget.terrainProvider = visible ? this.cesiumTerrainProvider : this.ellipsoidTerrainProvider;
    },

    restoreNorthOrientation: function() {
        var camera = this.cesiumWidget.camera;
        var position = Cesium.Cartesian3.clone(camera.position),
            orientation = {
                heading: 0.0,
                pitch: Cesium.Math.toRadians(-90.0),
                roll: 0.0
            };

        // We should have a difference between current position and destination position
        // otherwise an empty flight will be created (see CameraFlightPath.createTween in Cesium sources)
        var diff = Math.min(position.x, position.y, position.z) * Cesium.Math.EPSILON6;
        diff = Math.abs(Math.round(diff) * 10);
        position.x += diff;
        position.y += diff;
        position.z += diff;

        camera.flyTo({
            destination: position,
            orientation: orientation
        });
    },

    getZoom: function() {
        var scene = this.scene;
        var camera = this.cesiumWidget.camera;
        var ellipsoid = scene.globe.ellipsoid,
            earthRadius = (ellipsoid.maximumRadius + ellipsoid.minimumRadius) / 2;
        return camera.getMagnitude() - earthRadius;
    },

    getZoomAmount: function() {
        return (this.maxZoomAmount - this.minZoomAmount) * (this.getZoom() - this.minZoom) / (this.maxZoom - this.minZoom / 2);
    },

    zoomIn: function() {
        var zoomAmount = this.getZoomAmount();
        var camera = this.cesiumWidget.camera;
        if (this.getZoom() - this.zoomAmount < this.minZoom) {
            return;
        }
        camera.zoomIn(this.getZoomAmount() * 10);
    },

    zoomOut: function() {
        var zoomAmount = this.getZoomAmount();
        var camera = this.cesiumWidget.camera;
        if (this.getZoom() + this.zoomAmount > this.maxZoom) {
            return;
        }
        camera.zoomOut(this.getZoomAmount() * 10);
    },

    flyHome: function() {
        var camera = this.cesiumWidget.camera;
        camera.flyHome(4);
    },

    getVisibleWmsImageryLayerIds: function() {
        this.activeWmsLayers = [];
        var rootNode = Ext.getCmp('layersTree').getRootNode();
        var len = rootNode.childNodes.length;
        if (len > 0) {
            for (var i = 0; i < len; i++) {
                var data = rootNode.childNodes[i];
                var childrenLen = data.childNodes.length;
                if (childrenLen > 0) {
                    for (var j = 0; j < childrenLen; j++) {
                        var wmsLayer = data.childNodes[j];
                        var isActive = wmsLayer.layer.visibility;
                        if (isActive)
                            this.activeWmsLayers.push(wmsLayer);
                    }
                }
            }
        }
    },

    getVisibleWmsImageryLayerId: function() {
        for (var i = 0; i < this.wmsIds.length; i++) {
            var id = this.wmsIds[i];
            if (this.wms[id] && (this.wms[id].show || this.wms[id].visibility)) {
                return id;
            }
        }
        return null;
    },

    removeWmsFeatureLayers: function() {
        var names = Object.keys(this.wmsFeatureImageryLayers);
        for (var i = 0; i < names.length; i++) {
            var name = names[i];
            this.removeWmsFeatureImageryLayer(name);
            this.removeWmsFeatureImageryLayer(name, true);
            this.removeWmsFeatureGeoJsonDataSource(name);
        }
    },

    removeWmsFeatureLayer: function(name) {
        if (this.layerForRemove === name) {
            this.removeWmsFeatureImageryLayer(name);
            this.removeWmsFeatureImageryLayer(name, true);
            this.removeWmsFeatureGeoJsonDataSource(name);
            var index = -1;
            if (this.featureList) {
                var len = this.featureList.length;
                for (var i = 0; i < len; i++) {
                    if (this.featureList[i].name == name)
                        index = i;
                }
                if (index > -1) {
                    this.featureList.splice(index, 1);
                    // this.syncronizeLayers.splice(index, 1);
                }
            }
            var layersTreeAdapther = this.map.layersTreeAdapther;
            layersTreeAdapther.removeFeatureByName(name);
        }
    },

    removeWmsFeatureImageryLayer: function(name, bound) {
        bound = bound || false;

        if (bound) {
            var boundaryName = name + '_boundary';
            if (this.wmsFeatureBoundImageryLayers[boundaryName]) {
                this.imageryLayers.remove(this.wmsFeatureBoundImageryLayers[boundaryName]);
                delete this.wmsFeatureBoundImageryLayers[boundaryName];
            }
        }
        else if (!bound && this.wmsFeatureImageryLayers[name]) {
            this.imageryLayers.remove(this.wmsFeatureImageryLayers[name]);
            delete this.wmsFeatureImageryLayers[name];
        }
    },

    removeWmsFeatureGeoJsonDataSource: function(name) {
        var geoJsonDataSource = this.wmsFeatureGeoJsonDataSources[name];
        if (!geoJsonDataSource) {
            return;
        }

        delete this.wmsFeatureGeoJsonDataSources[name];
        if (this.dataSourceCollection.contains(geoJsonDataSource)) {
            this.dataSourceCollection.remove(geoJsonDataSource);
        }
    },

    setFetching: function(fetching) {
        this.isFetching = fetching;
    },

    parseWmsFeatureBoundingBox: function(feature) {
        var boundedBy = feature.getElementsByTagNameNS(this.gmlNamespace, 'boundedBy')[0];
        var coordinatesString = boundedBy.getElementsByTagNameNS(this.gmlNamespace, 'coordinates')[0].innerHTML.trim();

        var parts = coordinatesString.split(' '),
            southWest = parts[0].split(','),
            northEast = parts[1].split(',');

        return {
            west: parseFloat(southWest[0]),
            south: parseFloat(southWest[1]),
            east: parseFloat(northEast[0]),
            north: parseFloat(northEast[1])
        };
    },

    showFeaturesTooltip: function(features, position) {

        var canvas = this.cesiumWidget.canvas;
        var alignment = position.x <= canvas.width / 2 ? 'top left' : 'top right';

        var content = '';
        if (features.length === 0) {
            content = 'Не найдено ни одного снимка.';
        }
        else {
            for (var i = 0; i < features.length; i++) {
                var feature = features[i];
                content += feature.surveyDate.replace(/T.+$/, '') + ' (' + feature.resolution + 'm, ' +
                    feature.minLevel + ' — ' + feature.maxLevel + ' levels)' + '<br />';
            }
            content += '<br /><a class="load-features-link">Загрузить</a>';
        }

        $(document.body).on('click', '.load-features-link', (function () {

            this.addWmsFeatureLayers();

            if (!this.featureList) {
                return;
            }
            var firstFeatureItem = this.featureList[0];
            var bbox = firstFeatureItem.boundingBox;
            var camera = this.cesiumWidget.camera;
            camera.flyTo({
                destination: Cesium.Rectangle.fromDegrees(bbox.west, bbox.south, bbox.east, bbox.north)
            });
        }).bind(this));
    },

    addWmsFeatureLayers: function() {
        if (!this.featureList) {
            return;
        }

        var id = this.getVisibleWmsImageryLayerId();
        var url = this.wmsServices[id];

        for (var i = 0; i < this.featureList.length; i++) {
            var featureItem = this.featureList[i];
            if (featureItem.layerType) {
                var name = featureItem.feature.attributes.__survey_date.replace(/T.+$/, '') + '_' + featureItem.feature.attributes.__id;
                this.addWmsFeatureImageryLayer(url, name);

                var boundaryName = name + '_boundary';
                this.addWmsFeatureImageryLayer(url, boundaryName, true);

                if (featureItem.geoJson !== null) {
                    this.addWmsFeatureGeoJsonDataSource(name, featureItem.geoJson);
                }
            } else {
                var name = featureItem.surveyDate.replace(/T.+$/, '') + '_' + featureItem.id;
                this.addWmsFeatureImageryLayer(url, name);

                var boundaryName = name + '_boundary';
                this.addWmsFeatureImageryLayer(url, boundaryName, true);

                if (featureItem.geoJson !== null) {
                    this.addWmsFeatureGeoJsonDataSource(name, featureItem.geoJson);
                }
            }

        }
    },

    transferWmsFeatureLayers: function() {
        if (!this.featureList) {
            return;
        }

        for (var i = 0; i < this.featureList.length; i++) {
            var featureItem = this.featureList[i];
            if (featureItem.layerType) {
                var id = featureItem.layer.name;
                var url = this.wmsServices[id];
                var name = featureItem.feature.attributes.__survey_date.replace(/T.+$/, '') + '_' + featureItem.feature.attributes.__id;
                this.addWmsFeatureImageryLayer(url, name);

                var boundaryName = name + '_boundary';
                this.addWmsFeatureImageryLayer(url, boundaryName, true);

                if (featureItem.geoJson !== null) {
                    this.addWmsFeatureGeoJsonDataSource(name, featureItem.geoJson);
                }
            } else {
                var id = this.getVisibleWmsImageryLayerId();
                var url = this.wmsServices[id];
                var name = featureItem.surveyDate.replace(/T.+$/, '') + '_' + featureItem.id;
                this.addWmsFeatureImageryLayer(url, name);

                var boundaryName = name + '_boundary';
                this.addWmsFeatureImageryLayer(url, boundaryName, true);

                if (featureItem.geoJson !== null) {
                    this.addWmsFeatureGeoJsonDataSource(name, featureItem.geoJson);
                }
            }

        }
    },

    addWmsFeatureImageryLayer: function(url, name, bound) {
        bound = bound || false;

        var imageryProvider = new Cesium.WebMapServiceImageryProvider({
            url: url,
            layers: name,
            tilingScheme: new Cesium.WebMercatorTilingScheme(),
            parameters: {
                transparent: 'true',
                format: 'image/png',
                // srs: 'EPSG:4326'
                srs: 'EPSG:3857'
            }
        });

        var imageryLayer = new Cesium.ImageryLayer(imageryProvider);
        this.imageryLayers.add(imageryLayer);

        if (bound) {
            this.wmsFeatureBoundImageryLayers[name] = imageryLayer;
        }
        else {
            this.wmsFeatureImageryLayers[name] = imageryLayer;
        }
    },

    addWmsFeatureGeoJsonDataSource: function(name, geoJson) {
        var geoJsonDataSource = new Cesium.GeoJsonDataSource();
        geoJsonDataSource.load(geoJson);
        // geoJsonDataSource.load(geoJson, {
        // strokeWidth: 4,
        // stroke: Cesium.Color.RED
        // ,
        // fill: Cesium.Color.BLUE.withAlpha(0.1)
        // });
        geoJsonDataSource.name = name;
        this.dataSourceCollection.add(geoJsonDataSource);
        this.wmsFeatureGeoJsonDataSources[name] = geoJsonDataSource;
        this.wmsFeatureGeoJsonDataSources[name].show = false;
    },

    createPopup: function(features, position) {
        var px = position.x <= this.cesiumWidget.canvas.width / 2 ? position.x - 350 : position.x + 350;
        var layer = this.getVisibleWmsImageryLayerId();
        if (this.requestPopup)
            this.requestPopup.close();
        this.requestPopup = new Geoportal.Controls.GlobeFeaturesPopup({ globe: this, activeLayer: layer, features: this.sortFeatures(features) });
        this.requestPopup.show();
    },

    sortFeatures: function(features) {
        var len = features.length;
        var groupFeatures = {};
        for (var i = 0; i < len; i++) {
            var feature = features[i];
            var satellite = feature.satellite;
            if (satellite in groupFeatures) {
                groupFeatures[satellite].push(feature);
            }
            else {
                groupFeatures[satellite] = [];
                groupFeatures[satellite].push(feature);
            }
        }
        return groupFeatures;
    },

    moveToFindRegion: function(feature) {
        //console.log(feature);
        var geometryType = feature.geometry.id;
        var ofj = new OpenLayers.Format.GeoJSON();
        // var geoJSONFeature = ofj.write(feature);
        var geoJSONFeature = ofj.write(feature.geometry);
        //console.log(geoJSONFeature);


        var geoJsonDataSource = new Cesium.GeoJsonDataSource();
        geoJsonDataSource.load(geoJSONFeature, {
            strokeWidth: 4,
            stroke: Cesium.Color.RED,
            fill: Cesium.Color.BLUE.withAlpha(0.3)
        });
        // geoJsonDataSource.load(geoJson, {
        // strokeWidth: 4,
        // stroke: Cesium.Color.RED
        // ,
        // fill: Cesium.Color.BLUE.withAlpha(0.1)
        // });

        // geoJsonDataSource.name = name;
        this.dataSourceCollection.add(geoJsonDataSource);
        // this.wmsFeatureGeoJsonDataSources[name] = geoJsonDataSource;
        // this.wmsFeatureGeoJsonDataSources[name].show = false;

        /**
         * point, polygon, multipolygon
         */


        // this.points.removeAll();
        // var camera = this.cesiumWidget.camera;
        // var geometry = feature.geometry;
        // var newGeometry = geometry.transform(new OpenLayers.Projection("EPSG:3857"), new OpenLayers.Projection("EPSG:4326"));
        // newGeometry.calculateBounds();
        // var bounds = newGeometry.bounds;
        // var lonlat = OpenLayers.LonLat.fromArray([feature.geometry.x, feature.geometry.y]);
        // var position = Cesium.Cartesian3.fromDegrees(newGeometry.x, newGeometry.y);

        // this.points.add({
        //     position: position,
        //     pixelSize: 10,
        //     color: Cesium.Color.LIME
        // });

        // camera.flyTo({
        //     destination: Cesium.Cartesian3.fromDegrees(newGeometry.x, newGeometry.y, 100000.0)
        // });
    },





    getZoomLevelHeights: function(precision) {
        precision = precision || 10;

        var step = 100000.0;

        var result = [];
        var currentZoomLevel = 0;
        for (var height = 100000000.0; height > step; height = height - step) {
            var level = this.detectZoomLevel(height);
            if (level === null) {
                break;
            }

            if (level !== currentZoomLevel) {
                var minHeight = height;
                var maxHeight = height + step;
                while (maxHeight - minHeight > precision) {
                    height = minHeight + (maxHeight - minHeight) / 2;
                    if (this.detectZoomLevel(height) === level) {
                        minHeight = height;
                    }
                    else {
                        maxHeight = height;
                    }
                }

                result.push({
                    level: level,
                    height: Math.round(height)
                });

                currentZoomLevel = level;

                if (result.length >= 2) {
                    step = (result[result.length - 2].height - height) / 1000.0;
                }
            }
        }
        return result;
    },

    detectZoomLevel: function(distance) {
        var scene = this.cesiumWidget.scene;
        var tileProvider = scene.globe._surface.tileProvider;
        var quadtree = tileProvider._quadtree;
        var drawingBufferHeight = this.cesiumWidget.canvas.height;
        var sseDenominator = this.cesiumWidget.camera.frustum.sseDenominator;

        for (var level = 0; level <= 19; level++) {
            var maxGeometricError = tileProvider.getLevelMaximumGeometricError(level);
            var error = (maxGeometricError * drawingBufferHeight) / (distance * sseDenominator);
            if (error < quadtree.maximumScreenSpaceError) {
                return level;
            }
        }
        return null;
    },

    changeVisibilityImage: function(image, status, isBoundaries) {

        if (isBoundaries) {
            var name = image.layer ? image.layer.name : image.node.layer.name;
            if (this.wmsFeatureGeoJsonDataSources[name])
                this.wmsFeatureGeoJsonDataSources[name].show = status;

            var boundaryName = name + "_boundary";
            if (this.wmsFeatureBoundImageryLayers[boundaryName])
                this.wmsFeatureBoundImageryLayers[boundaryName].show = status;
        } else {

            var name = image.attributes.layer.name;
            var imageryLayers = this.imageryLayers;
            imageryLayers.get(imageryLayers.indexOf(this.wmsFeatureImageryLayers[name])).show = status;
        }
    },

    changeVisibilityFeature: function (name, status) {
        var imageryLayers = this.imageryLayers;
        if (imageryLayers)
            imageryLayers.get(imageryLayers.indexOf(this.wmsFeatureImageryLayers[name])).show = status;
    },

    zoomToFeature: function(node) {
        var camera = this.cesiumWidget.camera;
        if (node.layer.hasOwnProperty('transformInfo')) {
            if (node.layer.transformInfo.cs.boundary) {
                var bounds = node.layer.bounds;
                bounds.transform(new OpenLayers.Projection("EPSG:3857"), new OpenLayers.Projection("EPSG:4326"));
                camera.flyTo({
                    destination: Cesium.Rectangle.fromDegrees(bounds.left, bounds.bottom, bounds.right, bounds.top)
                });
                bounds.transform(new OpenLayers.Projection("EPSG:4326"), new OpenLayers.Projection("EPSG:3857"));
                this.showFeatureInfoPopup(this, node.layer.parent.layer.name, node.layer.feature.data);
            }
        } else {
            if (node.layer.feature.transformInfo.parentMap === "Cesium") {
                var bbox = node.layer.feature.boundingBox;
                var olBbox = new OpenLayers.Bounds(bbox.west, bbox.south, bbox.east, bbox.north);
                olBbox.transform(new OpenLayers.Projection("EPSG:3857"), new OpenLayers.Projection("EPSG:4326"));
                camera.flyTo({
                    destination: Cesium.Rectangle.fromDegrees(olBbox.left, olBbox.bottom, olBbox.right, olBbox.top)
                });
                this.showFeatureInfoPopup(this, node.parentNode.text, node.layer.feature);
            }

        }

        // console.log("zoom to 3d fature");
    },

    showFeatureInfoPopup: function(globe, title, feature) {
        if (this.popup)
            this.popup.close();
        this.popup = new Geoportal.Controls.GlobeFeatureInfoPopup({ globe: globe, title: title, feature: feature });
        this.popup.show();
    },

    changeContourStatus: function(wmsLayer, value) {
        this.wms[wmsLayer].show = value;
    },

    normalizeLayersTree: function() {
        var rootNode = Ext.getCmp('layersTree').getRootNode();
        var len = rootNode.childNodes.length;
        if (len > 0) {
            for (var i = 0; i < len; i++) {
                var data = rootNode.childNodes[i];
                var childrenLen = data.childNodes.length;
                if (childrenLen > 0 && data instanceof Ext.tree.AsyncTreeNode) {
                    for (var j = 0; j < childrenLen; j++) {
                        var wmsLayer = data.childNodes[j];
                        var partOfLayer = wmsLayer.layer.children;
                        var flag = false;
                        if (partOfLayer) {
                            for (var cnt = 0; cnt < partOfLayer.length; cnt++) {
                                flag = flag || partOfLayer[cnt].visibility;
                            }
                            if (this.wms[wmsLayer.text].show || flag)
                                wmsLayer.ui.toggleContoursVisible(true)
                        }
                    }
                }
            }
        }
    },

    setCenter: function(point) {
        console.log(point);
        if (this.cesiumWidget) {
            var camera = this.cesiumWidget.camera;
            // var bbox = point.bounds;
            var center = Cesium.Cartesian3.fromDegrees(point.x, point.y);
            var scene = this.scene;
            var ellipsoid = scene.globe.ellipsoid;
            var earthRadius = (ellipsoid.maximumRadius + ellipsoid.minimumRadius) / 2;
            camera.flyTo({
                destination: Cesium.Cartesian3.fromDegrees(point.x, point.y, this.currentZoom - earthRadius)
            });
        }
    },

    getCenter: function () {
        if (this.cesiumWidget) {
            var camera = this.cesiumWidget.camera;
            var projection = new Cesium.WebMercatorProjection();
            var centerOl = projection.project(camera.positionCartographic);
            return centerOl;
        }
    },

    clearPointsCollection: function() {
        this.points.removeAll();
    }
});


function Promise() {
     this._callbacks = [];
 }

 Promise.prototype.then = function(func, context) {
    var p;
    if (this._isdone) {
        p = func.apply(context, this.result);
    } else {
        p = new Promise();
        this._callbacks.push(function () {
            var res = func.apply(context, arguments);
            if (res && typeof res.then === 'function')
                res.then(p.done, p);
        });
    }
    return p;
};

Promise.prototype.done = function() {
    this.result = arguments;
    this._isdone = true;
    for (var i = 0; i < this._callbacks.length; i++) {
        this._callbacks[i].apply(null, arguments);
    }
    this._callbacks = [];
};

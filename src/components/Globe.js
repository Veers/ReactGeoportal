var classNames = require('classnames')
var Cesium = require('cesium/Cesium')
export default (function($, classNames, Cesium) {
    var gmlNamespace = 'http://www.opengis.net/gml';

    var basicImageries = {
        'sputnik': {
            url: 'http://tiles.maps.sputnik.ru/',
            northPoleUrl: 'img/sputnik-north-pole.png',
            southPoleUrl: 'img/sputnik-south-pole.png'
        },
        'map': {
            url: 'http://basemap.rekod.ru/worldmap/',
            northPoleUrl: 'img/map-north-pole.png',
            southPoleUrl: 'img/map-south-pole.png'
        },
        'osm': {
            url: 'http://a.tile.openstreetmap.org/',
            northPoleUrl: 'img/osm-north-pole.png',
            southPoleUrl: 'img/osm-south-pole.png'
        }
    };
    var basicImageryIds = Object.keys(basicImageries);

    var cadastreServiceUrl = 'https://pkk5.rosreestr.ru/arcgis/rest/services/Cadastre/Cadastre/MapServer/export';
    var cadastreLayerNames = [
        '0', '1', '2', '4', '5', '6', '7', '8', '9', '10', '11', '12', '13', '14', '15', '16',
        '17', '18', '19', '20', '23', '24', '29', '30', '31', '32', '33', '34', '35', '38', '39'
    ];

    var wmsServices = {
        'meteor-m1-kmss': 'http://gptl.ru/wms/mm1_msu/service',
        'meteor-m2-kmss': 'http://gptl.ru/wms/mm2_msu/service',
        'resurs-dk1-geoton': 'http://gptl.ru/wms/rdk1_gtn/service'
    };
    var wmsIds = Object.keys(wmsServices);
    var wmsBasicLayerNames = ['imageries', 'boundaries'];

    var ellipsoidTerrainProvider = new Cesium.EllipsoidTerrainProvider();
    var cesiumTerrainProvider = new Cesium.CesiumTerrainProvider({
        url : 'https://assets.agi.com/stk-terrain/world'
    });

    var featureCount = 3;

    var minZoom = 100.0;
    var maxZoom = 60000000.0;

    var minZoomAmount = 50000.0;
    var maxZoomAmount = 800000.0;

    var geocodingUrl = 'http://geocode-maps.yandex.ru/1.x/';

    $(document).on('DOMContentLoaded', function() {
        var isFetching = false;
        var featureList = null;
        var featureTooltip = null;
        var geocodingTooltip = null;

        // Caching DOM elements
        var container = document.querySelector('.container'),
            geocodingForm = container.querySelector('.geocoding-form'),
            geocodingInput = geocodingForm.querySelector('.geocoding-input'),
            tracer = container.querySelector('.tracer'),
            tracerLatitude = tracer.querySelector('.tracer-latitude'),
            tracerLongitude = tracer.querySelector('.tracer-longitude'),
            overlay = container.querySelector('.overlay');

        // Creating Cesium instance
        var cesiumWidget = new Cesium.CesiumWidget(container.querySelector('.globe'), {
            imageryProvider: false,
            terrainProvider: ellipsoidTerrainProvider,
            creditContainer: document.createElement('div'),
            orderIndependentTranslucency: true,
            useDefaultRenderLoop: false
        });

        // Swapping drag and tilt events' sources
        var scene = cesiumWidget.scene,
            cameraController = scene.screenSpaceCameraController;
        cameraController.zoomEventTypes = [
            Cesium.CameraEventType.MIDDLE_DRAG,
            Cesium.CameraEventType.WHEEL,
            Cesium.CameraEventType.PINCH
        ];
        cameraController.tiltEventTypes = Cesium.CameraEventType.RIGHT_DRAG;

        // Limiting camera position
        cameraController.minimumZoomDistance = minZoom;
        cameraController.maximumZoomDistance = maxZoom;

        // Setting initial view
        var camera = cesiumWidget.camera;
        camera.setView({
            destination: Cesium.Cartesian3.fromDegrees(74.4, 58.7, 15000000.0)
        });

        // Loading basic imagery layers
        var imageryLayers = scene.imageryLayers;
        var basicImageryProvider = new Cesium.SingleTileImageryProvider({
            url: 'img/earth.jpg'
        });
        var basicImageryLayer = new Cesium.ImageryLayer(basicImageryProvider);
        imageryLayers.add(basicImageryLayer);

        var basicImageryLayers = {};
        (function() {
            for (var i = 0; i < basicImageryIds.length; i++) {
                var id = basicImageryIds[i];
                addBasicImageryLayer(id, i === 0);
            }
        })();

        // Loading cadastre layer
        var comma = encodeURIComponent(',');
        var cadastreImageryProvider = new Cesium.UrlTemplateImageryProvider({
            url: cadastreServiceUrl + '?layers=' + encodeURIComponent('show:' + cadastreLayerNames.join(',')) + '&' +
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
        var wmsImageryLayers = {};
        var wmsFeatureImageryLayers = {};
        var wmsFeatureBoundImageryLayers = {};
        (function() {
            for (var i = 0; i < wmsIds.length; i++) {
                addWmsImageryLayer(wmsIds[i]);
            }
        })();

        // Initializing vector data sources
        var wmsFeatureGeoJsonDataSources = {};
        var dataSourceCollection = new Cesium.DataSourceCollection();
        var dataSourceDisplay = new Cesium.DataSourceDisplay({
            scene: scene,
            dataSourceCollection: dataSourceCollection
        });
        new Cesium.EventHelper().add(cesiumWidget.clock.onTick, function(clock) {
            dataSourceDisplay.update(clock.currentTime);
        });

        // Adding canvas event listeners
        var canvas = cesiumWidget.canvas;
        var canvasEventHandler = new Cesium.ScreenSpaceEventHandler(canvas);
        canvasEventHandler.setInputAction(
            onMouseCtrlClick,
            Cesium.ScreenSpaceEventType.LEFT_CLICK,
            Cesium.KeyboardEventModifier.CTRL
        );
        canvasEventHandler.setInputAction(onMouseMove, Cesium.ScreenSpaceEventType.MOUSE_MOVE);

        initControls();

        // Starting render loop
        Cesium.requestAnimationFrame(animate);

        function animate() {
            cesiumWidget.resize();
            cesiumWidget.render();
            Cesium.requestAnimationFrame(animate);
        }

        function addBasicImageryLayer(id, visible) {
            visible = visible || false;

            var layerOptions = {
                show: visible
            };

            var layers = [];
            var params = basicImageries[id];

            var imageryProvider = Cesium.createOpenStreetMapImageryProvider({
                url: params.url
            });
            var imageryLayer = new Cesium.ImageryLayer(imageryProvider, layerOptions);
            imageryLayers.add(imageryLayer);
            layers.push(imageryLayer);

            if (params.northPoleUrl) {
                var northPoleImageryProvider = new Cesium.SingleTileImageryProvider({
                    url: params.northPoleUrl,
                    rectangle: Cesium.Rectangle.fromDegrees(-180.0, 84.9, 180.0, 90.0)
                });
                var northPoleImageryLayer = new Cesium.ImageryLayer(northPoleImageryProvider, layerOptions);
                imageryLayers.add(northPoleImageryLayer);
                layers.push(northPoleImageryLayer);
            }

            if (params.southPoleUrl) {
                var southPoleImageryProvider = new Cesium.SingleTileImageryProvider({
                    url: params.southPoleUrl,
                    rectangle: Cesium.Rectangle.fromDegrees(-180.0, -90.0, 180.0, -84.9)
                });
                var southPoleImageryLayer = new Cesium.ImageryLayer(southPoleImageryProvider, layerOptions);
                imageryLayers.add(southPoleImageryLayer);
                layers.push(southPoleImageryLayer);
            }

            basicImageryLayers[id] = layers;
        }

        function setBasicImageryLayerVisible(id, visible) {
            var imageryLayers, j;
            if (visible) {
                for (var i = 0; i < basicImageryIds.length; i++) {
                    imageryLayers = basicImageryLayers[basicImageryIds[i]];
                    for (j = 0; j < imageryLayers.length; j++) {
                        imageryLayers[j].show = basicImageryIds[i] === id;
                    }
                }
            }
            else {
                imageryLayers = basicImageryLayers[id];
                for (j = 0; j < imageryLayers.length; j++) {
                    imageryLayers[j].show = false;
                }
            }
        }

        function isBasicImageryLayerVisible(id) {
            return basicImageryLayers[id][0].show;
        }

        function addWmsImageryLayer(id) {
            var url = wmsServices[id];

            var imageryProvider = new Cesium.WebMapServiceImageryProvider({
                url: url,
                layers: wmsBasicLayerNames.join(','),
                enablePickFeatures: true,
                getFeatureInfoFormats: [
                    new Cesium.GetFeatureInfoFormat('xml', 'application/vnd.ogc.gml', parseWmsFeatures)
                ],
                parameters : {
                    transparent: 'true',
                    format: 'image/png',
                    srs: 'EPSG:4326'
                },
                getFeatureInfoParameters: {
                    'feature_count': featureCount
                }
            });

            var imageryLayer = new Cesium.ImageryLayer(imageryProvider, {
                show: false
            });
            imageryLayers.add(imageryLayer);
            wmsImageryLayers[id] = imageryLayer;
        }

        function setWmsImageryLayerVisible(id, visible) {
            if (visible) {
                for (var i = 0; i < wmsIds.length; i++) {
                    wmsImageryLayers[wmsIds[i]].show = wmsIds[i] === id;
                }
            }
            else {
                wmsImageryLayers[id].show = false;
            }
        }

        function isWmsImageryLayerVisible(id) {
            return wmsImageryLayers[id].show;
        }

        function getVisibleWmsImageryLayerId() {
            for (var i = 0; i < wmsIds.length; i++) {
                var id = wmsIds[i];
                if (wmsImageryLayers[id].show) {
                    return id;
                }
            }
            return null;
        }

        function parseWmsFeatures(document) {
            var layer = document.querySelector('service_boundaries_layer'),
                features = layer.querySelectorAll('service_boundaries_feature');

            var items = [];
            for (var i = 0; i < features.length; i++) {
                var feature = features[i];
                try {
                    items.push({
                        id: feature.querySelector('id_element').innerHTML,
                        surveyDate: feature.querySelector('survey_date').innerHTML,
                        minLevel: feature.querySelector('min_level').innerHTML,
                        maxLevel: feature.querySelector('max_level').innerHTML,
                        resolution: feature.querySelector('resolution').innerHTML,
                        boundingBox: parseWmsFeatureBoundingBox(feature),
                        geoJson: parseWmsFeatureGeoJson(feature)
                    });
                }
                catch (e) {
                    console.error(e);
                }
            }

            return items;
        }

        function parseWmsFeatureBoundingBox(feature) {
            var boundedBy = feature.getElementsByTagNameNS(gmlNamespace, 'boundedBy')[0],
                coordinatesString = boundedBy.getElementsByTagNameNS(gmlNamespace, 'coordinates')[0].innerHTML.trim();

            var parts = coordinatesString.split(' '),
                southWest = parts[0].split(','),
                northEast = parts[1].split(',');

            return {
                west: parseFloat(southWest[0]),
                south: parseFloat(southWest[1]),
                east: parseFloat(northEast[0]),
                north: parseFloat(northEast[1])
            };
        }

        function parseWmsFeatureGeoJson(feature) {
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

            var polygons = coordinates.getElementsByTagNameNS(gmlNamespace, 'Polygon');
            if (polygons.length === 0) {
                return null;
            }

            var coordinatesString = polygons[0].getElementsByTagNameNS(gmlNamespace, 'coordinates')[0].innerHTML.trim(),
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
        }

        function addWmsFeatureLayers() {
            if (!featureList) {
                return;
            }

            var id = getVisibleWmsImageryLayerId();
            var url = wmsServices[id];

            for (var i = 0; i < featureList.length; i++) {
                var featureItem = featureList[i];

                var name = featureItem.surveyDate.replace(/T.+$/, '') + '_' + featureItem.id;
                addWmsFeatureImageryLayer(url, name);

                var boundaryName = name + '_boundary';
                addWmsFeatureImageryLayer(url, boundaryName, true);

                if (featureItem.geoJson !== null) {
                    addWmsFeatureGeoJsonDataSource(name, featureItem.geoJson);
                }
            }
        }

        function removeWmsFeatureLayers() {
            var names = Object.keys(wmsFeatureImageryLayers);
            for (var i = 0; i < names.length; i++) {
                var name = names[i];
                removeWmsFeatureImageryLayer(name);
                removeWmsFeatureImageryLayer(name, true);
                removeWmsFeatureGeoJsonDataSource(name);
            }
        }

        function addWmsFeatureImageryLayer(url, name, bound) {
            bound = bound || false;

            var imageryProvider = new Cesium.WebMapServiceImageryProvider({
                url: url,
                layers: name,
                parameters : {
                    transparent: 'true',
                    format: 'image/png',
                    srs: 'EPSG:4326'
                }
            });

            var imageryLayer = new Cesium.ImageryLayer(imageryProvider);
            imageryLayers.add(imageryLayer);

            if (bound) {
                wmsFeatureBoundImageryLayers[name] = imageryLayer;
            }
            else{
                wmsFeatureImageryLayers[name] = imageryLayer;
            }
        }

        function removeWmsFeatureImageryLayer(name, bound) {
            bound = bound || false;

            if (bound) {
                var boundaryName = name + '_boundary';
                if (wmsFeatureBoundImageryLayers[boundaryName]) {
                    imageryLayers.remove(wmsFeatureBoundImageryLayers[boundaryName]);
                    delete wmsFeatureBoundImageryLayers[boundaryName];
                }
            }
            else if (!bound && wmsFeatureImageryLayers[name]) {
                imageryLayers.remove(wmsFeatureImageryLayers[name]);
                delete wmsFeatureImageryLayers[name];
            }
        }

        function addWmsFeatureGeoJsonDataSource(name, geoJson) {
            var geoJsonDataSource = new Cesium.GeoJsonDataSource();
            geoJsonDataSource.load(geoJson, {
                strokeWidth: 4,
                stroke: Cesium.Color.YELLOW,
                fill: Cesium.Color.YELLOW.withAlpha(0.1)
            });
            dataSourceCollection.add(geoJsonDataSource);
            wmsFeatureGeoJsonDataSources[name] = geoJsonDataSource;
        }

        function removeWmsFeatureGeoJsonDataSource(name) {
            var geoJsonDataSource = wmsFeatureGeoJsonDataSources[name];
            if (!geoJsonDataSource) {
                return;
            }

            delete wmsFeatureGeoJsonDataSources[name];
            if (dataSourceCollection.contains(geoJsonDataSource)) {
                dataSourceCollection.remove(geoJsonDataSource);
            }
        }

        function setCadastreVisible(visible) {
            cadastreImageryLayer.show = visible;
        }

        function isCadastreVisible() {
            return cadastreImageryLayer.show;
        }

        function setTerrainVisible(visible) {
            cesiumWidget.terrainProvider = visible ? cesiumTerrainProvider : ellipsoidTerrainProvider;
        }

        function isTerrainVisible() {
            return cesiumWidget.terrainProvider === cesiumTerrainProvider;
        }

        function getZoom() {
            var ellipsoid = scene.globe.ellipsoid,
                earthRadius = (ellipsoid.maximumRadius + ellipsoid.minimumRadius) / 2;
            return camera.getMagnitude() - earthRadius;
        }

        function getZoomAmount() {
            return (maxZoomAmount - minZoomAmount) * (getZoom() - minZoom) / (maxZoom - minZoom / 2);
        }

        function zoomIn() {
            var zoomAmount = getZoomAmount();
            if (getZoom() - zoomAmount < minZoom) {
                return;
            }
            camera.zoomIn(getZoomAmount());
        }

        function zoomOut() {
            var zoomAmount = getZoomAmount();
            if (getZoom() + zoomAmount > maxZoom) {
                return;
            }
            camera.zoomOut(getZoomAmount());
        }

        function restoreNorthOrientation() {
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
        }

        function fetchGeocoding(queryString) {
            var url = geocodingUrl +
                '?format=json&lang=ru&results=10&skip=0&geocode=' + encodeURIComponent(queryString);

            fetch(url).then(function(response) {
                return response.json().then(function(result) {
                    showGeocodingTooltip(parseGeocodingResult(result));
                });
            }, function(error) {
                alert('Не удалось получить или распарсить ответ геокодирования!');
                console.error(error);
            });
        }

        function parseGeocodingResult(result) {
            var geoObjectCollection = result.response.GeoObjectCollection;
            return geoObjectCollection.featureMember.map(function(item) {
                var geoObject = item.GeoObject,
                    geoCoderMetaData = geoObject.metaDataProperty.GeocoderMetaData,
                    bounds = geoObject.boundedBy.Envelope,
                    southWest = parseGeocodingPosition(bounds.lowerCorner),
                    northEast = parseGeocodingPosition(bounds.upperCorner);

                var number = 0;
                return Object.assign({
                    number: ++number,
                    name: geoObject.name,
                    description: geoObject.description,
                    address: geoCoderMetaData.text,
                    maxLatitude: northEast.latitude,
                    minLatitude: southWest.latitude,
                    maxLongitude: northEast.longitude,
                    minLongitude: southWest.longitude
                }, parseGeocodingPosition(geoObject.Point.pos));
            });
        }

        function parseGeocodingPosition(positionString) {
            var positionArray = positionString.split(' ');
            return {
                latitude: parseFloat(positionArray[1]),
                longitude: parseFloat(positionArray[0])
            };
        }

        function onMouseCtrlClick(event) {
            if (isFetching) {
                return;
            }

            var id = getVisibleWmsImageryLayerId();
            if (!id || !event.position) {
                return;
            }

            var ellipsoid = scene.globe.ellipsoid;
            var cartesian = camera.pickEllipsoid(event.position, ellipsoid);
            if (!cartesian) {
                // Point is outside the globe
                return;
            }

            var ray = camera.getPickRay(event.position);
            var featuresPromise = imageryLayers.pickImageryLayerFeatures(ray, scene);
            if (!featuresPromise) {
                return;
            }

            hideFeaturesTooltip();
            removeWmsFeatureLayers();

            setFetching(true);
            featuresPromise.then(function(features) {
                setFetching(false);
                featureList = features;
                showFeaturesTooltip(features, event.position);
            }).otherwise(function(e) {
                setFetching(false);
                featureList = null;
                console.error(e);
                alert('Не удалось распарсить ответ WMS!');
            });
        }

        function onMouseMove(event) {
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
            tracerLongitude.innerHTML = formatLongitude(cartographic.longitude);
        }

        function onKeyDown(event) {
            switch (event.which) {
                case 78: restoreNorthOrientation(); break;
                case 107: case 187: zoomIn(); break;
                case 109: case 189: zoomOut(); break;
            }
        }

        function initControls() {
            (function() {
                var buttonGroup = document.querySelector('.tile-buttons'),
                    buttons = buttonGroup.querySelectorAll('.button');

                $(buttonGroup).on('click', '.button', function(event) {
                    var activeButton = event.target;
                    var id = activeButton.getAttribute('data-id');

                    if (isBasicImageryLayerVisible(id)) {
                        activeButton.className = 'button';
                        setBasicImageryLayerVisible(id, false);
                    }
                    else {
                        for (var i = 0; i < buttons.length; i++) {
                            var button = buttons[i];
                            button.className = classNames({
                                button: true,
                                'button-active': button === activeButton
                            });
                        }
                        setBasicImageryLayerVisible(id, true);
                    }
                });
            })();

            (function() {
                var buttonGroup = document.querySelector('.wms-buttons'),
                    buttons = buttonGroup.querySelectorAll('.button');

                $(buttonGroup).on('click', '.button', function(event) {
                    hideFeaturesTooltip();
                    removeWmsFeatureLayers();

                    var activeButton = event.target;
                    var id = activeButton.getAttribute('data-id');

                    if (isWmsImageryLayerVisible(id)) {
                        activeButton.className = 'button';
                        setWmsImageryLayerVisible(id, false);
                    }
                    else {
                        for (var i = 0; i < buttons.length; i++) {
                            var button = buttons[i];
                            button.className = classNames({
                                button: true,
                                'button-active': button === activeButton
                            });
                        }
                        setWmsImageryLayerVisible(id, true);
                    }
                });
            })();

            $(document.querySelector('.cadastre-button')).on('click', function(event) {
                var cadastreButton = event.target;
                var visible = !isCadastreVisible();
                cadastreButton.className = classNames({
                    'cadastre-button': true,
                    button: true,
                    'button-active': visible
                });
                setCadastreVisible(visible);
            });

            $(document.querySelector('.terrain-button')).on('click', function(event) {
                var terrainButton = event.target;
                var visible = !isTerrainVisible();
                terrainButton.className = classNames({
                    'terrain-button': true,
                    button: true,
                    'button-active': visible
                });
                setTerrainVisible(visible);
            });

            (function() {
                var buttonGroup = document.querySelector('.zoom-buttons'),
                    buttons = buttonGroup.querySelectorAll('.button');

                var zoomInterval = null;

                $(buttonGroup).on('mousedown', '.button', function(event) {
                    var id = event.target.getAttribute('data-id');

                    var zoom;
                    switch(id) {
                        case 'zoom-in': zoom = zoomIn; break;
                        case 'zoom-out': zoom = zoomOut; break;
                    }

                    if (!zoom) {
                        return;
                    }

                    if (zoomInterval !== null) {
                        zoomInterval.clearInterval(zoomInterval);
                    }

                    zoomInterval = setInterval(zoom, 1000 / 30);
                });

                $(document.body).on('mouseup', function(event) {
                    if (zoomInterval !== null) {
                        clearInterval(zoomInterval);
                        zoomInterval = null;
                    }
                });
            })();

            $(document).on('keydown', onKeyDown);

            $(document.querySelector('.north-button')).on('click', function(event) {
                restoreNorthOrientation();
            });

            $(geocodingForm).on('submit', function(event) {
                event.preventDefault();
                var queryString = geocodingInput.value.trim();
                if (!queryString) {
                    return;
                }
                fetchGeocoding(queryString);
            });

            $(document.body).on('click', '.load-features-link', function() {
                hideFeaturesTooltip();
                addWmsFeatureLayers();

                if (!featureList) {
                    return;
                }

                // Navigating to the first feature in current features' list
                var firstFeatureItem = featureList[0],
                    bbox = firstFeatureItem.boundingBox;
                camera.flyTo({
                    destination : Cesium.Rectangle.fromDegrees(bbox.west, bbox.south, bbox.east, bbox.north)
                });
            });

            $(document.body).on('click', '.geocoding-link', function(event) {
                event.preventDefault();

                hideGeocodingTooltip();

                var link = event.target;

                var minLatitude = parseFloat(link.getAttribute('data-min-latitude')),
                    maxLatitude = parseFloat(link.getAttribute('data-max-latitude')),
                    minLongitude = parseFloat(link.getAttribute('data-min-longitude')),
                    maxLongitude = parseFloat(link.getAttribute('data-max-longitude'));

                camera.flyTo({
                    destination: Cesium.Rectangle.fromDegrees(
                        minLongitude,
                        minLatitude,
                        maxLongitude,
                        maxLatitude
                    )
                });
            });
        }

        function showFeaturesTooltip(features, position) {
            hideFeaturesTooltip();

            var canvas = cesiumWidget.canvas;
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

            // featureTooltip = new Opentip(canvas, content, 'Снимки', {
            //     className: 'features-tooltip',
            //     extends: 'glass',
            //     background: '#ffffff',
            //     offset: [position.x <= canvas.width / 2 ? position.x : position.x - canvas.width, position.y],
            //     target: canvas,
            //     targetJoint: alignment,
            //     stem: alignment,
            //     tipJoint: alignment,
            //     containInViewport: false,
            //     closeButtonOffset: [10, 10],
            //     showOn: null,
            //     hideOn: [],
            //     hideTrigger: 'closeButton',
            //     hideTriggers: [],
            //     removeElementsOnHide: true
            // });

            // featureTooltip.show();
        }

        function hideFeaturesTooltip() {
            if (featureTooltip !== null) {
                featureTooltip.hide();
                featureTooltip = null;
            }
        }

        function showGeocodingTooltip(items) {
            hideGeocodingTooltip();

            var content = '';
            if (items.length === 0) {
                content = 'Ничего не найдено.';
            }
            else {
                for (var i = 0; i < items.length; i++) {
                    var item = items[i];
                    content += '<li><a class="geocoding-link" ' +
                        'data-min-latitude="' + item.minLatitude + '" ' +
                        'data-max-latitude="' + item.maxLatitude + '" ' +
                        'data-min-longitude="' + item.minLongitude + '" ' +
                        'data-max-longitude="' + item.maxLongitude + '" ' +
                        '>' + item.address + '</a></li>';
                }
                content = '<ol class="geocoding-list">' + content + '</ol>';
            }

            // geocodingTooltip = new Opentip(geocodingForm, content, 'Результаты геокодирования', {
            //     className: 'geocoding-tooltip',
            //     extends: 'glass',
            //     background: '#ffffff',
            //     offset: [12, 16],
            //     target: geocodingForm,
            //     contantInViewport: false,
            //     closeButtonOffset: [10, 10],
            //     showOn: null,
            //     hideOn: [],
            //     hideTrigger: 'closeButton',
            //     hideTriggers: [],
            //     removeElementsOnHide: true
            // });

            // geocodingTooltip.show();
        }

        function hideGeocodingTooltip() {
            if (geocodingTooltip !== null) {
                geocodingTooltip.hide();
                geocodingTooltip = null;
            }
        }

        function setFetching(fetching) {
            isFetching = fetching;
            overlay.className = classNames({
                overlay: true,
                'overlay-hidden': !isFetching
            });
        }

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
            const f = formatAngle(value, isDegrees);
            return (f.degree < 10 ? '0' : '') + (f.degree < 100 ? '0' : '') + f.degree + '°' +
                (f.prime < 10 ? '0' : '') + f.prime + '′' +
                (f.doublePrime < 10 ? '0' : '') + f.doublePrime + '″' +
                (f.sign > 0 ? 'E' : 'W');
        }
    });
})(Gator, classNames, Cesium);

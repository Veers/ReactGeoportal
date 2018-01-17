'use strict'

const MapUtils = (function() {
    return {
        basicImageries: {
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
        },
        gmlNamespace: 'http://www.opengis.net/gml'
    }
}())

export default MapUtils
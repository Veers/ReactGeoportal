import React, { Component } from 'react'
import PropTypes from 'prop-types'

import 'ol/ol.css';
import {Map, View} from 'ol';
import TileLayer from 'ol/layer/Tile';
import OSM from 'ol/source/OSM';

class OlMapComponent extends Component {
    static propTypes = {
    }

    constructor(props) {
        super(props)
        const map = new Map({
            target: 'cesiumContainer',
            layers: [
              new TileLayer({
                source: new OSM()
              })
            ],
            view: new View({
              center: [0, 0],
              zoom: 0
            })
        });
    }

    componentWillReceiveProps = (nextProps) => {
    }

    componentDidMount() {}

    render() {
        return false
    }
}

export default OlMapComponent
import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import { fetchMapLayers } from '../actions/mapActions'
import Picker from '../components/Picker'
import Posts from '../components/Posts'
import TopToolbar from '../components/TopToolbar'
import LayerComponent from '../components/LayerComponent'
import MapComponent from '../components/MapComponent'
import SearchComponent from '../components/SearchComponent'

// import '../../node_modules/react-checkbox-tree/src/scss/react-checkbox-tree.scss'
// import '../style/main.scss'

class App extends Component {

  constructor(props) {
    super(props)
    this.state = {
      projection: "EPSG:3857",
      layerName: ''      
    };
    this.toggleProjection = this.toggleProjection.bind(this)
    this.toggleLayer = this.toggleLayer.bind(this)
  }

  componentDidMount() {
    const { dispatch } = this.props
    dispatch(fetchMapLayers())
  }

  toggleProjection = () => {
    (this.state.projection == "EPSG:4326") ? this.setState({projection: "EPSG:3857"}) : this.setState({projection: "EPSG:4326"})
  }

  toggleLayer = (layer, e) => {
    this.setState({layerName: layer})
  }
  



  render() {
    return (
      <div>
        <MapComponent projection={this.state.projection} activeLayer={this.state.layerName}/>
        <button onClick={this.toggleProjection}>Сменить проеккцию</button>
        <label>{this.state.projection}</label>
        &nbsp;&nbsp;&nbsp;
        <button onClick={(e) => this.toggleLayer('xyz', e)}>XYZ</button>
        <button onClick={(e) => this.toggleLayer('wms', e)}>WMS</button>
        <button onClick={(e) => this.toggleLayer('wmts', e)}>WMTS</button>
      </div>
    )
  }
}

App.propTypes = {
  layers: PropTypes.array.isRequired,
  isFetching: PropTypes.bool.isRequired,
  lastUpdated: PropTypes.number,
  dispatch: PropTypes.func.isRequired
}

function mapStateToProps(state) {
  const { fetchLayersReducer } = state
  const {
    isFetching,
    items: layers
  } = fetchLayersReducer[fetchMapLayers] || {
    isFetching: true,
    items: []
  }
  return {
    layers,
    isFetching
  }
}

export default connect(mapStateToProps)(App)





  // from render
  // <TopToolbar />
  //       <LayerComponent coveragesLayers={this.state.coveragesLayers} activeLayer={this.state.activeLayer} onLayerChange={this.onLayerChange} />
  //       <SearchComponent/>

  // render() {
  //   const { layers } = this.props
  //   //<MapComponent coveragesLayers={this.state.coveragesLayers} activeLayer={this.state.activeLayer} onLayerChange={this.onLayerChange} />

  //   return (
  //     <div>

  //     </div>
  //   )
  // }


// App.defaultProps = {
//   layers: Object.create(null)
// }

// const mapStateToProps = (state) => {
//   return {
//       layers: state.layers,
//       hasErrored: state.layersHasErrored,
//       isLoading: state.layersIsLoading
//   };
// };

// const mapDispatchToProps = (dispatch) => {
//   return {
//       fetchData: (url) => dispatch(layersFetchData(url))
//   };
// };

// export default connect(mapStateToProps, mapDispatchToProps)(App); 
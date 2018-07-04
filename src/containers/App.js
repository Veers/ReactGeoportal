import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import { itemsFetchData } from '../actions/mapActions'
import { mapLayers } from '../reducers/rootReducer'
import Picker from '../components/Picker'
import Posts from '../components/Posts'
import TopToolbar from '../components/TopToolbar'
import LayerComponent from '../components/LayerComponent'
import MapComponent from '../components/MapComponent'
import SearchComponent from '../components/SearchComponent'
import OlMapComponent from '../components/OlMapComponent'

import '../../node_modules/react-checkbox-tree/src/scss/react-checkbox-tree.scss'
import '../style/main.scss'

class App extends Component {
  // static propTypes = {
  //   dispatch: PropTypes.func.isRequired,
  //   layers: PropTypes.object.isRequired
  // }

  constructor(props) {
    super(props)

    // this.state = {
    //   location: 'external',
    //   coveragesLayers: [],
    //   activeLayer: {}
    // }

    // this.onLayerChange = this.onLayerChange.bind(this)
  }

  componentDidMount() {
    this.props.fetchData('http://5826ed963900d612000138bd.mockapi.io/items');
  }

  componentDidUpdate(prevProps) {
    // const { dispatch, layers } = this.props
  }

  componentWillReceiveProps(nextProps) {
    // const { dispatch, layers } = this.props
    // if (nextProps.selectedSubreddit !== this.props.selectedSubreddit) {
    //   const { dispatch, selectedSubreddit } = nextProps
    //   dispatch(fetchPostsIfNeeded(selectedSubreddit))
    // }
  }

  // onLayerChange(layer) {
  //   console.debug(layer)
  //   this.setState({ activeLayer: layer })
  // }
  
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

  render() {
    if (this.props.hasErrored) {
        return <p>Sorry! There was an error loading the items</p>;
    }

    if (this.props.isLoading) {
        return <p>Loading…</p>;
    }

    return (
        <ul>
            {this.props.items.map((item) => (
                <li key={item.id}>
                    {item.label}
                </li>
            ))}
        </ul>
    );
  }
}

// App.defaultProps = {
//   layers: Object.create(null)
// }

const mapStateToProps = (state) => {
  return {
      items: state.items,
      hasErrored: state.itemsHasErrored,
      isLoading: state.itemsIsLoading
  };
};

const mapDispatchToProps = (dispatch) => {
  return {
      fetchData: (url) => dispatch(itemsFetchData(url))
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(App); 
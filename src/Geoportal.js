import PropTypes from 'prop-types'

import TopToolbar from './TopToolbar'
import LayerComponent from './LayerComponent'
import SearchComponent from './SearchComponent'

import { selectedLayers, requestLayers, receiveLayers } from './actions/layersActions'

import './style/main.scss'

class Geoportal extends React.Component {
  constructor(props) {
    super(props);
    this.handleChange = this.handleChange.bind(this);
  }

  componentDidMount() {
    const { dispatch, selectedSubreddit } = this.props
    dispatch(fetchLayersIfNeeded(selectedSubreddit))
  }

  componentDidUpdate(prevProps) {
    if (this.props.selectedLayers !== prevProps.selectedLayers) {
      const { dispatch, selectedLayers } = this.props
      dispatch(fetchLayersIfNeeded(selectedLayers))
    }
  }

  render() {
    return (    	
      	<div>
          test
        </div>
    );
  }

  Geoportal.propTypes = {
    selectedLayers: PropTypes.string.isRequired,
    layers: PropTypes.array.isRequired,
    isFetching: PropTypes.bool.isRequired,
    lastUpdated: PropTypes.number,
    dispatch: PropTypes.func.isRequired
  }

  function mapStateToProps(state) {
    const { selectLayers, requestLayers, receiveLayers } = this.state
    const {
      isFetching,
      items,
      lastUpdated
    } = getLayers[] || {
      isFetching: true,
      layers: []
    }
  }
}

export default connect(mapStateToProps)(Geoportal)
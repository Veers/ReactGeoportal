import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import { selectSubreddit, fetchPostsIfNeeded, invalidateSubreddit, requestLayers, receiveLayers, fetchLayers } from '../actions'
import { mapLayers } from '../reducers'
import Picker from '../components/Picker'
import Posts from '../components/Posts'
import TopToolbar from '../components/TopToolbar'
import LayerComponent from '../components/LayerComponent'

class App extends Component {
  static propTypes = {
    dispatch: PropTypes.func.isRequired,
    layers: PropTypes.array.isRequired
  }

  constructor(props) {
    super(props)
    this.state = {
      location: 'external',
      layersData: []
    }
  }

  componentDidMount() {
    // const { dispatch, selectedSubreddit } = this.props
    // const { dispatch, layers } = this.props
    // dispatch(fetchPostsIfNeeded(selectedSubreddit))
    // dispatch(fetchLayers())

    fetch(`http://gptl.ru/api/map/public/maps.json`)
      .then(response => response.json())
      .then(json => this.setState(Object.assign({}, this.state, {
        layersData: json[0].templates[0].layers
      })))
  }

  componentDidUpdate(prevProps) {
    const { dispatch, layers } = this.props
  }

  componentWillReceiveProps(nextProps) {
    const { dispatch, layers } = this.props
    // if (nextProps.selectedSubreddit !== this.props.selectedSubreddit) {
    //   const { dispatch, selectedSubreddit } = nextProps
    //   dispatch(fetchPostsIfNeeded(selectedSubreddit))
    // }
  }

  // handleChange = nextSubreddit => {
    // this.props.dispatch(selectSubreddit(nextSubreddit))
  // }

  // handleRefreshClick = e => {
  //   e.preventDefault()

  //   const { dispatch, selectedSubreddit } = this.props
  //   dispatch(invalidateSubreddit(selectedSubreddit))
  //   dispatch(fetchPostsIfNeeded(selectedSubreddit))
  // }

  render() {
    // const { selectedSubreddit, posts, isFetching, lastUpdated } = this.props
    const { layers } = this.props
    // const isEmpty = posts.length === 0
    return (
      <div>
        <TopToolbar />
        <LayerComponent layers={this.state.layersData}/>
        
      </div>
    )
  }
}

App.defaultProps = {
  layers: []
}

const mapStateToProps = state => {
  const { layers, mapLayers } = state
  const {
    layers: []
  } = mapLayers[requestLayers] || {
    layers: [],
    status: "error"
  }

  return {
    layers
  }
}

export default connect(mapStateToProps)(App)

// const mapStateToProps = state => {
//   const { selectedSubreddit, postsBySubreddit } = state
//   const {
//     isFetching,
//     lastUpdated,
//     items: posts
//   } = postsBySubreddit[selectedSubreddit] || {
//     isFetching: true,
//     items: []
//   }

//   return {
//     selectedSubreddit,
//     posts,
//     isFetching,
//     lastUpdated
//   }
// }

// export default connect(mapStateToProps)(App)


// selectedSubreddit: PropTypes.string.isRequired,
//     posts: PropTypes.array.isRequired,
//     isFetching: PropTypes.bool.isRequired,
//     lastUpdated: PropTypes.number,


// <Picker value={selectedSubreddit}
//                 onChange={this.handleChange}
//                 options={[ 'reactjs', 'frontend' ]} />
//         <p>
//           {lastUpdated &&
//             <span>
//               Last updated at {new Date(lastUpdated).toLocaleTimeString()}.
//               {' '}
//             </span>
//           }
//           {!isFetching &&
//             <button onClick={this.handleRefreshClick}>
//               Refresh
//             </button>
//           }
//         </p>
//         {isEmpty
//           ? (isFetching ? <h2>Loading...</h2> : <h2>Empty.</h2>)
//           : <div style={{ opacity: isFetching ? 0.5 : 1 }}>
//               <Posts posts={posts} />
//             </div>
//         }
//             
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
    layers: PropTypes.array
  }

  componentDidMount() {
    // const { dispatch, selectedSubreddit } = this.props
    const { dispatch } = this.props
    // dispatch(fetchPostsIfNeeded(selectedSubreddit))
    dispatch(fetchLayers())
  }

  componentWillReceiveProps(nextProps) {
    // if (nextProps.selectedSubreddit !== this.props.selectedSubreddit) {
    //   const { dispatch, selectedSubreddit } = nextProps
    //   dispatch(fetchPostsIfNeeded(selectedSubreddit))
    // }
    if (nextProps.layers !== this.props.layers) {
      const { layers } = nextProps.layers
    }
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
        <LayerComponent />
        
      </div>
    )
  }
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
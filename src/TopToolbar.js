import React, {Component} from 'react';
import AppBar from 'material-ui/AppBar';
import IconButton from 'material-ui/IconButton';
import IconMenu from 'material-ui/IconMenu';
import MenuItem from 'material-ui/MenuItem';
import FlatButton from 'material-ui/FlatButton';
import Toggle from 'material-ui/Toggle';
import MoreVertIcon from 'material-ui/svg-icons/navigation/more-vert';
import NavigationClose from 'material-ui/svg-icons/navigation/close';


/**
 * This example is taking advantage of the composability of the `AppBar`
 * to render different components depending on the application state.
 */
class TopToolbar extends Component {
  constructor(props) {
    super(props)
    this.state = {
      logged: true
    }
    this.handleEvent = this.handleEvent.bind(this)
  }

  handleEvent = (event, logged) => {
    this.setState({logged: logged});
  }

  render() {
    return (
      <div>
      <AppBar title="Application header" iconElementRight={
        <FlatButton {...this.props} label="Login" />
      }/>
      </div>
    );
  }
}

export default TopToolbar;
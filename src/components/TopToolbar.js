import React, {Component} from 'react'
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider'
import AppBar from 'material-ui/AppBar'
import IconButton from 'material-ui/IconButton'
import IconMenu from 'material-ui/IconMenu'
import MenuItem from 'material-ui/MenuItem'
import FlatButton from 'material-ui/FlatButton'
import Toggle from 'material-ui/Toggle'
import MoreVertIcon from 'material-ui/svg-icons/navigation/more-vert'
import NavigationClose from 'material-ui/svg-icons/navigation/close'

class TopToolbar extends Component {
  constructor(props) {
    super(props)
    this.state = {
      logged: true
    }
    this.handleEvent = this.handleEvent.bind(this)
  }

  handleEvent = (event, logged) => {
    //this.setState({logged: logged});
    console.log(event)
  }

  render() {
    return (
      <div>
      <MuiThemeProvider>
      <AppBar title="Application header title" iconElementRight={
        <FlatButton {...this.props} label="Login" onClick={this.handleEvent}/>
      }/>
      </MuiThemeProvider>
      </div>
    );
  }
}

export default TopToolbar;
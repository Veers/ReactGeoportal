import React, {Component} from 'react'

import PropTypes from 'prop-types'

import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider'

import FloatingActionButton from 'material-ui/FloatingActionButton'
import ContentAdd from 'material-ui/svg-icons/content/add'
import ContentRemove from 'material-ui/svg-icons/content/remove'

import {List, ListItem} from 'material-ui/List'
import Drawer from 'material-ui/Drawer'
import Subheader from 'material-ui/Subheader'
import Divider from 'material-ui/Divider'
import Checkbox from 'material-ui/Checkbox'
import Toggle from 'material-ui/Toggle'

import '../style/main.scss'

class LayersComponent extends Component {
  // static propTypes = {    
  //   layers: PropTypes.array.isRequired
  // }

  constructor(props) {
    super(props)
    this.state = {open: false}
  }

  handleToggle = () => this.setState({open: !this.state.open});

  render() {
    let button = null;
    if (this.state.open) {
      button = <ContentRemove />
    } else {
      button = <ContentAdd />
    }
    return (
      <div>
      <MuiThemeProvider>
        <FloatingActionButton className="layersButton" onClick={this.handleToggle}>
          {button}       
        </FloatingActionButton>
        </MuiThemeProvider>
        <MuiThemeProvider>
        <Drawer open={this.state.open}>
          <List>
            <Subheader>Hangout Notifications</Subheader>
            <ListItem primaryText="Notifications" leftCheckbox={<Checkbox />} />
            <ListItem primaryText="Sounds" leftCheckbox={<Checkbox />} />
            <ListItem primaryText="Video sounds" leftCheckbox={<Checkbox />} />
          </List>
        </Drawer>
        </MuiThemeProvider>
      </div>
    );
  }
}

export default LayersComponent;
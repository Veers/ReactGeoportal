import React, {Component} from 'react';

import PropTypes from 'prop-types'

import FloatingActionButton from 'material-ui/FloatingActionButton';
import ContentAdd from 'material-ui/svg-icons/content/add';

import {List, ListItem} from 'material-ui/List';
import Drawer from 'material-ui/Drawer';
import Subheader from 'material-ui/Subheader';
import Divider from 'material-ui/Divider';
import Checkbox from 'material-ui/Checkbox';
import Toggle from 'material-ui/Toggle';

import '../style/main.scss'

class LayersTree extends Component {

  static propTypes = {
    layers: PropTypes.array.isRequired
  }

  constructor(props) {
    super(props)
  }

  handleToggle = () => this.setState({open: !this.state.open});

  render() {
    return (
      <div>
        <FloatingActionButton className="layersButton" onClick={this.handleToggle}>
          <ContentAdd />
        </FloatingActionButton>

        <Drawer open={this.state.open}>
          <List>
            <Subheader>Hangout Notifications</Subheader>
            <ListItem primaryText="Notifications" leftCheckbox={<Checkbox />} />
            <ListItem primaryText="Sounds" leftCheckbox={<Checkbox />} />
            <ListItem primaryText="Video sounds" leftCheckbox={<Checkbox />} />
          </List>
        </Drawer>
      </div>
    );
  }
}

export default LayersComponent;
import React, {Component} from 'react'

import FloatingActionButton from 'material-ui/FloatingActionButton'
import ContentAdd from 'material-ui/svg-icons/content/add'

import Drawer from 'material-ui/Drawer'
import AppBar from 'material-ui/AppBar'
import {RadioButton, RadioButtonGroup} from 'material-ui/RadioButton'

class SearchComponent extends Component {
  constructor(props) {
    super(props)
    this.state = {open: false}
  }

  handleToggle = () => this.setState({open: !this.state.open});

  render() {
    return (
      <div>
        <FloatingActionButton className="searchToggleButton" secondary={true} onClick={this.handleToggle}>
          <ContentAdd />
        </FloatingActionButton>

        <Drawer open={this.state.open}>
          <RadioButtonGroup name="shipSpeed" defaultSelected="not_light">
            <RadioButton value="not_light" label="not_light" />
            <RadioButton value="not_light2" label="not_light2" />
            <RadioButton value="not_light3" label="not_light3" />
          </RadioButtonGroup>        
        </Drawer>
      </div>
    );
  }
}

export default SearchComponent;
import React, {Component} from 'react'

import PropTypes from 'prop-types'

import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider'

import FloatingActionButton from 'material-ui/FloatingActionButton'
import ContentAdd from 'material-ui/svg-icons/content/add'
import ContentRemove from 'material-ui/svg-icons/content/remove'
import {RadioButton, RadioButtonGroup} from 'material-ui/RadioButton';

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
    let mapLayers = this.props.layers
    return (
      <div>
      <MuiThemeProvider>
        <FloatingActionButton className="layersButton" onClick={this.handleToggle}>
          {button}       
        </FloatingActionButton>
        </MuiThemeProvider>
        <MuiThemeProvider>
        <Drawer open={this.state.open}>
            <Subheader>Hangout Notifications</Subheader>
              <RadioButtonGroup name="mapLayers">
                {mapLayers.map(function(element){
                  if (element.layers)
                    return <RadioButton label={element.name + " group"} key={element.id} />
                  else
                    return <RadioButton label={element.name} key={element.id} />
                })}
              </RadioButtonGroup>
        </Drawer>
        </MuiThemeProvider>
      </div>
    );
  }
}

/**
 * set error message if layers did not loaded
 * @type {Object}
 */
LayersComponent.defaultProps = {
  layers: []
}

export default LayersComponent;
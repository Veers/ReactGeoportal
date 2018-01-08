import React, {Component} from 'react'
import PropTypes from 'prop-types'

import Utils from '../Utils'

import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider'

import FloatingActionButton from 'material-ui/FloatingActionButton'
import ContentAdd from 'material-ui/svg-icons/content/add'
import ContentRemove from 'material-ui/svg-icons/content/remove'
import {RadioButton, RadioButtonGroup} from 'material-ui/RadioButton'

import {List, ListItem} from 'material-ui/List'
import Drawer from 'material-ui/Drawer'
import Subheader from 'material-ui/Subheader'
import Divider from 'material-ui/Divider'
import Checkbox from 'material-ui/Checkbox'
import Toggle from 'material-ui/Toggle'

import '../style/main.scss'

class LayersComponent extends Component {
  static propTypes = {    
    layersData: PropTypes.object.isRequired
  }

  constructor(props) {
    super(props)
    this.state = {
      open: false,
      layers: [],
      activeLayer: {}
    }
  }

  handleToggle = () => this.setState({open: !this.state.open})

  toggleLayers = (event, value) => this.setState((prevState, props) => ({
    activeLayer: value
  }))

  componentWillReceiveProps = (nextProps) => {
    this.setState({
      layers: nextProps.layersData.layers,
      activeLayer: nextProps.layersData.activeLayer
    })
  }


  render() {
    let button = null;
    if (this.state.open) {
      button = <ContentRemove />
    } else {
      button = <ContentAdd />
    }
    let mapLayers = this.state.layers
    let activeLayer = this.state.activeLayer
    const radioStyles = {
      radioButton: {
        marginBottom: 10,
        marginLeft: 10
      },
      listParentNode: {
        marginBottom: 10,
        marginLeft: 10
      }
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
            <Subheader>LAYERS TREE</Subheader>
            <RadioButtonGroup name="mapLayers" onChange={this.toggleLayers} valueSelected={activeLayer}>
              {mapLayers.map(function(element){
                if (element.layers)
                  return <RadioButton value={element} label={element.name + " group"} key={element.id}  style={radioStyles.listParentNode}/>
                else
                  return <RadioButton value={element} label={element.name} key={element.id} style={radioStyles.radioButton}/>
              })}
            </RadioButtonGroup>
          </Drawer>
        </MuiThemeProvider>
      </div>
    );
  }
}

export default LayersComponent
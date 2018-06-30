import React, {Component} from 'react'
import PropTypes from 'prop-types'

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

class LayersComponent extends Component {
  static propTypes = {    
    coveragesLayers: PropTypes.array.isRequired,
    onLayerChange: PropTypes.func.isRequired,
    activeLayer: PropTypes.object.isRequired
  }

  constructor(props) {
    super(props)
    this.state = {
      open: false,
      coveragesLayers: [],
      activeLayer: {}
    }
  }

  handleToggle = () => this.setState({open: !this.state.open})

  toggleLayers = (event, value) => {
    this.setState((prevState, props) => ({
      activeLayer: value
    }))
    this.props.onLayerChange(value)
  }

  componentWillReceiveProps = (nextProps) => {
    this.setState({
      coveragesLayers: nextProps.coveragesLayers,
      activeLayer: nextProps.activeLayer
    })
  }


  render() {
    let button = null;
    if (this.state.open) {
      button = <ContentRemove />
    } else {
      button = <ContentAdd />
    }
    let mapLayers = this.state.coveragesLayers
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
        <FloatingActionButton className="layersButton" onClick={this.handleToggle}>
          {button}       
        </FloatingActionButton>
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
      </div>
    );
  }
}

export default LayersComponent
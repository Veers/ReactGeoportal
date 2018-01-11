import React, {Component} from 'react'
import PropTypes from 'prop-types'

import FloatingActionButton from 'material-ui/FloatingActionButton'
import ContentAdd from 'material-ui/svg-icons/content/add'

import Drawer from 'material-ui/Drawer'
import AppBar from 'material-ui/AppBar'
import {RadioButton, RadioButtonGroup} from 'material-ui/RadioButton'


import SearchForm from './SearchForm'

class SearchComponent extends Component {
  constructor(props) {
    super(props)
    this.state = {open: false}
  }

  handleToggle = () => this.setState({open: !this.state.open})

  showResults = (values) => console.log(23)

  oc = (value) => console.log(34)

  render() {
    return (
      <div>
          <FloatingActionButton className='searchToggleButton' secondary={true} onClick={this.handleToggle}>
            <ContentAdd />
          </FloatingActionButton>
          <Drawer open={this.state.open} width='35%'>
            <h2>Form</h2>
            <SearchForm onSubmit={this.showResults} onChange={this.oc}/>
          </Drawer>
      </div>
    )
  }
}

export default SearchComponent
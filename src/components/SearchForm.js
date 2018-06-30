import React, { Component } from 'react'
import { connect } from 'react-redux'
import { Field, reduxForm, formValueSelector } from 'redux-form'
import { RadioButton } from 'material-ui/RadioButton'
import MenuItem from 'material-ui/MenuItem'
import { AutoComplete as MUIAutoComplete } from 'material-ui'
import {
  AutoComplete,
  Checkbox,
  DatePicker,
  TimePicker,
  RadioButtonGroup,
  SelectField,
  Slider,
  TextField,
  Toggle
} from 'redux-form-material-ui'
import CheckboxTree from 'react-checkbox-tree'

// import '../../node_modules/react-checkbox-tree/src/scss/react-checkbox-tree.scss'
// import 'react-checkbox-tree/lib/react-checkbox-tree.css'

const nodes = [{
    value: 'mars',
    label: 'Mars',
    children: [
        { value: 'phobos', label: 'Phobos' },
        { value: 'deimos', label: 'Deimos' },
    ],
}]

class SearchForm extends Component {

	constructor(props) {
		super(props)
		this.state = {
            checked: [],
            expanded: []
        }
	}

	changeShootingPeriod = (event, index, value) => console.log(event)

	render() {
		return(
			<form>

				<Field name="Radio" component={RadioButtonGroup}>
          			<RadioButton value="react" label="Весь мир"/>
          			<RadioButton value="angular" label="Видимая область"/>
          			<RadioButton value="ember" label="Задать вручьную"/>
        		</Field>

        		<Field name="DatePickerHere0" component={DatePicker} format={null} hintText="Дата начала съемки"/>
        		<Field name="DatePickerHere1" component={DatePicker} format={null} hintText="Дата окончания съемки"/>

        		<Field name="shootingPeriod"
        			component={SelectField}
        			hintText="Выбрать период съемки" 
        			onChange={this.changeShootingPeriod}
        		>
        			<MenuItem key="month" value="month" primaryText="Месяц"/>
          			<MenuItem key="halfYear" value="halfYear" primaryText="Полгода"/>
          			<MenuItem key="year" value="year" primaryText="Год"/>
          			<MenuItem key="10years" value="10years" primaryText="10 лет"/>
        		</Field>

        		<CheckboxTree
                	nodes={nodes}
                	checked={this.state.checked}
                	expanded={this.state.expanded}
                	onCheck={checked => this.setState({ checked })}
                	onExpand={expanded => this.setState({ expanded })}
            	/>
        					
			</form>
		)
	}
}

SearchForm = reduxForm({
	form: 'searchForm'
})(SearchForm)

export default SearchForm
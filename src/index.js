import React from 'react';
import ReactDOM from 'react-dom';
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';

import TopToolbar from './TopToolbar'

class Geoportal extends React.Component {
  constructor(props) {
    super(props);
    this.handleChange = this.handleChange.bind(this);
    this.state = {name: 'Medium'};
  }

  handleChange(e) {
    this.setState({name: e.target.value});
  }
  render() {
    return (    	
      	<div>
          <MuiThemeProvider>
            <TopToolbar />
          </MuiThemeProvider>
        </div>
    );
  }
}

ReactDOM.render(<Geoportal/>, document.getElementById('app'));
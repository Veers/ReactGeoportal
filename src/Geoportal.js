import TopToolbar from './TopToolbar'
import LayerComponent from './LayerComponent'
import SearchComponent from './SearchComponent'

import './style/main.scss'

class Geoportal extends React.Component {
  constructor(props) {
    super(props);
    this.handleChange = this.handleChange.bind(this);
    this.state = {name: 'Medium'};
  }

  handleChange(e) {
    this.setState({name: e.target.value})
  }
  render() {
    return (    	
      	<div>
          <MuiThemeProvider>
            <TopToolbar />
          </MuiThemeProvider>
          <MuiThemeProvider>
            <LayerComponent />
          </MuiThemeProvider>
          <MuiThemeProvider>
            <SearchComponent />
          </MuiThemeProvider>
        </div>
    );
  }
}

export default Geoportal
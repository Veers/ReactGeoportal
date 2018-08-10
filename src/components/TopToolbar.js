import React, {Component} from 'react'
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider'
import { withStyles } from '@material-ui/core/styles';
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import Typography from '@material-ui/core/Typography';
import IconButton from '@material-ui/core/IconButton';
import MenuIcon from '@material-ui/icons/Menu';
import Switch from '@material-ui/core/Switch';
import LeftMenu from './LeftMenu';

const styles = theme => ({
  root: {
    display: 'flex',
    flexWrap: 'wrap',
  },
  flex: {
    flexGrow: 1,
  },
  menuButton: {
    marginLeft: -12,
    marginRight: 20,
  },
  formControl: {
    margin: theme.spacing.unit,
    minWidth: 120
  },
  selectEmpty: {
    marginTop: theme.spacing.unit * 2,
  }
});

class TopToolbar extends Component {
  constructor(props) {
    super(props)
    this.state = {
      logged: true,
      projection: '123',
      isMenuOpen: false
    }
    this.handleEvent = this.handleEvent.bind(this)
  }

  handleEvent = (event, logged) => {
    //this.setState({logged: logged});
    console.log(event)
  }

  clickMenu = event => {
    this.setState((prevState) => ({
      isMenuOpen: !prevState.isMenuOpen
    }));
  }

  render() {
    const { classes } = this.props;

    return (
      <div>
        <AppBar position="static">
          <Toolbar>
            <IconButton color="inherit" aria-label="Menu" onClick={this.clickMenu}>
              <MenuIcon />
            </IconButton>
            <Typography variant="title" color="inherit">
              News
            </Typography>
            <Switch id="mapSwitcher" defaultChecked value="checkedF" color="default" /> c123
          </Toolbar>
        </AppBar>
        <LeftMenu status={this.state.isMenuOpen}/>
      </div>
    );
  }
}

export default withStyles(styles)(TopToolbar);

// export default TopToolbar;
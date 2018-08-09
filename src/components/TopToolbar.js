import React, {Component} from 'react'
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider'
import { withStyles } from '@material-ui/core/styles';
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import Typography from '@material-ui/core/Typography';
import Button from '@material-ui/core/Button';
import IconButton from '@material-ui/core/IconButton';
import MenuIcon from '@material-ui/icons/Menu';
import Switch from '@material-ui/core/Switch';
import Input from '@material-ui/core/Input';
import InputLabel from '@material-ui/core/InputLabel';
import MenuItem from '@material-ui/core/MenuItem';
import FormHelperText from '@material-ui/core/FormHelperText';
import FormControl from '@material-ui/core/FormControl';
import Select from '@material-ui/core/Select';
import MoreVertIcon from 'material-ui/svg-icons/navigation/more-vert'
import NavigationClose from 'material-ui/svg-icons/navigation/close'

class TopToolbar extends Component {
  constructor(props) {
    super(props)
    this.state = {
      logged: true
    }
    this.handleEvent = this.handleEvent.bind(this)
  }

  handleEvent = (event, logged) => {
    //this.setState({logged: logged});
    console.log(event)
  }

  render() {
    const classes = {
      root: {
        flexGrow: 1,
      },
      flex: {
        flexGrow: 1,
      },
      menuButton: {
        marginLeft: -12,
        marginRight: 20,
      },
    };

    return (
      <div>
        <MuiThemeProvider>
          <AppBar position="static">
            <Toolbar>
              <IconButton color="inherit" aria-label="Menu">
                <MenuIcon />
              </IconButton>
              <Typography variant="title" color="inherit">
                News
              </Typography>
              <Switch id="mapSwitcher" defaultChecked value="checkedF" color="default" /> c123
              <FormControl className={classes.formControl}>
                <InputLabel htmlFor="age-helper">Age</InputLabel>
                <Select
                  value={this.state.age}
                  onChange={this.handleChange}
                  input={<Input name="age" id="age-helper" />}
                >
                  <MenuItem value={10}>Ten</MenuItem>
                  <MenuItem value={20}>Twenty</MenuItem>
                  <MenuItem value={30}>Thirty</MenuItem>
                </Select>
                <FormHelperText>Projection select</FormHelperText>
              </FormControl>
            </Toolbar>
          </AppBar>
        </MuiThemeProvider>
      </div>
    );
  }
}

export default TopToolbar;
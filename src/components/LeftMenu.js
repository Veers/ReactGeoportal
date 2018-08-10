import React from 'react';
import PropTypes from 'prop-types';
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';
import { withStyles } from '@material-ui/core/styles';
import Drawer from '@material-ui/core/Drawer';
import Button from '@material-ui/core/Button';
import List from '@material-ui/core/List';
import Divider from '@material-ui/core/Divider';

const styles = {
  list: {
    width: 250,
  },
  fullList: {
    width: 'auto',
  },
};

class LeftMenu extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      isOpen: false
    };
    this.toggleDrawer = this.toggleDrawer.bind(this)
  }

  toggleDrawer = (open) => () => {
    this.setState({
      isOpen: open,
    });
  };

  render() {
    const { classes } = this.props.classes;
    const { status } = this.props.status;

    return (
      <div>
       <MuiThemeProvider>
        <Drawer open={this.props.status} onClose={this.toggleDrawer(false)}>
          <div
            tabIndex={0}
            role="button"
            onClick={this.toggleDrawer(false)}
            onKeyDown={this.toggleDrawer(false)}
          >
          </div>
        </Drawer>
       </MuiThemeProvider>
      </div>
    );
  }
}

LeftMenu.propTypes = {
  classes: PropTypes.object.isRequired,
  status: PropTypes.bool.isRequired
};

export default withStyles(styles)(LeftMenu);

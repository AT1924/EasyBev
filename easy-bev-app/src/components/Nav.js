import React from 'react';
import AppBar from '@material-ui/core/AppBar';
import Button from '@material-ui/core/Button';
import PropTypes from 'prop-types';
import CssBaseline from '@material-ui/core/CssBaseline';
import Toolbar from '@material-ui/core/Toolbar';
import Typography from '@material-ui/core/Typography';
import Link from '@material-ui/core/Link';
import AccountCircleIcon from '@material-ui/icons/AccountCircle';
import withStyles from "@material-ui/core/styles/withStyles";
import { BrowserView, MobileView, isBrowser, isMobile } from "react-device-detect";

const styles = theme => ({
    '@global': {
        ul: {
            margin: 0,
            padding: 0,
            listStyle: 'none',
        },
    },
    appBar: {
        borderBottom: `1px solid ${theme.palette.divider}`,

    },
    bottomBar: {
        top: 'auto',
        bottom: 0,
    },
    toolbar: {
        flexWrap: 'wrap',
    },
    toolbarTitle: {
        flexGrow: 1,
    },
    link: {
        margin: theme.spacing(1, 1.5),
    },
});

class Nav extends React.Component{
    constructor() {
        super();
        // this.state = {
        //     width: window.innerWidth,
        // };
        // this.handleWindowSizeChange = this.handleWindowSizeChange.bind(this);
        // console.log(window.innerWidth);
    }


    render() {
        const { classes } = this.props;
        // the rest is the same...

        if (isMobile) {
            return (
                <React.Fragment>
                    <CssBaseline />
                    <AppBar position="fixed" color="default" elevation={0} className={classes.bottomBar}>
                        <Toolbar className={classes.toolbar}>
                            <nav>
                                <Link variant="button" color="textPrimary" href="#" className={classes.link}>
                                    Cart
                                </Link>
                                <Link variant="button" color="textPrimary" href="#" className={classes.link}>
                                    Feed
                                </Link>
                                <Link variant="button" color="textPrimary" href="#" className={classes.link}>
                                    Messaging
                                </Link>
                                <Link variant="button" color="textPrimary" href="#" className={classes.link}>
                                    Orders
                                </Link>
                            </nav>
                            <Button href="#" color="primary" className={classes.link}>
                                <AccountCircleIcon/>
                            </Button>
                        </Toolbar>
                    </AppBar>
                </React.Fragment>
            );
        } else {
            return (
                <React.Fragment>
                    <CssBaseline />
                    <AppBar position="static" color="default" elevation={0} className={classes.appBar}>
                        <Toolbar className={classes.toolbar}>
                            <Typography variant="h6" color="inherit" noWrap className={classes.toolbarTitle}>
                                EasyBev
                            </Typography>
                            <nav>
                                <Link variant="button" color="textPrimary" href="#" className={classes.link}>
                                    Cart
                                </Link>
                                <Link variant="button" color="textPrimary" href="#" className={classes.link}>
                                    Feed
                                </Link>
                                <Link variant="button" color="textPrimary" href="#" className={classes.link}>
                                    Messaging
                                </Link>
                                <Link variant="button" color="textPrimary" href="#" className={classes.link}>
                                    Orders
                                </Link>
                            </nav>
                            <Button href="#" color="primary" className={classes.link}>
                                <AccountCircleIcon/>
                            </Button>
                        </Toolbar>
                    </AppBar>
                </React.Fragment>
            );
        }
    }
}

Nav.propTypes = {
    classes: PropTypes.object.isRequired
};

export default withStyles(styles)(Nav);
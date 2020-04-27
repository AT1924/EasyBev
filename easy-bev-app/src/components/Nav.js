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
import Menu from "@material-ui/core/Menu";
import MenuItem from "@material-ui/core/MenuItem";
import Redirect from "react-router-dom/es/Redirect";
import image1 from "./EasyBev_Logo.jpg";

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
    mobileBanner: {
        borderBottom: `1px solid ${theme.palette.divider}`,
        padding: 15,
        backgroundColor: '#FFFFFF',
        alignItems: 'center',
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
    img: {
        width: '50%',
        resizeMode: 'contain',
    },
});

class Nav extends React.Component{
    state = {anchorEl : null, redirect: false, redirectLoc: "", fromType: localStorage.getItem("typeUser"),};


    handleClick = event => {
        this.setState({ anchorEl: event.currentTarget });
    };

    handleClose = () => {
        this.setState({ anchorEl: null });
    };

    async logout() {
        try {
            fetch("/api/log_out", {
                method: "post",
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json'
                },

                //make sure to serialize your JSON body
                body: JSON.stringify({})
            }).then( response => response.json())
                .then(json => {
                       console.log(json);
                        this.setState({ redirect: true, redirectLoc: '/' });
                }
                );
        } catch(error) {
            console.error(error);
        }
    }

    redirect = name => (event) => {
        if (name === "/") {
            localStorage.setItem('login', "false");
            this.logout();
            console.log('logguted out')
        } else {
            this.setState({ redirect: true, redirectLoc: [name] });
        }

    };

    render() {
        const { classes } = this.props;
        // the rest is the same...
        if (this.state.redirect) {
            return (

                <Redirect to={this.state.redirectLoc[0]}/>
            )
        }
        else if (isMobile) {
            return (
                <React.Fragment>
                    <CssBaseline />
                    <AppBar position="static" className={classes.mobileBanner}>
                        <img className={classes.img} alt="complex" src={image1} />
                    </AppBar>
                    <AppBar position="fixed" color="default" elevation={0} className={classes.bottomBar}>
                        <Toolbar className={classes.toolbar}>
                            <nav>

                                <Link variant="button" color="textPrimary" href="/feed" className={classes.link}>
                                    Feed
                                </Link>

                                {this.state.fromType === "merchants" ?                                 <Link variant="button" color="textPrimary" href="/cart" className={classes.link}>
                                    Cart
                                </Link> :                                      <Link variant="button" color="textPrimary" href="/cart" className={classes.link}>
                                    Add Promotions
                                </Link>                           }

                                <Link variant="button" color="textPrimary" href="/message" className={classes.link}>
                                    Messaging
                                </Link>
                                <Link variant="button" color="textPrimary" href="/orders" className={classes.link}>
                                    Orders
                                </Link>
                            </nav>
                            <Button aria-controls="simple-menu" aria-haspopup="true" onClick={this.handleClick}>
                                <AccountCircleIcon/>
                            </Button>
                            <Menu
                                id="simple-menu"
                                anchorEl={this.state.anchorEl}
                                keepMounted
                                open={Boolean(this.state.anchorEl)}
                                onClose={this.handleClose}
                            >
                                <MenuItem onClick={this.redirect("/profile")}>My account</MenuItem>
                                <MenuItem onClick={this.redirect("/")}>Logout</MenuItem>
                            </Menu>
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

                                <Link variant="button" color="textPrimary" href="/feed" className={classes.link}>
                                    Feed
                                </Link>
                                {this.state.fromType === "merchants" ?                                 <Link variant="button" color="textPrimary" href="/cart" className={classes.link}>
                                    Cart
                                </Link> :                                      <Link variant="button" color="textPrimary" href="/cart" className={classes.link}>
                                    Add Promotions
                                </Link>                           }
                                <Link variant="button" color="textPrimary" href="/message" className={classes.link}>
                                    Messaging
                                </Link>
                                <Link variant="button" color="textPrimary" href="/orders" className={classes.link}>
                                    Orders
                                </Link>
                            </nav>
                            <Button aria-controls="simple-menu" aria-haspopup="true" onClick={this.handleClick}>
                                <AccountCircleIcon/>
                            </Button>
                            <Menu
                                id="simple-menu"
                                anchorEl={this.state.anchorEl}
                                keepMounted
                                open={Boolean(this.state.anchorEl)}
                                onClose={this.handleClose}
                            >
                                <MenuItem onClick={this.redirect("/profile")}>My account</MenuItem>
                                <MenuItem onClick={this.redirect("/")}>Logout</MenuItem>
                            </Menu>
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
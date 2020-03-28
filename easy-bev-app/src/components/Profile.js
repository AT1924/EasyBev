import React from 'react';
import Avatar from '@material-ui/core/Avatar';
import Button from '@material-ui/core/Button';
import CssBaseline from '@material-ui/core/CssBaseline';
import TextField from '@material-ui/core/TextField';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import Checkbox from '@material-ui/core/Checkbox';
import Link from '@material-ui/core/Link';
import Grid from '@material-ui/core/Grid';
import Box from '@material-ui/core/Box';
import LockOutlinedIcon from '@material-ui/icons/LockOutlined';
import Typography from '@material-ui/core/Typography';
import { makeStyles } from '@material-ui/core/styles';
import Container from '@material-ui/core/Container';
import PropTypes from "prop-types";
import withStyles from "@material-ui/core/styles/withStyles";
import Nav from "./Nav";

const styles = theme => ({
    paper: {
        marginTop: theme.spacing(8),
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
    },
    avatar: {
        margin: theme.spacing(1),
        backgroundColor: theme.palette.secondary.main,
    },
    form: {
        width: '100%', // Fix IE 11 issue.
        marginTop: theme.spacing(1),
    },
    submit: {
        margin: theme.spacing(3, 0, 2),
    },
});

class Profile extends React.Component {

    state = {
        email: '', password: '', error: false, errorMsg: '', redirect: false, type: "merchants", signin: false,
    };

    // getInfo = async e => {
    //     e.preventDefault();
    //     const response = await fetch('/api/get_client', {
    //         method: 'POST',
    //         headers: {
    //             'Content-Type': 'application/json',
    //         },
    //
    //         body: JSON.stringify({}),
    //     });
    //     const body = await response.json();
    //     console.log(body);
    //     // if (body.error) {
    //     //     console.log(body);
    //     //     this.setState({ errorMsg: body.error});
    //     //
    //     //     return false;
    //     // }
    //     // else if (!(body.error)){
    //     //     localStorage.setItem('login', "true");
    //     //     this.setState({ signin: true });
    //     // }
    //     // else {
    //     //     console.log(body);
    //     // }
    //
    //     return false;
    // };

    async getData() {
        try {
            fetch("/api/get_client", {
                method: "post",
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json'
                },

                //make sure to serialize your JSON body
                body: JSON.stringify({})
            })
                .then( (response) => {
                   console.log(response.json());
                });
        } catch(error) {
            console.error(error);
        }
    }


    handleChange = name => (event) => {
        this.setState({ [name]: event.target.value });
    };

    handle = () => (event) => {
        if (this.state.type === "distributors") {
            this.setState({ type: "merchants" });
            console.log("merchants");
        } else {
            this.setState({ type: "distributors" });
            console.log("dist");
        }
    };


    render() {
        const { classes } = this.props;
        const info = this.getData();
            return (
                <React.Fragment>
                    <CssBaseline />
                    <Nav/>

                    <Container component="main" maxWidth="xs">
                        <CssBaseline />
                        <div className={classes.paper} >
                            <Typography component="h1" variant="h5">
                                Profile
                            </Typography>
                            <form className={classes.form} noValidate onSubmit={this.signIn}>
                                {/*<TextField*/}
                                {/*    variant="outlined"*/}
                                {/*    margin="normal"*/}
                                {/*    required*/}
                                {/*    fullWidth*/}
                                {/*    id="company"*/}
                                {/*    label="Company Name"*/}
                                {/*    name="company"*/}
                                {/*    autoComplete="company"*/}
                                {/*    onChange={this.handleChange('company')}*/}
                                {/*/>*/}
                                <TextField
                                    disabled
                                    fullWidth
                                    margin="normal"
                                    id="company"
                                    label="Company Name"
                                    defaultValue="Akhils Company"
                                />
                                {/*<TextField*/}
                                {/*    variant="outlined"*/}
                                {/*    margin="normal"*/}
                                {/*    required*/}
                                {/*    fullWidth*/}
                                {/*    id="address"*/}
                                {/*    label="Street Address"*/}
                                {/*    name="address"*/}
                                {/*    autoComplete="address"*/}
                                {/*    onChange={this.handleChange('company')}*/}
                                {/*/>*/}
                                <TextField
                                    fullWidth
                                    margin="normal"
                                    disabled
                                    id="address"
                                    label="Address"
                                    defaultValue="85 Canal St."
                                />
                                {/*<TextField*/}
                                {/*    variant="outlined"*/}
                                {/*    margin="normal"*/}
                                {/*    required*/}
                                {/*    fullWidth*/}
                                {/*    id="State"*/}
                                {/*    label="State"*/}
                                {/*    name="state"*/}
                                {/*    autoComplete="state"*/}
                                {/*    onChange={this.handleChange('company')}*/}
                                {/*/>*/}
                                <TextField
                                    fullWidth
                                    margin="normal"
                                    disabled
                                    id="State"
                                    label="State"
                                    defaultValue="RI"
                                />
                                {/*<TextField*/}
                                {/*    variant="outlined"*/}
                                {/*    margin="normal"*/}
                                {/*    required*/}
                                {/*    fullWidth*/}
                                {/*    id="zip"*/}
                                {/*    label="Zip-code"*/}
                                {/*    name="zip"*/}
                                {/*    autoComplete="zip"*/}
                                {/*    onChange={this.handleChange('company')}*/}
                                {/*/>*/}
                                <TextField
                                    fullWidth
                                    margin="normal"
                                    disabled
                                    id="zip"
                                    label="Zip-code"
                                    defaultValue="02912"
                                />
                                {/*<TextField*/}
                                {/*    variant="outlined"*/}
                                {/*    fullWidth*/}
                                {/*    margin="normal"*/}
                                {/*    required*/}

                                {/*    id="email"*/}
                                {/*    label="Email Address"*/}
                                {/*    name="email"*/}
                                {/*    autoComplete="email"*/}
                                {/*    onChange={this.handleChange('email')}*/}
                                {/*/>*/}
                                <TextField
                                    fullWidth
                                    margin="normal"
                                    disabled
                                    id="email"
                                    label="Email"
                                    defaultValue="akhil@bob.com"
                                />
                                {/*<TextField*/}
                                {/*    variant="outlined"*/}
                                {/*    margin="normal"*/}
                                {/*    required*/}
                                {/*    fullWidth*/}
                                {/*    name="password"*/}
                                {/*    label="Password"*/}
                                {/*    type="password"*/}
                                {/*    id="password"*/}
                                {/*    autoComplete="current-password"*/}
                                {/*    onChange={this.handleChange('password')}*/}
                                {/*/>*/}
                                <TextField
                                    hidden
                                    fullWidth
                                    margin="normal"
                                    disabled
                                    id="password"
                                    label="Password"
                                    defaultValue="02912"
                                />

                                <Button
                                    type="submit"
                                    fullWidth
                                    variant="contained"
                                    color="primary"
                                    className={classes.submit}
                                >
                                    Edit
                                </Button>

                                <Grid/>
                            </form>
                        </div>
                    </Container>

                </React.Fragment>


            );


    }


}

Profile.propTypes = {
    classes: PropTypes.object.isRequired
};

export default withStyles(styles)(Profile);
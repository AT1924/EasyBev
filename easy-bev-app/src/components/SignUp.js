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
import Tabs from "@material-ui/core/Tabs";
import Tab from "@material-ui/core/Tab";
import Paper from "@material-ui/core/Paper";
import Redirect from "react-router-dom/es/Redirect";

function Copyright() {
    return (
        <Typography variant="body2" color="textSecondary" align="center">
            {'Copyright © '}
            <Link color="inherit" href="https://material-ui.com/">
                Your Website
            </Link>{' '}
            {new Date().getFullYear()}
            {'.'}
        </Typography>
    );
}

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
        marginTop: theme.spacing(3),
    },
    submit: {
        margin: theme.spacing(3, 0, 2),
    },
});

class SignUp extends React.Component {
    state = {
        email: '', password: '', error: false, errorMsg: '', type: "merchants", company: '', signin: false,
    };

    signUp = async e => {
        e.preventDefault();
        const response = await fetch('/api/signup', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },//ben 42069 IS A PLACEHOLDER FOR THE ACTUAL CODE, MUST TAKE THAT AS INPUT WHEN SIGNING UP
            body: JSON.stringify({code: 42069, company: this.state.company, type:this.state.type, email: this.state.email, password: this.state.password }),
        });
        const body = await response.json();
        console.log(body);
        if (body.error) {
            console.log(body);
            this.setState({ errorMsg: body.error});
            return false;
        }
        else if (!(body.error)){
            localStorage.setItem('login', "true");
            this.setState({ signin: true });
        }
        else {
            console.log(body);
        }

        return false;
    };

    handleChange = name => (event) => {
        this.setState({ [name]: event.target.value });
    };

    check = () => {
        if (this.state.type === "merchants") {
            return true;
        } else {
            return false;
        }
    };

    handle = () => (event) => {
        if (this.state.type === "distributors") {
            this.setState({ type: "merchants" });
            console.log("merchant");
        } else {
            this.setState({ type: "distributors" });
            console.log("dist");
        }
    };



    render() {
        const { classes } = this.props;
        if (this.state.signin) {
            return (
                <Redirect to="/feed"/>
            )

        } else {
            return (
                <Container component="main" maxWidth="xs">
                    <CssBaseline />
                    <div className={classes.paper}>
                        <Avatar className={classes.avatar}>
                            <LockOutlinedIcon/>
                        </Avatar>
                        <Typography component="h1" variant="h5">
                            Sign up
                        </Typography>
                        <form className={classes.form} noValidate onSubmit={this.signUp}>
                            <Paper square>
                                <Tabs
                                    value={this.state.type}
                                    indicatorColor="primary"
                                    textColor="primary"
                                    onChange={this.handle()}
                                    variant="fullWidth"
                                    centered
                                >
                                    <Tab label="Merchant" id='merchant' value="merchants"/>
                                    <Tab label="Distributor" id='dist' value="distributors"/>
                                </Tabs>

                            </Paper>
                            {
                            this.check()
                                ?  < Container>
                                    <TextField
                                        variant="outlined"
                                        margin="normal"
                                        required
                                        fullWidth
                                        id="code"
                                        label="Distributor Code"
                                        name="code"
                                        autoComplete="code"
                                        onChange={this.handleChange('company')}
                                    />
                                    <TextField
                                        variant="outlined"
                                        margin="normal"
                                        required
                                        fullWidth
                                        id="company"
                                        label="Company Name"
                                        name="company"
                                        autoComplete="company"
                                        onChange={this.handleChange('company')}
                                    />
                                    <TextField
                                        variant="outlined"
                                        margin="normal"
                                        required
                                        fullWidth
                                        id="address"
                                        label="Street Address"
                                        name="address"
                                        autoComplete="address"
                                        onChange={this.handleChange('company')}
                                    />
                                    <TextField
                                        variant="outlined"
                                        margin="normal"
                                        required
                                        fullWidth
                                        id="State"
                                        label="State"
                                        name="state"
                                        autoComplete="state"
                                        onChange={this.handleChange('company')}
                                    />
                                    <TextField
                                        variant="outlined"
                                        margin="normal"
                                        required
                                        fullWidth
                                        id="zip"
                                        label="Zip-code"
                                        name="zip"
                                        autoComplete="zip"
                                        onChange={this.handleChange('company')}
                                    />
                            <TextField
                                variant="outlined"
                                margin="normal"
                                required
                                fullWidth
                                id="email"
                                label="Email Address"
                                name="email"
                                autoComplete="email"
                                onChange={this.handleChange('email')}
                            />
                            <TextField
                                variant="outlined"
                                margin="normal"
                                required
                                fullWidth
                                name="password"
                                label="Password"
                                type="password"
                                id="password"
                                autoComplete="current-password"
                                onChange={this.handleChange('password')}
                            /> </Container>
                                :
                             < Container><TextField
                                 variant="outlined"
                                 margin="normal"
                                 required
                                 fullWidth
                                 id="company"
                                 label="Company Name"
                                 name="company"
                                 autoComplete="company"
                                 onChange={this.handleChange('company')}
                             />
                                 <TextField
                                     variant="outlined"
                                     margin="normal"
                                     required
                                     fullWidth
                                     id="address"
                                     label="Street Address"
                                     name="address"
                                     autoComplete="address"
                                     onChange={this.handleChange('company')}
                                 />
                                 <TextField
                                     variant="outlined"
                                     margin="normal"
                                     required
                                     fullWidth
                                     id="State"
                                     label="State"
                                     name="state"
                                     autoComplete="state"
                                     onChange={this.handleChange('company')}
                                 />
                                 <TextField
                                     variant="outlined"
                                     margin="normal"
                                     required
                                     fullWidth
                                     id="zip"
                                     label="Zip-code"
                                     name="zip"
                                     autoComplete="zip"
                                     onChange={this.handleChange('company')}
                                 />
                                 <TextField
                                     variant="outlined"
                                     margin="normal"
                                     required
                                     fullWidth
                                     id="email"
                                     label="Email Address"
                                     name="email"
                                     autoComplete="email"
                                     onChange={this.handleChange('email')}
                                 />
                                 <TextField
                                     variant="outlined"
                                     margin="normal"
                                     required
                                     fullWidth
                                     name="password"
                                     label="Password"
                                     type="password"
                                     id="password"
                                     autoComplete="current-password"
                                     onChange={this.handleChange('password')}
                                 />
                            </Container>}


                            <Button
                                type="submit"
                                fullWidth
                                variant="contained"
                                color="primary"
                                className={classes.submit}
                            >
                                Sign Up
                            </Button>
                            <Grid container justify="flex-end">
                                <Grid item>
                                    <Link href="/" variant="body2">
                                        Already have an account? Sign in
                                    </Link>
                                </Grid>
                            </Grid>
                        </form>
                    </div>
                    <Box mt={5}>
                        <Copyright/>
                    </Box>
                </Container>
            );
        }
    }

}


SignUp.propTypes = {
    classes: PropTypes.object.isRequired
};

export default withStyles(styles)(SignUp);
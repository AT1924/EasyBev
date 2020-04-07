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
import TableContainer from "@material-ui/core/TableContainer";
import Table from "@material-ui/core/Table";
import TableHead from "@material-ui/core/TableHead";
import TableRow from "@material-ui/core/TableRow";
import TableCell from "@material-ui/core/TableCell";
import TableBody from "@material-ui/core/TableBody";
import Paper from "@material-ui/core/Paper";

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
    constructor(props) {
        super(props);
        this.state = {
            email: '', company: '', state: '', zip: '', address: '',
            error: false, errorMsg: '', redirect: false, type: "Merchant", signin: false,
            body: [], rows: [],
        };

    }

    componentDidMount () {
        console.log("Component did mount");
        const api = this.getData();
        console.log('api done');
    }

    createData(id, name, email, state) {
        return { id, name, email, state};
    }

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
            }).then( response => response.json())
                .then(json => {
                        console.log(json);
                        if ('distributor' in json.body) {
                            this.setState({company: json.body.distributor.name, type: "Distributor",
                                address: json.body.distributor.address,
                                state: json.body.distributor.state, zip: json.body.distributor.zip, email: json.body.distributor.email});
                            const newRows = [];
                            for (let i = 0; i < json.body.merchants.length; i++) {
                                newRows.push(this.createData(json.body.merchants[i].id, json.body.merchants[i].name,
                                    json.body.merchants[i].email, json.body.merchants[i].state))
                            }
                            this.setState({rows: newRows});
                        } else {
                            this.setState({company: json.body.merchant.name, address: json.body.merchant.address,
                                state: json.body.merchant.state, zip: json.body.merchant.zip, email: json.body.merchant.email});
                        }
                    }
                );
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

    check = () => {
        if (this.state.type === "Distributor") {
            return true;
        } else {
            return false;
        }
    };


    render() {
        const { classes } = this.props;
        const {company, address, state, zip, email, type, rows} = this.state;
        console.log(this.state);

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
                                <TextField
                                    disabled
                                    fullWidth
                                    margin="normal"
                                    id="company"
                                    label="Type"
                                    value={type}
                                />
                                <TextField
                                    disabled
                                    fullWidth
                                    margin="normal"
                                    id="company"
                                    label="Company Name"
                                    value={company}
                                />
                                <TextField
                                    fullWidth
                                    margin="normal"
                                    disabled
                                    id="address"
                                    label="Address"
                                    value={address}
                                />

                                <TextField
                                    fullWidth
                                    margin="normal"
                                    disabled
                                    id="State"
                                    label="State"
                                    value={state}
                                />

                                <TextField
                                    fullWidth
                                    margin="normal"
                                    disabled
                                    id="zip"
                                    label="Zip-code"
                                    // defaultValue={zip}
                                    value={zip}
                                />

                                <TextField
                                    fullWidth
                                    margin="normal"
                                    disabled
                                    id="email"
                                    label="Email"
                                    value={email}
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

                                {this.check() ? <Container>
                                        <TableContainer component={Paper}>
                                            <Table className={classes.table} size="small" aria-label="a dense table">
                                                <TableHead>
                                                    <TableRow>
                                                        <TableCell>Id</TableCell>
                                                        <TableCell align="right">Company Name</TableCell>
                                                        <TableCell align="right">Email</TableCell>
                                                        <TableCell align="right">State</TableCell>
                                                        {/*<TableCell align="right">Protein&nbsp;(g)</TableCell>*/}
                                                    </TableRow>
                                                </TableHead>
                                                <TableBody> 
                                                    {rows.map((row) => (
                                                        <TableRow key={row.id}>
                                                            <TableCell component="th" scope="row">
                                                                {row.id}
                                                            </TableCell>
                                                            <TableCell align="right">{row.name}</TableCell>
                                                            <TableCell align="right">{row.email}</TableCell>
                                                            <TableCell align="right">{row.state}</TableCell>
                                                        </TableRow>
                                                    ))}
                                                </TableBody>
                                            </Table>
                                        </TableContainer>
                                </Container> :
                                    <Container>
                                    </Container>}




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
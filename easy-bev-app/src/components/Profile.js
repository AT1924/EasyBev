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
import ExpansionPanel from "@material-ui/core/ExpansionPanel";
import ExpansionPanelSummary from "@material-ui/core/ExpansionPanelSummary";
import ExpansionPanelDetails from "@material-ui/core/ExpansionPanelDetails";
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
import Divider from "@material-ui/core/Divider";
import {red} from "@material-ui/core/colors";
import { BrowserView, MobileView, isBrowser, isMobile } from "react-device-detect";
import {Helmet} from "react-helmet";
import InputBase from "@material-ui/core/InputBase";
import IconButton from "@material-ui/core/IconButton";
import Tabs from "@material-ui/core/Tabs";
import Tab from "@material-ui/core/Tab";

const styles = theme => ({
    paper: {
        marginTop: theme.spacing(8),
        marginBottom: theme.spacing(8),
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
    },
    root: {
      margin: theme.spacing(5),
    },
    heading: {
        fontSize: theme.typography.pxToRem(15),
        flexBasis: '33.33%',
        flexShrink: 0,
    },
    secondaryHeading: {
        fontSize: theme.typography.pxToRem(15),
        color: '#FF0000',
    },
    divide: {
        marginTop: theme.spacing(3),
        marginBottom: theme.spacing(3),
    },
    avatar: {
        margin: theme.spacing(1),
        backgroundColor: 'red',
    },
    form: {
        width: '100%', // Fix IE 11 issue.
        marginTop: theme.spacing(1),
    },
    submit: {
        margin: theme.spacing(3, 0, 2),
    },
    addClient: {
        padding: '2px 4px',
        display: 'flex',
        alignItems: 'center',
        width: 400,
    },
    input: {
        marginLeft: theme.spacing(1),
        flex: 1,
    },
    iconButton: {
        padding: 10,
    },
    divider: {
        height: 28,
        margin: 4,
    },
});

class Profile extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            email: '', company: '', state: '', zip: '', address: '',
            error: false, errorMsg: '', redirect: false, type: "Merchant", signin: false,
            body: [], rows: [], panel1: true, panel2: false,
            payname: '', payphone: '', payaddress: '', paycountry: '',
            paycity: '', payzip: '', paycardnum: '', paycardver: '',
            monthexp: '', yearexp: '', billing: true,
            response: '', emailMessage: '', merchantEmail: '',
        };

    }

    componentDidMount () {
        console.log("Component did mount");
        const api = this.getData();
        console.log('api done');
    }

    createData(id, name, email, address, city, state, zip) {
        return { id, name, email, address, city, state, zip};
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
                                console.log(json.body.merchants);
                                newRows.push(this.createData(json.body.merchants[i].id, json.body.merchants[i].name,
                                    json.body.merchants[i].email, json.body.merchants[i].address, json.body.merchants[i].city,
                                    json.body.merchants[i].state, json.body.merchants[i].zip))
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

    // async addClient(email) {
    //     if(email.includes('@')) {
    //         this.setState({emailMessage: ""});
    //         try {
    //             fetch("/api/invite_merchant", {
    //                 method: "post",
    //                 headers: {
    //                     'Accept': 'application/json',
    //                     'Content-Type': 'application/json'
    //                 },
    //
    //                 //make sure to serialize your JSON body
    //                 body: JSON.stringify({email: this.state.merchantEmail})
    //             }).then( response => response.json())
    //                 .then(json => {
    //                         console.log(json);
    //                     }
    //                 );
    //         } catch(error) {
    //             console.error(error);
    //         }
    //     } else {
    //         this.setState({emailMessage: "Enter Valid Email"});
    //     }
    //
    // }

    addClient = async e => {
        console.log("hello");
        e.preventDefault();
        if (this.state.merchantEmail.includes("@")) {
            console.log("adding Client");
            this.setState({emailMessage: ""});
            const response = await fetch("/api/invite_merchant", {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },

                body: JSON.stringify({
                    email: this.state.merchantEmail,
                }),
            });
            const body = await response.json();
            console.log(body);
            if (body.error) {
                console.log(body);
                this.setState({errorMsg: body.error});
                return false;
            } else if (!(body.error)) {
                console.log('success')
            } else {
                console.log(body);
            }
        } else {
            if (this.state.merchantEmail.length > 0) {
                this.setState({emailMessage: "Enter Valid Email"})
            }

        }

    };

    updatePay = async e => {
        e.preventDefault();
        if (this.state.merchantEmail.include("@")) {
            console.log("adding Client");
            const response = await fetch('/api/add_payment', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },

                body: JSON.stringify({
                    name: this.state.payname, phone: this.state.payphone,
                    address: this.state.payaddress, country: this.state.paycountry,
                    city: this.state.paycity, postal_code: this.state.payzip,
                    digits: this.state.paycardnum, security_code: this.state.paycardver,
                    x_month: this.state.monthexp, x_year: this.state.yearexp
                }),
            });
            const body = await response.json();
            console.log(body);
            if (body.error) {
                console.log(body);
                this.setState({errorMsg: body.error});
                return false;
            } else if (!(body.error)) {
                this.setState({
                    cartListData: [],
                    response: "Order Successful"
                });
            } else {
                console.log(body);
            }
        }

    };

    handleOpen = (name) => (event, isExpanding) => {
        if (name === 'panel1') {
            if (this.state.panel1 === true) {
                this.setState({panel1: false})
            } else {
                this.setState({panel1: true, panel2: false})
            }
        } else {
            if (this.state.panel2 === true) {
                this.setState({panel2: false})
            } else {
                this.setState({panel2: true, panel1: false})
            }
        }
    };

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

    changeBill = () => {
        if (this.state.billing) {
            this.setState({billing: false})
        } else {
            this.updatePay();
            this.setState({billing: true})
        }
    }

    checkBill = () => {
        if (this.state.payname === '') {
            return true;
        } else {
            return false;
        }
    }


    render() {
        const { classes } = this.props;
        const {emailMessage, company, address, state, zip, email, type, rows, panel1, panel2,
            payname, payphone, payaddress, paycountry, paycity, payzip, paycardnum, paycardver, monthexp, yearexp, billing} = this.state;

        if (isMobile){
            return (
                <React.Fragment>
                    <Helmet>
                        <meta name="viewport" content="height=device-height, initial-scale=1.0, maximum-scale=1.0"/>

                    </Helmet>

                    <CssBaseline />
                    <Nav/>

                    <Container component="main" maxWidth='md'>
                        <CssBaseline />
                        <div className={classes.root}>
                            <Typography component="h1" variant="h5" className={classes.divide}>
                                Settings
                            </Typography>

                            <ExpansionPanel expanded={panel1} onChange={this.handleOpen('panel1')}>
                                <ExpansionPanelSummary
                                    expandIcon={<ExpandMoreIcon />}
                                    aria-controls="panel2bh-content"
                                    id="panel2bh-header"
                                >
                                    <Typography className={classes.heading}>User Information</Typography>
                                    {/*<Typography className={classes.secondaryHeading}>*/}
                                    {/*    Last Edited: 09/92/12*/}
                                    {/*</Typography>*/}
                                </ExpansionPanelSummary>
                                <ExpansionPanelDetails>
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
                                    </form>
                                </ExpansionPanelDetails>
                            </ExpansionPanel>
                            <ExpansionPanel expanded={panel2} onChange={this.handleOpen('panel2')}>
                                <ExpansionPanelSummary
                                    expandIcon={<ExpandMoreIcon />}
                                    aria-controls="panel3bh-content"
                                    id="panel3bh-header"
                                >
                                    <Typography className={classes.heading}>Billing Information</Typography>
                                    {this.checkBill() ? <Typography className={classes.secondaryHeading}>
                                        Please Enter Payment Information
                                    </Typography> : <div></div>}

                                </ExpansionPanelSummary>
                                <ExpansionPanelDetails>
                                    <form className={classes.form} noValidate >
                                        <TextField
                                            onChange={this.handleChange('payname')}
                                            disabled={billing}
                                            fullWidth
                                            margin="normal"
                                            id="payname"
                                            label="Name"
                                            // defaultValue="Credit Card Holder Name"
                                            value={payname}
                                        />
                                        <TextField
                                            onChange={this.handleChange('payphone')}
                                            disabled={billing}
                                            fullWidth
                                            margin="normal"
                                            id="payphone"
                                            label="Phone"
                                            // defaultValue="Phone"
                                            value={payphone}
                                        />
                                        <TextField
                                            onChange={this.handleChange('payaddress')}
                                            fullWidth
                                            margin="normal"
                                            disabled={billing}
                                            id="payaddress"
                                            label="Address"
                                            // defaultValue="Billing Address"
                                            value={payaddress}
                                        />

                                        <TextField
                                            onChange={this.handleChange('paycountry')}
                                            fullWidth
                                            margin="normal"
                                            disabled={billing}
                                            id="paycountry"
                                            label="Country"
                                            // defaultValue='Billing Country'
                                            value={paycountry}
                                        />

                                        <TextField
                                            onChange={this.handleChange('paycity')}
                                            fullWidth
                                            margin="normal"
                                            disabled={billing}
                                            id="billcity"
                                            label="City"
                                            // defaultValue='Billing City'
                                            value={paycity}
                                        />

                                        <TextField
                                            onChange={this.handleChange('payzip')}
                                            fullWidth
                                            margin="normal"
                                            disabled={billing}
                                            id="billzip"
                                            label="Postal Code"
                                            // defaultValue='Billing Zip'
                                            value={payzip}
                                        />
                                        <Divider className={classes.divide}/>
                                        <TextField
                                            onChange={this.handleChange('paycardnum')}
                                            fullWidth
                                            margin="normal"
                                            disabled={billing}
                                            id="billcardnum"
                                            label="Credit Card No."
                                            // defaultValue='Card Number'
                                            value={paycardnum}
                                        />
                                        <TextField
                                            onChange={this.handleChange('paycardver')}
                                            fullWidth
                                            margin="normal"
                                            disabled={billing}
                                            id="billvernum"
                                            label="Card Verification No."
                                            // defaultValue='Billing Zip'
                                            value={paycardver}
                                        />
                                        <TextField
                                            onChange={this.handleChange('monthexp')}
                                            margin="normal"
                                            disabled={billing}
                                            id="billexpmonth"
                                            label="Month of Expiration"
                                            // defaultValue='Expiry Month'
                                            value={monthexp}
                                        />
                                        <TextField
                                            onChange={this.handleChange('yearexp')}
                                            margin="normal"
                                            disabled={billing}
                                            id="billexpmonth"
                                            label="Year of Expiration"
                                            // defaultValue='Expiry Year'
                                            value={yearexp}
                                        />
                                        {this.state.response}

                                        <Button
                                            fullWidth
                                            variant="contained"
                                            color="primary"
                                            className={classes.submit}
                                            onClick={billing ? this.changeBill : this.updatePay}
                                        >
                                            {billing ? "Edit" : "Submit"}
                                        </Button>


                                    </form>
                                </ExpansionPanelDetails>
                            </ExpansionPanel>
                        </div>
                        <div className={classes.paper} >

                            {this.check() ? <Container>
                                    <Typography component="h1" variant="h5" className={classes.divide}>
                                        Client List
                                    </Typography>
                                    <Grid container direction="row" alignItems="flex-end" spacing={1} >
                                        <Grid item>
                                    <Button onClick={this.addClient} variant="contained" color="primary" component="span" style={{height: '10vh'}}  aria-label="menu">
                                        Add
                                    </Button>
                                        </Grid>
                                        <Grid item>
                                    <TextField
                                        variant="outlined"
                                        margin="normal"
                                        id="merchantEmail"
                                        label="Merchant Email"
                                        name="merchantEmail"
                                        onChange={this.handleChange('merchantEmail')}
                                    />
                                        </Grid>
                                    </Grid>


                                    <Typography style={{margin: 25, color: '#B3B3B3B3'}}>
                                        {emailMessage}
                                    </Typography>
                                    <TableContainer component={Paper}>
                                        <Table className={classes.table} size="medium" aria-label="a dense table" >
                                            <TableHead>
                                                <TableRow>
                                                    <TableCell>Id</TableCell>
                                                    <TableCell align="right">Company Name</TableCell>
                                                    <TableCell align="right">Email</TableCell>
                                                    <TableCell align="right">Address</TableCell>
                                                    <TableCell align="right">City</TableCell>
                                                    <TableCell align="right">State</TableCell>
                                                    <TableCell align="right">Zip</TableCell>
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
                                                        <TableCell align="right">{row.address}</TableCell>
                                                        <TableCell align="right">{row.city}</TableCell>
                                                        <TableCell align="right">{row.state}</TableCell>
                                                        <TableCell align="right">{row.zip}</TableCell>
                                                    </TableRow>
                                                ))}
                                            </TableBody>
                                        </Table>
                                    </TableContainer>
                                </Container> :
                                <Container>
                                </Container>}


                            <Grid/>

                        </div>
                    </Container>

                </React.Fragment>


            );
        } else{
            return (
                <React.Fragment>
                    <CssBaseline />
                    <Nav/>

                    <Container component="main" maxWidth='md'>
                        <CssBaseline />
                        <div className={classes.root}>
                            <Typography component="h1" variant="h5" className={classes.divide}>
                                Settings
                            </Typography>

                            <ExpansionPanel expanded={panel1} onChange={this.handleOpen('panel1')}>
                                <ExpansionPanelSummary
                                    expandIcon={<ExpandMoreIcon />}
                                    aria-controls="panel2bh-content"
                                    id="panel2bh-header"
                                >
                                    <Typography className={classes.heading}>User Information</Typography>
                                    {/*<Typography className={classes.secondaryHeading}>*/}
                                    {/*    Last Edited: 09/92/12*/}
                                    {/*</Typography>*/}
                                </ExpansionPanelSummary>
                                <ExpansionPanelDetails>
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
                                    </form>
                                </ExpansionPanelDetails>
                            </ExpansionPanel>
                            <ExpansionPanel expanded={panel2} onChange={this.handleOpen('panel2')}>
                                <ExpansionPanelSummary
                                    expandIcon={<ExpandMoreIcon />}
                                    aria-controls="panel3bh-content"
                                    id="panel3bh-header"
                                >
                                    <Typography className={classes.heading}>Billing Information</Typography>
                                    {this.checkBill() ? <Typography className={classes.secondaryHeading}>
                                        Please Enter Payment Information
                                    </Typography> : <div></div>}

                                </ExpansionPanelSummary>
                                <ExpansionPanelDetails>
                                    <form className={classes.form} noValidate >
                                        <TextField
                                            onChange={this.handleChange('payname')}
                                            disabled={billing}
                                            fullWidth
                                            margin="normal"
                                            id="payname"
                                            label="Name"
                                            // defaultValue="Credit Card Holder Name"
                                            value={payname}
                                        />
                                        <TextField
                                            onChange={this.handleChange('payphone')}
                                            disabled={billing}
                                            fullWidth
                                            margin="normal"
                                            id="payphone"
                                            label="Phone"
                                            // defaultValue="Phone"
                                            value={payphone}
                                        />
                                        <TextField
                                            onChange={this.handleChange('payaddress')}
                                            fullWidth
                                            margin="normal"
                                            disabled={billing}
                                            id="payaddress"
                                            label="Address"
                                            // defaultValue="Billing Address"
                                            value={payaddress}
                                        />

                                        <TextField
                                            onChange={this.handleChange('paycountry')}
                                            fullWidth
                                            margin="normal"
                                            disabled={billing}
                                            id="paycountry"
                                            label="Country"
                                            // defaultValue='Billing Country'
                                            value={paycountry}
                                        />

                                        <TextField
                                            onChange={this.handleChange('paycity')}
                                            fullWidth
                                            margin="normal"
                                            disabled={billing}
                                            id="billcity"
                                            label="City"
                                            // defaultValue='Billing City'
                                            value={paycity}
                                        />

                                        <TextField
                                            onChange={this.handleChange('payzip')}
                                            fullWidth
                                            margin="normal"
                                            disabled={billing}
                                            id="billzip"
                                            label="Postal Code"
                                            // defaultValue='Billing Zip'
                                            value={payzip}
                                        />
                                        <Divider className={classes.divide}/>
                                        <TextField
                                            onChange={this.handleChange('paycardnum')}
                                            fullWidth
                                            margin="normal"
                                            disabled={billing}
                                            id="billcardnum"
                                            label="Credit Card No."
                                            // defaultValue='Card Number'
                                            value={paycardnum}
                                        />
                                        <TextField
                                            onChange={this.handleChange('paycardver')}
                                            fullWidth
                                            margin="normal"
                                            disabled={billing}
                                            id="billvernum"
                                            label="Card Verification No."
                                            // defaultValue='Billing Zip'
                                            value={paycardver}
                                        />
                                        <TextField
                                            onChange={this.handleChange('monthexp')}
                                            margin="normal"
                                            disabled={billing}
                                            id="billexpmonth"
                                            label="Month of Expiration"
                                            // defaultValue='Expiry Month'
                                            value={monthexp}
                                        />
                                        <TextField
                                            onChange={this.handleChange('yearexp')}
                                            margin="normal"
                                            disabled={billing}
                                            id="billexpmonth"
                                            label="Year of Expiration"
                                            // defaultValue='Expiry Year'
                                            value={yearexp}
                                        />
                                        {this.state.response}

                                        <Button
                                            fullWidth
                                            variant="contained"
                                            color="primary"
                                            className={classes.submit}
                                            onClick={billing ? this.changeBill : this.updatePay}
                                        >
                                            {billing ? "Edit" : "Submit"}
                                        </Button>


                                    </form>
                                </ExpansionPanelDetails>
                            </ExpansionPanel>
                        </div>
                        <div className={classes.paper} >

                            {this.check() ? <Container>
                                    <Typography component="h1" variant="h5" className={classes.divide}>
                                        Client List
                                    </Typography>
                                    <Grid container direction="row" alignItems="flex-end" spacing={1} >
                                        <Grid item>
                                            <Button onClick={this.addClient} variant="contained" color="primary" component="span" style={{height: '10vh'}}  aria-label="menu">
                                                Add
                                            </Button>
                                        </Grid>
                                        <Grid item>
                                            <TextField
                                                variant="outlined"
                                                margin="normal"
                                                id="merchantEmail"
                                                label="Merchant Email"
                                                name="merchantEmail"
                                                onChange={this.handleChange('merchantEmail')}
                                            />
                                        </Grid>
                                    </Grid>


                                    <Typography style={{margin: 25, color: '#B3B3B3B3'}}>
                                        {emailMessage}
                                    </Typography>
                                    <TableContainer component={Paper}>
                                        <Table className={classes.table} size="medium" aria-label="a dense table" >
                                            <TableHead>
                                                <TableRow>
                                                    <TableCell>Id</TableCell>
                                                    <TableCell align="right">Company Name</TableCell>
                                                    <TableCell align="right">Email</TableCell>
                                                    <TableCell align="right">Address</TableCell>
                                                    <TableCell align="right">City</TableCell>
                                                    <TableCell align="right">State</TableCell>
                                                    <TableCell align="right">Zip</TableCell>
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
                                                        <TableCell align="right">{row.address}</TableCell>
                                                        <TableCell align="right">{row.city}</TableCell>
                                                        <TableCell align="right">{row.state}</TableCell>
                                                        <TableCell align="right">{row.zip}</TableCell>
                                                    </TableRow>
                                                ))}
                                            </TableBody>
                                        </Table>
                                    </TableContainer>
                                </Container> :
                                <Container>
                                </Container>}


                            <Grid/>

                        </div>
                    </Container>

                </React.Fragment>


            );
        }



    }


}

Profile.propTypes = {
    classes: PropTypes.object.isRequired
};

export default withStyles(styles)(Profile);
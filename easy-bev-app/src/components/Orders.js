import React from 'react';
import CssBaseline from '@material-ui/core/CssBaseline';
import Grid from '@material-ui/core/Grid';
import Typography from '@material-ui/core/Typography';
import Container from '@material-ui/core/Container';
import Nav from "./Nav";
import withStyles from "@material-ui/core/styles/withStyles";
import ExpansionPanel from '@material-ui/core/ExpansionPanel';
import ExpansionPanelSummary from '@material-ui/core/ExpansionPanelSummary';
import ExpansionPanelDetails from '@material-ui/core/ExpansionPanelDetails';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableContainer from '@material-ui/core/TableContainer';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import FormControl from "@material-ui/core/FormControl";
import InputLabel from "@material-ui/core/InputLabel";
import Select from "@material-ui/core/Select";
import {Helmet} from "react-helmet";

const SimpleExpansionPanel  = (props) => {


    return (
        <React.Fragment>

        <div >
            <ExpansionPanel>
                <ExpansionPanelSummary
                    expandIcon={<ExpandMoreIcon/>}
                    aria-controls="panel1a-content"
                    id="panel1a-header"
                >
                    <Typography>ID : {props.children.id} Order Date : {props.children.timestamp} Total Price :  $ {props.children.price} </Typography>
                </ExpansionPanelSummary>
                <ExpansionPanelDetails>
                    <Typography>

                        <TableContainer>
                            <Table size="small" aria-label="a dense table">
                                <TableHead>
                                    <TableRow>
                                        <TableCell>Name</TableCell>
                                        <TableCell align="right">Price</TableCell>
                                        <TableCell align="right">Quantity</TableCell>
                                    </TableRow>
                                </TableHead>
                                <TableBody>
                                    {
                                        props.children.items.map((row) => (

                                            <TableRow key={row.name}>
                                                <TableCell component="th" scope="row">
                                                    {row.name}
                                                </TableCell>
                                                <TableCell align="right">{row.price*row.oqty}</TableCell>
                                                <TableCell align="right">{row.oqty}</TableCell>
                                            </TableRow>
                                        ))}
                                </TableBody>
                            </Table>
                        </TableContainer>



                    </Typography>
                </ExpansionPanelDetails>
            </ExpansionPanel>


        </div>
        </React.Fragment>
    );
}




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
    toolbar: {
        flexWrap: 'wrap',
    },
    toolbarTitle: {
        flexGrow: 1,
    },
    link: {
        margin: theme.spacing(1, 1.5),
    },
    heroContent: {
        padding: theme.spacing(8, 0, 6),
    },
    cardHeader: {
        backgroundColor:
            theme.palette.type === 'dark' ? theme.palette.grey[700] : theme.palette.grey[200],
    },
    cardPricing: {
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'baseline',
        marginBottom: theme.spacing(2),
    },
    footer: {
        borderTop: `1px solid ${theme.palette.divider}`,
        marginTop: theme.spacing(8),
        paddingTop: theme.spacing(3),
        paddingBottom: theme.spacing(3),
        [theme.breakpoints.up('sm')]: {
            paddingTop: theme.spacing(6),
            paddingBottom: theme.spacing(6),
        },
    },
});





class Orders extends React.Component{
    constructor() {
        super();
        this.orderValues = null;
        this.state = {orders: [], type:'distributors', curItem: 'none', clients: []}
    }

    componentDidMount () {
        console.log("Component did mount");
        const api = this.getOrders();
        this.setState({type:localStorage.getItem("typeUser") });
        console.log('api done');
    }

    async getOrders() {
        try {
            fetch("/api/get_orders", {
                method: "post",
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json'
                },

                //make sure to serialize your JSON body
                body: JSON.stringify({})
            }).then( response => response.json())
                .then(json => {
                        console.log(json)
                        if ('error' in json) {
                            return;
                        }
                        if (this.state.type === 'distributors') {
                            this.setState({clients: json.body.merchants})
                        } else {
                            let ord = [];
                            for (let i = 0; i< json.body.length; i++) {
                                ord.push({id: json.body[i].id, price: json.body[i].price, timestamp: json.body[i].timestamp, items: JSON.parse(json.body[i].order_json)})
                            }
                            this.setState({orders: ord});
                        }
                    }
                );
        } catch(error) {
            console.error(error);
        }
    }

    changeClient = (event) => {
        this.setState({curItem: event.target.value});

        let curClient = -1;
        for (let i = 0; i < this.state.clients.length; i++) {
            if(event.target.value === this.state.clients[i].name) {
                curClient = i;
                break;
            }
        }
        let ord = [];
        console.log(curClient);
        if (curClient !== -1) {
            for (let i = 0; i< this.state.clients[curClient].orders.length; i++) {
                ord.push({id: this.state.clients[curClient].orders[i].id, price: this.state.clients[curClient].orders[i].price,
                    timestamp: this.state.clients[curClient].orders[i].timestamp, items: JSON.parse(this.state.clients[curClient].orders[i].order_json)})
            }
            this.setState({orders: ord});
        }


    }


    render() {

        return (
            <React.Fragment>
                <CssBaseline/>
                <Nav/>
                <Helmet>
                    <meta name="viewport" content="height=device-height, initial-scale=1.0, maximum-scale=1.0"/>

                </Helmet>

                <Container style={{marginTop: "50px", height: "100vh"}} maxWidth="md" component="main">
                    <h1>Orders</h1>
                    {this.state.type === 'distributors' ? <div style={{marginBottom: "50px"}}>
                        <FormControl >
                            <h3>Merchant Name</h3>
                        <Select
                            native
                            value={this.state.curItem}
                            onChange={this.changeClient}
                            inputProps={{
                                name: 'age',
                                id: 'age-native-simple',
                            }}
                        >
                            <option aria-label="None" value="" />
                            {this.state.clients.map(function(item) {
                                return <option value={item.name}>{item.name}</option>;
                            })}
                        </Select>
                    </FormControl>
                    </div> : ''}
                    <Grid container spacing={5} alignItems="center" justify="flex-start">

                        <Grid item style={{width: "1000px"}}>
                            <ul>

                                {this.state.orders.map(function(item) {
                                    return<li><SimpleExpansionPanel  children={item}/></li>;
                                })}



                            </ul>


                        </Grid>
                    </Grid>
                </Container>

                <Container maxWidth="md" component="footer" >
                    <Grid container spacing={4} justify="space-evenly">

                    </Grid>
                </Container>


            </React.Fragment>
        );
    }
}
export default withStyles(styles)(Orders);
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

const SimpleExpansionPanel  = (props) => {


    return (
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


// MICHAEL: FOR /orders I want a list of information, order quantity and UPC value to display
// in the order list on the front-end. GET request for all orders for the current signed in
// user.


class Orders extends React.Component{
    constructor() {
        super();
        this.orderValues = null;
        this.state = {orders: []}
    }

    componentDidMount () {
        console.log("Component did mount");
        const api = this.getOrders();
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
                        let ord = [];
                        for (let i = 0; i< json.body.length; i++) {
                            ord.push({id: json.body[i].id, price: json.body[i].price, timestamp: json.body[i].timestamp, items: JSON.parse(json.body[i].order_json)})
                        }
                        this.setState({orders: ord});
                        console.log(ord);
                    }
                );
        } catch(error) {
            console.error(error);
        }
    }



    render() {

        return (
            <React.Fragment>
                <CssBaseline/>
                <Nav/>

                <Container style={{marginTop: "50px", height: "100vh"}} maxWidth="md" component="main">
                    <h1>Orders</h1>
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
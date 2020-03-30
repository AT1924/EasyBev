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

const SimpleExpansionPanel  = (props) => {


    return (
        <div >
            <ExpansionPanel>
                <ExpansionPanelSummary
                    expandIcon={<ExpandMoreIcon/>}
                    aria-controls="panel1a-content"
                    id="panel1a-header"
                >
                    <Typography>{props.children}</Typography>
                </ExpansionPanelSummary>
                <ExpansionPanelDetails>
                    <Typography>
                        Lorem ipsum dolor sit amet, consectetur adipiscing elit. Suspendisse malesuada lacus ex,
                        sit amet blandit leo lobortis eget.
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
    }



    render() {

        return (
            <React.Fragment>
                <CssBaseline/>
                <Nav/>

                <Container style={{marginTop: "100px"}} maxWidth="md" component="main">
                    <Grid container spacing={5} alignItems="center">
                        <Grid item>
                            <ul>

                                {['a', 'b', 'c'].map(function(item) {
                                    return<li><SimpleExpansionPanel children={item}/></li>;
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
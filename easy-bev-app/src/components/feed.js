import React from 'react';
import CssBaseline from '@material-ui/core/CssBaseline';
import Grid from '@material-ui/core/Grid';
import Typography from '@material-ui/core/Typography';
import Container from '@material-ui/core/Container';
import Nav from "./Nav";
import withStyles from "@material-ui/core/styles/withStyles";
import {makeStyles, MuiThemeProvider} from '@material-ui/core/styles';
import { createMuiTheme } from '@material-ui/core/styles';
import Paper from '@material-ui/core/Paper';
import { BrowserView, MobileView, isBrowser, isMobile } from "react-device-detect";
import ButtonBase from '@material-ui/core/ButtonBase';
import image1 from './logo.png';
import Modal from "@material-ui/core/Modal";
import grey from '@material-ui/core/colors/grey';
import {Helmet} from "react-helmet";

const titleColor = grey[700];

let useStyles = makeStyles((theme) => ({
    root: {
        flexGrow: 1,
        margin: 15,
        width: '100%',
    },
    paper: {
        padding: theme.spacing(2),
        margin: 'auto',
        maxWidth: '1000px',
        width: '800px',
    },
    image: {
        width: 128,
        height: 128,
    },
    img: {
        margin: 'auto',
        display: 'block',
        maxWidth: '100%',
        maxHeight: '100%',
    },
}));

if (isMobile){
    useStyles = makeStyles((theme) => ({
        root: {
            flexGrow: 1,
            margin: 15,
            width: '100%',
        },
        paper: {
            padding: theme.spacing(2),
            margin: 'auto',
            maxWidth: '100vw',
            width: '80vw',
        },
        image: {
            width: 128,
            height: 128,
        },
        img: {
            margin: 'auto',
            display: 'block',
            maxWidth: '100%',
            maxHeight: '100%',
        },
    }));
}


const adds = [["2 for 1", 'All beer and wine is available in the offer!', 'Expires: 10/42/21', 'Up to $100'],
               ["Buy 1 get 1 50% off!", 'All beer and wine is available in the offer!', 'Expires: 3/02/21', 'Up to $500'],
            ["5 for 2", 'All beer and wine is available in the offer!', 'Expires: 10/42/21', 'Up to $1000']];

const Ad  = (props) => {

    const classes = useStyles();
    console.log("children props", props.children);
    return (
        <div className={classes.root}>
            <Paper className={classes.paper}>
                <Grid container spacing={2}>
                    <Grid item>
                        <ButtonBase className={classes.image}>
                            <img className={classes.img} alt="complex" src={image1} />
                        </ButtonBase>
                    </Grid>
                    <Grid item xs={12} sm container>
                        <Grid item xs container direction="column" spacing={2}>
                            <Grid item xs>
                                <Typography gutterBottom variant="subtitle1">
                                    Title: {props.children.title}
                                </Typography>
                                <Typography variant="body2" gutterBottom>
                                    Description: {props.children.description}
                                </Typography>
                                <Typography variant="body2" color="textSecondary">
                                    Price: {props.children.price}
                                </Typography>
                                <Typography variant="body2" color="textSecondary">
                                    Expiry Date: {props.children.expiry}
                                </Typography>
                                {
                                    props.children.promotionItems.map((row) => (
                                        <Typography variant="body2" color="textSecondary">
                                            Promo Item: {row.name}
                                        </Typography>
                                    ))}
                            </Grid>
                        </Grid>
                        <Grid item>
                            <Typography variant="subtitle1">
                                {props.children[3]}
                            </Typography>
                        </Grid>
                    </Grid>
                </Grid>
            </Paper>
        </div>
    );
};




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

const sleep = require('util').promisify(setTimeout);

const blues = createMuiTheme({
    palette: {
        primary: { main: '#616161' },
        secondary: { main: '#2979ff' },
        contrastText: '#fff'
    }
})



class Feed extends React.Component{
    constructor() {
        super();
        this.orderValues = null;
        this.state = {open: false};
        this.state.promotions = [];

    }

    componentDidMount() {
        this.getPromotions = this.getPromotions.bind(this);
        this.getPromotions()
        setInterval( this.getPromotions, 10000 );

        //this.getPromotions();
        this.setState({fromType:localStorage.getItem("typeUser") });
    }

    async getItems() {
        try {
            fetch("/api/get_items", {
                method: "post",
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json'
                },

                //make sure to serialize your JSON body
                body: JSON.stringify({})
            }).then( response => response.json())
                .then(json => {

                        //console.log(json);
                        //this.setState({inventory: json.body.items});
                    }
                );
        } catch(error) {
            console.error(error);
        }
        console.log("WAITING");


    }


    async getPromotions() {
        try {
            fetch("/api/get_feeds", {
                method: "post",
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json'
                },

                //make sure to serialize your JSON body
                body: JSON.stringify({})
            }).then( response => response.json())
                .then(json => {
                        console.log("received", json)
                        // title, description promotion price, expirydate, items
                        if (json.error){
                            this.setState({promotions: {}});
                        }
                        this.setState({promotions: json.body});
                    }
                );
        } catch(error) {
            console.error(error);
        }

    }



    handleOpen = () => {
        if (this.state.open) {
            return
        } else {
            this.setState({open: true})
        }
    }

    handleClose = () => {
        if (this.state.open) {
            this.setState({open: false})
        } else {
            return
        }
    }


    render() {

        return (
            <React.Fragment>

                <Helmet>
                    <meta name="viewport" content="height=device-height, initial-scale=1.0, maximum-scale=1.0"/>

                </Helmet>
                <MuiThemeProvider theme={blues}/>

                <CssBaseline/>
                <Nav/>



                <Container maxWidth="md" component="main">
                    <Grid container spacing={5} justify="center" alignItems="center">
                        <Typography align="center"  variant="overline" style={{marginTop: '5vh', marginLeft:'2vw', fontSize: "225%"}}>
                            Promotions
                        </Typography>
                        <Grid item>
                            <ul>
                                {this.state.promotions.map(function(item) {
                                    console.log("promotion item", item);
                                    return<li><Ad children={item}/></li>;
                                })}

                            </ul>


                        </Grid>
                    </Grid>
                    <div style={{height: "10vh"}}></div>
                </Container>

                <Container maxWidth="md" component="footer" >
                    <Grid container spacing={4} justify="space-evenly">

                    </Grid>
                </Container>


            </React.Fragment>
        );
    }
}
export default withStyles(styles)(Feed);
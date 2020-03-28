import React from 'react';
import CssBaseline from '@material-ui/core/CssBaseline';
import Grid from '@material-ui/core/Grid';
import Typography from '@material-ui/core/Typography';
import Container from '@material-ui/core/Container';
import Nav from "./Nav";
import withStyles from "@material-ui/core/styles/withStyles";
import { makeStyles } from '@material-ui/core/styles';
import Paper from '@material-ui/core/Paper';
import ButtonBase from '@material-ui/core/ButtonBase';
import image1 from './logo.png';

const useStyles = makeStyles((theme) => ({
    root: {
        flexGrow: 1,
        margin: 15,
        width: '100%',
    },
    paper: {
        padding: theme.spacing(2),
        margin: 'auto',
        maxWidth: 1000,
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

const adds = [["2 for 1", 'All beer and wine is available in the offer!', 'Expires: 10/42/21', 'Up to $100'],
               ["Buy 1 get 1 50% off!", 'All beer and wine is available in the offer!', 'Expires: 3/02/21', 'Up to $500'],
            ["5 for 2", 'All beer and wine is available in the offer!', 'Expires: 10/42/21', 'Up to $1000']];

const Ad  = (props) => {
    const classes = useStyles();
    console.log(props.children[0]);
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
                                    {props.children[0]}
                                </Typography>
                                <Typography variant="body2" gutterBottom>
                                    {props.children[1]}
                                </Typography>
                                <Typography variant="body2" color="textSecondary">
                                    {props.children[2]}
                                </Typography>
                            </Grid>
                            <Grid item>
                                <Typography variant="body2" style={{ cursor: 'pointer' }}>
                                    Remove
                                </Typography>
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


class Feed extends React.Component{
    constructor() {
        super();
        this.orderValues = null;
    }

    render() {

        return (
            <React.Fragment>
                <CssBaseline/>
                <Nav/>

                <Container maxWidth="md" component="main">
                    <Grid container spacing={5} alignItems="center">
                        <Grid item>
                            <ul>
                                {adds.map(function(item) {
                                    return<li><Ad children={item}/></li>;
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
export default withStyles(styles)(Feed);
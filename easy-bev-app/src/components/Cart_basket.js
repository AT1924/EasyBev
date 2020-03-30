import React from "react";
import Card from '@material-ui/core/Card';
import CardActions from '@material-ui/core/CardActions';
import CardContent from '@material-ui/core/CardContent';
import Button from '@material-ui/core/Button';
import Grid from '@material-ui/core/Grid';
import withStyles from "@material-ui/core/styles/withStyles";
import Typography from '@material-ui/core/Typography';
import CartTable from "./CartTable";


const styles = theme =>({
    root: {
        minWidth: 275,
    },
    bullet: {
        display: 'inline-block',
        margin: '0 2px',
        transform: 'scale(0.8)',
    },
    title: {
        fontSize: 14,
    },
    pos: {
        marginBottom: 12,
    },
});


class Cart_basket extends React.Component{
    constructor(props) {
        super(props);
        this.state = {
            children : []
        };

    }

    createData(name, price) {
        return { name, price};
    }


    render() {

        return (
            <React.Fragment>
                <Card className={styles.root} variant="outlined">
                    <CardContent>
                        <Typography className={styles.title} variant="h5" component="h2">
                            This is Your Cart
                        </Typography>
                        <Typography className={styles.pos} color="textSecondary">
                            Your items are listed below
                        </Typography>

                        <Grid container>
                            {console.log("logger", this.props.children)}
                            <CartTable children={this.props.children}/>
                        </Grid>

                    </CardContent>

                    <CardActions>
                        <Button
                            variant="outlined"
                            color="primary"
                            style={{ textTransform: 'none' }}
                        >
                            Payment
                        </Button>
                    </CardActions>
                </Card>
            </React.Fragment>
        );
    }
}

export default withStyles(styles)(Cart_basket);
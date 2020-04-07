import React from 'react';
import TextField from '@material-ui/core/TextField';
import Autocomplete from '@material-ui/lab/Autocomplete';
import { makeStyles } from '@material-ui/core/styles';
import Card from '@material-ui/core/Card';
import CardActions from '@material-ui/core/CardActions';
import CardContent from '@material-ui/core/CardContent';
import Button from '@material-ui/core/Button';
import Typography from '@material-ui/core/Typography';
import withStyles from "@material-ui/core/styles/withStyles";
import Grid from "./Cart";

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


class Cart_Search extends React.Component{
    constructor(props) {
        super(props);
        this.state = {
            tags: [],
            inventory: [],
            currItem: null,
        };

        this.getChoice = this.getChoice.bind(this);

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
            })
                .then( (response) => {
                    console.log(response.json());
                });
        } catch(error) {
            console.error(error);
        }
    }


    // async getItems() {
    //     try {
    //         fetch("/api/get_items", {
    //             method: "post",
    //             headers: {
    //                 'Accept': 'application/json',
    //                 'Content-Type': 'application/json'
    //             },
    //
    //             //make sure to serialize your JSON body
    //             body: JSON.stringify({})
    //         })
    //             .then( (response) => {
    //                 console.log(response.json());
    //                 return response.json();
    //             });
    //     } catch(error) {
    //         console.error(error);
    //     }
    // }

    getChoice = (event, value) => {


        this.setState({
            currItem: Object.values(value)
        }, () => {
            // This will output an array of objects
            // given by Autocompelte options property.

        });
    }


    getChoiceSecond = (value) => {
        console.log("here");
        this.props.callback(this.state.currItem);

    }





    render() {
        //const info = this.getItems();
        //console.log(info);
        return (
            <React.Fragment>
                <Grid container id="topContainer" direction="row" justify="space-around" >
                <Autocomplete
                    id="search_bar"
                    options={this.props.children}
                    getOptionLabel={(option) => option.name}
                    style={{ width: 400 }}
                    onChange={this.getChoice}
                    renderInput={(params) => <TextField {...params} label="Please select item" variant="outlined" />}
                />

                <Card className={styles.root} variant="outlined">
                    <CardContent>
                        <Typography className={styles.title} color="textSecondary" gutterBottom>
                            Item UPC : {this.state.currItem != null ? this.state.currItem[0]:""}
                        </Typography>
                        <Typography className={styles.title} color="textSecondary" gutterBottom>
                            Item Name : {this.state.currItem != null ? this.state.currItem[1]:""}
                        </Typography>
                        <Typography className={styles.title} color="textSecondary" gutterBottom>
                            Item Size : {this.state.currItem != null ? this.state.currItem[2]:""}
                        </Typography>
                        <Typography className={styles.title} color="textSecondary" gutterBottom>
                            Item Quantity : {this.state.currItem != null ? this.state.currItem[3]:""}
                        </Typography>
                        <Typography className={styles.title} color="textSecondary" gutterBottom>
                            Item Price : {this.state.currItem != null ? this.state.currItem[4]:""}
                        </Typography>
                    </CardContent>
                    <CardActions>
                        <Button variant="outlined" onClick={this.getChoiceSecond} size="small">Submit To Cart</Button>
                    </CardActions>
                </Card>
                </Grid>


            </React.Fragment>
        );
    }
}


// const inventory = [
//     { name: 'WhiteClaw 6 Pack', price: 14.99 },
//     { name: 'Svedka 14 Count', price: 109.99 },
//     { name: 'Smirnoff Blue Raspberry 2 Count', price: 21.99 },
//     { name: 'BudLight 3 Count Keg', price: 250.00 },
//     { name: 'Mikes Hard Lemonade 6 Count', price: 10.89 },
// ];


const style = {
    search_bar: {
        width: "50%",
    },

}



export default withStyles(styles)(Cart_Search);
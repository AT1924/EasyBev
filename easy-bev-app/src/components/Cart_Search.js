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
import Grid from '@material-ui/core/Grid';
import FormControl from "@material-ui/core/FormControl";
import Select from "@material-ui/core/Select";
import InputLabel from "@material-ui/core/InputLabel";
import MenuItem from "@material-ui/core/MenuItem";
import InputBase from "@material-ui/core/InputBase";
import Radio from "@material-ui/core/Radio";
import BarcodeScanner from './BarcodeScanner';
import FormControlLabel from "@material-ui/core/FormControlLabel";

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
    margin: {
        margin: theme.spacing(1),
    },
});

const BootstrapInput = withStyles((theme) => ({
    root: {
        'label + &': {
            marginTop: theme.spacing(3),
        },
    },
    input: {
        borderRadius: 4,
        position: 'relative',
        backgroundColor: theme.palette.background.paper,
        border: '1px solid #ced4da',
        fontSize: 16,
        padding: '10px 26px 10px 12px',
        transition: theme.transitions.create(['border-color', 'box-shadow']),
        // Use the system font instead of the default Roboto font.
        fontFamily: [
            '-apple-system',
            'BlinkMacSystemFont',
            '"Segoe UI"',
            'Roboto',
            '"Helvetica Neue"',
            'Arial',
            'sans-serif',
            '"Apple Color Emoji"',
            '"Segoe UI Emoji"',
            '"Segoe UI Symbol"',
        ].join(','),
        '&:focus': {
            borderRadius: 4,
            borderColor: '#80bdff',
            boxShadow: '0 0 0 0.2rem rgba(0,123,255,.25)',
        },
    },
}))(InputBase);


class Cart_Search extends React.Component{
    constructor(props) {
        super(props);
        this.state = {
            tags: [],
            inventory: [],
            currItem: null,
            orderq: 1,
            searchOpt: 'type',
            error: '',
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


    getChoice = (event, value) => {
        if (value !== null) {
            console.log(value);
            this.setState({
                currItem: value
            }, () => {
                // This will output an array of objects
                // given by Autocompelte options property.

            });
        }
    };


    getChoiceSecond =  (value) => {
        this.setState({orderq:1});
        this.props.callback(this.state.currItem, this.state.orderq);

    };

    changeQ = () => (event) => {
        this.setState({orderq: event.target.value})
    };

    changeSearch = (event) => {
        this.setState({searchOpt: event.target.value})
    }

    checkSearch = () => {
        if(this.state.searchOpt === 'type') {
            return true;
        } else {
            return false;
        }
    }

    callback = (result) => {
        let convert = parseInt(result);
        let match = -1;
        console.log(this.props.children[0]);
        for (let i = 0; i < this.props.children.length; i++) {
            if (this.props.children[i].upc === convert) {
                match = i
                break;
            }
        }
        if (match === -1) {
            this.setState({error: "UPC not in system."})
        } else {
            this.setState({currItem: this.props.children[match]})
        }

    }





    render() {
        //const info = this.getItems();
        //console.log(info);
        return (
            <React.Fragment>
                <Grid container id="topContainer" direction="row" justify="space-around" >

                    {this.checkSearch() ? <Autocomplete
                            id="search_bar"
                            options={this.props.children}
                            getOptionLabel={(option) => option.name}
                            style={{ width: 400 }}
                            onChange={this.getChoice}
                            renderInput={(params) => <TextField {...params} label="Please select item" variant="outlined" />}
                        />  :
                        <BarcodeScanner callback={this.callback} ></BarcodeScanner>}
                    {this.state.error}


                    <Radio
                        checked={this.state.searchOpt === 'type'}
                        onChange={this.changeSearch}
                        value="type"
                        inputProps={{ 'aria-label': 'Type' }}
                        label="Type to Search"
                        labelPlacement="bottom"
                    />
                    <Radio
                        checked={this.state.searchOpt === 'scan'}
                        onChange={this.changeSearch}
                        value="scan"
                        inputProps={{ 'aria-label': 'Type' }}
                        label="Scan to Search"
                        labelPlacement="bottom"
                    />

                <Card className={styles.root} variant="outlined">
                    <CardContent>
                        <Typography className={styles.title} color="textSecondary" gutterBottom>
                            UPC : {this.state.currItem != null ? this.state.currItem.upc:""}
                        </Typography>
                        <Typography className={styles.title} color="textSecondary" gutterBottom>
                            Description : {this.state.currItem != null ? this.state.currItem.name:""}
                        </Typography>
                        <Typography className={styles.title} color="textSecondary" gutterBottom>
                            Unit Volume : {this.state.currItem != null ? this.state.currItem.size:""}
                        </Typography>
                        <Typography className={styles.title} color="textSecondary" gutterBottom>
                            Quantity/Unit : {this.state.currItem != null ? this.state.currItem.qty:""}
                        </Typography>
                        <Typography className={styles.title} color="textSecondary" gutterBottom>
                            Unit Price : {this.state.currItem != null ? this.state.currItem.price:""}
                        </Typography>
                        <FormControl className={styles.margin}>
                            Order Quantity :
                            <Select
                                labelId="demo-customized-select-label"
                                id="demo-customized-select"
                                value={this.state.orderq}
                                onChange={this.changeQ()}
                                input={<BootstrapInput />}
                            >
                                <MenuItem value={1}>1</MenuItem>
                                <MenuItem value={2}>2</MenuItem>
                                <MenuItem value={3}>3</MenuItem>
                                <MenuItem value={4}>4</MenuItem>
                                <MenuItem value={5}>5</MenuItem>
                                <MenuItem value={6}>6</MenuItem>
                                <MenuItem value={7}>7</MenuItem>
                                <MenuItem value={8}>8</MenuItem>
                                <MenuItem value={9}>9</MenuItem>
                                <MenuItem value={10}>10</MenuItem>
                            </Select>
                        </FormControl>
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
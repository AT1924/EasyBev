import Dynamsoft from "../Dynamsoft";
import React from 'react';
import BarcodeScanner from './BarcodeScanner';
import Button from "@material-ui/core/Button";
import Cart_Search from './Cart_Search';
import Nav from "./Nav";
import CssBaseline from '@material-ui/core/CssBaseline';
import Cart_basket from './Cart_basket';
import Container from '@material-ui/core/Container';
import Grid from '@material-ui/core/Grid';
import CartItem_Details from "./CartItem_Details"
import { sizing } from '@material-ui/system';
import CardContent from "@material-ui/core/CardContent";
import Typography from "@material-ui/core/Typography";
import CartTable from "./CartTable";
import CardActions from "@material-ui/core/CardActions";
import Card from "@material-ui/core/Card";

const inventory = [
    { upc: 8256607 , name: 'AMERICAN ANTHEM VODKA 10/12PKS, 50ML', size: 50, qty: 10, price: 100.00},
    { upc: 8257606, name: 'CIROC VS, LTR', size: 1000, qty: 12, price: 100.00},
    { upc: 8262802, name: 'BULLEIT RYE, 200', size: 200, qty: 48, price: 100.00},
    { upc: 8776509, name: 'SEAGRAMS SEVEN CROWN 12/CS, 375', size: 375, qty: 12, price: 100.00},
    { upc: 8260901, name: 'CIROC BLACK RASPBERRY 4/15PK, 50ML', size: 50, qty:4, price: 100.00},
];

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


class Cart extends React.Component {
    constructor(props){
        super(props);
        this.reader = null;
        this.refDivMessage = React.createRef();
        this.state = {
            messageKeyBase: 0,
            messages: [],
            bShowScanner: false,
            cartListData: [],
            currItem: null,
            inventory: [],
            response: '',
            total: 0,
        };
    }

    componentDidMount() {
        this.getItems();
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
                        console.log(json);
                    this.setState({inventory: json.body.items});
                    }
                );
        } catch(error) {
            console.error(error);
        }
    }

    makeOrder = async e => {
        e.preventDefault();
        console.log("Sending order");
        const response = await fetch('/api/make_order', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },

            body: JSON.stringify({body:this.state.cartListData }),
        });
        const body = await response.json();
        console.log(body);
        if (body.error) {
            console.log(body);
            this.setState({ errorMsg: body.error});

            return false;
        }
        else if (!(body.error)){
            this.setState({ cartListData: [],
            response: "Order Successful"});
        }
        else {
            console.log(body);
        }

        return false;
    };


    populateCart = (searchData, qty) => {

        if (searchData != null) {
            if (searchData.length === 7) {
                searchData.push(qty);
            } else {
                searchData[7] = qty;
            }
            console.log(searchData);
            this.setState(state => {
                //let values = Object.values(searchData);
                //let item = [values[0], values[1]];
                //state.currItem = Object.values(searchData);
                state.cartListData.push(Object.values(searchData));
                return state
            });

            // here use search data to get all the information regarding the item


        }


    };


render() {

        return (
            <React.Fragment>
                <CssBaseline />
                <Nav/>

                <Grid id="contained" container spacing={10} direction="column" justify="space-between">


                        <Grid item >
                            <Cart_Search  children={this.state.inventory} callback={this.populateCart}/>
                        </Grid>

                    <Grid item>

                        {/*<Cart_basket children={this.state.cartListData} />*/}
                        <Card className={styles.root} variant="outlined">
                            <CardContent>
                                <Typography className={styles.title} variant="h5" component="h2">
                                    This is Your Cart
                                </Typography>
                                <Typography className={styles.pos} color="textSecondary">
                                    Your items are listed below
                                </Typography>

                                <Grid container>
                                    <CartTable children={this.state.cartListData}/>
                                    <Typography>
                                        Total : {this.state.total}
                                    </Typography>
                                </Grid>

                            </CardContent>

                            <CardActions>
                                <Button
                                    variant="outlined"
                                    color="primary"
                                    style={{ textTransform: 'none' }}
                                    onClick={this.makeOrder}
                                >
                                    Payment
                                </Button>
                            </CardActions>
                            {this.state.response}
                        </Card>

                    </Grid>
                </Grid>

                <div id = "cart" style={style.cart}>








                    {/*{ !this.state.bShowScanner ? (*/}
                    {/*    <Button onClick={this.showScanner} variant="contained">Default</Button>*/}


                    {/*    ) : (*/}
                    {/*    <div style={style.cameraViewContainer}>*/}
                    {/*        <button id = "scan" onClick={this.hideScanner}>Cancel</button>*/}

                    {/*        <BarcodeScanner appendMessage={this.appendMessage}></BarcodeScanner>*/}
                    {/*    </div>*/}
                    {/*) }*/}

                    {/*<div className="div-message" style={style.div_message} ref={this.refDivMessage}>*/}
                    {/*    { this.state.messages.map((message, index) =>*/}
                    {/*        <p key={ this.state.messageKeyBase + index }>*/}
                    {/*            { message }*/}
                    {/*        </p>*/}
                    {/*    ) }*/}
                    {/*</div>*/}

                </div>
            </React.Fragment>
        );
    }
    appendMessage = str => {
        this.setState(state=>{
            state.messages.push(str);
            if(state.messages.length > 500){
                ++state.messageKeyBase;
                state.messages.splice(0, 1);
            }
            return state;
        });
    }
    onIptChange = event=>{
        // React can't get event.target in async func by default.
        // Thus get event.target in sync part.
        let input = event.target;

        (async ()=>{
            try{
                this.appendMessage("======== start read... ========");
                let reader = this.reader = this.reader || await Dynamsoft.BarcodeReader.createInstance();
                let files = input.files;
                for(let i = 0; i < files.length; ++i){
                    let file = files[i];
                    this.appendMessage(file.name + ':')
                    let results = await reader.decode(file);
                    for(let result of results){
                        this.appendMessage(result.barcodeText);
                    }
                }
                input.value = "";
                this.appendMessage("======== finish read ========");
            }catch(ex){
                this.appendMessage(ex.message);
                console.error(ex);
            }
        })();
    }
    showScanner = ()=>{
        this.setState({
            bShowScanner: true
        });
    }
    hideScanner = ()=>{
        this.setState({
            bShowScanner: false
        });
    }
}

const style = {
    contained: {
        height: "100vh",
    },
    div_message: {
        maxHeight: "200px",
        overflowY: "auto",
        resize: "both"
    },
    cart:{
        width:"100%",
        position:"relative",
        top:"25%",
    },
    cameraViewContainer:{
        position:"absolute",
        width:"100%",
        height:"100%",
    },
    cart_search:{
        width:"100%",
    }


};

export default Cart;

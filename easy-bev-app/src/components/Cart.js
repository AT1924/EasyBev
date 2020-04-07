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

const inventory = [
    { upc: 8256607 , name: 'AMERICAN ANTHEM VODKA 10/12PKS, 50ML', size: 50, qty: 10, price: 100.00},
    { upc: 8257606, name: 'CIROC VS, LTR', size: 1000, qty: 12, price: 100.00},
    { upc: 8262802, name: 'BULLEIT RYE, 200', size: 200, qty: 48, price: 100.00},
    { upc: 8776509, name: 'SEAGRAMS SEVEN CROWN 12/CS, 375', size: 375, qty: 12, price: 100.00},
    { upc: 8260901, name: 'CIROC BLACK RASPBERRY 4/15PK, 50ML', size: 50, qty:4, price: 100.00},
];



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
            currItem: null
        };

    }


    populateCart = (searchData) => {
        if (searchData != null) {
            this.setState(state => {
                //let values = Object.values(searchData);
                //let item = [values[0], values[1]];
                //state.currItem = Object.values(searchData);
                state.cartListData.push(Object.values(searchData));

                return state;
            });

            // here use search data to get all the information regarding the item


        }


    };


    // populateCartSecond = (searchData) => {
    //     if (searchData != null) {
    //         this.setState(state => {
    //             //let values = Object.values(searchData);
    //             //let item = [values[0], values[1]];
    //             state.cartListData.push(Object.values(searchData));
    //
    //             return state;
    //         });
    //
    //         // here use search data to get all the information regarding the item
    //
    //
    //     }
    //
    //
    // };





render() {

        return (
            <React.Fragment>
                <CssBaseline />
                <Nav/>

                <Grid id="contained" container spacing={10} direction="column" justify="space-between">


                        <Grid item >
                            <Cart_Search style={style.cart_search} children={inventory} callback={this.populateCart}/>
                        </Grid>



                    <Grid item>

                        <Cart_basket children={this.state.cartListData} />

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

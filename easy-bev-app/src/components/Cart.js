import Dynamsoft from "../Dynamsoft";
import React from 'react';

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
import { BrowserView, MobileView, isBrowser, isMobile } from "react-device-detect";
import {Helmet} from "react-helmet";
import Card from "@material-ui/core/Card";
import Radio from '@material-ui/core/Radio';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogTitle from '@material-ui/core/DialogTitle';
import TextField from '@material-ui/core/TextField';



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
            open: false,
            messageKeyBase: 0,
            messages: [],
            bShowScanner: false,
            cartListData: [],
            currItem: null,
            inventory: [],
            Title: null,
            Description: null,
            PromotionPrice: 0,
            Month : null,
            Day : null,
            Year : null,
            response: '',
            total: 0,

        };

    }

    componentDidMount() {
        this.getItems();
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
        if (this.state.fromType === "merchants") {


            console.log(this.state.cartListData);
            console.log("Sending order");
            const response = await fetch('/api/make_order', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },

                body: JSON.stringify(this.state.cartListData),
            });
            const body = await response.json();
            console.log(body);
            if (body.error) {
                console.log(body);
                this.setState({errorMsg: body.error});

                return false;
            } else if (!(body.error)) {
                this.setState({
                    cartListData: [],
                    response: "Order Successful", total: 0
                });
            } else {
                console.log(body);
            }
        } else {
            // call this.handleclose
            let expiryDate = this.state.Month + "/" + this.state.Day + "/" + this.state.Year;
            const response = await fetch('/api/new_feed', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },


                body: JSON.stringify({title: this.state.Title, description: this.state.Description, price: this.state.PromotionPrice, expiry: expiryDate ,promotionItems: this.state.cartListData, }),
            });
            const body = await response.json();
            this.handleClose();
            console.log(body);
            if (body.error) {
                console.log(body);
                this.setState({errorMsg: body.error});

                return false;
            } else if (!(body.error)) {
                this.setState({
                    cartListData: [],
                    response: "Promotion Upload Successful", total: 0
                });
            } else {
                console.log(body);
            }
        }

        return false;
    };


    populateCart = (searchData, qty) => {

        if (searchData != null) {
            searchData['oqty'] = qty;
            this.setState(state => {
                //let values = Object.values(searchData);
                //let item = [values[0], values[1]];
                //state.currItem = Object.values(searchData);
                state.cartListData.push(searchData);
                return state
            });

            this.setState({total: this.state.total + searchData.price * searchData.oqty})

            // here use search data to get all the information regarding the item


        }


    };



    deleteItem = (i) => {
        console.log("here",i);

        let index = this.state.cartListData.findIndex(x => x.name === i.name);
        console.log(index);
        this.setState(state => {
            state.cartListData.splice(index, 1);
            return state
        });
        console.log("ending",this.state.cartListData);
    };


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


    handleChange = name => (event) => {
        this.setState({ [name]: event.target.value });
    };


render() {

       if (isMobile){
           return (

               <React.Fragment>
                   <Helmet>
                       <meta name="viewport" content="height=device-height, initial-scale=1.0, maximum-scale=1.0"/>

                   </Helmet>

                   <CssBaseline/>
                   <Nav/>
                   <div id="cartMobile" style={styleMobile.cartMobile}>
                       <Grid id="contained" container spacing={1} direction="column" justify="space-between">
                           <Grid item>
                               <Cart_Search children={this.state.inventory} callback={this.populateCart}/>

                           </Grid>

                           <Grid item>

                               {/*<Cart_basket children={this.state.cartListData} />*/}
                               <Card className={styles.root} variant="outlined" style={styleMobile.cartTableMobile}>
                                   <CardContent>
                                       <Typography className={styles.title} variant="h5" component="h2">
                                           This is Your Cart
                                       </Typography>
                                       <Typography className={styles.pos} color="textSecondary">
                                           Your items are listed below
                                       </Typography>


                                           <CartTable children={this.state.cartListData} callback={this.deleteItem}/>
                                           <Grid container direction="row" justify="space-between">
                                           <Grid item>
                                           <Typography>
                                               Total : {this.state.total}
                                           </Typography>
                                           </Grid>
                                           <Grid item>
                                               <CardActions>
                                                   {this.state.fromType === "merchants" ?                                        <Button
                                                           variant="outlined"
                                                           color="primary"
                                                           style={{textTransform: 'none'}}
                                                           onClick={this.makeOrder}
                                                       >
                                                           Payment
                                                       </Button> :
                                                       <div>
                                                           <Button variant="outlined" color="primary" onClick={this.handleOpen}>
                                                               Add Promotion
                                                           </Button>
                                                           <Dialog
                                                               open={this.state.open}
                                                               onClose={this.handleClose}
                                                               aria-labelledby="alert-dialog-title"
                                                               aria-describedby="alert-dialog-description"
                                                           >
                                                               <DialogTitle id="alert-dialog-title">{"Add Your Promotion Here"}</DialogTitle>
                                                               <DialogContent>




                                                                   <Grid container direction="column">


                                                                       <Grid container direction="row" >

                                                                           <Grid item>
                                                                               <TextField style={{width: "35vw"}} id='Title' name='Title' label='Title' onChange={this.handleChange('Title')}/>
                                                                           </Grid>

                                                                       </Grid>



                                                                       <Grid container direction="row" >


                                                                           <Grid item>
                                                                               <TextField style={{width: "35vw"}} id='Description' name='Description' label='Description' onChange={this.handleChange('Description')} />
                                                                           </Grid>



                                                                       </Grid>

                                                                       <Grid container direction="row" >

                                                                           <Grid item>
                                                                               <TextField style={{width: "35vw"}} id='PromotionPrice' name='PromotionPrice' label='Price' onChange={this.handleChange('PromotionPrice')}/>
                                                                           </Grid>

                                                                       </Grid>

                                                                       <Grid container direction="column">
                                                                           <Grid item>
                                                                           <Typography style={{width: "10vw"}}>Expiration:</Typography>
                                                                           </Grid>
                                                                           <Grid container direction="row" justify="flex-end" spacing={2}>
                                                                           <Grid item >
                                                                               <TextField style={{width: "10vw"}} id='Month' name='Month' label='Month' onChange={this.handleChange('Month')} />
                                                                           </Grid>
                                                                           <Grid item>
                                                                               <TextField style={{width: "10vw"}} id='Day' name='Day' label='Day' onChange={this.handleChange('Day')} />
                                                                           </Grid>
                                                                           <Grid item>
                                                                               <TextField style={{width: "10vw"}} id='Year' name='Year' label='Year' onChange={this.handleChange('Year')} />
                                                                           </Grid>
                                                                           </Grid>
                                                                       </Grid>
                                                                   </Grid>



                                                               </DialogContent>
                                                               <DialogActions>
                                                                   <Button onClick={this.handleClose} color="primary">
                                                                       Disagree
                                                                   </Button>
                                                                   <Button onClick={this.makeOrder} color="primary" autoFocus>
                                                                       Agree
                                                                   </Button>
                                                               </DialogActions>

                                                           </Dialog>
                                                       </div>

                                                   }



                                               </CardActions>
                                           </Grid>
                                           </Grid>
                                       <div style={{height: "25px"}}></div>



                                   </CardContent>


                                   {this.state.response}
                               </Card>

                           </Grid>
                       </Grid>
                   </div>
               </React.Fragment>
           );

       }
       else {
           return (
               <React.Fragment>
                   <CssBaseline/>
                   <Nav/>
                   <div id="cart">
                       <Grid id="contained" container spacing={1} direction="column" justify="space-between">
                           <Grid item>
                               <Cart_Search children={this.state.inventory} callback={this.populateCart}/>

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
                                           <CartTable children={this.state.cartListData} callback={this.deleteItem}/>
                                           <Typography>
                                               Total : {this.state.total}
                                           </Typography>
                                       </Grid>

                                   </CardContent>

                                   <CardActions>
                                       {this.state.fromType === "merchants" ?                                        <Button
                                           variant="outlined"
                                           color="primary"
                                           style={{textTransform: 'none'}}
                                           onClick={this.makeOrder}
                                       >
                                           Payment
                                       </Button> :
                                           <div>
                                           <Button variant="outlined" color="primary" onClick={this.handleOpen}>
                                               Add Promotion
                                           </Button>
                                           <Dialog
                                           open={this.state.open}
                                           onClose={this.handleClose}
                                           aria-labelledby="alert-dialog-title"
                                           aria-describedby="alert-dialog-description"
                                           >
                                           <DialogTitle id="alert-dialog-title">{"Add Your Promotion Here"}</DialogTitle>
                                           <DialogContent>




                                           <Grid container direction="column">


                                           <Grid container direction="row" >

                                           <Grid item>
                                           <TextField style={{width: "24vw"}} id='Title' name='Title' label='Title' onChange={this.handleChange('Title')}/>
                                           </Grid>

                                           </Grid>
                                               
                                               

                                           <Grid container direction="row" >


                                           <Grid item>
                                           <TextField style={{width: "24vw"}} id='Description' name='Description' label='Description' onChange={this.handleChange('Description')} />
                                           </Grid>
                                               
                                               

                                           </Grid>

                                           <Grid container direction="row" >

                                               <Grid item>
                                                   <TextField style={{width: "24vw"}} id='PromotionPrice' name='PromotionPrice' label='Promotion Price' onChange={this.handleChange('PromotionPrice')}/>
                                               </Grid>

                                           </Grid>

                                           <Grid container direction="row" spacing={1}>
                                           <Grid item>
                                           <Typography style={{width: "10vw"}}>Expiry:</Typography>
                                           </Grid>

                                           <Grid item>
                                           <TextField style={{width: "10vw"}} id='Month' name='Month' label='Month' onChange={this.handleChange('Month')} />
                                           </Grid>
                                           <Grid item>
                                           <TextField style={{width: "10vw"}} id='Day' name='Day' label='Day' onChange={this.handleChange('Day')} />
                                           </Grid>
                                           <Grid item>
                                           <TextField style={{width: "10vw"}} id='Year' name='Year' label='Year' onChange={this.handleChange('Year')} />
                                           </Grid>
                                           </Grid>
                                           </Grid>



                                           </DialogContent>
                                           <DialogActions>
                                           <Button onClick={this.handleClose} color="primary">
                                           Disagree
                                           </Button>
                                           <Button onClick={this.makeOrder} color="primary" autoFocus>
                                           Agree
                                           </Button>
                                           </DialogActions>

                                           </Dialog>
                                           </div>

                                       }



                                   </CardActions>
                                   {this.state.response}
                               </Card>

                           </Grid>
                       </Grid>
                   </div>


                   {/*<div id = "cart" style={style.cart}>*/}


                   {/*{ !this.state.bShowScanner ? (*/}
                   {/*<Button onClick={this.showScanner} variant="contained">Default</Button>*/}


                   {/*) : (*/}
                   {/*<div style={style.cameraViewContainer}>*/}
                   {/*<button id = "scan" onClick={this.hideScanner}>Cancel</button>*/}

                   {/*<BarcodeScanner appendMessage={this.appendMessage}></BarcodeScanner>*/}
                   {/*</div>*/}
                   {/*) }*/}

                   {/*<div className="div-message" style={style.div_message} ref={this.refDivMessage}>*/}
                   {/*{ this.state.messages.map((message, index) =>*/}
                   {/*<p key={ this.state.messageKeyBase + index }>*/}
                   {/*{ message }*/}
                   {/*</p>*/}
                   {/*) }*/}
                   {/*</div>*/}

                   {/*</div>*/}
               </React.Fragment>
           );
       }
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


const styleMobile = {
    cartMobile: {
        minHeight: "100vh",
    },
    cartTableMobile: {
        maxWidth: "100vw",
        marginTop: "25px",
    },


};

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

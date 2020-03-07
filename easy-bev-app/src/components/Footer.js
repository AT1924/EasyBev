import Button from "@material-ui/core/Button";
import React from "react";
import IconButton from "@material-ui/core/IconButton";
import ShoppingCartIcon from '@material-ui/icons/ShoppingCart'
import LibraryBooksOutlinedIcon from '@material-ui/icons/LibraryBooksOutlined'
import AssignmentIcon from '@material-ui/icons/Assignment'
import ChatIcon from '@material-ui/icons/Chat'
import Grid from '@material-ui/core/Grid';


class Footer extends React.Component {
    constructor(props){
        super(props);
        this.reader = null;


        this.state = {
            chosen : "FEED",
        }
    }
    update(whereto){
        console.log("UPDATE", whereto);
        this.state = {chosen: whereto}
        console.log("STATE", this.state)
    }

    getColor(which){
        if (which === this.state.chosen){
            return "primary";
        }else{
            return "secondary";
        }

    }


    render() {
        return (<div id = "footer">
            <Grid container style={style.root} spacing={2}>
                <Grid item xs={12}>
                    <Grid container direction="row" justify="center" alignItems="flex-end" spacing={2}>

                        <IconButton onClick={() => {this.state = {chosen:"FEED"}}} color = {this.state.chosen === "FEED"? "primary":"secondary"}><LibraryBooksOutlinedIcon/></IconButton>
                        <IconButton onClick={() => {this.state = {chosen:"CART"}}} color = {this.state.chosen === "CART"? "primary":"secondary"}><ShoppingCartIcon/></IconButton>
                        <IconButton onClick={() => {this.state = {chosen:"ORDERS"}}} color = {this.state.chosen === "ORDERS"? "primary":"secondary"}><AssignmentIcon/></IconButton>
                        <IconButton onClick={() => {this.state = {chosen:"MESSAGE"}}} color = {this.state.chosen === "MESSAGE"? "primary":"secondary"}><ChatIcon/></IconButton>

                    </Grid>
                </Grid>
            </Grid>


        </div>


        )
    }

}

const style = {
    root: {
        flexGrow: 1,
    }
};

export default Footer;

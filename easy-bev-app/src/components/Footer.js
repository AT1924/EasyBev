import Button from "@material-ui/core/Button";
import React from "react";
import IconButton from "@material-ui/core/IconButton";
import ShoppingCartIcon from '@material-ui/icons/ShoppingCart'
import LibraryBooksOutlinedIcon from '@material-ui/icons/LibraryBooksOutlined'
import AssignmentIcon from '@material-ui/icons/Assignment'
import ChatIcon from '@material-ui/icons/Chat'

class Footer extends React.Component {
    constructor(props){
        super(props);
        this.reader = null;
        this.state = {
            chosen : "FEED",
        }
    }
    update(whereto){
        this.state = {chosen: whereto}
    }
    render() {
        return (<div id = "footer">
            <IconButton onclick={this.update("FEED")} color = "primary"><LibraryBooksOutlinedIcon/></IconButton>
            <IconButton onclick={this.update("CART")} color = "secondary"><ShoppingCartIcon/></IconButton>
            <IconButton onclick={this.update("ORDERS")} color = "secondary"><AssignmentIcon/></IconButton>
            <IconButton onclick={this.update("MESSAGE")} color = "secondary"><ChatIcon/></IconButton>
        </div>)
    }

}

const style = {

}

export default Footer;

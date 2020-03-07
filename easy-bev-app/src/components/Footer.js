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
        this.state = {chosen: whereto}
    }

    render() {
        return (<div id = "footer">
            <Grid container style={style.root} spacing={2}>
                <Grid item xs={12}>
                    <Grid container direction="row" justify="center" alignItems="flex-end" spacing={2}>

                        <IconButton onclick={this.update("FEED")} color = "primary"><LibraryBooksOutlinedIcon/></IconButton>
                        <IconButton onclick={this.update("CART")} color = "secondary"><ShoppingCartIcon/></IconButton>
                        <IconButton onclick={this.update("ORDERS")} color = "secondary"><AssignmentIcon/></IconButton>
                        <IconButton onclick={this.update("MESSAGE")} color = "secondary"><ChatIcon/></IconButton>

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
}

export default Footer;

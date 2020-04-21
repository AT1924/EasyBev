import React from 'react';
import Avatar from '@material-ui/core/Avatar';
import Button from '@material-ui/core/Button';
import CssBaseline from '@material-ui/core/CssBaseline';
import Container from '@material-ui/core/Container';
import PropTypes from "prop-types";
import withStyles from "@material-ui/core/styles/withStyles";
import Nav from "./Nav";
import Grid from "@material-ui/core/Grid";
import Paper from "@material-ui/core/Paper";
import TextField from "@material-ui/core/TextField";
import Typography from "@material-ui/core/Typography";
import List from "@material-ui/core/List";
import ListItem from "@material-ui/core/ListItem";
import ListItemText from "@material-ui/core/ListItemText";
const io = require('socket.io-client')


const styles = theme => ({
    root: {
        flexGrow: 1,
    },
    messages: {
        padding: theme.spacing(2),
        marginTop: theme.spacing(5),
        marginRight: theme.spacing(5),
        height: 500,
        textAlign: 'center',
        color: theme.palette.text.secondary,
    },
    paper: {
        maxWidth: 400,
        margin: `${theme.spacing(1)}px auto`,
        padding: theme.spacing(2),
    },
    option: {
        padding: theme.spacing(2),
        marginTop: theme.spacing(5),
        marginLeft: theme.spacing(5),
        textAlign: 'center',
        color: theme.palette.text.secondary,
    },
    textBox: {
        padding: theme.spacing(2),
        marginRight: theme.spacing(5),
        textAlign: 'center',
        color: theme.palette.text.secondary,
    },

});

//include identifying info

class Message extends React.Component {
    constructor(props) {
        super(props);
        this.state = { message: "",
            fromId: "",
            fromType: "",
            toId: "",
            contacts: [],
            selected: -1,
            socket: '',
            messages: [],
        };
        // this.sendMessage = this.sendMessage.bind(this)

    }

    async getData() {
        try {
            fetch("/api/get_client", {
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
                        if ('distributor' in json.body) {
                            let contacts = []
                            for (let i = 0; i < json.body.merchants.length; i++) {
                                contacts.push([json.body.merchants[i].email, json.body.merchants[i].id])
                            }
                            this.setState({contacts: contacts, fromId: json.body.distributor.id});

                        } else {
                            this.setState({contacts: [[json.body.merchant.distributor_email, json.body.merchant.d_id]], fromId: json.body.merchant.id});
                            console.log("got merchant info");
                            const socket = io.connect('http://localhost:8080', {query: 'id=' + this.state.fromId + '&&type=' + this.state.fromType});
                            socket.on('messageChannel', (data) => {
                                console.log("received", data, "and state is", this.state)
                                if (data.toId === this.state.fromId && data.toType === this.state.fromType){
                                    this.receiveMessage(data);
                                }
                            });
                            this.setState({socket: socket});
                            console.log('got merchant info')
                        }
                    }
                );
        } catch(error) {
            console.error(error);
        }
    }



    componentDidMount() {
        this.setState({fromType:localStorage.getItem("typeUser") });
        this.getData();

    }

    receiveMessage(message){
        console.log("received", message.data);
        //display on screen
    }

    sendMessage = () => {
        console.log("sending");
        this.state.socket.emit("messageChannel", { fromType: this.state.fromType,
            fromId:this.state.fromId, toId: this.state.toId, data:this.state.message });
    }

    handleChange = name => (event) => {
        this.setState({ [name]: event.target.value });
    };

    handleListItemClick = (value, index) => {
        this.setState({selected: index, toId: value});
    };


    render() {
        const { classes } = this.props;
        console.log(this.state);
        return (
            <React.Fragment>
                <CssBaseline />
                <Nav/>

                <div className={classes.root}>
                    <Grid container >
                        <Grid item xs={6}>
                            <Paper className={classes.option}>
                                <List className={classes.root}>
                                    {this.state.contacts.map((value, index) => {
                                        return (
                                            <ListItem selected={this.state.selected == index} key={index} role={undefined} dense button
                                                      onClick={(event) => this.handleListItemClick(value[1], index)}>
                                                <ListItemText id={index} primary={value[0]} />
                                            </ListItem>
                                        );
                                    })}
                                </List>
                            </Paper>
                        </Grid>
                        <Grid item xs={6}>
                            <Grid container >
                                <Grid item xs={12}>
                                    <Paper className={classes.messages}>
                                        {this.state.selected > -1 ?
                                            <Paper className={classes.paper}>
                                                {/*{this.state.messages.map((value, index) => {*/}
                                                {/*    return (*/}
                                                {/*        <Grid container wrap="nowrap" spacing={2}>*/}
                                                {/*            <Grid item>*/}
                                                {/*                <Avatar>W</Avatar>*/}
                                                {/*            </Grid>*/}
                                                {/*            <Grid item xs zeroMinWidth>*/}
                                                {/*                <Typography noWrap>hello</Typography>*/}
                                                {/*            </Grid>*/}
                                                {/*        </Grid>*/}
                                                {/*    );*/}
                                                {/*})}*/}
                                                <Grid container wrap="nowrap" spacing={2}>
                                                    <Grid item>
                                                        <Avatar>W</Avatar>
                                                    </Grid>
                                                    <Grid item xs zeroMinWidth>
                                                        <Typography noWrap>hello</Typography>
                                                    </Grid>
                                                </Grid>
                                            </Paper>
                                            : <div></div>}
                                    </Paper>
                                </Grid>
                                <Grid item xs={12}>
                                    <Paper className={classes.textBox}>
                                        <Grid id="submitMessage" container direction="row" justify="center" alignItems="center">
                                            <Grid item>
                                                <TextField
                                                    id="message"
                                                    name="message"
                                                    variant="outlined"
                                                    style={{ marginRight: '20vw' }}

                                                    fullWidth

                                                    onChange={this.handleChange('message')}

                                                />


                                                {/*<TextField id="message"*/}
                                                           {/*name="message"*/}
                                                           {/*variant="outlined"*/}
                                                           {/*fullWidth*/}
                                                           {/*onChange={this.handleChange('message')}/>*/}
                                            </Grid>

                                            <Grid item >
                                                <Button variant="outlined" color="primary" size="large" style={{ marginLeft: '1vw' }}>
                                                    Send
                                                </Button>
                                            </Grid>

                                        </Grid>
                                    </Paper>
                                </Grid>
                            </Grid>
                        </Grid>
                    </Grid>
                </div>

            </React.Fragment>


        );


    }


}

Message.propTypes = {
    classes: PropTypes.object.isRequired
};

export default withStyles(styles)(Message);
import React, { useRef, useLayoutEffect } from 'react';
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
import Input from '@material-ui/core/Input';
import ListItemText from "@material-ui/core/ListItemText";
import useStayScrolled from 'react-stay-scrolled';
const io = require('socket.io-client')


const styles = theme => ({
    root: {
        flexGrow: 1,
    },
    root2: {
        width: '100%',
        height: '100%',
        maxWidth: 360,
        backgroundColor: theme.palette.background.paper,
        position: 'relative',
        overflow: 'auto',
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
    message: {
        // margin: `${theme.spacing(1)}px auto`,
        padding: theme.spacing(2),
        width: '100%',

    }

});

//
// //include identifying info
// const socket = io.connect('http://localhost:8080', {query: 'id=poop&&type=whatever'});

class Message extends React.Component {
    constructor(props) {
        super(props);
        this.state = { message: "",
            email: '',
            fromId: "",
            fromType: "",
            toId: "",
            contacts: [],
            selected: [-1, -1],
            socket: '',
            convos: {},
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
                        // console.log(json);
                        if ('distributor' in json.body) {
                            let contacts = []
                            for (let i = 0; i < json.body.merchants.length; i++) {
                                contacts.push([json.body.merchants[i].email, json.body.merchants[i].id])
                            }
                            this.setState({contacts: contacts, fromId: json.body.distributor.id, email: json.body.distributor.email});

                        } else {
                            this.setState({contacts: [[json.body.merchant.distributor_email, json.body.merchant.d_id]],
                                fromId: json.body.merchant.id,
                                email: json.body.merchant.email});
                            // console.log('got merchant info')
                        }
                    const socket = io.connect('http://localhost:8080', {query: 'id=' + this.state.fromId + '&&type=' + this.state.fromType});
                    socket.on('messageChannel', (data) => {
                        console.log("received", data, "and state is", this.state)
                        if (data.toId === this.state.fromId && data.fromType !== this.state.fromType){
                            this.receiveMessage(data, false);
                        } else if (data.fromId === this.state.fromId && data.fromType === this.state.fromType) {
                            this.receiveMessage(data, true);
                        }
                    });
                    this.setState({socket: socket});
                    this.getConvo();
                    }
                );
        } catch(error) {
            console.error(error);
        }
    }

    async getConvo() {
        try {
            fetch("/api/get_messages", {
                method: "post",
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json'
                },

                //make sure to serialize your JSON body
                body: JSON.stringify({})
            }).then( response => response.json())
                .then(json => {
                    let convos = {};
                    for(let key in json) {
                        let value = json[key];
                        let convo = [];
                        for (let i = 0; i<value.length; i++) {
                            if(value[i].fromMerchant === 1) {
                                console.log(value[i]);
                                convo.push([value[i].text, value[i].merch_email, value[i].timestamp])
                            } else {
                                convo.push([value[i].text, value[i].dist_email, value[i].timestamp])
                            }
                        }
                        convos[key] = convo;
                    }
                    for (let i = 0; i < this.state.contacts.length; i++) {
                        if (!(this.state.contacts[i][0] in convos)) {
                            convos[this.state.contacts[i][0]] = []
                        }
                    }
                    // console.log(convos);
                    this.setState({convos: convos})

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

    receiveMessage(message, isent){
        let from = message.data[1];
        if (from === this.state.selected[0] || isent) {
            this.setState(prevState => ({
                messages: [...prevState.messages, [message.data[0], from, message.timestamp]]
            }));

            let convosCopy = JSON.parse(JSON.stringify(this.state.convos));
            convosCopy[this.state.selected[0]] = this.state.messages;
            this.setState({convos:convosCopy});

        }  else {
            let temp = [...this.state.convos[from]];
            temp.push([message.data[0], from, message.timestamp]);
            let convosCopy = JSON.parse(JSON.stringify(this.state.convos));
            convosCopy[from] = temp;
            this.setState({convos:convosCopy});

        }

    }

    sendMessage = () => {
        console.log("sending");
        this.state.socket.emit("messageChannel", { fromType: this.state.fromType,
            fromId:this.state.fromId, toId: this.state.toId, data:[this.state.message, this.state.email]});
        // this.setState(prevState => ({
        //     messages: [...prevState.messages, [this.state.message, this.state.email]]
        // }));
        // let messagesCopy = [...this.state.messages];
        // messagesCopy.push([this.state.message, this.state.email]);
        // this.setState({messages: messagesCopy});
        //
        // let convosCopy = JSON.parse(JSON.stringify(this.state.convos));
        // convosCopy[this.state.selected[0]] = messagesCopy;
        // this.setState({convos:convosCopy});
        this.setState({message: ''});

    }

    handleChange = name => (event) => {
        this.setState({ [name]: event.target.value });
    };

    handleListItemClick = (value) => {
        this.setState({selected: value, toId: value[1]});
        this.setState({messages: [...this.state.convos[value[0]]]});
    };


    render() {
        const { classes } = this.props;
        // console.log(this.state.convos);
        return (
            <React.Fragment>
                <CssBaseline />
                <Nav/>

                <div className={classes.root}>
                    <Grid container >
                        <Grid item xs={6}>
                            <Paper className={classes.option}>
                                <List className={classes.root}>
                                    {this.state.contacts.map((value) => {
                                        return (
                                            <ListItem selected={this.state.selected[1] == value[1]} key={value[1]} role={undefined} dense button
                                                      onClick={(event) => this.handleListItemClick(value)}>
                                                <ListItemText id={value[1]} primary={value[0]} />
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
                                        {this.state.selected[1] > -1 ?
                                            <List className={classes.root2} >
                                                {this.state.messages.map((value) => {
                                                    return (
                                                        <ListItem  >
                                                            <Paper className={classes.message}>
                                                                <Grid container wrap="nowrap" spacing={2} direction='column'>
                                                                    <Grid container justfiy='flex-start'>
                                                                        <Grid item xs={6}>
                                                                            <Typography variant="caption" display="block" color={value[1] === this.state.email ? 'primary' : 'secondary'}>
                                                                                {value[1]}
                                                                            </Typography>
                                                                        </Grid>
                                                                        <Grid item xs={6}>
                                                                            <Typography variant="caption" display="block" color='textSecondary'>
                                                                                {'Delivered ' + value[2]}
                                                                            </Typography>
                                                                        </Grid>
                                                                    </Grid>
                                                                    <Grid item xs >
                                                                        <Typography > {value[0]} </Typography>
                                                                    </Grid>
                                                                </Grid>
                                                            </Paper>
                                                        </ListItem>
                                                    );
                                                })}
                                            </List>
                                            : <div></div>}

                                    </Paper>
                                </Grid>
                                <Grid item xs={12}>
                                    <Paper className={classes.textBox}>
                                        <Grid id="submitMessage" container direction="row" justify="center" alignItems="center">
                                            <Grid item >
                                                <Button variant="outlined" color="primary" disabled={this.state.selected[1] === -1} size="large" style={{ marginRight: '1vw' }} onClick={this.sendMessage}>
                                                    Send
                                                </Button>
                                            </Grid>
                                            <Grid item>
                                                <Input
                                                    id="message"
                                                    variant="outlined"
                                                    style={{width: '20vw'}}
                                                    fullWidth
                                                    onChange={this.handleChange('message')}
                                                    placeholder="Type a message."
                                                    value={this.state.message}
                                                    type="text"
                                                />
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
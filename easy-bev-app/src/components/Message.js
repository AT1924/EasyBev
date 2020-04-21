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


class Message extends React.Component {
    constructor(props) {
        super(props);
        this.state = { message: "",
            fromEmail: "",
            fromType: "",
        };
        // this.sendMessage = this.sendMessage.bind(this)

    }



    componentDidMount() {
        socket.on('messageChannel', (data) => {
            console.log("received", data, "and state is", this.state)
            if (data.toEmail === this.state.fromEmail && data.toType === this.state.fromType){
                this.receiveMessage(data);
            }
        });
    }

    receiveMessage(message){
        console.log("received", message.data);
        //display on screen
    }

    // sendMessage = () => {
    //     toEmail = this.state.fromEmail === "email1" ? "email2" : "email1";
    //     fromEmail = this.state.fromEmail;
    //     fromType = this.state.fromType;
    //     toType = "merchant";
    //     console.log("sending");
    //     socket.emit("messageChannel", { fromType: fromType, fromEmail:fromEmail, toType:toType, toEmail: this.state.toEmail, data:this.state.message });
    // }

    handleChange = name => (event) => {
        this.setState({ [name]: event.target.value });
    };


    render() {
        const { classes } = this.props;
        return (
            <React.Fragment>
                <CssBaseline />
                <Nav/>

                <div className={classes.root}>
                    <Grid container >
                        <Grid item xs={6}>
                            <Paper className={classes.option}>
                            </Paper>
                        </Grid>
                        <Grid item xs={6}>
                            <Grid container >
                                <Grid item xs={12}>
                                    <Paper className={classes.messages}>
                                        <Paper className={classes.paper}>
                                            <Grid container wrap="nowrap" spacing={2}>
                                                <Grid item>
                                                    <Avatar>W</Avatar>
                                                </Grid>
                                                <Grid item xs zeroMinWidth>
                                                    <Typography noWrap>hello</Typography>
                                                </Grid>
                                            </Grid>
                                        </Paper>
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
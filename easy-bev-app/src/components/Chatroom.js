import React from 'react';
const io = require('socket.io-client')


const socket = io.connect('http://localhost:8080', {query: 'email=myEmail&&type=myType'});//include identifying info

export default class Chatroom extends React.Component {

    constructor(props, context) {
        super(props, context);
        this.state = {
            fromEmail: this.props.fromEmail,
            fromType:this.props.fromType,
        };
        this.sendMessage = this.sendMessage.bind(this)



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

    sendMessage(fromEmail, fromType, toEmail, toType, data){
        data = "from" + fromEmail;
        toEmail = this.state.fromEmail === "email1" ? "email2" : "email1";
        fromEmail = this.state.fromEmail;
        fromType = this.state.fromType;
        toType = "merchant";
        console.log("sending");
        socket.emit("messageChannel", { fromType: fromType, fromEmail:fromEmail, toType:toType, toEmail:toEmail, data:data });
    }
    render() {
       return  <button onClick={this.sendMessage}>Send Message</button>
    }
}

import React from 'react';
const io = require('socket.io-client')


const socket = io.connect('http://localhost:8080');

export default class Chatroom extends React.Component {

    constructor(props, context) {
        super(props, context);
        this.state = {
            myEmail: "m@b.com",
            myType:"merchant",
        }

    }
    componentDidMount() {
        socket.on('messageChannel', (data) => {
            if (data.toEmail === this.state.myEmail && data.toType === this.state.myType){
                this.receiveMessage(data);
            }
        });
    }

    receiveMessage(message){
        console.log("received", message.data);
        //display on screen
    }

    sendMessage(fromEmail, fromType, toEmail, toType, data){
        data = "hey how's it going";
        toEmail = "michael_bardakji@brown.edu";
        fromEmail = "m@b.com";
        fromType = "merchant";
        toType = "merchant";
        socket.emit("messageChannel", { fromType: fromType, fromEmail:fromEmail, toType:toType, toEmail:toEmail, data:data });
    }
    render() {
       return  <button onClick={this.sendMessage}>Send Message</button>
    }
}

import index from "./js/index";
import Cart from "./components/Cart";

import SignIn from "./components/SignIn";
import SignUp from "./components/SignUp";
import feed from "./components/feed";
import Orders from "./components/Orders";
import Message from "./components/Message";
import { Route, Link, BrowserRouter as Router } from 'react-router-dom'

import React from 'react';
import ReactDOM from 'react-dom';


const routing = (
    <Router>
        <div>
            <Route exact path="/" component={Cart} />
            <Route path="/login" component={SignIn} />
            <Route path="/signup" component={SignUp} />
            <Route path="/feed" component={feed}/>
            <Route path="/orders" component={Orders}/>
            <Route path="/message" component={Message}/>


        </div>
    </Router>
)


{/*class App extends React.Component {
    render() {
        return <Qrbutton></Qrbutton>
    }
}
ReactDOM.render(<App />, document.getElementById('root'))*/}

ReactDOM.render(
    routing, document.getElementById('root')
);

import index from "./js/index";
import Qrbutton from "./components/Qrbutton";
import SignIn from "./components/SignIn";
import SignUp from "./components/SignUp";
import { Route, Link, BrowserRouter as Router } from 'react-router-dom'

import React from 'react';
import ReactDOM from 'react-dom';


const routing = (
    <Router>
        <div>
            <Route exact path="/" component={Qrbutton} />
            <Route path="/login" component={SignIn} />
            <Route path="/signup" component={SignUp} />


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

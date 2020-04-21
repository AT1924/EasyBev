import Cart from "./components/Cart";
import { MuiThemeProvider, createMuiTheme } from '@material-ui/core/styles';
import SignIn from "./components/SignIn";
import SignUp from "./components/SignUp";
import feed from "./components/feed";
import Profile from "./components/Profile";
import Orders from "./components/Orders";
import Message from "./components/Message";
import { Route,Redirect, Link, BrowserRouter as Router } from 'react-router-dom'
import React from 'react';
import ReactDOM from 'react-dom';
import BarcodeScanner from "./components/BarcodeScanner";
import './style/index.css'
import {func} from "prop-types";
const defaultTheme = createMuiTheme();



function isLogin(){
    if (localStorage.getItem("login") === "true") {
        return true;
    } else {
        return false;
    }
}


const PrivateRoute = ({ component: Component, ...rest }) => (
    <Route {...rest} render={(props) => (
        isLogin()
            ? <Component {...props} />
            : <Redirect to={{
                pathname: '/login',
                state: { from: props.location }
            }} />
    )} />
);


class App extends React.Component {
    state = {theme: defaultTheme};


    render() {
        return(
        <MuiThemeProvider theme={this.state.theme}>
        <Router>

                <Route exact path="/" component={SignIn} />
                <PrivateRoute path='/feed' component={feed} />
                <PrivateRoute path='/profile' component={Profile} />
                <PrivateRoute path='/cart' component={Cart} />
                <PrivateRoute path='/orders' component={Orders} />
                {/*<Route path="/cart" component={Cart} />*/}
                <Route path="/login" component={SignIn} />
                <Route path="/signup" component={SignUp} />
                <Route path="/message" component={Message}/>




        </Router>
        </MuiThemeProvider>)
    }
}

ReactDOM.render(<App />, document.getElementById('root'));


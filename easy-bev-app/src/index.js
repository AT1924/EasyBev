import PrivateRouteComponent from './components/PrivateRouteComponent'
import Cart from "./components/Cart";
import { MuiThemeProvider, createMuiTheme } from '@material-ui/core/styles';
import SignIn from "./components/SignIn";
import SignUp from "./components/SignUp";
import feed from "./components/feed";
import Orders from "./components/Orders";
import Message from "./components/Message";
import { Route,Redirect, Link, BrowserRouter as Router } from 'react-router-dom'
import React from 'react';
import ReactDOM from 'react-dom';
import {func} from "prop-types";
const defaultTheme = createMuiTheme();




// function isLogin(){
//     let done = false;
//     const response = fetch('/api/authenticate', {
//         method: 'POST',
//         headers: {
//             'Content-Type': 'application/json',
//         },
//     }).then(()=>{
//         done = true;
//     });
//     deasync.loopWhile(()=>{return !done});
//     return response.valid;
// }




async function whatToRender(props, Component){


}

// const PrivateRouteBluePrint = ({component: Component, ...rest}) => {
//
//     return (
//
//         // Show the component only when the user is logged in
//         // Otherwise, redirect the user to /signin page
//         <Route {...rest} render={
//         } />
//     );
// };

// const PublicRoute = ({component: Component, restricted, ...rest}) => {
//     return (
//         // restricted = false meaning public route
//         // restricted = true meaning restricted route
//         <Route {...rest} render={props => (
//             isLoggedIn() && restricted ?
//                 <Redirect to="/dashboard" />
//                 : <Component {...props} />
//         )} />
//     );
// };
const privateRouteComponentWrapper = (comp) => {
    return <PrivateRouteComponent/>;
};

class App extends React.Component {
    state = {theme: defaultTheme};


    render() {
        return(
        <MuiThemeProvider theme={this.state.theme}>
        <Router>
            <div>
                <Route exact path="/" component={SignIn} />
                <Route path="/cart" component={Cart} />
                <Route path="/login" component={SignIn} />
                <Route path="/signup" component={SignUp} />
                <Route path="/feed" component={privateRouteComponentWrapper} />
                <Route path="/orders" component={Orders}/>
                <Route path="/message" component={Message}/>

            </div>
        </Router>
        </MuiThemeProvider>)
    }
}

ReactDOM.render(<App />, document.getElementById('root'));


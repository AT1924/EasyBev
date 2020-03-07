import index from "./js/index";
import Cart from "./components/Cart";
import { MuiThemeProvider, createMuiTheme } from '@material-ui/core/styles';
import SignIn from "./components/SignIn";
import SignUp from "./components/SignUp";
import feed from "./components/feed";
import Orders from "./components/Orders";
import Message from "./components/Message";
import { Route, Link, BrowserRouter as Router } from 'react-router-dom'

import React from 'react';
import ReactDOM from 'react-dom';

const defaultTheme = createMuiTheme();

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
                <Route path="/feed" component={feed}/>
                <Route path="/orders" component={Orders}/>
                <Route path="/message" component={Message}/>

            </div>
        </Router>
        </MuiThemeProvider>)
    }
}

ReactDOM.render(<App />, document.getElementById('root'));


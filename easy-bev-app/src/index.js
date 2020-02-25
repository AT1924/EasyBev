import index from "./js/index";
import Qrbutton from "./components/Qrbutton";
import React from 'react';
import ReactDOM from 'react-dom';

class App extends React.Component {
    render() {
        return <Qrbutton></Qrbutton>
    }
}
ReactDOM.render(<App />, document.getElementById('root'))

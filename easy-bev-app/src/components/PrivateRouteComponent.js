import React from 'react';

class PrivateRouteComponent extends React.Component {
    constructor(props){
        super(props);
        this.state = {loggedIn : false};
    }
    async componentDidMount(){

    }
    componentWillUnmount(){

    }

    render() {
        return (

                // this.props.component
            <h1>hi</h1>
        );
    }
}

export default PrivateRouteComponent;

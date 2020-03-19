import React from 'react';
import { Route, Redirect } from 'react-router-dom';
const axios = require('axios');

// async function isLogin(){
//     const response = await fetch('/api/authenticate', {
//         method: 'POST',
//         headers: {
//             'Content-Type': 'application/json',
//         },
//         body:JSON.stringify({}),
//     }).catch((err) => {
//         return false
//     });
//     const respJson = await response.json().catch((err) => {
//         return false
//     });
//     console.log("found", respJson)
//     return respJson.valid;
// }

function isLogin() {
    return axios.get('/api/authenticate', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body:JSON.stringify({}),
    })
}
//
// function isLogin(){
//     fetch('/api/authenticate', {
//         method: 'POST',
//         headers: {
//             'Content-Type': 'application/json',
//         },
//         body:JSON.stringify({}),
//     }).then((response)=>{
//         response.json().then((respJson)=>{
//             console.log("found", respJson)
//             return respJson;
//         }).catch((err) => {
//             return false
//         });
//     }).catch((err) => {
//         return false
//     });
//
// }

const PrivateRoute = ({component: Component, ...rest}) => {
    isLogin().then((response)=>{
        console.log("found", response.data);
        if (response.data.valid){
            return (
                <Route {...rest} render={props => {
                    return (<Component {...props} />);
                }  } />
            );
        }else{
            return (
                <Route {...rest} render={props => {
                    return (<Redirect to="/login"/>);
                }  } />
            );
        }

    }).catch((err) => {
        console.log("error2", err)

        return (
            <Route {...rest} render={props => {
                return (<Redirect to="/login"/>);
            }  } />
        );    });


    // if(loggedIn){
    //     return (
    //         <Route {...rest} render={props => {
    //             return (<Component {...props} />);
    //         }  } />
    //     );
    // }else{
    //     return (
    //         <Route {...rest} render={props => {
    //             return (<Redirect to="/login"/>);
    //         }  } />
    //     );
    // }

};

export default PrivateRoute;

//
// isLogin().then((res) => {
//     res ? <Redirect to="/login" /> :<Component {...props} />
// })
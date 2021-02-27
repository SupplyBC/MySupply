import React, { Component } from "react";
// import { BrowserRouter, Route, NavLink } from "react-router-dom";


class BankAccounts extends Component {

    // constructor(props) {
    //     super(props);
    // }

    render() {
        let acc = this.props.accounts;
        let cont = this.props.contract;
        if (!acc || !cont) {
        return <div> Loading..... </div>;
        }

        return (
            <h1> MANAGE BANK ACCOUNTS </h1>
        );
    }
}

export default BankAccounts;
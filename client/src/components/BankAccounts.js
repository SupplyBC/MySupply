import React, { Component } from "react";
import { BrowserRouter, Route, NavLink } from "react-router-dom";

class CreateAccount extends Component {

    state = {msg: '', address: '' , accName: ''}

    constructor(props) {
        super(props)
        this.accNameRef = React.createRef();
        this.accAddrRef = React.createRef();
        this.onSubmit = this.onSubmit.bind(this);
        this.onChange = this.onChange.bind(this);
    }

    onSubmit = async (e) => {
        e.preventDefault();
        const accountName = this.state.accName;
        console.log(accountName)

      await this.props.contract.methods
      .selfCreateBankAccount(accountName)
      .send({ from: this.props.account[0] })
      .once("receipt", (receipt) => {
        this.setState({ msg: "account was created successfully!" });
        setTimeout(() => {
          this.setState({ msg: " " });
        }, 3000);
      });
    }

    onChange = async (e) => {
        this.setState({
            accName: this.accNameRef.current.value,
        })

    }
    render() {
            let acc = this.props.account;
            let cont = this.props.contract;
            if (!acc || !cont) {
              return <div> Loading..... </div>;
            }
        return(
              <form onSubmit={this.onSubmit} className="newform-container">
                <label> Your Name: </label>
                <input
                  onChange={this.onChange}
                  ref={this.accNameRef}
                  type="text"
                  placeholder="e.g. MY COMPANY PHARMACEUTICAL INDUSTRIES"
                  value={this.state.accName}
                />
                <div>
                  <input className="btn" type="submit" value="CREATE ACCOUNT" />
                </div>
                <div
                  style={{ marginTop: "20px" }}
                  className="notify-data-container notify-text "
                >
                  {this.state.msg}
                </div>
              </form>
        );
    }
}

class ManageAccount extends Component {
    render() {
        return(
            <div> Manage Your Bank Account </div>
        );
    }
}
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
            <BrowserRouter>
        <div className="product-form-container">
          <div className="side-nav">
            <ul className="mini-nav-list">
              <li className="link-item">
                <NavLink to="/bank-account/new">
                  + CREATE ACCOUNT
                </NavLink>
              </li>
              <li className="link-item">
                
                <NavLink to="/bank-account/manage">
                  + MANAGE ACCOUNT
                </NavLink>
              </li>

            </ul>
          </div>
          <div className="main-content">
            <Route
              path="/bank-account/new"
              exact
              render={(props) => (
                <CreateAccount
                  {...props}
                  account={this.props.accounts}
                  contract={this.props.contract}
                />
              )}
            />
            <Route
              path="/bank-account/manage"
              exact
              render={(props) => (
                <ManageAccount
                  {...props}
                  account={this.props.accounts}
                  contract={this.props.contract}
                />
              )}
            />
          </div>
        </div>
      </BrowserRouter>
        );
    }
}

export default BankAccounts;
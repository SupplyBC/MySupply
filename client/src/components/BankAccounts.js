import React, { Component } from "react";
import { BrowserRouter, Route, NavLink } from "react-router-dom";

class CreateAccount extends Component {
  state = { msg: "", address: "", accName: "" };

  constructor(props) {
    super(props);
    this.accNameRef = React.createRef();
    this.accAddrRef = React.createRef();
    this.onSubmit = this.onSubmit.bind(this);
    this.onChange = this.onChange.bind(this);
  }

  onSubmit = async (e) => {
    e.preventDefault();
    const accountName = this.state.accName;
    await this.props.pcContract.methods
      .createBankAccount(this.props.account[0],accountName)
      .send({ from: this.props.account[0] })
      .once("receipt", (receipt) => {
        this.setState({ msg: "account was created successfully!" });
        setTimeout(() => {
          this.setState({ msg: " " });
        }, 3000);
      });

    this.setState({ address: "", accName: "" });
  };

  onChange = async (e) => {
    this.setState({
      accName: this.accNameRef.current.value,
    });
  };
  render() {
    let acc = this.props.account;
    let cont1 = this.props.pcContract;
    let cont2 = this.props.pctContract;
    if (!acc || !cont1 || !cont2) {
      return <div> Loading..... </div>;
    }
    return (
      <form onSubmit={this.onSubmit} className="newform-container">
        <label> Your Name: </label>
        <input
          onChange={this.onChange}
          ref={this.accNameRef}
          type="text"
          placeholder="e.g. MY COMPANY PHARMACEUTICAL INDUSTRIES"
          value={this.state.accName}
          required="required"
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
class Deposit extends Component {
  state = { msg: "", depositAmount: 0, usrAddr: "" };

  constructor(props) {
    super(props);
    this.amountRef = React.createRef();
    this.onSubmit = this.onSubmit.bind(this);
    this.onChange = this.onChange.bind(this);
  }

  onSubmit = async (e) => {
    e.preventDefault();
    const amount = parseInt(this.state.depositAmount, 10);

    await this.props.pcContract.methods
      .deposit(this.props.account[0],amount)
      .send({ from: this.props.account[0] })
      .once("receipt", (receipt) => {
        this.setState({ msg: "deposit was completed successfully!" });
        setTimeout(() => {
          this.setState({ msg: " " });
        }, 3000);
      });

    this.setState({ depositAmount: "", usrAddr: "" });
  };

  onChange = async (e) => {
    this.setState({
      depositAmount: this.amountRef.current.value,
    });
  };

  render() {
    return (
      <form onSubmit={this.onSubmit} className=" newform-container bank">
        <h4> Deposit </h4>
        <label> Enter Amount: </label>
        <input
          onChange={this.onChange}
          ref={this.amountRef}
          type="number"
          placeholder="e.g. 125000"
          value={this.state.depositAmount}
          required="required"
        />
        <div>
          <input className="btn" type="submit" value="DEPOSIT" />
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

class Withdraw extends Component {
  state = { msg: "", withdrawalAmount: 0, usrAddr: "" };

  constructor(props) {
    super(props);
    this.amountRef = React.createRef();
    this.onSubmit = this.onSubmit.bind(this);
    this.onChange = this.onChange.bind(this);
  }

  onSubmit = async (e) => {
    e.preventDefault();
    const amount = parseInt(this.state.withdrawalAmount, 10);
    await this.props.pcContract.methods
      .withdraw(this.props.account[0],amount)
      .send({ from: this.props.account[0] })
      .once("receipt", (receipt) => {
        this.setState({ msg: "Withdrawal completed successfully!" });
        setTimeout(() => {
          this.setState({ msg: " " });
        }, 3000);
      });

    this.setState({ withdrawalAmount: "", usrAddr: "" });
  };

  onChange = async (e) => {
    this.setState({
      withdrawalAmount: this.amountRef.current.value,
    });
  };

  render() {
    return (
      <form onSubmit={this.onSubmit} className=" newform-container bank">
        <h4> Withdraw </h4>
        <label> Enter Amount: </label>
        <input
          onChange={this.onChange}
          ref={this.amountRef}
          type="number"
          placeholder="e.g. 125000"
          value={this.state.withdrawalAmount}
          required="required"
        />
        <div>
          <input className="btn" type="submit" value="WITHDRAW" />
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

class Transfer extends Component {
  state = { msg: "", transferAmount: 0, fromAddr: "", toAddr: "" };

  constructor(props) {
    super(props);
    this.amountRef = React.createRef();
    this.toRef = React.createRef();
    this.onSubmit = this.onSubmit.bind(this);
    this.onChange = this.onChange.bind(this);
  }

  onSubmit = async (e) => {
    e.preventDefault();
    const to = this.state.toAddr;
    const amount = parseInt(this.state.transferAmount, 10);
    await this.props.pcContract.methods
      .transfer(this.props.account[0],to, amount)
      .send({ from: this.props.account[0] })
      .once("receipt", (receipt) => {
        this.setState({ msg: "Transfer was completed successfully!" });
        setTimeout(() => {
          this.setState({ msg: " " });
        }, 3000);
      });

    this.setState({ transferAmount: "", fromAddr: "", toAddr: "" });
  };

  onChange = async (e) => {
    this.setState({
      transferAmount: this.amountRef.current.value,
      toAddr: this.toRef.current.value,
    });
  };

  render() {
    return (
      <form onSubmit={this.onSubmit} className=" newform-container bank">
        <h4> Transfer </h4>
        <label> Enter Amount: </label>
        <input
          onChange={this.onChange}
          ref={this.amountRef}
          type="number"
          placeholder="e.g. 125000"
          value={this.state.transferAmount}
          required="required"
        />
        <label> Transfer to: </label>
        <input
          onChange={this.onChange}
          ref={this.toRef}
          type="text"
          placeholder="e.g. 0x9F04c9437De819788e7f35D25ed236A6EfA1653B"
          value={this.state.toAddr}
          required="required"
        />
        <div>
          <input className="btn" type="submit" value="TRANSFER" />
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
  state = { msg: "", userAddr: "", userName: "", bankAddr: "0x00", balance: 0 };

  componentDidMount = async () => {
    const bank = await this.props.pcContract.methods.getBank().call();
    const balance = await this.props.pcContract.methods
      .getBalance(this.props.account[0])
      .call();
    const balanceUSD = parseInt(balance, 10).toLocaleString("en-US", {
      style: "currency",
      currency: "USD",
    });
    const userInfo = await this.props.pcContract.methods
      .getAccountDetails(this.props.account[0])
      .call();
    const addr = userInfo.userId;
    const name = userInfo.userName;
    const accState = userInfo.isActive;
    this.setState({
      bank,
      balanceUSD,
      userAddr: addr,
      userName: name,
      accState,
    });
  };
  // constructor(props) {
  //   super(props);
  //   this.accAddrRef = React.createRef();
  //   this.onSubmit = this.onSubmit.bind(this);
  //   this.onChange = this.onChange.bind(this);
  // }

  render() {
    let acc = this.props.account;
    let cont1 = this.props.pcContract;
    let cont2 = this.props.pctContract;
    let web3 = this.props.web3;
    if (!acc || !cont1 || !cont2 || !web3) {
      return <div> Loading..... </div>;
    }
    if (!this.state.accState) {
      return (
        <div className="alert">
          {" "}
          You don't have a bank account to manage! Please create an account and
          try again!
        </div>
      );
    }
    return (
      <div style={{ margin: "0", padding: "0" }} className="newform-container">
        <div className="account-details">
          <p>
            
            <strong>Bank ID:</strong> <em>{this.state.bank}</em>
          </p>
          <p>
            
            <strong> Account ID:</strong> <em>{this.state.userAddr}</em>
          </p>
          <p>
            
            <strong> Username:</strong> <em>{this.state.userName}</em>
          </p>
          <p>
            
            <strong> Current Balance:</strong> <em>{this.state.balanceUSD} </em>
          </p>
        </div>
        <hr className="custom-hr-full" />
        <Deposit 
        account={this.props.account}
        pcContract={this.props.pcContract}
        pctContract={this.props.pctContract} />
        <hr className="custom-hr-half" />
        <Withdraw
        account={this.props.account}
        pcContract={this.props.pcContract}
        pctContract={this.props.pctContract} />
        <hr className="custom-hr-half" />
        <Transfer
          account={this.props.account}
          pcContract={this.props.pcContract}
          pctContract={this.props.pctContract}
          web3={this.props.web3}
        />
      </div>
    );
  }
}

class TxHistory extends Component {
  state = { txLog: null, sortSelection: "" };

  constructor(props) {
    super(props);
    this.sortRef = React.createRef();
    this.onChange = this.onChange.bind(this);
  }

  componentDidMount = async () => {
   
    const txEvents = await this.props.pcContract.getPastEvents("BankTransact", {
      filter: {
        _from: this.props.account[0],
      },
      fromBlock: 0,
    });

    const txs = txEvents.reverse().map((item, index) => {
      let type = item.returnValues.txName;
      let from = item.returnValues._from;
      let to = item.returnValues._to;
      let amount = parseInt(
        item.returnValues._amount,
        10
      ).toLocaleString("en-US", { style: "currency", currency: "USD" });
      let time = new Date(item.returnValues.timestamp * 1000).toString();
      const dateArr = time.split(" ", 5);
      const timestamp = dateArr.join(" ");

      return (
        <div className="tx-container" key={index}>
          <div className="head">
            <p className="head-title">{type}</p>
            <span className="time">{timestamp}</span>
          </div>
          <hr className="custom-hr-full"></hr>
          <div className="content">
            <p>
             <strong>VALUE</strong>
             <em>{amount}</em>
            </p>
            <p>
              <strong>FROM</strong> <em>{from}</em>
            </p>
            <p>
              <strong>TO</strong> <em>{to}</em>
            </p>
          </div>
        </div>
      );
    });

    this.setState({ txLog: txs });
  };

  onChange = async (e) => {

    if(this.sortRef.current.value === 'new') {
      this.setState({txLog: this.state.txLog.reverse()})
    } else {
      this.setState({txLog: this.state.txLog.reverse()})
    }
}
  render() {
    return (
      <div className="newform-container">
        <div className="panel">
          <h4> Transactions History</h4>
          <form className="sort-form">
            <label>VIEW: </label>
            <select ref={this.sortRef} onChange={this.onChange}>
              <option id="1" value="new">
                NEW TO OLD
              </option>
              <option id="2" value="old">
                OLD TO NEW
              </option>
            </select>
          </form>
        </div>
        <div className="tx-content">{this.state.txLog}</div>
      </div>
    );
  }
}

class BankAccounts extends Component {

  render() {
    let acc = this.props.accounts;
    let cont1 = this.props.pcContract;
    let cont2 = this.props.pctContract;
    let web3 = this.props.web3;
    
    if (!acc || !cont1 || !cont2 || !web3) {
      return <div> Loading..... </div>;
    }

    return (
      <BrowserRouter>
        <div className="product-form-container">
          <div className="side-nav">
            <ul className="mini-nav-list">
              <li className="link-item">
                <NavLink to="/bank-account/new">+ CREATE ACCOUNT</NavLink>
              </li>
              <li className="link-item">
                <NavLink to="/bank-account/manage">+ MANAGE ACCOUNT</NavLink>
              </li>
              <li className="link-item">
                <NavLink to="/bank-account/tx-history">
                  + TRANSACTIONS HISTORY
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
                  pcContract={this.props.pcContract}
                  pctContract={this.props.pctContract}
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
                  pcContract={this.props.pcContract}
                  pctContract={this.props.pctContract}
                  web3={this.props.web3}
                />
              )}
            />
            <Route
              path="/bank-account/tx-history"
              exact
              render={(props) => (
                <TxHistory
                  {...props}
                  account={this.props.accounts}
                  pcContract={this.props.pcContract}
                  pctContract={this.props.pctContract}
                  web3={this.props.web3}
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

import React, { Component } from "react";
import getWeb3 from "./getWeb3";
import Header from "./components/Header";
import SupplyForm from "./components/SupplyForm";
import Track from "./components/TrackForm";
import Inventory from "./components/Inventory";
import AddProduct from "./components/AddProduct";
import FinancialLog from "./components/FinancialLog";
import BankAccounts from "./components/BankAccounts";
import NewDemoTestContract from "./contracts/NewDemoTest.json";
import { BrowserRouter, Route, NavLink } from "react-router-dom";
import "./App.css";

class App extends Component {
  // state = { storageValue: 0, web3: null, accounts: null, contract: null };
  state = { web3: null, accounts: null, contract: null , isMenuToggled: false };

  constructor(props) {
    super(props);
    this.toggleMenu = this.toggleMenu.bind(this);
    this.collapseMenu = this.collapseMenu.bind(this);
  }

  componentDidMount = async () => {
    try {
      // Get network provider and web3 instance.
      const web3 = await getWeb3();

      // Use web3 to get the user's accounts.
      const accounts = await web3.eth.getAccounts();
      // const balance = web3.utils.fromWei(
      // await web3.eth.getBalance(accounts[0]),
      //   "ether"
      // );
      // Get the contract instance.
      const networkId = await web3.eth.net.getId();
      const deployedNetwork = NewDemoTestContract.networks[networkId];
      const instance = new web3.eth.Contract(
        NewDemoTestContract.abi,
        deployedNetwork && deployedNetwork.address
      );
      // Set web3, accounts, and contract to the state, and then proceed with an
      // example of interacting with the contract's methods.
      // this.setState({ web3, accounts, contract: instance }, this.runExample);

      const balance = await instance.methods.getBalance(accounts[0]).call();
      this.setState({ web3, accounts, balance, contract: instance });
    } catch (error) {
      // Catch any errors for any of the above operations.
      alert(`Failed to load Web3. Please check your web3 connection and try again!`);
      //  console.error(error);
    }
  };

  collapseMenu() {
    
    setTimeout(() => {
      this.setState({isMenuToggled: false});
    }, 200);
    
  }

  toggleMenu() {
    this.setState({isMenuToggled: !this.state.isMenuToggled})
  }

  render() {
    if (!this.state.web3) {
      return <div style={{textAlign:'center' , margin: '50px auto', padding: '10px'}}>
        <img src={require("./assets/imgs/spinner.gif")}  alt='loading'/>
        </div>;
    }
    let toggle
    this.state.isMenuToggled ?  toggle = '' : toggle = 'hide'
    return (
      <BrowserRouter>
        <div className="App">
          <Header accounts={this.state.accounts} balance={this.state.balance} />
          <div className="navbar-container">
          <button onClick={this.toggleMenu} className="responsive-menu">
            <img
            alt = "hamburger-menu"
            width = "20px"
            src={require("../src/assets/imgs/hamburger-menu.svg")}/>
            </button>
            <ul id = "my-nav" className={`nav-list ${toggle}`}>
              <li className="nav-item">
                <NavLink onClick={this.collapseMenu} to="/add-product">ADD PRODUCT</NavLink>
              </li>
              <li className="nav-item">
                
                <NavLink onClick={this.collapseMenu} to="/supply">REQUEST MATERIAL</NavLink>
              </li>
              <li className="nav-item">
                
                <NavLink onClick={this.collapseMenu} to="/track">TRACK REQUESTS</NavLink>
              </li>
              <li className="nav-item">
                
              <NavLink onClick={this.collapseMenu} to="/inventory">VIEW INVENTORY</NavLink>
              </li>
              <li className="nav-item">
                
                <NavLink onClick={this.collapseMenu} to="/financial-log">FINANCIAL LOG</NavLink>
              </li>
              <li className="nav-item">
                
                <NavLink onClick={this.collapseMenu} to="/bank-account">MANAGE BANK ACCOUNTS</NavLink>
              </li>
            </ul>
          </div>

          {/* <Route path="/" exact component={App} /> */}
          {/* <Route path="/add-product" exact 
        render={(props) => (
          <AddProduct {...props} accounts={this.state.accounts} contract={this.state.contract} />
        )} /> */}

          <Route
            path="/supply"
            exact
            render={(props) => (
              <SupplyForm
                {...props}
                Web3={this.state.web3}
                account={this.state.accounts}
                contract={this.state.contract}
              />
            )}
          />
          <Route path="/inventory" exact component={Inventory} />
          <Route
            path="/track"
            exact
            render={ (props) => (
              <Track
                {...props}
                Web3={this.state.web3}
                account={this.state.accounts}
                contract={this.state.contract}
                
              />
            )}
          />
          <Route
            path="/add-product"
            exact
            render={(props) => (
              <AddProduct
                {...props}
                accounts={this.state.accounts}
                contract={this.state.contract}
              />
            )}
          />
          <Route path="/financial-log" exact
          render={(props) => (
            <FinancialLog
              {...props}
              accounts={this.state.accounts}
              contract={this.state.contract}
            />
          )}/>
          <Route path="/bank-account" exact
          render={(props) => (
            <BankAccounts
              {...props}
              accounts={this.state.accounts}
              contract={this.state.contract}
              web3 = {this.state.web3}
            />
          )}/>
          {/* <Navbar /> */}
          {/* <ProductForm contract = {this.state.contract} accounts = {this.state.accounts} /> */}
          {/* <Inventory /> */}
          {/* <MaterialsList/> */}
          {/* <h1>Good to Go!</h1>
        <p>Your Truffle Box is installed and ready.</p>
        <h2>Smart Contract Example</h2>
        <p>
          If your contracts compiled and migrated successfully, below will show
          a stored value of 5 (by default).
        </p>
        <p>
          Try changing the value stored on <strong>line 40</strong> of App.js.
        </p>
        <div>The stored value is: {this.state.storageValue}</div> */}
          <div> {this.state.response} </div>
        </div>
      </BrowserRouter>
    );
  }
}

export default App;

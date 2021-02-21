import React, { Component } from "react";
import getWeb3 from "./getWeb3";
import Header from "./components/Header";
import SupplyForm from "./components/SupplyForm";
import Track from "./components/TrackForm";
import Inventory from "./components/Inventory";
import AddProduct from "./components/AddProduct";
import FinancialLog from "./components/FinancialLog";
import NewDemoTestContract from "./contracts/NewDemoTest.json";
import { BrowserRouter, Route, NavLink } from "react-router-dom";
import "./App.css";

class App extends Component {
  // state = { storageValue: 0, web3: null, accounts: null, contract: null };
  state = { web3: null, accounts: null, contract: null , isMenuToggled: false };

  constructor(props) {
    super(props);
    this.toggleMenu = this.toggleMenu.bind(this);
  }

  componentDidMount = async () => {
    try {
      // Get network provider and web3 instance.
      const web3 = await getWeb3();

      // Use web3 to get the user's accounts.
      const accounts = await web3.eth.getAccounts();
      const balance = web3.utils.fromWei(
      await web3.eth.getBalance(accounts[0]),
        "ether"
      );
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
      this.setState({ web3, accounts, balance, contract: instance });
    } catch (error) {
      // Catch any errors for any of the above operations.
      alert(`Failed to load Web3. Please check your web3 connection and try again!`);
      //  console.error(error);
    }
  };

  //  runExample = async () => {
  //  const {contract, accounts } = this.state;

  //   // Stores a given value, 5 by default.
  //   // await contract.methods.set(5).send({ from: accounts[0] });
  //   const supplier =  await contract.methods.getSupplier('0xf333028b8Fc7a030F1186Db50BceF0C0607c2CF2').call();
  // await contract.methods.createLog(1, 'SHIPPED' ,'20C', '25%', 'NORMAL').send({from: accounts[0]})
  // const response = await contract.methods.getTrackLogs(1).call()

  //   // Get the value from the contract to prove it worked.
  //   // const response = await contract.methods.get().call();

  //   // Update state with the result.
  //   this.setState({ supplier });
  // this.setState({response});
  //  };

  toggleMenu() {
    if (this.state.isMenuToggled === '') {
    } else {
    this.setState({isMenuToggled: !this.state.isMenuToggled})
    }
  }

  render() {
    // if (!this.state.web3) {
    //   return <div>Loading Web3, accounts, and contract...</div>;
    // }
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
            src={require("../src/hamburger-menu.svg")}/>
            </button>
            <ul id = "my-nav" className={`nav-list ${toggle}`}>
              <li className="nav-item">
                <NavLink to="/add-product">ADD PRODUCT</NavLink>{" "}
              </li>
              <li className="nav-item">
                {" "}
                <NavLink to="/supply">REQUEST MATERIAL</NavLink>{" "}
              </li>
              <li className="nav-item">
                {" "}
                <NavLink to="/track">TRACK REQUESTS</NavLink>{" "}
              </li>
              <li className="nav-item">
                {" "}
                <NavLink to="/inventory">VIEW INVENTORY</NavLink>{" "}
              </li>
              <li className="nav-item">
                {" "}
                <NavLink to="/financial-log">FINANCIAL LOG</NavLink>{" "}
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
            render={(props) => (
              <Track
                {...props}
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

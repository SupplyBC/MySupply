import React, { Component } from "react";
import { BrowserRouter, Route, NavLink } from "react-router-dom";

class QueryProductSpecs extends Component {
  state = { proName: "" };

  constructor(props) {
    super(props);
    this.productRef = React.createRef();
    this.onSubmit = this.onSubmit.bind(this);
    this.onChange = this.onChange.bind(this);
  }

  onSubmit = async (e) => {
    e.preventDefault();

    // this.props.contract.methods.addProduct('1', this.state.input).send({from: this.props.accounts[0]});
    // const material = this.state.materialName;
    // const proName = this.state.proName;
    // const supplierId = this.state.supplier;

    const specs = await this.props.contract.methods
      .getProductSpecs(this.state.proName)
      .call();
    if (specs.length === 0) {
      this.setState({
        specs: specs.push(
          "Didn't find any specs for the given product ID, please try again!".toUpperCase()
        ),
      });
    }
    this.setState({ specs });
    this.setState({ proName: "" });
  };

  onChange = (e) => {
    this.setState({
      proName: this.productRef.current.value,
    });
  };

  render() {
    let acc = this.props.account;
    let cont = this.props.contract;
    if (!acc || !cont) {
      return <div> Loading..... </div>;
    }
    return (
      <form onSubmit={this.onSubmit} className="newform-container">
        <label> Enter Product ID </label>

        <input
          type="text"
          ref={this.productRef}
          placeholder="e.g. pro101"
          value={this.state.proName}
          onChange={this.onChange}
        />

        <input
          style={{ cursor: "pointer" }}
          className="btn"
          type="submit"
          value="VIEW PRODUCT SPECS"
        />

        <div
          style={{ marginTop: "20px"}}
          className="product-data-container"
        >
          {this.state.specs}
        </div>
      </form>
    );
  }
}

class RequestMaterials extends Component {
  state = {
    materialName: "",
    materialsVisibility: false,
    supplier: "",
    amount: 0,
    form: "",
    strength: 0,
    msg: " ",
  };

  constructor(props) {
    super(props);
    this.materialRef = React.createRef();
    this.supplierRef = React.createRef();
    this.amountRef = React.createRef();
    this.formRef = React.createRef();
    this.matStrRef = React.createRef();
    this.onSubmit = this.onSubmit.bind(this);
    this.onChange = this.onChange.bind(this);
  }

  onSubmit = async (e) => {
    e.preventDefault();
    const material = this.state.materialName;
    // const proName = this.state.proName;
    const supplierId = this.state.supplier;
    const matform = this.state.form;
    const matamount = this.state.amount;
    const matstr = this.state.strength;
    console.log(supplierId, material, matform, matamount, matstr);
    if (this.props.Web3.utils.isAddress(this.state.supplier)) {
      await this.props.contract.methods
        .createRequest(supplierId, this.state.materialName, matform, matamount)
        .send({ from: this.props.account[0] })
        .once("receipt", (receipt) => {
          this.setState({ msg: "Request was sent successfully!" });
          setTimeout(() => {
            this.setState({ msg: " " })
           }, 2000);
        });
      // if (request.length === 0) {
      //   this.setState({
      //     materials: materials.push(
      //       "This supplier has no recently created materials!"
      //     ),
      //   });
      // }
      this.setState({
        matName: "",
        proName: "",
        supplier: "",
        form: "",
        amount: "",
        strength: "",
        materialsVisibility: true,
      });
      // this.setState({ requests: this.state.requests + 1 });
    }
    else {
      this.setState({ msg: "Please Try Again!" });
      setTimeout(() => {
        this.setState({ msg: " " })
       }, 2000);
    }

    // this.props.contract.methods.addProduct('1', this.state.input).send({from: this.props.accounts[0]});
    //  const material = this.state.materialName;
    // // const proName = this.state.proName;
    //  const supplierId = this.state.supplier;
    //  const matform = this.state.form;
    //  const matamount =this.state.amount;
    this.setState({ supplier: "", materialName: "", amount: null, form: "" });
  };

  onChange = (e) => {
    this.setState({
      materialName: this.materialRef.current.value,
      supplier: this.supplierRef.current.value,
      amount: this.amountRef.current.value,
      form: this.formRef.current.value,
    });
  };

  render() {
    let acc = this.props.account;
    let cont = this.props.contract;
    let web = this.props.Web3;
    if (!acc || !cont || !web) {
      return <div> Loading..... </div>;
    }
    return (
      <form onSubmit={this.onSubmit} className="newform-container">
        <label> Supplier ID:</label>

        <input
          type="text"
          id="supplier-id"
          ref={this.supplierRef}
          placeholder="e.g. 0x49A504f461b36A9337Ddaf1f63c3A3AAD0242E81"
          autoComplete="off"
          value={this.state.supplier}
          onChange={this.onChange}
        />

        {/* <button
                    style= {{cursor:'pointer'}}
                    className="btn"
                    type="submit"
                    onClick = {this.getProductSpecs}
                    >SEARCH FOR MATERIAL </button> */}

        <label> Material Name: </label>
        <select
          name="material-name"
          onChange={this.onChange}
          ref={this.materialRef}
        >
          <option id="1" value="vitamin-a">
            VITAMIN A
          </option>
          <option id="2" value="vitmain-b-complex">
            VITAMIN B COMPLEX
          </option>
          <option id="3" value="vitamin-c-extract">
            VITAMIN C EXTRACT
          </option>
          <option id="4" value="vitamin-d">
            VITAMIN D
          </option>
          <option id="5" value="potassium">
            POTASSIUM
          </option>
          <option id="6" value="zinc">
            ZINC
          </option>
          <option id="7" value="plastic">
            PLASTIC
          </option>
          <option id="8" value="glass">
            GLASS
          </option>
          <option id="9" value="wood">
            WOOD
          </option>
          <option id="10" value="wheat-germ-oil">
            WHEAT GERM OIL
          </option>
          <option id="11" value="paracetamol">
            PARACETAMOL
          </option>
          <option id="12" value="ginseng">
            GINSENG
          </option>
          <option id="13" value="selenium">
            SELENIUM
          </option>
          <option id="14" value="DHA">
            DHA
          </option>
          <option id="15" value="folic-acid">
            FOLIC ACID
          </option>
          <option id="16" value="lysine">
            LYSINE
          </option>
          <option id="17" value="nickel">
            NICKEL
          </option>
        </select>

        <label> Material Form: </label>
        <select
          name="requested-mat-form"
          onChange={this.handleChange}
          ref={this.formRef}
        >
          <option id="pow" value="powder">
            POWDER
          </option>
          <option id="liq" value="liquid">
            LIQUID
          </option>
          <option id="na" value="n/a">
            N/A
          </option>
        </select>
        <label> Material Strength: </label>
        <input
          value={this.state.matStr}
          onChange={this.handleChange}
          ref={this.matStrRef}
          type="number"
          placeholder="e.g. 10"
        />

        <label>Requested Amount: </label>

        <input
          type="number"
          id="material-amount"
          value={this.state.amount}
          ref={this.amountRef}
          placeholder="e.g. 1000 KGs"
          autoComplete="off"
          onChange={this.onChange}
        />

        <input
          style={{ cursor: "pointer" }}
          className="btn"
          type="submit"
          value="SEND MATERIAL REQUEST"
        />

        <div
          style={{ marginTop: "20px"}}
          className="notify-data-container notify-text"
        >
          {this.state.msg}
        </div>
      </form>
    );
  }
}

class CreateMaterial extends Component {
  render() {
    return(
      <div>
        <em> Supplier Feature to Create Material</em>
      </div>
    );
  }
}

class SupplyForm extends Component {
  // state = {materialName: '' , materialsVisibility:  false , proName: '' , supplier: '' }

  // constructor(props) {
  //     super(props);

  //     this.materialRef = React.createRef();
  //     this.supplierRef = React.createRef();
  //     this.onSubmit = this.onSubmit.bind(this)
  //     this.onChange = this.onChange.bind(this)
  //     this.viewMaterialBySupplierAddress = this.viewMaterialBySupplierAddress.bind(this)
  //     this.viewSpecs = this.viewSpecs.bind(this)
  // }

  componentDidMount = async () => {
    // if (!this.props.contract || !this.props.accounts) {
    //     return <h2> PLEASE WAIT... </h2>;
    // }
  };

  // onSubmit = async (e) => {
  //     e.preventDefault();
  //     // this.props.contract.methods.addProduct('1', this.state.input).send({from: this.props.accounts[0]});
  //     // this.logProduct();
  //     // const material = this.state.materialName;
  //     // const proName = this.state.proName;
  //     // const supplierId = this.state.supplier;

  //     this.viewMaterialBySupplierAddress();
  //   }

  // onChange = (e) => {
  //     e.preventDefault();
  //     this.setState({

  //         proName : this.productRef.current.value,
  //         // materialName : this.materialRef.current.value,
  //         supplier: this.supplierRef.current.value
  //         });
  // }

  // logProduct = async () => {
  //     const product = await this.props.contract.methods.getProductDetails('5').call();
  //     console.table(product);
  // }

  // fakeTransact = async () => {
  //     //await contract.methods.set(5).send({ from: accounts[0] });
  //     this.props.contract.methods.set(5).send({from: this.props.accounts[0]})
  //     this.setState({materialsVisibility: !this.setState.materialsVisibility });
  //     console.log(this.state.materialsVisibility)
  // }

  // viewSpecs = async () => {
  //   const specs = await this.props.contract.methods
  //     .getProductSpecs(this.state.proName)
  //     .call();
  //   if (specs.length === 0) {
  //     this.setState({
  //       specs: specs.push(
  //         "Didn't find any specs for the given product ID, please try again!"
  //       ),
  //     });
  //   }
  //   console.log(specs);
  //   this.setState({ specs });
  // };

  // viewMaterialBySupplierAddress = async () => {
  //   // console.log()
  //   if (this.props.Web3.utils.isAddress(this.state.supplier)) {
  //     const materials = await this.props.contract.methods
  //       .getMaterialBySupplier(`${this.state.supplier}`)
  //       .call();
  //     if (materials.length === 0) {
  //       this.setState({
  //         materials: materials.push(
  //           "This supplier has no materials created currently!"
  //         ),
  //       });
  //     }
  //     this.setState({ materials });
  //   }
  // };
  render() {
    // const vis = this.state.materialsVisibility ? 'show' : 'hide';
    // const random = Math.floor(Math.random() * 100);
    let acc = this.props.account;
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
                <NavLink to="/supply/querySpecs">+ QUERY PRODUCT SPECS</NavLink>{" "}
              </li>
              <li className="link-item">
                {" "}
                <NavLink to="/supply/requestMaterial">
                  + REQUEST MATERIALS
                </NavLink>
              </li>
              <label style={{marginTop: '10px'}}><strong> SUPPLIER </strong> </label>
              <li className="link-item">
                
                {" "}
                <NavLink to="/supply/supplier/createMaterial">
                  + CREATE MATERIAL
                </NavLink>
              </li>
            </ul>
          </div>
          <div className="main-content">
            <Route
              path="/supply/querySpecs"
              exact
              render={(props) => (
                <QueryProductSpecs
                  {...props}
                  account={this.props.account}
                  contract={this.props.contract}
                />
              )}
            />
            <Route
              path="/supply/requestMaterial"
              exact
              render={(props) => (
                <RequestMaterials
                  {...props}
                  Web3={this.props.Web3}
                  account={this.props.account}
                  contract={this.props.contract}
                />
              )}
            />
            <Route
              path="/supply/supplier/createMaterial"
              exact
              render={(props) => (
                <CreateMaterial
                  {...props}
                  Web3={this.props.Web3}
                  account={this.props.account}
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

export default SupplyForm;

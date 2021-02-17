import React, { Component } from "react";
import { BrowserRouter, Route, NavLink } from "react-router-dom";

class CreateProduct extends Component {
  state = { productName: "", productId: "", productForm: "", msg: " " };

  constructor(props) {
    super(props);
    this.nameRef = React.createRef();
    this.idRef = React.createRef();
    this.formRef = React.createRef();
    // this.handleNameChange = this.handleNameChange.bind(this);
    // this.handleIdChange = this.handleIdChange.bind(this);
    // this.handleFormChange = this.handleFormChange.bind(this);
    this.handleChange = this.handleChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
    // this.handleSubmit = this.handleChange.bind(this);
  }

  sendData() {}

  handleSubmit = async (e) => {
    e.preventDefault();
    let name = this.state.productName;
    let id = this.state.productId;
    let form = this.state.productForm;
    await this.props.contract.methods
      .addProduct(name, id, form)
      .send({ from: this.props.account[0] })
      .once("receipt", (receipt) => {
        this.setState({ msg: "Product was created successfully!" });
      });
    this.setState({
      productName: "",
      productId: "",
      productForm: "",
    });
    // await this.props.contract.methods.addProduct(id,name,form).send({from: this.props.accounts[0]});
    console.log(name, id, form);
  };

  handleChange = async (e) => {
    this.setState({
      productName: this.nameRef.current.value,
      productId: this.idRef.current.value,
      productForm: this.formRef.current.value,
    });
    console.log(this.props.account, this.props.contract);
  };

  render() {
    let acc = this.props.account;
    let cont = this.props.contract;
    if (!acc || !cont) {
      return <div> Loading..... </div>;
    }
    return (
      <form onSubmit={this.handleSubmit} className="newform-container">
        <label> Product Name: </label>
        <input
          onChange={this.handleChange}
          ref={this.nameRef}
          type="text"
          placeholder="e.g. MyProduct"
          value={this.state.productName}
        />
        <label> Product ID: </label>
        <input
          onChange={this.handleChange}
          ref={this.idRef}
          type="text"
          placeholder="e.g. pro101"
          value={this.state.productId}
        />
        <label> Product Form: </label>
        <select ref={this.formRef} onChange={this.handleChange}>
          <option id="1" value="tablets">
            TABLETS
          </option>
          <option id="2" value="capsules">
            CAPSULES
          </option>
          <option id="3" value="tablets">
            OTHER
          </option>
        </select>
        <div>
          <input className="btn" type="submit" value="CREATE PRODUCT" />
        </div>
        <div
          style={{ marginTop: "20px", fontStyle: "italic" }}
          className="notify-data-container notify-text "
        >
          {this.state.msg}
        </div>
      </form>
    );
  }
}

class AddMaterial extends Component {
  state = {
    proID: "",
    matName: "",
    matType: "",
    matStr: 0,
    matForm: "",
    msg: " ",
  };
  constructor(props) {
    super(props);
    this.proIdRef = React.createRef();
    this.matNameRef = React.createRef();
    this.matTypeRef = React.createRef();
    this.matStrRef = React.createRef();
    this.matFormRef = React.createRef();
    this.handleChange = this.handleChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
  }

  handleSubmit = async (e) => {
    e.preventDefault();
    let proID = this.state.proID;
    let name = this.state.matName;
    let type = this.state.matType;
    let strength = this.state.matStr;
    let form = this.state.matForm;
    await this.props.contract.methods

      .addProductSpecs(
        this.state.proID,
        this.state.matName,
        this.state.matType,
        this.state.matStr,
        this.state.matForm
      )
      .send({ from: this.props.account[0] })
      .once("receipt", (receipt) => {
        this.setState({ msg: "Added product specification successfully!" });
      });
    this.setState({
      proID: "",
      matName: "",
      matType: "",
      matStr: "",
      matForm: "",
    });
    console.log(proID, name, type, strength, form);
  };

  handleChange = async (e) => {
    this.setState({
      proID: this.proIdRef.current.value,
      matName: this.matNameRef.current.value,
      matType: this.matTypeRef.current.value,
      matStr: this.matStrRef.current.value,
      matForm: this.matFormRef.current.value,
    });
  };
  render() {
    let acc = this.props.account;
    let cont = this.props.contract;

    if (!acc || !cont) {
      return <div> Loading..... </div>;
    }
    return (
      <form onSubmit={this.handleSubmit} className="newform-container">
        <label>Product ID: </label>
        <input
          value={this.state.proID}
          onChange={this.handleChange}
          ref={this.proIdRef}
          type="text"
          placeholder="e.g. pro101"
          autoComplete="off"
        />
        <label> Material Name: </label>
        <select
          name="mat-name"
          onChange={this.handleChange}
          ref={this.matNameRef}
        >
          <option id="11" value="vitamin-a">
            VITAMIN A
          </option>
          <option id="22" value="vitmain-b-complex">
            VITAMIN B COMPLEX
          </option>
          <option id="33" value="vitamin-c-extract">
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
            WHEAT GERM OIl
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

        <label> Material Type: </label>
        <select
          name="mat-type"
          onChange={this.handleChange}
          ref={this.matTypeRef}
        >
          <option id="1" value="active">
            ACTIVE
          </option>
          <option id="2" value="support">
            SUPPORT/SECONDARY
          </option>
          <option id="3" value="packaging">
            PACKAGING
          </option>
        </select>
        <label> Material Strength: </label>
        <input
          value={this.state.matStr}
          onChange={this.handleChange}
          ref={this.matStrRef}
          type="number"
          placeholder="e.g. 150 mg"
        />
        <label> Material Form: </label>
        <select
          name="mat-form"
          onChange={this.handleChange}
          ref={this.matFormRef}
        >
          <option id="1" value="powder">
            POWDER
          </option>
          <option id="2" value="liquid">
            LIQUID
          </option>
          <option id="3" value="n/a">
            N/A
          </option>
        </select>

        {/* <div>
                
                </div>
                 <div>
               
                </div>
                <div className="form-item">
                
                </div>
                 <div>
               
                 </div>
                 <div >
               
                </div> */}
        <div>
          <input className="btn" type="submit" value="ADD MATERIAL" />
        </div>

        <div
          style={{ marginTop: "20px", fontStyle: "italic" }}
          className="notify-data-container notify-text"
        >
          {this.state.msg}
        </div>
      </form>
    );
  }
}

class AddProduct extends Component {
  render() {
    let account = this.props.accounts;
    let contract = this.props.contract;
    if (!account || !contract) {
      return <div>Loading ..... </div>;
    }
    return (
      <BrowserRouter>
        <div className="product-form-container">
          <div className="side-nav">
            <ul className="mini-nav-list">
              <li className="link-item">
                <NavLink to="/add-product/createProduct">
                  + CREATE PRODUCT
                </NavLink>{" "}
              </li>
              <li className="link-item">
                {" "}
                <NavLink to="/add-product/addMaterial">+ ADD SPECS</NavLink>
              </li>
            </ul>
          </div>
          <div className="main-content">
            <Route
              path="/add-product/createProduct"
              exact
              render={(props) => (
                <CreateProduct
                  {...props}
                  account={this.props.accounts}
                  contract={this.props.contract}
                />
              )}
            />
            <Route
              path="/add-product/addMaterial"
              exact
              render={(props) => (
                <AddMaterial
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

export default AddProduct;

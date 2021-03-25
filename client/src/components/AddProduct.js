import React, { Component } from "react";
import { BrowserRouter, Route, NavLink } from "react-router-dom";

class CreateProduct extends Component {
  state = {
    productName: "",
    productId: "",
    productForm: "",
    msg: " ",
  };

  constructor(props) {
    super(props);
    this.nameRef = React.createRef();
    this.idRef = React.createRef();
    this.formRef = React.createRef();
    this.handleChange = this.handleChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
  }

  // sendData() {  }

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
        setTimeout(() => {
          this.setState({ msg: " " });
        }, 2000);
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
          style={{ marginTop: "20px" }}
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
    matAmount: 0,
    msg: " ",
  };
  constructor(props) {
    super(props);
    this.proIdRef = React.createRef();
    this.matNameRef = React.createRef();
    this.matTypeRef = React.createRef();
    this.matStrRef = React.createRef();
    this.matFormRef = React.createRef();
    this.matAmountRef = React.createRef();
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
    let amount = this.state.matAmount;
    await this.props.contract.methods

      .addProductSpecs(
        this.state.proID,
        this.state.matName,
        this.state.matType,
        this.state.matStr,
        this.state.matForm,
        this.state.matAmount
      )
      .send({ from: this.props.account[0] })
      .once("receipt", (receipt) => {
        this.setState({ msg: "Added product specification successfully!" });
        setTimeout(() => {
          this.setState({ msg: " " });
        }, 2000);
      });
    this.setState({
      matName: "",
      matType: "",
      matStr: "",
      matForm: "",
      matAmount: "",
    });
    console.log(proID, name, type, strength, form, amount);
  };

  handleChange = async (e) => {
    this.setState({
      proID: this.proIdRef.current.value,
      matName: this.matNameRef.current.value,
      matType: this.matTypeRef.current.value,
      matStr: this.matStrRef.current.value,
      matForm: this.matFormRef.current.value,
      matAmount: this.matAmountRef.current.value,
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
        <label> Material Amount (mg) :</label>
        <input
          value={this.state.matAmount}
          onChange={this.handleChange}
          ref={this.matAmountRef}
          type="number"
          placeholder="e.g. 10"
        />
        <label> Material Strength (%) : </label>
        <input
          value={this.state.matStr}
          onChange={this.handleChange}
          ref={this.matStrRef}
          type="number"
          placeholder="e.g. 10"
        />
        <label> Material Form: </label>
        <select
          name="material-form"
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
        <div>
          <input className="btn" type="submit" value="ADD PRODUCT SPECIFICATION" />
        </div>

        <div
          style={{ marginTop: "20px" }}
          className="notify-data-container notify-text"
        >
          {this.state.msg}
        </div>
      </form>
    );
  }
}

class CreateCostPlan extends Component {
  state = {
    product: "",
    directMaterialStdCost: 0,
    packagingMaterialStdCost: 0,
    laborStdCost: 0,
    manuIndirectStdCost: 0,
    mrkStdCost: 0,
    rsrhStdCost: 0,
    totalStdCost: 0,
    budget: 0,
  };

  constructor(props) {
    super(props);
    this.proRef = React.createRef();
    this.dirMatStdRef = React.createRef();
    this.pkgMatStdRef = React.createRef();
    this.labStdRef = React.createRef();
    this.manIndStdRef = React.createRef();
    this.mrkStdRef = React.createRef();
    this.rsrhStdRef = React.createRef();
    this.budgetRef = React.createRef();
    this.OnChange = this.onChange.bind(this);
    this.OnSubmit = this.OnSubmit.bind(this);
  }

  calculateTotalStd = async () => {};

  OnSubmit = async (e) => {
    e.preventDefault();

    const pro = this.state.product;
    const matStd = parseInt(this.state.directMaterialStdCost, 10);
    const pkgMatStd = parseInt(this.state.packagingMaterialStdCost,10)
    const labStd = parseInt(this.state.laborStdCost, 10);
    const manuIndirectStdCost = parseInt(this.state.manuIndirectStdCost, 10);
    const totBudget = parseInt(this.state.budget,10);
    const mrkStd = parseInt(this.state.mrkStdCost,10);
    const rsrhStd = parseInt(this.state.rsrhStdCost,10);
    
    const totalStandard = matStd + labStd + manuIndirectStdCost
                          + mrkStd + rsrhStd;
    
    this.setState({ totalStdCost: totalStandard });

    console.log(pro, matStd, labStd, manuIndirectStdCost, totalStandard, totBudget, pkgMatStd);
    await this.props.contract.methods.setStdCostPlan(pro,matStd, pkgMatStd,
      labStd, manuIndirectStdCost, mrkStd , rsrhStd, totBudget)
    .send({from: this.props.account[0]}).once("receipt", (receipt) => {
      this.setState({ msg: "Standard Cost Plan Was Set Successfully" });
      setTimeout(() => {
        this.setState({ msg: " " });
      }, 2000);
    });

    this.setState({
      product: "",
      directMaterialStdCost: "",
      packagingMaterialStdCost: "",
      laborStdCost: "",
      manuIndirectStdCost: "",
      mrkStdCost: "",
      rsrhStdCost: "",
      budget: ""
    });

  };

  onChange = async (e) => {
    this.setState({
      product: this.proRef.current.value,
      directMaterialStdCost: this.dirMatStdRef.current.value,
      packagingMaterialStdCost: this.pkgMatStdRef.current.value,
      laborStdCost: this.labStdRef.current.value,
      manuIndirectStdCost: this.manIndStdRef.current.value,
      mrkStdCost: this.mrkStdRef.current.value,
      rsrhStdCost: this.rsrhStdRef.current.value,
      budget: this.budgetRef.current.value,
    });
  };

  render() {
    return (
      <form onSubmit={this.OnSubmit}  className="newform-container">
        <label>Product ID:</label>
        <input
          type="text"
          ref={this.proRef}
          value={this.state.product}
          placeholder="e.g. pro101"
          onChange={this.OnChange}
          required = "required"
        />

        <h4> Set Standard Costs </h4>

        <label>Raw Materials: </label>
        <input
          type="number"
          ref={this.dirMatStdRef}
          value={this.state.directMaterialStdCost}
          placeholder="e.g. 5000"
          onChange={this.OnChange}
          required = "required"
        />

        <label>Packaging Materials: </label>
        <input
          type="number"
          ref={this.pkgMatStdRef}
          value={this.state.packagingMaterialStdCost}
          placeholder="e.g. 5000"
          onChange={this.OnChange}
          required = "required"
        />

        <label>Direct Labor: </label>
        <input
          type="number"
          ref={this.labStdRef}
          value={this.state.laborStdCost}
          placeholder="e.g. 5000"
          onChange={this.OnChange}
          required = "required"
        />

        <label>Manufacturing Overhead (Indirect Costs): </label>
        <input
          type="number"
          ref={this.manIndStdRef}
          value={this.state.manuIndirectStdCost}
          placeholder="e.g. 5000"
          onChange={this.OnChange}
          required = "required"
        />

        <label>Marketing: </label>
        <input
          type="number"
          ref={this.mrkStdRef}
          value={this.state.mrkStdCost}
          placeholder="e.g. 5000"
          onChange={this.OnChange}
          required = "required"
        />

        <label>Research: </label>
        <input
          type="number"
          ref={this.rsrhStdRef}
          value={this.state.rsrhStdCost}
          placeholder="e.g. 5000"
          onChange={this.OnChange}
          required = "required"
        />

        <h4> Set Product Budget </h4>

        <label>Product Budget:</label>
        <input
          type="number"
          ref={this.budgetRef}
          value={this.state.budget}
          placeholder="e.g. 5000"
          onChange={this.onChange}
        />

        {/* <div className="standard-cost-total-container"></div> */}

        <input
          type="submit"
          className="btn"
          value="CREATE STANDARD COST PLAN"
        />


        <div style={{marginTop:'20px'}} className = "notify-text">
          {this.state.msg}

        </div>
      </form>
    );
  }
}
class ReviewProduct extends Component {
  render() {
    let account = this.props.account;
    let contract = this.props.contract;
    if (!account || !contract) {
      return <div>Loading ..... </div>;
    }
    return(
      <div>Review Product Status</div>
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
                </NavLink>
              </li>
              <li className="link-item">
                
                <NavLink to="/add-product/addMaterial">
                  + ADD PRODUCT SPECS
                </NavLink>
              </li>
              <li className="link-item">
                
                <NavLink to="/add-product/costPlan">+ CREATE COST PLAN</NavLink>
              </li>
              <li className="link-item">
                
                <NavLink to="/add-product/review">+ REVIEW PRODUCTS</NavLink>
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
            <Route
              path="/add-product/costPlan"
              exact
              render={(props) => (
                <CreateCostPlan
                  {...props}
                  account={this.props.accounts}
                  contract={this.props.contract}
                />
              )}
            />
            <Route
              path="/add-product/review"
              exact
              render={(props) => (
                <ReviewProduct
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

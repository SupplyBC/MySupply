import React, { Component } from "react";
import { BrowserRouter, Route, NavLink } from "react-router-dom";

class CreateProduct extends Component {
  state = {
    productName: "",
    productId: "",
    productForm: "",
    msg: " ",
    alert: false
  };

  constructor(props) {
    super(props);
    this.nameRef = React.createRef();
    this.idRef = React.createRef();
    this.formRef = React.createRef();
    this.handleChange = this.handleChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
  }


  handleSubmit = async (e) => {
    e.preventDefault();
    let name = this.state.productName;
    let id = this.state.productId;
    let form = this.state.productForm;

    const products = await this.props.pcContract.methods
      .getProductsByManu(this.props.account[0])
      .call();
    const pros = products.filter((item) => {
      return item.productName === id;
    })

    console.log(products)
    console.log(pros)
  

    if(pros.length === 0) {
      await this.props.pcContract.methods
      .addProduct(name, id, form)
      .send({ from: this.props.account[0] })
      .once("receipt", (receipt) => {
        this.setState({ msg: "Product was created successfully!" , alert: false });
        setTimeout(() => {
          this.setState({ msg: " " });
        }, 2000);
      });
    this.setState({
      productName: "",
      productId: "",
      productForm: "",
    });

     
    } else {
      this.setState({ msg: "This product ID already exists , change ID and try again! " , alert: true });
      setTimeout(() => {
        this.setState({ msg: " " });
      }, 2000);

    }

    
  };

  handleChange = async (e) => {
    this.setState({
      productName: this.nameRef.current.value,
      productId: this.idRef.current.value,
      productForm: this.formRef.current.value,
    });
  };

  render() {
    let beError;
    this.state.alert? beError = "alert-text" : beError = ""
    let acc = this.props.account;
    let cont1 = this.props.pcContract;
    let cont2 = this.props.pctContract;

    if (!acc || !cont1 || !cont2) {
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
          className= {`notify-data-container notify-text ${beError}`}
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
    alert: false

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

  
    const products = await this.props.pcContract.methods
      .getProductsByManu(this.props.account[0])
      .call();
    const pros = products.filter((item) => {
      // return item.productId === name;
      return item.productName === proID;
    });

    console.log(products)
    console.log(pros)

    if(pros.length === 0 ) {
      this.setState({ msg: "Invalid Product ID, Please Try Again! " , alert: true });
        setTimeout(() => {
          this.setState({ msg: " " });
        }, 2000);
    } else {
      await this.props.pcContract.methods
      .addProductSpecs(proID, name, type, strength, form, amount)
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

    }
    

    

   
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
    let beError;
    this.state.alert? beError = "alert-text" : beError = ""
    let acc = this.props.account;
    let cont1 = this.props.pcContract;
    let cont2 = this.props.pctContract;

    if (!acc || !cont1 || !cont2) {
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
        <label> Material Amount (g) :</label>
        <input
          value={this.state.matAmount}
          onChange={this.handleChange}
          ref={this.matAmountRef}
          type="number"
          placeholder="e.g. 10"
          required="required"
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
          required="required"
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
          <input
            className="btn"
            type="submit"
            value="ADD PRODUCT SPECIFICATION"
          />
        </div>

        <div
          style={{ marginTop: "20px" }}
          className= {`notify-data-container notify-text ${beError}`}
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
    productUnitsNo: 0,
    materialUnitCost: 0,
    packagingMaterialStdCost: 0,
    mrkStdCost: 0,
    rsrhStdCost: 0,
    totalStdCost: 0,
    workHoursNo: 0,
    hourlyWorkRate: 0,
    shippingCost: 0,
  };

  constructor(props) {
    super(props);
    this.proRef = React.createRef();
    this.unitNoRef = React.createRef();
    this.pkgMatStdRef = React.createRef();
    this.mrkStdRef = React.createRef();
    this.rsrhStdRef = React.createRef();
    this.budgetRef = React.createRef();
    this.hoursNoRef = React.createRef();
    this.hourlyRateRef = React.createRef();
    this.materialUnitCostRef = React.createRef();
    this.shippingCostRef = React.createRef();
    this.OnChange = this.onChange.bind(this);
    this.OnSubmit = this.OnSubmit.bind(this);

  }

  OnSubmit = async (e) => {
    e.preventDefault();

    const pro = this.state.product;
    const units = this.state.productUnitsNo;
    const pkgMatStd = parseInt(this.state.packagingMaterialStdCost, 10);
    const mrkStd = parseInt(this.state.mrkStdCost, 10);
    const rsrhStd = parseInt(this.state.rsrhStdCost, 10);
    const hoursNo = parseInt(this.state.workHoursNo,10);
    const rate = parseInt(this.state.hourlyWorkRate,10);
    const matUnitCost = parseInt(this.state.materialUnitCost,10);
    const shippingCost = parseInt(this.state.shippingCost,10)

    // const totalStandard =
    //   matStd + pkgMatStd + labStd + manuIndirectStdCost + mrkStd + rsrhStd;

    // this.setState({ totalStdCost: totalStandard });

    await this.props.pcContract.methods
      .setStdCostPlan(
        pro,
        units,
        pkgMatStd,
        matUnitCost,
        rate,
        hoursNo,        
        mrkStd,
        rsrhStd,
        shippingCost
        
      )
      .send({ from: this.props.account[0] })
      .once("receipt", (receipt) => {
        this.setState({ msg: "Standard Cost Plan Was Set Successfully" });
        setTimeout(() => {
          this.setState({ msg: " " });
        }, 2000);
      });

    this.setState({
      
      productUnitsNo: "",
      packagingMaterialStdCost: "",
      mrkStdCost: "",
      rsrhStdCost: "",
      workHoursNo: "",
      hourlyWorkRate: "",
      materialUnitCost: "",
      shippingCost: "",
    });
  };

  onChange = async (e) => {
    this.setState({
      product: this.proRef.current.value,
      productUnitsNo: this.unitNoRef.current.value,
      packagingMaterialStdCost: this.pkgMatStdRef.current.value,
      mrkStdCost: this.mrkStdRef.current.value,
      rsrhStdCost: this.rsrhStdRef.current.value,
      workHoursNo: this.hoursNoRef.current.value,
      hourlyWorkRate: this.hourlyRateRef.current.value,
      materialUnitCost: this.materialUnitCostRef.current.value,
      shippingCost: this.shippingCostRef.current.value

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
      <form onSubmit={this.OnSubmit} className="newform-container">
        <label>Product ID:</label>
        <input
          type="text"
          ref={this.proRef}
          value={this.state.product}
          placeholder="e.g. pro101"
          onChange={this.OnChange}
          required="required"
        />

        <h4> Set Production Units </h4>
        <label>Production Units No:</label>
        <input
          type="number"
          ref={this.unitNoRef}
          value={this.state.productUnitsNo}
          placeholder="e.g. 50,000"
          onChange={this.OnChange}
          required="required"
        />

        <h4> Set Standards  </h4>

        <label>Unit Material Cost: </label>
        <input
          type="number"
          ref={this.materialUnitCostRef}
          value={this.state.materialUnitCost}
          placeholder="e.g. 5"
          onChange={this.OnChange}
          required="required"
        />

        <label>Packaging Materials: </label>
        <input
          type="number"
          ref={this.pkgMatStdRef}
          value={this.state.packagingMaterialStdCost}
          placeholder="e.g. 5000"
          onChange={this.OnChange}
          required="required"
        />

        <label>Working Hours No: </label>
        <input
          type="number"
          ref={this.hoursNoRef}
          value={this.state.workHoursNo}
          placeholder="e.g. 2000"
          onChange={this.OnChange}
          required="required"
        />

        <label>Hourly Work Rate: </label>
        <input
          type="number"
          ref={this.hourlyRateRef}
          value={this.state.hourlyWorkRate}
          placeholder="e.g. 50"
          onChange={this.OnChange}
          required="required"
        />

         <label>Shipping Cost: </label>
        <input
          type="number"
          ref={this.shippingCostRef}
          value={this.state.shippingCost}
          placeholder="e.g. 50"
          onChange={this.OnChange}
          required="required"
        />


        <label>Marketing: </label>
        <input
          type="number"
          ref={this.mrkStdRef}
          value={this.state.mrkStdCost}
          placeholder="e.g. 5000"
          onChange={this.OnChange}
          required="required"
        />

        <label>Research: </label>
        <input
          type="number"
          ref={this.rsrhStdRef}
          value={this.state.rsrhStdCost}
          placeholder="e.g. 5000"
          onChange={this.OnChange}
          required="required"
        />

        <input
          type="submit"
          className="btn"
          value="CREATE STANDARD COST PLAN"
        />

        <div style={{ marginTop: "20px" }} className="notify-text">
          {this.state.msg}
        </div>
      </form>
    );
  }
}
class ReviewProduct extends Component {
  state = { products: null, product: "", vis: false };

  constructor(props) {
    super(props);
    this.proRef = React.createRef();
    this.OnSubmit = this.OnSubmit.bind(this);
    this.OnChange = this.OnChange.bind(this);
  }

  componentDidMount = async () => {
    await this.getData();
  };

  OnSubmit = async (e) => {
    e.preventDefault();
    const name = this.state.product;
    const products = await this.props.pcContract.methods
      .getProductsByManu(this.props.account[0])
      .call();
    const pros = products.filter((item) => {
      // return item.productId === name;
      return item.productId === name;
    });

    const proId = pros.map((item) => {
      const id = item.productName;
      this.setState({ id });
      return id;
    });
    

    const proName = pros.map((item) => {
      const name = item.productId;
      this.setState({ name });
      return name;
    });


    this.setState({ proId, proName });


    

    if (this.state.id === undefined) {
      this.setState({msg: 'Please Select a Product!'})
      setTimeout(() => {
        this.setState({ msg: " " });
      }, 3000);
    } else {
      const details = await this.props.pcContract.methods
      .getProductPhase(this.state.id)
      .call();

    const lastDetail = details[details.length - 1];
    this.setState({ lastDetail , vis:true });
    if( details.length === 0 || pros.length === 0 ) {
      this.setState({msg: 'No Data Found, Please try again later' , vis:false})
      setTimeout(() => {
        this.setState({ msg: " " });
      }, 3000);
      
    }  
    }
  

    
    
  };

  OnChange = async (e) => {
    this.setState({
      product: this.proRef.current.value,
    });
  };

  getData = async () => {
    const products = await this.props.pcContract.methods
      .getProductsByManu(this.props.account[0])
      .call();

    const names = products.map((item, index) => {
      const name = item.productId;
      return (
        <option key={index} id={index}>
          {name}
        </option>
      );
    });
    this.setState({ names });
  };
  render() {
    let view;
    this.state.vis ? (view = "show") : (view = "hide");
    return (
      <div className="newform-container">
        <h4> Product Status</h4>
        <form onSubmit={this.OnSubmit} className="newform-container form-row">
          <label>SELECT PRODUCT</label>
          <select  onChange={this.OnChange} ref={this.proRef} required>
            <option id='default' style={{fontStyle: 'italic' , opacity: '0.6', color: '#777' }} value="default"> Select a Product </option>
            {this.state.names}
          </select>
          <input type="submit" className="btn" value="VIEW STATUS" />
        </form>
        <div style={{marginTop: '20px'}} className="notify">{this.state.msg}</div>
        <div className={` ${view} review-container `}>
          <div className="review">
            <div className="content">
              <p className="head">PRODUCT ID</p>
              <p className="text">{this.state.id}</p>
              <p className="head">PRODUCT NAME</p>
              <p className="text">{this.state.name}</p>
            </div>
            <div className="status">
            <p className="head">CURRENT STATUS</p>
            <div className="text">{this.state.lastDetail}</div></div>
          </div>
        </div>
      </div>
    );
  }
}

class AddProduct extends Component {
  render() {
    let account = this.props.accounts;
    let contract1 = this.props.pcContract;
    let contract2 = this.props.pctContract;
    if (!account || !contract1 || !contract2) {
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
                <NavLink to="/add-product/costPlan">+ CREATE STANDARD PLAN</NavLink>
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
                  pcContract={this.props.pcContract}
                  pctContract={this.props.pctContract}
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
                  pcContract={this.props.pcContract}
                  pctContract={this.props.pctContract}
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
                  pcContract={this.props.pcContract}
                  pctContract={this.props.pctContract}
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
                  pcContract={this.props.pcContract}
                  pctContract={this.props.pctContract}
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

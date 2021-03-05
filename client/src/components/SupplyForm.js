import React, { Component } from "react";
import { BrowserRouter, Route, NavLink } from "react-router-dom";

class QueryProductSpecs extends Component {
  state = { proName: "", tableVisibility: false };

  constructor(props) {
    super(props);
    this.productRef = React.createRef();
    this.btnRef = React.createRef();
    this.onSubmit = this.onSubmit.bind(this);
    this.onChange = this.onChange.bind(this);
  }

  onSubmit = async (e) => {
    e.preventDefault();

    // this.props.contract.methods.addProduct('1', this.state.input).send({from: this.props.accounts[0]});
    this.btnRef.current.setAttribute("disabled", "disabled");
    const specs = await this.props.contract.methods
      .getProductSpecs(this.state.proName)
      .call();

    const specsRow = specs.map((spec, index) => {
      let name = spec.materialName;
      let amount = spec.materialAmount;
      let form = spec.materialForm;
      let type = spec.materialType;
      return (
        <tr key={index}>
          <td> {name} </td>
          <td> {type} </td>
          <td>{amount} mg </td>
          <td>{form} </td>
        </tr>
      );
    });

    if (specs.length === 0) {
      this.setState({
        msg: "Didn't find any specs for the given product ID, please try again!".toUpperCase(),
      });
    }
    setTimeout(() => {
      this.setState({ msg: " " });
    }, 3000);

    this.setState({ proName: "", specsRow });
    this.setState({ tableVisibility: true });

    this.btnRef.current.removeAttribute("disabled");
  };

  onChange = async (e) => {
    this.setState({
      proName: this.productRef.current.value,
    });
  };

  render() {
    let table;
    let acc = this.props.account;
    let cont = this.props.contract;
    if (!acc || !cont) {
      return <div> Loading..... </div>;
    }
    this.state.tableVisibility ? (table = "show") : (table = "hide");
    return (
      <form onSubmit={this.onSubmit} className="newform-container">
        <label> Enter Product ID </label>

        <input
          type="text"
          ref={this.productRef}
          placeholder="e.g. pro101"
          value={this.state.proName}
          onChange={this.onChange}
          required = "required"
        />

        <input
          className="btn"
          type="submit"
          value="VIEW PRODUCT SPECS"
          ref={this.btnRef}
        />

        <div
          style={{ marginTop: "20px" }}
          className={`${table} product-data-container`}
        >
          <div style={{ margin: "10px 0px" }} className="query-result">
            {this.state.msg}
          </div>
          <table border="1">
            <thead>
              <tr>
                <th>NAME</th>
                <th>TYPE </th>
                <th>AMOUNT</th>
                <th>FORM</th>
              </tr>
            </thead>
            <tbody>{this.state.specsRow}</tbody>
          </table>
        </div>
      </form>
    );
  }
}

class RequestMaterials extends Component {
  state = {
    materialName: "",
    supplier: "",
    amount: 0,
    form: "",
    strength: 0,
    resultCount: 0,
    msg: " ",
    amountToggled: false
  };

  constructor(props) {
    super(props);
    this.materialRef = React.createRef();
    this.supplierRef = React.createRef();
    this.amountRef = React.createRef();
    this.formRef = React.createRef();
    this.matStrRef = React.createRef();
    this.idRef = React.createRef();
    this.onSubmit = this.onSubmit.bind(this);
    this.onChange = this.onChange.bind(this);
    this.addRequest = this.addRequest.bind(this);
  }

  addRequest = async(e) => {
    e.preventDefault()
    const amount = this.state.amount;
    const id = this.state.matId;
    console.log(id,amount);
    const info = await this.props.contract.methods.getMaterialById(id).call();
    const toAddr = info.supplier;
    console.log(info,toAddr)
    await this.props.contract.methods.createRequest(toAddr,id,amount)
    .send({from: this.props.account[0]})
    .once("receipt", (receipt) => {
        this.setState({ msg: "Request was sent successfully!"});
      setTimeout(() => {
        this.setState({ msg: " " });
      }, 3000);
    });
    const request = await this.props.contract.methods.getMyRequests().call();
    const requestNo = request[request.length -1].requestId;

    this.setState({ requestInfo: "Your Tracking Number: " + requestNo});
      setTimeout(() => {
        this.setState({ requestInfo: " " });
      }, 15000);
  }
  onSubmit = async (e) => {
    e.preventDefault();
    const material = this.state.materialName;
    // const proName = this.state.proName;
    // const supplierId = this.state.supplier;
    // const matform = this.state.form;
    // const matamount = this.state.amount;
    // const matstr = this.state.strength;

    console.log(material);
    const query = await this.props.contract.methods.getMaterials().call();
    console.log(query);
    const queryFilter = query.filter( item => {
      return item.materialName.includes(material) 
    });
    console.log(queryFilter);
    const result = queryFilter.map((item,index) => {
      let supplier = item.supplier;
      let id = item.materialID;
      let name = item.materialName;
      let cost = item.unitCost;
      let form = item.materialForm;
      let availableAmount = item.createdAmount;
      console.log(supplier,id,name,cost);

      return(
          <div key={index}>
            <ul className="query-result-list" key={index}>
              <li> <strong>SUPPLIER: </strong> {supplier}</li>
              <li> <strong>ID: </strong> {id}</li>
              <li> <strong>NAME: </strong> {name}</li>
              <li> <strong>FORM: </strong> {form}</li>
              <li> <strong>UNIT COST: </strong> {cost}  L.E</li>
              <li> <strong>IN STOCK: </strong> {availableAmount} KG</li>     
            </ul>
            <hr className="custom-hr-full"></hr> 
          </div>
      );
    })
    this.setState({ resultCount: queryFilter.length ,result , amountToggled: true});
    // if (this.props.Web3.utils.isAddress(this.state.supplier)) {
    //   await this.props.contract.methods
    //     .createRequest(
    //       supplierId,
    //       material,
    //       matform,
    //       matstr,
    //       matamount
    //     )
    //     .send({ from: this.props.account[0] })
    //     .once("receipt", (receipt) => {
    //       this.setState({ msg: "Request was sent successfully!"});
    //       setTimeout(() => {
    //         this.setState({ msg: " " });
    //       }, 2000);
    //     });

        // const request = await this.props.contract.methods.getMyRequests().call();
        // const requestNo = request[request.length -1].requestId;

        // this.setState({ requestInfo: "Your Tracking Number: " + requestNo});
        //   setTimeout(() => {
        //     this.setState({ requestInfo: " " });
        //   }, 15000);


    //   // if (request.length === 0) {
    //   //   this.setState({
    //   //     materials: materials.push(
    //   //       "This supplier has no recently created materials!"
    //   //     ),
    //   //   });
    //   // }

    
    //   this.setState({
    //     matName: "",
    //     proName: "",
    //     supplier: "",
    //     form: "",
    //     amount: "",
    //     strength: "",
    //   });
    //   // this.setState({ requests: this.state.requests + 1 });
    // } else {
    //   this.setState({ msg: "Please Try Again!" });
    //   setTimeout(() => {
    //     this.setState({ msg: " " });
    //   }, 2000);
    // }

    // this.props.contract.methods.addProduct('1', this.state.input).send({from: this.props.accounts[0]});
    //  const material = this.state.materialName;
    // // const proName = this.state.proName;
    //  const supplierId = this.state.supplier;
    //  const matform = this.state.form;
    //  const matamount =this.state.amount;
    // this.setState({ supplier: "", materialName: "", amount: null, form: "" });
  };

  onChange = (e) => {
    this.setState({
      materialName: this.materialRef.current.value,
      matId: this.idRef.current.value,
      // supplier: this.supplierRef.current.value,
      amount: this.amountRef.current.value,
      // form: this.formRef.current.value,
      // strength: this.matStrRef.current.value,
    });
  };

  render() {
    let toggled;
    let acc = this.props.account;
    let cont = this.props.contract;
    let web = this.props.Web3;
    if (!acc || !cont || !web) {
      return <div> Loading..... </div>;
    }
    this.state.amountToggled ? toggled="show" : toggled ="hide"
    return (
      <form onSubmit={this.onSubmit} className="newform-container">
        {/* <label> Supplier ID:</label>

        <input
          type="text"
          id="supplier-id"
          ref={this.supplierRef}
          placeholder="e.g. 0x49A504f461b36A9337Ddaf1f63c3A3AAD0242E81"
          autoComplete="off"
          value={this.state.supplier}
          onChange={this.onChange}
          required = "required"
        /> */}

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
        
        <div 
        className={`${toggled} amount-pop-up`}> 

        <label>Material ID:</label>
        <input
          type="text"
          value={this.state.matId}
          onChange={this.onChange}
          ref={this.idRef}
          placeholder="e.g. mat101"
          
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
          required = "required"
          />
          </div>

        {/* <label> Material Form: </label>
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
          required = "required"
        /> */}

        <div className="btn-group">
          <input
            style={{ cursor: "pointer" }}
            className="btn"
            type="submit"
            value="SEARCH"
          />

          <button
           className={`${toggled} btn`}
           onClick={this.addRequest}>
            REQUEST</button>


        </div>
        

        <div
          style={{ marginTop: "20px" }}
          className="notify-data-container notify-text"
        >
          <div><strong>{this.state.msg}</strong> </div>
          <div style={{color: '#222', fontSize: '16px' }}><strong>{this.state.requestInfo}</strong></div>
        </div>
        <div className={`${toggled} results-counter`}>
        <p style={{textAlign: 'left'}}> Found <strong>{this.state.resultCount} </strong> results
            for "{this.state.materialName}". </p>
        </div>
        <div className={`${toggled} query-result-container`}>
         
          {this.state.result} 
        </div>
      </form>
    );
  }
}

class CreateMaterial extends Component {
  state = {
    matId: "",
    matName: "",
    matForm: "",
    matStr: 0,
    matAmount: 0,
    matUnitCost: 0,
  };
  constructor(props) {
    super(props);
    this.idRef = React.createRef();
    this.matRef = React.createRef();
    this.formRef = React.createRef();
    this.strRef = React.createRef();
    this.amountRef = React.createRef();
    this.unitCostRef = React.createRef();
    this.onChange = this.onChange.bind(this);
    this.onSubmit = this.onSubmit.bind(this);
  }

  onSubmit = async (e) => {
    e.preventDefault();
    const id = this.state.matId;
    const name = this.state.matName;
    const form = this.state.matForm;
    const strength = this.state.matStr;
    const amount = this.state.matAmount;
    const cost = this.state.matUnitCost;

    await this.props.contract.methods
      .createMaterial(id, name, strength, form, amount, cost)
      .send({ from: this.props.account[0] })
      .once("receipt", (receipt) => {
        this.setState({ msg: "Materials Created Successfully!" });
        setTimeout(() => {
          this.setState({ msg: " " });
        }, 2000);
      });

    this.setState({
      matId: "",
      matName: "",
      matForm: "",
      matStr: "",
      matAmount: "",
      matUnitCost: "",
    });
  };

  onChange = async (e) => {
    this.setState({
      matId: this.idRef.current.value,
      matName: this.matRef.current.value,
      matForm: this.formRef.current.value,
      matStr: this.strRef.current.value,
      matAmount: this.amountRef.current.value,
      matUnitCost: this.unitCostRef.current.value,
    });
  };
  render() {
    return (
      <form onSubmit={this.onSubmit} className="newform-container">
        <label>Material ID:</label>
        <input
          type="text"
          value={this.state.matId}
          onChange={this.onChange}
          ref={this.idRef}
          placeholder="e.g. mat101"
          required = "required"
          
        />
        <label>Material Name:</label>
        <select name="material-name" onChange={this.OnChange} ref={this.matRef}>
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

        <label> Material Form: </label>
        <select
          name="material-form"
          onChange={this.onChange}
          ref={this.formRef}
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

        <label> Material Strength: </label>
        <input
          value={this.state.matStr}
          onChange={this.onChange}
          ref={this.strRef}
          type="number"
          placeholder="e.g. 10"
        />
        <label> Material Amount: </label>
        <input
          value={this.state.matAmount}
          onChange={this.onChange}
          ref={this.amountRef}
          type="number"
          placeholder="e.g. 1000"
          required = "required"
        />

        <label> Material Unit Cost: </label>
        <input
          value={this.state.matUnitCost}
          onChange={this.onChange}
          ref={this.unitCostRef}
          type="number"
          placeholder="e.g. 10"
          required = "required"
        />

        <input type="submit" value="CREATE MATERIAL" className="btn" />

        <div style={{ marginTop: "20px" }} className="notify-text">
          {this.state.msg}
        </div>
      </form>
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
                <NavLink to="/supply/querySpecs">+ QUERY PRODUCT SPECS</NavLink>
              </li>
              <li className="link-item">
                <NavLink to="/supply/requestMaterial">
                  + REQUEST MATERIAL
                </NavLink>
              </li>
              <label style={{ marginTop: "10px" }}>
                <strong> SUPPLIER </strong>
              </label>
              <li className="link-item">
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

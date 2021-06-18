import React, { Component } from "react";
import { BrowserRouter, Route, NavLink } from "react-router-dom";


class MaterialCostData extends Component {
  state = { material: '', isVisible: false}
  constructor(props) {
    super(props);
    this.toggleFinancialDetails = this.toggleFinancialDetail.bind(this);
  }

  componentDidMount = async () => {
    const isTrust = await this.props.pcContract.methods.checkIfTrusted(this.props.supplier, this.props.account[0]).call();
    this.setState({ isTrust });
    if (this.state.isTrust === true) {

    } else {
      this.setState({
        msg: 'YOU ARE NOT AUTHORIZED TO REVIEW THIS DATA!',
      })
    }
  }

  toggleFinancialDetail = async () => {
    this.setState({ isVisible: !this.state.isVisible })
  }

  onSubmit = async (e) => {
    e.preventDefault();
    const matCosts = await this.props.pcContract.methods.getMaterialCostPlan(this.props.materialId).call();
    const cost = matCosts.map(() => {
      const matMaterialCostValue = parseInt(matCosts.directMaterialCost, 10);
      const matPkgCostValue = parseInt(matCosts.packagingMaterialCost, 10);
      const matLaborCostValue = parseInt(matCosts.directLaborCost, 10);
      const matShippingCostValue = parseInt(matCosts.shippingCost, 10);
      const matTotalDirectCostValue = parseInt(matCosts.totalDirectCost, 10);
      const matTotalIndirectCostValue = parseInt(matCosts.totalIndirectCost, 10);
      const matMaterialCost = matMaterialCostValue.toLocaleString('en-US', { style: 'currency', currency: 'USD' });
      const matPkgCost = matPkgCostValue.toLocaleString('en-US', { style: 'currency', currency: 'USD' });
      const matLaborCost = matLaborCostValue.toLocaleString('en-US', { style: 'currency', currency: 'USD' });
      const matShippingCost = matShippingCostValue.toLocaleString('en-US', { style: 'currency', currency: 'USD' });
      const matTotalDirectCost = matTotalDirectCostValue.toLocaleString('en-US', { style: 'currency', currency: 'USD' });
      const matTotalIndirectCost = matTotalIndirectCostValue.toLocaleString('en-US', { style: 'currency', currency: 'USD' });

      this.setState({
        matMaterialCostValue,
        matPkgCostValue,
        matLaborCostValue,
        matShippingCostValue,
        matTotalDirectCostValue,
        matTotalIndirectCostValue,
        matMaterialCost,
        matPkgCost,
        matLaborCost,
        matShippingCost,
        matTotalDirectCost,
        matTotalIndirectCost
      })

      return true;

    });

    if (this.state.matTotalDirectCostValue === 0) {
      this.setState({
        msg: "No Financial Data Found for the Given Material ID!".toUpperCase(),
      });
    }
    this.setState({ cost })

  }

  render() {
    let classified, visible;
    this.state.isVisible ? visible = "show" : visible = "hide";
    this.state.isTrust ? classified = "show" : classified = "hide";
    let isToggled;
    this.props.toggled? isToggled = "" : isToggled="hide";
    return (
      <div className="newform-container">
        <form onSubmit={this.onSubmit} >
          <button onClick={this.toggleFinancialDetail} className={` ${isToggled} financial-detail-btn`}>{this.state.isVisible ? 'Hide Financial Data' : 'View Financial Data'}</button>
        </form>
        {/* <button onClick={this.toggleFinancialDetail} className="financial-detail-btn"></button> */}
        <div className={`${visible}`}>
          <div className={`costsClashContainer `}>
            <div className="alert-text" style={{ marginLeft: '-20px' }}>{this.state.msg}</div>
            <div className={`${classified} std-cost-container`} style={{ marginLeft: '-19%' }}  >
              <table className={`${isToggled} cost-data`} >
                <thead>
                  <tr>
                    <th>CRITERIA</th>
                    <th>COST</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td> Raw Materials </td>
                    <td>{this.state.matMaterialCost}</td>
                  </tr>
                  <tr>
                    <td> Packaging Materials </td>
                    <td>{this.state.matPkgCost}</td>
                  </tr>
                  <tr>
                    <td> Direct Labor </td>
                    <td>{this.state.matLaborCost}</td>
                  </tr>
                  <tr
                    style={{
                      borderTop: "1px solid",
                      borderBottom: "1px solid",
                    }}
                  >
                    <td>TOTAL DIRECT COST</td>
                    <td>{this.state.matTotalDirectCost}</td>
                  </tr>

                </tbody>
              </table>
            </div>
          </div>

        </div>

      </div>
    );
  }
}

class RevokeAccess extends Component {

  state = { participant: '' }

  constructor(props) {
    super(props);
    this.participantRef = React.createRef();
    this.onSubmit = this.onSubmit.bind(this);
    this.onChange = this.onChange.bind(this);
  }


  onSubmit = async (e) => {
    e.preventDefault();
    const parti = this.state.participant;
    const addr = await this.props.pcContract.methods.checkIfTrusted(this.props.account[0], parti).call();
    this.setState({ addr })
    if (this.state.addr === true) {
      await this.props.pcContract.methods.removeFromTrusted(parti).send({
        from: this.props.account[0]
      }).once("receipt", (receipt) => {
        this.setState({ textStatus: true, msg: "Access was revoked successfully!".toUpperCase() });
        setTimeout(() => {
          this.setState({ msg: " " });
        }, 3000);
      });

    } else {
      this.setState({ textStatus: false, msg: "Access already revoked from this address!".toUpperCase() });
      setTimeout(() => {
        this.setState({ msg: " " });
      }, 3000);
    }


  }

  onChange = async (e) => {
    this.setState({
      participant: this.participantRef.current.value,
    })
  }
  render() {
    let placeholder;
    this.state.textStatus ? placeholder = 'good' : placeholder = 'alert'
    return (
      <form onSubmit={this.onSubmit} className="newform-container">

        <h4>REVOKE ACCESS</h4>
        <label> Enter Participant Address </label>

        <input
          type="text"
          ref={this.participantRef}
          placeholder="e.g.0x8a57428748D955C919F1928C1F21aF0dC1f4fC9d"
          value={this.state.participant}
          onChange={this.onChange}
          required="required"
        />

        <input
          className="btn"
          type="submit"
          value="REVOKE ACCESS"
          ref={this.btnRef}
        />

        <div
          style={{ marginTop: "20px" }}
          className={` product-data-container`}
        >
          <div style={{ margin: "10px 0px" }} className={`query-result ${placeholder}-text`}>
            {this.state.msg}
          </div>
        </div>
      </form>
    );
  }
}

class ManagePermissions extends Component {
  state = { participant: '' }

  constructor(props) {
    super(props);
    this.participantRef = React.createRef();
    this.onSubmit = this.onSubmit.bind(this);
    this.onChange = this.onChange.bind(this);
  }


  onSubmit = async (e) => {
    e.preventDefault();
    const parti = this.state.participant;
    const addr = await this.props.pcContract.methods.checkIfTrusted(this.props.account[0], parti).call();
    this.setState({ addr })
    if (this.state.addr === true) {

      this.setState({ textStatus: false, msg: "Access already granted for this address!".toUpperCase() });
      setTimeout(() => {
        this.setState({ msg: " " });
      }, 3000)
    } else {
      await this.props.pcContract.methods.addToTrusted(parti).send({
        from: this.props.account[0]
      }).once("receipt", (receipt) => {
        this.setState({ textStatus: true, msg: "Access was granted successfully!".toUpperCase() });
        setTimeout(() => {
          this.setState({ msg: " " });
        }, 3000);
      });
    }


  }

  onChange = async (e) => {
    this.setState({
      participant: this.participantRef.current.value,
    })
  }
  render() {
    let placeholder;
    this.state.textStatus ? placeholder = 'good' : placeholder = 'alert'
    return (
      <div>
        <form onSubmit={this.onSubmit} className="newform-container">

          <h4>Manage Data Permissions</h4>
          <h4>GRANT ACCESS</h4>
          <label> Enter Participant Address </label>

          <input
            type="text"
            ref={this.participantRef}
            placeholder="e.g.0x8a57428748D955C919F1928C1F21aF0dC1f4fC9d"
            value={this.state.participant}
            onChange={this.onChange}
            required="required"
          />

          <input
            className="btn"
            type="submit"
            value="GRANT ACCESS"
            ref={this.btnRef}
          />

          <div
            style={{ marginTop: "20px" }}
            className={` product-data-container`}
          >
            <div style={{ margin: "10px 0px" }} className={`query-result ${placeholder}-text`}>
              {this.state.msg}
            </div>
          </div>
        </form>
        <hr className="custom-hr-half" />
        <RevokeAccess
          account={this.props.account}
          pcContract={this.props.pcContract} />
      </div>
    );
  }
}

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
    this.btnRef.current.setAttribute("disabled", "disabled");
    const specs = await this.props.pcContract.methods
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
          <td>{amount} g </td>
          <td>{form} </td>
        </tr>
      );
    });

    if (specs.length === 0) {
      this.setState({
        msg: "Didn't find any specs for the given product ID, please try again!".toUpperCase(),
        tableVisibility: false,
      });
      setTimeout(() => {
        this.setState({ msg: " " });
      }, 3000);
    } else {
      this.setState({ tableVisibility: true });
    }
    this.setState({ proName: "", specsRow });
    

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
    let cont1 = this.props.pcContract;
    let cont2 = this.props.pctContract;
    if (!acc || !cont1 || !cont2) {
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
          required="required"
        />

        <input
          className="btn"
          type="submit"
          value="VIEW PRODUCT SPECS"
          ref={this.btnRef}
        />

        <div style={{ margin: "10px 0px" }} className="query-result alert-text">
          {this.state.msg}
        </div>
        <div
          style={{ marginTop: "20px" }}
          className={`${table} product-data-container`}
        >

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
    manufacturerBatched: "",
    amount: 0,
    form: "",
    strength: 0,
    resultCount: 0,
    msg: " ",
    amountToggled: false,
    batchToggled: false,
    modalIsOpen: false,
    setIsOpen: false,
  };

  constructor(props) {
    super(props);
    this.materialRef = React.createRef();
    this.supplierRef = React.createRef();
    this.amountRef = React.createRef();
    this.formRef = React.createRef();
    this.matStrRef = React.createRef();
    this.idRef = React.createRef();
    this.manufacturerBatchedRef = React.createRef();
    this.onSubmit = this.onSubmit.bind(this);
    this.onChange = this.onChange.bind(this);
    this.addRequest = this.addRequest.bind(this);
    this.addBatchRequest = this.addBatchRequest.bind(this);
  }


  addBatchRequest = async (e) => {
    e.preventDefault();
    this.setState({ batchToggled: true })
    const amount = this.state.amount;
    const id = this.state.matId;
    const manu2 = this.state.manufacturerBatched;
    const info = await this.props.pcContract.methods.getMaterialById(id).call();
    const supplier = info.supplier;
    await this.props.pcContract.methods.createBatchRequest(
      manu2,
      supplier,
      id,
      amount
    )

  }

  addRequest = async (e) => {
    e.preventDefault()
    const amount = this.state.amount;
    const id = this.state.matId;
    console.log(id, amount);
    const info = await this.props.pcContract.methods.getMaterialById(id).call();
    const toAddr = info.supplier;
    console.log(info, toAddr)
    await this.props.pcContract.methods.createRequest(toAddr, id, amount)
      .send({ from: this.props.account[0] })
      .once("receipt", (receipt) => {
        this.setState({ msg: "Request was sent successfully!" });
        setTimeout(() => {
          this.setState({ msg: " " });
        }, 3000);
      });
    const request = await this.props.pcContract.methods.getMyRequests().call();
    console.log(request);
    const requestNo = request[request.length - 1].requestId;
    console.log(requestNo);
    this.setState({ requestInfo: "Your Tracking Number: " + requestNo });
    setTimeout(() => {
      this.setState({ requestInfo: " " });
    }, 15000);
  }

  triggerSupplierMenu = () => {
    this.setState({
      isTriggered: !this.state.isTriggered
    })

  }
  onSubmit = async (e) => {
    e.preventDefault();
    const material = this.state.materialName;
    const query = await this.props.pcContract.methods.getMaterials().call();
    const queryFilter = query.filter(item => {
      return item.materialName.includes(material)
    });
    const result = queryFilter.map((item, index) => {

      let supplier = item.supplier;
      let id = item.materialID;
      let name = item.materialName;
      let cost = parseInt(item.unitCost, 10).toLocaleString('en-US', { style: 'currency', currency: 'USD' });
      let form = item.materialForm;
      let availableAmount = item.createdAmount;
      let conditions = item.storageConditions;
      let stability = item.materialStability;
      let stabilityPeriod = item.materialStabilityPeriod;
      let toHide;
      this.state.isTriggered? toHide="" : toHide="hide"


      return (
        <div key={index}>

          <ul className="query-result-list" key={index}>
            <div className="supplier-summary-container">
            <li > <strong>SUPPLIER </strong> <span className="lead">{supplier}</span></li> 
            <span className="show-details-container">
            
             </span>
            </div>
            <div className= {`${toHide}`}> 
              <li><strong><em>---- MATERIAL INFORMATION ----</em></strong></li>
              <li> <strong>ID </strong> {id}</li>
              <li> <strong>NAME </strong> {name}</li>
              <li> <strong>FORM </strong> {form}</li>
              <li> <strong>UNIT COST </strong> {cost}</li>
              <li> <strong>STABILITY </strong> {stability ? "STABLE" : "NOT STABLE"}</li>
              <li> <strong>STABILITY PERIOD </strong> {stabilityPeriod} years</li>
              <li> <strong>STORAGE CONDITIONS</strong> {conditions === '' ? 'N/A' : conditions}</li>
              <li> <strong>IN STOCK </strong> {availableAmount} g</li>
              </div>
            </ul>
            <MaterialCostData
              toggled ={this.state.isTriggered}
              supplier={supplier}
              materialId={id}
              account={this.props.account}
              pcContract={this.props.pcContract}

            />
            <hr className="custom-hr-full"></hr>
            
        </div>
      );
    })
    this.setState({ resultCount: queryFilter.length, result, amountToggled: true });

    if(this.state.resultCount === 0) {
      this.setState({emptyToggle: true})
    } else {
      this.setState({emptyToggle: false})
    }

  };

  onChange = (e) => {
    this.setState({
      materialName: this.materialRef.current.value,
      matId: this.idRef.current.value,
      // supplier: this.supplierRef.current.value,
      amount: this.amountRef.current.value,
      manufacturerBatched: this.manufacturerBatchedRef.current.value
      // form: this.formRef.current.value,
      // strength: this.matStrRef.current.value,
    });
  };

  render() {
    let toggled, toggled2 , toggled3
    let acc = this.props.account;
    let cont1 = this.props.pcContract;
    let cont2 = this.props.pctContract;
    let web = this.props.Web3;
    if (!acc || !cont1 || !cont2 || !web) {
      return <div> Loading..... </div>;
    }
    this.state.amountToggled ? toggled = "show" : toggled = "hide"
    this.state.batchToggled ? toggled2 = "show" : toggled2 = "hide"
    this.state.emptyToggle?   toggled3="hide" : toggled3= "show"
    return (
      <form onSubmit={this.onSubmit} className="newform-container">

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
          className={`${toggled2} amount-pop-up`}>

          <label>Add Manufacturer Address:</label>
          <input
            type="text"
            ref={this.manufacturerBatchedRef}
            value={this.state.manufacturerBatched}
            onChange={this.onChange}
            placeholder="e.g.0x8a57428748D955C919F1928C1F21aF0dC1f4fC9d"

          />
        </div>

        <div
          className={`${toggled} amount-pop-up`}>

          <label>Material ID:</label>
          <input
            type="text"
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
            placeholder="e.g. 1000 g"
            autoComplete="off"
            onChange={this.onChange}
            required="required"
          />
        </div>

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

          <button
            className={`${toggled} btn`}
            onClick={this.addBatchRequest}>
            CREATE BATCH REQUEST
          </button>


        </div>


        <div
          style={{ marginTop: "20px" }}
          className="notify-data-container notify-text"
        >
          <div><strong>{this.state.msg}</strong> </div>
          <div style={{ fontSize: '16px' }}><strong>{this.state.requestInfo}</strong></div>
        </div>
        <div className={`${toggled} results-counter`}>
          <p style={{ textAlign: 'left' }}> Found <strong>{this.state.resultCount} </strong> results. </p>
        </div>
        <div className={`${toggled} query-result-container`}>
        <button 
             onClick={this.triggerSupplierMenu}
             className={`${toggled3} material-detail-btn`}>
               {this.state.isTriggered? 'CHANGE VIEW: EXPANDED' : 'CHANGE VIEW: COLLPASED'}
             </button>
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
    matConditions: "",
    matStability: false,
    matStabilityPeriod: "",

  };
  constructor(props) {
    super(props);
    this.idRef = React.createRef();
    this.matRef = React.createRef();
    this.formRef = React.createRef();
    this.strRef = React.createRef();
    this.amountRef = React.createRef();
    this.unitCostRef = React.createRef();
    this.matConditionsRef = React.createRef();
    this.matStabilityRef = React.createRef();
    this.matStabilityPeriodRef = React.createRef();
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
    const condition = this.state.matConditions;
    const stability = this.state.matStability;
    const stabilityPeriod = this.state.matStabilityPeriod

    await this.props.pcContract.methods
      .createMaterial(id, name, strength, form, amount, cost, condition, stability, stabilityPeriod)
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
      matConditions: "",
      matStability: Boolean,
      matStabilityPeriod: 0,
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
      matConditions: this.matConditionsRef.current.value,
      matStability: this.matStabilityRef.current.value,
      matStabilityPeriod: this.matStabilityPeriodRef.current.value
    });

    console.log(this.state.matStability);
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
          required="required"

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

        <label> Material Strength (%): </label>
        <input
          value={this.state.matStr}
          onChange={this.onChange}
          ref={this.strRef}
          type="number"
          placeholder="e.g. 10"
        />
        <label> Material Amount (g): </label>
        <input
          value={this.state.matAmount}
          onChange={this.onChange}
          ref={this.amountRef}
          type="number"
          placeholder="e.g. 1000"
          required="required"
        />

        <label> Material Unit Cost: </label>
        <input
          value={this.state.matUnitCost}
          onChange={this.onChange}
          ref={this.unitCostRef}
          type="number"
          placeholder="e.g. 10"
          required="required"
        />
        <div className='checkbox-container'
          style={{ display: 'flex', flexDirection: 'row', gap: '10px', margin: '10px 0px' }}>
          <input
            type="checkbox"
            value="true"
            onChange={this.onChange}
            ref={this.matStabilityRef}
            required="required"
            style={{ display: 'inline' }}
            name="stability"
          />
          <label>Stable</label>

        </div>

        <label> Stability Period (years) </label>
        <input
          value={this.state.matstabilityPeriod}
          onChange={this.onChange}
          ref={this.matStabilityPeriodRef}
          type="number"
          placeholder="e.g. 2"
        />

        <label> Storage Conditions / Usage Instructions: </label>
        <input
          value={this.state.storageConditions}
          onChange={this.onChange}
          ref={this.matConditionsRef}
          type="text"
          placeholder="e.g. Keep out of reach for children , store in a dry place."
        />


        <input type="submit" value="CREATE MATERIAL" className="btn" />

        <div style={{ marginTop: "20px" }} className="notify-text">
          {this.state.msg}
        </div>
      </form>
    );
  }
}

class CreateCostPlan extends Component {
  state = {
    material: "",
    materialMaterialCost: 0,
    materialPkgCost: 0,
    materialLaborCost: 0,
    materialShippingCost: 0,
    materialTotalIndirectCost: 0
  };

  constructor(props) {
    super(props);
    this.matRef = React.createRef();
    this.materialPkgCostRef = React.createRef();
    this.materialMaterialCostRef = React.createRef();
    this.materialLaborCostRef = React.createRef();
    this.materialShippingCostRef = React.createRef();
    this.materialTotalIndirectCostRef = React.createRef()
    this.OnChange = this.onChange.bind(this);
    this.OnSubmit = this.OnSubmit.bind(this);

  }

  OnSubmit = async (e) => {
    e.preventDefault();

    const mat = this.state.material;
    const matPkgCost = parseInt(this.state.materialPkgCost, 10);
    const matMaterialCost = parseInt(this.state.materialMaterialCost, 10);
    const matLaborCost = parseInt(this.state.materialLaborCost, 10);
    const matShippingCost = parseInt(this.state.materialShippingCost, 10);
    const matTotalIndirectCost = parseInt(this.state.materialTotalIndirectCost, 10);

    // const totalStandard =
    //   matStd + pkgMatStd + labStd + manuIndirectStdCost + mrkStd + rsrhStd;

    // this.setState({ totalStdCost: totalStandard });

    await this.props.pcContract.methods
      .setMaterialCostPlan(
        mat,
        matMaterialCost,
        matPkgCost,
        matLaborCost,
        matTotalIndirectCost,
        matShippingCost

      )
      .send({ from: this.props.account[0] })
      .once("receipt", (receipt) => {
        this.setState({ msg: "Material Cost Plan Was Set Successfully" });
        setTimeout(() => {
          this.setState({ msg: " " });
        }, 2000);
      });

    this.setState({

      materialMaterialCost: "",
      materialPkgCost: "",
      materialLaborCost: "",
      materialShippingCost: "",
      materialTotalIndirectCost: ""
    });
  };

  onChange = async (e) => {
    this.setState({
      material: this.matRef.current.value,
      materialPkgCost: this.materialPkgCostRef.current.value,
      materialMaterialCost: this.materialMaterialCostRef.current.value,
      materialShippingCost: this.materialShippingCostRef.current.value,
      materialLaborCost: this.materialLaborCostRef.current.value,
      materialTotalIndirectCost: this.materialTotalIndirectCostRef.current.value

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
        <label>Material ID:</label>
        <input
          type="text"
          ref={this.matRef}
          value={this.state.material}
          placeholder="e.g. mat101"
          onChange={this.OnChange}
          required="required"
        />


        <h4> Set Material Cost Plan  </h4>

        <label>Raw Material Cost: </label>
        <input
          type="number"
          ref={this.materialMaterialCostRef}
          value={this.state.materialMaterialCost}
          placeholder="e.g. 5000"
          onChange={this.OnChange}
          required="required"
        />

        <label>Packaging Material Cost: </label>
        <input
          type="number"
          ref={this.materialPkgCostRef}
          value={this.state.materialPkgCost}
          placeholder="e.g. 5000"
          onChange={this.OnChange}
          required="required"
        />


        <label>Labor Cost: </label>
        <input
          type="number"
          ref={this.materialLaborCostRef}
          value={this.state.materialLaborCost}
          placeholder="e.g. 5000"
          onChange={this.OnChange}
          required="required"
        />

        <label>Shipping Cost: </label>
        <input
          type="number"
          ref={this.materialShippingCostRef}
          value={this.state.materialShippingCost}
          placeholder="e.g. 5000"
          onChange={this.OnChange}
          required="required"
        />

        <label>Total Indirect Cost: </label>
        <input
          type="number"
          ref={this.materialTotalIndirectCostRef}
          value={this.state.materialTotalIndirectCost}
          placeholder="e.g. 5000"
          onChange={this.OnChange}
          required="required"
        />

        <input
          type="submit"
          className="btn"
          value="CREATE MATERIAL COST PLAN"
        />

        <div style={{ marginTop: "20px" }} className="notify-text">
          {this.state.msg}
        </div>
      </form>
    );
  }
}
class ApproveRequest extends Component {
  state = { msg: '', requestId: '' }

  constructor(props) {
    super(props);
    this.requestIdRef = React.createRef();
    this.onSubmit = this.onSubmit.bind(this);
    this.onChange = this.onChange.bind(this);
  }


  onSubmit = async (e) => {
    e.preventDefault();
    const requestNo = parseInt(this.state.requestId, 10);
    console.log(requestNo);


    await this.props.pctContract.methods.approveRequest(requestNo)
      .send({ from: this.props.account[0] })
      .once("receipt", (receipt) => {
        this.setState({ msg: "Request was approved successfully!" });
        setTimeout(() => {
          this.setState({ msg: " " });
        }, 3000);
      });


    this.setState({ requestId: '' })

  }

  onChange = async (e) => {
    this.setState({
      requestId: this.requestIdRef.current.value
    })


  }
  render() {
    return (
      <form onSubmit={this.onSubmit} className="newform-container">
        <h4> Approve Request</h4>
        <label> Tracking Number: </label>
        <input
          type="number"
          value={this.state.requestId}
          ref={this.requestIdRef}
          onChange={this.onChange}
          placeholder="e.g. 101"
          required="required"
        />
        <div>
          <input type="submit" className="btn" value="APPROVE REQUEST" />
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

class SendShipment extends Component {
  state = { msg: '', requestId: '' }

  constructor(props) {
    super(props);
    this.requestIdRef = React.createRef();
    this.onSubmit = this.onSubmit.bind(this);
    this.onChange = this.onChange.bind(this);
  }


  onSubmit = async (e) => {
    e.preventDefault();
    const requestNo = this.state.requestId;

    //todo transact here
    await this.props.pctContract.methods.sendShipment(requestNo)
      .send({ from: this.props.account[0] })
      .once("receipt", (receipt) => {
        this.setState({ msg: "Updated shipment status successfully!" });
        setTimeout(() => {
          this.setState({ msg: " " });
        }, 3000);
      });



    this.setState({ requestId: '' })


  }

  onChange = async (e) => {
    this.setState({
      requestId: this.requestIdRef.current.value,
    })


  }
  render() {
    return (
      <form onSubmit={this.onSubmit} className="newform-container">
        <h4> Send Shipment</h4>
        <label> Tracking Number: </label>
        <input
          type="number"
          value={this.state.requestId}
          ref={this.requestIdRef}
          onChange={this.onChange}
          placeholder="e.g. 101"
          required="required"
        />

        <div>
          <input type="submit" className="btn" value="SEND SHIPMENT" />
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

class TransitGlobal extends Component {
  state = { msg: '', requestId: '' }

  constructor(props) {
    super(props);
    this.requestIdRef = React.createRef();
    this.onSubmit = this.onSubmit.bind(this);
    this.onChange = this.onChange.bind(this);
  }


  onSubmit = async (e) => {
    e.preventDefault();
    const requestNo = this.state.requestId;
    console.log(requestNo);


    await this.props.pctContract.methods.globalTransitShipment(requestNo)
      .send({ from: this.props.account[0] })
      .once("receipt", (receipt) => {
        this.setState({ msg: "Updated shipment status successfully!" });
        setTimeout(() => {
          this.setState({ msg: " " });
        }, 3000);
      });


    this.setState({ requestId: '' })


  }

  onChange = async (e) => {
    this.setState({
      requestId: this.requestIdRef.current.value
    })


  }
  render() {
    return (
      <form onSubmit={this.onSubmit} className="newform-container">
        <h4> Transit Shipment (Globally)</h4>
        <label> Tracking Number: </label>
        <input
          type="number"
          value={this.state.requestId}
          ref={this.requestIdRef}
          onChange={this.onChange}
          placeholder="e.g. 101"
          required="required"
        />
        <div>
          <input type="submit" className="btn" value="SHIP GLOBALLY" />
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

class TransitLocal extends Component {
  state = { msg: '', requestId: '' }

  constructor(props) {
    super(props);
    this.requestIdRef = React.createRef();
    this.onSubmit = this.onSubmit.bind(this);
    this.onChange = this.onChange.bind(this);
  }


  onSubmit = async (e) => {
    e.preventDefault();
    const requestNo = this.state.requestId;
    console.log(requestNo);


    //todo transact here

    await this.props.pctContract.methods.localTransitShipment(requestNo)
      .send({ from: this.props.account[0] })
      .once("receipt", (receipt) => {
        this.setState({ msg: "Updated shipment status successfully!" });
        setTimeout(() => {
          this.setState({ msg: " " });
        }, 3000);
      });


    this.setState({ requestId: '' })



  }

  onChange = async (e) => {
    this.setState({
      requestId: this.requestIdRef.current.value
    })


  }
  render() {
    return (
      <form onSubmit={this.onSubmit} className="newform-container">
        <h4> Transit Shipment (Locally)</h4>
        <label> Tracking Number: </label>
        <input
          type="number"
          value={this.state.requestId}
          ref={this.requestIdRef}
          onChange={this.onChange}
          placeholder="e.g. 101"
          required="required"
        />
        <div>
          <input type="submit" className="btn" value="SHIP LOCALLY" />
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

class ReceiveShipment extends Component {
  state = { msg: '', requestId: '' }

  constructor(props) {
    super(props);
    this.requestIdRef = React.createRef();
    this.onSubmit = this.onSubmit.bind(this);
    this.onChange = this.onChange.bind(this);
  }


  onSubmit = async (e) => {
    e.preventDefault();
    const requestNo = this.state.requestId;


    await this.props.pctContract.methods.receiveShipment(requestNo)
      .send({ from: this.props.account[0] })
      .once("receipt", (receipt) => {
        this.setState({ msg: "Updated shipment status successfully!" });
        setTimeout(() => {
          this.setState({ msg: " " });
        }, 3000);
      });


    this.setState({ requestId: '' })
  }

  onChange = async (e) => {
    this.setState({
      requestId: this.requestIdRef.current.value
    })


  }
  render() {
    return (
      <form onSubmit={this.onSubmit} className="newform-container">
        <h4> Receive Shipment</h4>
        <label> Tracking Number: </label>
        <input
          type="number"
          value={this.state.requestId}
          ref={this.requestIdRef}
          onChange={this.onChange}
          placeholder="e.g. 101"
          required="required"
        />
        <div>
          <input type="submit" className="btn" value="RECEIVE SHIPMENT" />
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

class SetLocation extends Component {
  state = { msg: '', requestId: '', latitude: '', longitude: '' }

  constructor(props) {
    super(props);
    this.requestIdRef = React.createRef();
    this.latRef = React.createRef();
    this.longRef = React.createRef();
    this.onSubmit = this.onSubmit.bind(this);
    this.onChange = this.onChange.bind(this);
  }


  onSubmit = async (e) => {
    e.preventDefault();
    const requestNo = this.state.requestId;
    const lat = this.state.latitude;
    const long = this.state.longitude;

    await this.props.pctContract.methods.setShipmentLocation(requestNo, lat, long)
      .send({ from: this.props.account[0] })
      .once("receipt", (receipt) => {
        this.setState({ msg: "Updated shipment location successfully!" });
        setTimeout(() => {
          this.setState({ msg: " " });
        }, 3000);
      });


    this.setState({ requestId: '', latitude: '', longitude: '' })
  }

  onChange = async (e) => {
    this.setState({
      requestId: this.requestIdRef.current.value,
      latitude: this.latRef.current.value,
      longitude: this.longRef.current.value
    })


  }
  render() {
    return (
      <form onSubmit={this.onSubmit} className="newform-container">
        <h4> Set Shipment Location</h4>
        <label> Tracking Number: </label>
        <input
          type="text"
          value={this.state.requestId}
          ref={this.requestIdRef}
          onChange={this.onChange}
          placeholder="e.g. 101"
          required="required"
        />
        <label> Latitude: </label>
        <input
          type="text"
          value={this.state.latitude}
          ref={this.latRef}
          onChange={this.onChange}
          placeholder="e.g. 50.1"
          required="required"
        />
        <label> Longitude: </label>
        <input
          type="text"
          value={this.state.longitude}
          ref={this.longRef}
          onChange={this.onChange}
          placeholder="e.g. 0.09"
          required="required"
        />
        <div>
          <input type="submit" className="btn" value="SET LOCATION" />
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

class SetShippingMethod extends Component {
  state = { msg: '', requestId: '', method: '' }

  constructor(props) {
    super(props);
    this.requestIdRef = React.createRef();
    this.methodRef = React.createRef();
    this.onSubmit = this.onSubmit.bind(this);
    this.onChange = this.onChange.bind(this);
  }


  onSubmit = async (e) => {
    e.preventDefault();
    const requestNo = this.state.requestId;
    const shipMethod = this.state.method;

    await this.props.pctContract.methods.setShipmentMethod(requestNo, shipMethod)
      .send({ from: this.props.account[0] })
      .once("receipt", (receipt) => {
        this.setState({ msg: "Updated shipping method successfully!" });
        setTimeout(() => {
          this.setState({ msg: " " });
        }, 3000);
      });


    this.setState({ requestId: '', method: '' })
  }

  onChange = async (e) => {
    this.setState({
      requestId: this.requestIdRef.current.value,
      method: this.methodRef.current.value
    });
  }

  render() {
    return (
      <form onSubmit={this.onSubmit} className="newform-container">
        <h4> Set Shipping Method</h4>
        <label> Tracking Number: </label>
        <input
          type="text"
          value={this.state.requestId}
          ref={this.requestIdRef}
          onChange={this.onChange}
          placeholder="e.g. 101"
          required="required"
        />
        <label>Shipping Method</label>
        <select ref={this.methodRef} onChange={this.onChange} >

          <option id="1" value="airplane">AIRPLANE</option>
          <option id="2" value="truck">TRUCK</option>
          <option id="3" value="ship">SHIP</option>

        </select>
        <div>
          <input type="submit" className="btn" value="SET METHOD" />
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
class ManageSupply extends Component {
  render() {
    return (
      <div className="form-collection newform-container">
        <p className="sub-head" style={{ textAlign: 'center' }}> <strong>SUPPLY PORTAL: </strong>MANAGE SUPPLY CHAIN ACTIVITES. </p>
        <SetLocation
          account={this.props.account}
          pcContract={this.props.pcContract}
          pctContract={this.props.pctContract} />
        <hr className="custom-hr-half"></hr>
        <SetShippingMethod
          account={this.props.account}
          pcContract={this.props.pcContract}
          pctContract={this.props.pctContract} />
        <hr className="custom-hr-half"></hr>
        <ApproveRequest
          account={this.props.account}
          pcContract={this.props.pcContract}
          pctContract={this.props.pctContract} />
        <hr className="custom-hr-half"></hr>
        <SendShipment
          account={this.props.account}
          pcContract={this.props.pcContract}
          pctContract={this.props.pctContract} />
        <hr className="custom-hr-half"></hr>
        <TransitGlobal
          account={this.props.account}
          pcContract={this.props.pcContract}
          pctContract={this.props.pctContract} />
        <hr className="custom-hr-half"></hr>
        <TransitLocal
          account={this.props.account}
          pcContract={this.props.pcContract}
          pctContract={this.props.pctContract} />
        <hr className="custom-hr-half"></hr>
        <ReceiveShipment
          account={this.props.account}
          pcContract={this.props.pcContract}
          pctContract={this.props.pctContract} />

      </div>
    );
  }
}

class ManageIOT extends Component {
  state = { request: '', temp: 0, humid: 0, msg: '' }
  constructor(props) {
    super(props)
    this.tempRef = React.createRef();
    this.humidRef = React.createRef();
    this.requestIdRef = React.createRef();
    this.onClick = this.onClick.bind(this);
    this.onChange = this.onChange.bind(this);
  }

  onClick = async (e) => {
    e.preventDefault();
    const temp = this.state.temp;
    const humid = this.state.humid;
    const request = parseInt(this.state.request, 10);
    console.log(temp, humid)
    await this.props.pctContract.methods.setShipmentTrackData(request, temp, humid)
      .send({ from: this.props.account[0] })
      .once("receipt", (receipt) => {
        this.setState({ msg: "Updated Temp and Humidity Data Successfully!" });
        setTimeout(() => {
          this.setState({ msg: " " });
        }, 3000);
      });

  }

  onChange = async (e) => {
    this.setState({
      temp: this.tempRef.current.value,
      humid: this.humidRef.current.value,
      request: this.requestIdRef.current.value
    });
  }

  render() {
    return (
      <div className="newform-container">
        <p className="sub-head" style={{ marginBottom: '20px' }}> <strong>IOT PORTAL</strong>: MANAGE IOT DATA. </p>
        <label> Tracking Number: </label>
        <input
          type="number"
          value={this.state.requestId}
          ref={this.requestIdRef}
          onChange={this.onChange}
          placeholder="e.g. 101"
          required="required"
        />
        <hr className="custom-hr-half"></hr>
        <h4> Set Temperature </h4>
        <label>  Temperature (°C):</label>
        <input type="number"
          value={this.state.temp}
          ref={this.tempRef}
          onChange={this.onChange}
          placeholder="e.g. 28"
          required="required"
        />

        <h4> Set Humidity </h4>
        <label> Humidity (%):</label>
        <input type="number"
          value={this.state.humid}
          ref={this.humidRef}
          onChange={this.onChange}
          placeholder="e.g. 30"
          required="required"
        />
        <div>
          <button onClick={this.onClick} className="btn"> UPDATE DATA </button>
        </div>
        <div
          style={{ marginTop: "20px" }}
          className="notify-data-container notify-text "
        >
          {this.state.msg}
        </div>


      </div>
    );
  }

}

class SupplyForm extends Component {

  render() {
    let acc = this.props.account;
    let cont1 = this.props.pcContract;
    let cont2 = this.props.pctContract;
    if (!acc || !cont1 || !cont2) {
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
                <NavLink to="/supply/managePermissions">+ MANAGE PERMISSIONS</NavLink>
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
              <li className="link-item">
                <NavLink to="/supply/supplier/createCostPlan">
                  + CREATE COST PLAN
                </NavLink>
              </li>
              <label style={{ marginTop: "10px" }}>
                <strong> MISC. </strong>
              </label>
              <li className="link-item">
                <NavLink to="/supply/supplyPortal">
                  + MANAGE SUPPLY
                </NavLink>
              </li>
              <li className="link-item">
                <NavLink to="/supply/iotPortal">
                  + MANAGE IOT
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
                  pcContract={this.props.pcContract}
                  pctContract={this.props.pctContract}
                />
              )}
            />
            <Route
              path="/supply/managePermissions"
              exact
              render={(props) => (
                <ManagePermissions
                  {...props}
                  Web3={this.props.Web3}
                  account={this.props.account}
                  pcContract={this.props.pcContract}
                  pctContract={this.props.pctContract}
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
                  pcContract={this.props.pcContract}
                  pctContract={this.props.pctContract}
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
                  pcContract={this.props.pcContract}
                  pctContract={this.props.pctContract}
                />
              )}
            />
            <Route
              path="/supply/supplier/createCostPlan"
              exact
              render={(props) => (
                <CreateCostPlan
                  {...props}
                  Web3={this.props.Web3}
                  account={this.props.account}
                  pcContract={this.props.pcContract}
                  pctContract={this.props.pctContract}
                />
              )}
            />
            <Route
              path="/supply/supplyPortal"
              exact
              render={(props) => (
                <ManageSupply
                  {...props}
                  Web3={this.props.Web3}
                  account={this.props.account}
                  pcContract={this.props.pcContract}
                  pctContract={this.props.pctContract}
                />
              )}
            />
            <Route
              path="/supply/iotPortal"
              exact
              render={(props) => (
                <ManageIOT
                  {...props}
                  Web3={this.props.Web3}
                  account={this.props.account}
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

export default SupplyForm;

import React, { Component } from "react";
import { BrowserRouter, Route, NavLink } from "react-router-dom";

class SetActualCosts extends Component {
  state = {
    product: "",
    productUnitsNo: 0,
    directMaterialActCost: 0,
    packagingMaterialActCost: 0,
    laborActCost: 0,
    manuIndirectActCost: 0,
    mrkActCost: 0,
    rsrhActCost: 0,
    totalActCost: 0,
  };

  constructor(props) {
    super(props);
    this.proRef = React.createRef();
    this.unitNoRef = React.createRef();
    this.dirMatActRef = React.createRef();
    this.pkgMatActRef = React.createRef();
    this.labActRef = React.createRef();
    this.manIndActRef = React.createRef();
    this.mrkActRef = React.createRef();
    this.rsrhActRef = React.createRef();
    this.OnChange = this.onChange.bind(this);
    this.OnSubmit = this.OnSubmit.bind(this);
  }

  OnSubmit = async (e) => {
    e.preventDefault();

    const pro = this.state.product;
    const units = this.state.productUnitsNo;
    const matAct = parseInt(this.state.directMaterialActCost, 10);
    const pkgMatAct = parseInt(this.state.packagingMaterialActCost,10)
    const labAct = parseInt(this.state.laborActCost, 10);
    const manuIndirectActCost = parseInt(this.state.manuIndirectActCost, 10);
    const totBudget = parseInt(this.state.budget,10);
    const mrkAct = parseInt(this.state.mrkActCost,10);
    const rsrhAct = parseInt(this.state.rsrhActCost,10);
    
    const totalActual = matAct + pkgMatAct + labAct + manuIndirectActCost
                        + mrkAct + rsrhAct;
    
    this.setState({ totalActCost: totalActual , totBudget});

    await this.props.pcContract.methods.setActualCost( pro ,units, matAct, pkgMatAct,
      labAct, manuIndirectActCost, mrkAct , rsrhAct)
    .send({from: this.props.account[0]}).once("receipt", (receipt) => {
      this.setState({ msg: "Actual Costs Were Set Successfully" });
      setTimeout(() => {
        this.setState({ msg: " " });
      }, 2000);
    });

    this.setState({
      product: "",
      productUnitsNo: "", 
      directMaterialActCost: "",
      packagingMaterialActCost: "",
      laborActCost: "",
      manuIndirectActCost: "",
      mrkActCost: "",
      rsrhActCost: "",
    });

  };

  onChange = async (e) => {
    this.setState({
      product: this.proRef.current.value,
      productUnitsNo: this.unitNoRef.current.value,
      directMaterialActCost: this.dirMatActRef.current.value,
      packagingMaterialActCost: this.pkgMatActRef.current.value,
      laborActCost: this.labActRef.current.value,
      manuIndirectActCost: this.manIndActRef.current.value,
      mrkActCost: this.mrkActRef.current.value,
      rsrhActCost: this.rsrhActRef.current.value,
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

      <h4> Set Production Units </h4>
      <label>Actual Production Units No: </label>
      <input
          type="number"
          ref={this.unitNoRef}
          value={this.state.productUnitsNo}
          placeholder="e.g. 50,000"
          onChange={this.OnChange}
          required = "required"
        />


      <h4> Set Actual Costs </h4>

      <label>Raw Materials: </label>
      <input
        type="number"
        ref={this.dirMatActRef}
        value={this.state.directMaterialActCost}
        placeholder="e.g. 5000"
        onChange={this.OnChange}
        required = "required"
      />

      <label>Packaging Materials: </label>
      <input
        type="number"
        ref={this.pkgMatActRef}
        value={this.state.packagingMaterialActCost}
        placeholder="e.g. 5000"
        onChange={this.OnChange}
        required = "required"
      />

      <label>Direct Labor: </label>
      <input
        type="number"
        ref={this.labActRef}
        value={this.state.laborActCost}
        placeholder="e.g. 5000"
        onChange={this.OnChange}
        required = "required"
      />

      <label>Manufacturing Overhead (Indirect Costs): </label>
      <input
        type="number"
        ref={this.manIndActRef}
        value={this.state.manuIndirectActCost}
        placeholder="e.g. 5000"
        onChange={this.OnChange}
        required = "required"
      />

      <label>Marketing: </label>
      <input
        type="number"
        ref={this.mrkActRef}
        value={this.state.mrkActCost}
        placeholder="e.g. 5000"
        onChange={this.OnChange}
        required = "required"
      />

      <label>Research: </label>
      <input
        type="number"
        ref={this.rsrhActRef}
        value={this.state.rsrhActCost}
        placeholder="e.g. 5000"
        onChange={this.OnChange}
        required = "required"
      />


      <input
        type="submit"
        className="btn"
        value="SET ACTUAL COSTS"
      />


      <div style={{marginTop:'20px'}} className = "notify-text">
        {this.state.msg}

      </div>
    </form>
    );
  }
}

class SetFlexibleBudget extends Component {
  state = {
    product: "",
    productUnitsNo: 0,
    directMaterialFlexCost: 0,
    packagingMaterialFlexCost: 0,
    laborFlexCost: 0,
    manuIndirectFlexCost: 0,
    mrkFlexCost: 0,
    rsrhFlexCost: 0,
    totalFlexCost: 0,
  };

  constructor(props) {
    super(props);
    this.proRef = React.createRef();
    this.unitNoRef = React.createRef();
    this.dirMatFlexRef = React.createRef();
    this.pkgMatFlexRef = React.createRef();
    this.labFlexRef = React.createRef();
    this.manIndFlexRef = React.createRef();
    this.mrkFlexRef = React.createRef();
    this.rsrhFlexRef = React.createRef();
    this.OnChange = this.onChange.bind(this);
    this.OnSubmit = this.OnSubmit.bind(this);
  }

  OnSubmit = async (e) => {
    e.preventDefault();

    const pro = this.state.product;
    const units = this.state.productUnitsNo;
    const matFlex = parseInt(this.state.directMaterialFlexCost, 10);
    const pkgMatFlex = parseInt(this.state.packagingMaterialFlexCost,10)
    const labFlex = parseInt(this.state.laborFlexCost, 10);
    const manuIndirectFlexCost = parseInt(this.state.manuIndirectFlexCost, 10);
    const mrkFlex = parseInt(this.state.mrkFlexCost,10);
    const rsrhFlex = parseInt(this.state.rsrhFlexCost,10);
    const totalFlex = matFlex + pkgMatFlex + labFlex + manuIndirectFlexCost
                        + mrkFlex + rsrhFlex;
    
    this.setState({ totalFlexCost: totalFlex});

    await this.props.pcContract.methods.setFlexibleCosts(pro, units, matFlex, pkgMatFlex,
      labFlex, manuIndirectFlexCost, mrkFlex , rsrhFlex)
    .send({from: this.props.account[0]}).once("receipt", (receipt) => {
      this.setState({ msg: "Flexible Costs Were Set Successfully" });
      setTimeout(() => {
        this.setState({ msg: " " });
      }, 2000);
    });

    this.setState({
      product: "",
      productUnitsNo: "",
      directMaterialFlexCost: "",
      packagingMaterialFlexCost: "",
      laborFlexCost: "",
      manuIndirectFlexCost: "",
      mrkFlexCost: "",
      rsrhFlexCost: "",
    });

  };

  onChange = async (e) => {
    this.setState({
      product: this.proRef.current.value,
      productUnitsNo: this.unitNoRef.current.value,
      directMaterialFlexCost: this.dirMatFlexRef.current.value,
      packagingMaterialFlexCost: this.pkgMatFlexRef.current.value,
      laborFlexCost: this.labFlexRef.current.value,
      manuIndirectFlexCost: this.manIndFlexRef.current.value,
      mrkFlexCost: this.mrkFlexRef.current.value,
      rsrhFlexCost: this.rsrhFlexRef.current.value,
    });
  };
  render() {
    return(
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

      <h4> Set Production Units </h4>
      <label>Flexible Production Units No: </label>
      <input
          type="number"
          ref={this.unitNoRef}
          value={this.state.productUnitsNo}
          placeholder="e.g. 50,000"
          onChange={this.OnChange}
          required = "required"
        />

      <h4> Set Flexible Costs </h4>

      <label>Raw Materials: </label>
      <input
        type="number"
        ref={this.dirMatFlexRef}
        value={this.state.directMaterialFlexCost}
        placeholder="e.g. 5000"
        onChange={this.OnChange}
        required = "required"
      />

      <label>Packaging Materials: </label>
      <input
        type="number"
        ref={this.pkgMatFlexRef}
        value={this.state.packagingMaterialFlexCost}
        placeholder="e.g. 5000"
        onChange={this.OnChange}
        required = "required"
      />

      <label>Direct Labor: </label>
      <input
        type="number"
        ref={this.labFlexRef}
        value={this.state.laborFlexCost}
        placeholder="e.g. 5000"
        onChange={this.OnChange}
        required = "required"
      />

      <label>Manufacturing Overhead (Indirect Costs): </label>
      <input
        type="number"
        ref={this.manIndFlexRef}
        value={this.state.manuIndirectFlexCost}
        placeholder="e.g. 5000"
        onChange={this.OnChange}
        required = "required"
      />

      <label>Marketing: </label>
      <input
        type="number"
        ref={this.mrkFlexRef}
        value={this.state.mrkFlexCost}
        placeholder="e.g. 5000"
        onChange={this.OnChange}
        required = "required"
      />

      <label>Research: </label>
      <input
        type="number"
        ref={this.rsrhFlexRef}
        value={this.state.rsrhFlexCost}
        placeholder="e.g. 5000"
        onChange={this.OnChange}
        required = "required"
      />


      <input
        type="submit"
        className="btn"
        value="SET FLEXIBLE COSTS"
      />


      <div style={{marginTop:'20px'}} className = "notify-text">
        {this.state.msg}

      </div>
    </form>
    );
  }
}

class CalculateStaticVariance extends Component {
  state = { id: "", tableVisibility: false };

  constructor(props) {
    super(props);
    this.productIdRef = React.createRef();
    this.onChange = this.onChange.bind(this);
    this.onSubmit = this.onSubmit.bind(this);
  }

  onSubmit = async (e) => {
    e.preventDefault();
    const proId = this.state.id;
    const standard = await this.props.pcContract.methods
      .getStdCostPlan(proId)
      .call();
    const stdCostData = standard.map((item, index) => {

      let matCostValue = parseInt(standard.directMaterialCost,10);
      let pkgCostValue = parseInt(standard.packagingMaterialCost,10);
      let laborCostValue = parseInt(standard.directLaborCost,10);
      let indirectManuCostValue = parseInt(standard.totalIndirectCost,10);
      let mrkCostValue = parseInt(standard.marketingCost,10);
      let rsrchCostValue = parseInt(standard.researchCost,10);
      let totalCostValue = parseInt(standard.CostTOT,10); 

      let matCost = matCostValue.toLocaleString("en-US", { style: "currency", currency: "USD" });
      let pkgCost = pkgCostValue.toLocaleString("en-US", { style: "currency", currency: "USD" });
      let laborCost = laborCostValue.toLocaleString("en-US", { style: "currency", currency: "USD" });
      let indirectManuCost = indirectManuCostValue.toLocaleString("en-US", { style: "currency", currency: "USD" });
      let mrkCost = mrkCostValue.toLocaleString("en-US",{ style: "currency", currency: "USD" });
      let rsrchCost = rsrchCostValue.toLocaleString("en-US", { style: "currency", currency: "USD" });
      let totalCost = totalCostValue.toLocaleString("en-US", {style: "currency", currency: "USD"});

      this.setState({
        standard,
        proId,
        matCost,
        pkgCost,
        laborCost,
        indirectManuCost,
        mrkCost,
        rsrchCost,
        totalCost,
        matCostValue,
        pkgCostValue,
        laborCostValue,
        indirectManuCostValue,
        mrkCostValue,
        rsrchCostValue,
        totalCostValue,
      });
      return true;
    });

    const actual =  await this.props.pcContract.methods
    .getActualCost(proId)
    .call();

    const actualCostData = actual.map((item,index) => {
      let matActCostValue = parseInt(actual.directMaterialCost,10);
      let pkgActCostValue = parseInt(actual.packagingMaterialCost,10);
      let laborActCostValue = parseInt(actual.directLaborCost,10);
      let indirectManuActCostValue = parseInt(actual.totalIndirectCost,10);
      let mrkActCostValue = parseInt(actual.marketingCost,10);
      let rsrchActCostValue = parseInt(actual.researchCost,10);
      let totalActCostValue = parseInt(actual.CostTOT,10); 

      let matActCost = matActCostValue.toLocaleString("en-US", { style: "currency", currency: "USD" });
      let pkgActCost = pkgActCostValue.toLocaleString("en-US", { style: "currency", currency: "USD" });
      let laborActCost = laborActCostValue.toLocaleString("en-US", { style: "currency", currency: "USD" });
      let indirectManuActCost = indirectManuActCostValue.toLocaleString("en-US", { style: "currency", currency: "USD" });
      let mrkActCost = mrkActCostValue.toLocaleString("en-US",{ style: "currency", currency: "USD" });
      let rsrchActCost = rsrchActCostValue.toLocaleString("en-US", { style: "currency", currency: "USD" });
      let totalActCost = totalActCostValue.toLocaleString("en-US", {style: "currency", currency: "USD"});
      
      
      this.setState({
        actual,
        matActCost,
        pkgActCost,
        laborActCost,
        indirectManuActCost,
        mrkActCost,
        rsrchActCost,
        totalActCost,
        matActCostValue,
        pkgActCostValue,
        laborActCostValue,
        indirectManuActCostValue,
        mrkActCostValue,
        rsrchActCostValue,
        totalActCostValue,
      });
      return true;

    });

    if (this.state.totalCost === "$0.00" || this.state.totalActCost === "$0.00" ) {
      this.setState({
        msg: "No Financial Data Found for the Given Product ID!".toUpperCase(),
      });
      this.setState({ tableVisibility: false });
    } else {
      this.setState({ tableVisibility: true });
    }

    setTimeout(() => {
      this.setState({ msg: " " });
    }, 3000);
    this.setState({ stdCostData, actualCostData });
  };

  onChange = async (e) => {
    this.setState({
      id: this.productIdRef.current.value,
    });
  };
  render() {
    let table;
    let acc = this.props.account;
    let cont1 = this.props.pcContract;
    let cont2 = this.props.pctContract;
    let web3 = this.props.Web3;
    
    if (!acc || !cont1 || !cont2 || !web3) {
      return <div> Loading..... </div>;
    }
    this.state.tableVisibility ? (table = "show") : (table = "hide");
    return (
      <div className="financial-status-container">
        <form onSubmit={this.onSubmit} className="form-container">
          <div className="form-row">
            <h4>Review Static-Budget Variance</h4>
            <label style={{ marginRight: "5px" }}> Product ID: </label>
            <input
              type="text"
              placeholder="e.g. pro101"
              value={this.state.id}
              onChange={this.onChange}
              ref={this.productIdRef}
              required="required"
            />
            <div>
              <input
              style={{ cursor: "pointer" }}
              type="submit"
              className="btn"
              value="VIEW FINANCIAL STATUS"
            />
            </div>
            
          </div>
          <div className="query-result">
            <p> {this.state.msg} </p>
          </div>
          <div className={`${table} costsClashContainer `}>
            <div className="std-cost-container">
              <table className="cost-data">
                <thead>
                  <tr>
                    <th>CRITERIA</th>
                    <th>STANDARD COSTS</th>
                    <th>STATIC-BUDGET VARIANCE</th>
                    <th>ACTUAL COSTS</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td> Raw Materials </td>
                    <td>{this.state.matCost}</td>
                    <td>
                      {Math.abs((this.state.matCostValue - this.state.matActCostValue)).toLocaleString('en-US', {style:'currency', currency:'USD'})}
                    </td>
                    <td>{this.state.matActCost}</td>
                  </tr>
                  <tr>
                    <td> Packaging Materials </td>
                    <td>{this.state.pkgCost}</td>
                    <td>
                      {Math.abs((this.state.pkgCostValue - this.state.pkgActCostValue)).toLocaleString('en-US', {style:'currency', currency:'USD'})}
                    </td>
                    <td>{this.state.pkgActCost}</td>
                  </tr>
                  <tr>
                    <td> Direct Labor </td>
                    <td>{this.state.laborCost}</td>
                    <td>
                      {Math.abs((this.state.laborCostValue - this.state.laborActCostValue)).toLocaleString('en-US', {style:'currency', currency:'USD'})}
                    </td>
                    <td>{this.state.laborActCost}</td>
                  </tr>
                  <tr>
                    <td> Indirect Manufacturing Costs </td>
                    <td>{this.state.indirectManuCost}</td>
                    <td>
                      {Math.abs((this.state.indirectManuCostValue - this.state.indirectManuActCostValue)).toLocaleString('en-US', {style:'currency', currency:'USD'})}
                    </td>
                    <td>{this.state.indirectManuActCost}</td>
                  </tr>
                  <tr>
                    <td> Marketing </td>
                    <td>{this.state.mrkCost}</td>
                    <td>
                      {Math.abs((this.state.mrkCostValue - this.state.mrkActCostValue)).toLocaleString('en-US', {style:'currency', currency:'USD'})}
                    </td>
                    <td>{this.state.mrkActCost}</td>
                  </tr>
                  <tr>
                    <td> Research </td>
                    <td>{this.state.rsrchCost}</td>
                    <td>
                      {Math.abs((this.state.rsrchCostValue - this.state.rsrchActCostValue)).toLocaleString('en-US', {style:'currency', currency:'USD'})}
                    </td>
                    <td>{this.state.rsrchActCost}</td>
                  </tr>
                </tbody>

                <tfoot>
                  <tr>
                    <th> TOTAL </th>
                    <td>{this.state.totalCost} </td>
                    <td>
                      {Math.abs((this.state.totalCostValue - this.state.totalActCostValue)).toLocaleString('en-US', {style:'currency', currency:'USD'}) }
                    </td>
                    <td>{this.state.totalActCost} </td>
                  </tr>
                </tfoot>
              </table>
            </div>
          </div>
        </form>
      </div>
    );
  }
}

class CalculateFlexibleVariance extends Component {

  state = { id: "", tableVisibility: false };

  constructor(props) {
    super(props);
    this.productIdRef = React.createRef();
    this.onChange = this.onChange.bind(this);
    this.onSubmit = this.onSubmit.bind(this);
  }

  onSubmit = async (e) => {
    e.preventDefault();
    const proId = this.state.id;
    const standard = await this.props.pcContract.methods
      .getStdCostPlan(proId)
      .call();
    const stdCostData = standard.map((item, index) => {

      let matCostValue = parseInt(standard.directMaterialCost,10);
      let pkgCostValue = parseInt(standard.packagingMaterialCost,10);
      let laborCostValue = parseInt(standard.directLaborCost,10);
      let indirectManuCostValue = parseInt(standard.totalIndirectCost,10);
      let mrkCostValue = parseInt(standard.marketingCost,10);
      let rsrchCostValue = parseInt(standard.researchCost,10);
      let totalCostValue = parseInt(standard.CostTOT,10); 

      let matCost = matCostValue.toLocaleString("en-US", { style: "currency", currency: "USD" });
      let pkgCost = pkgCostValue.toLocaleString("en-US", { style: "currency", currency: "USD" });
      let laborCost = laborCostValue.toLocaleString("en-US", { style: "currency", currency: "USD" });
      let indirectManuCost = indirectManuCostValue.toLocaleString("en-US", { style: "currency", currency: "USD" });
      let mrkCost = mrkCostValue.toLocaleString("en-US",{ style: "currency", currency: "USD" });
      let rsrchCost = rsrchCostValue.toLocaleString("en-US", { style: "currency", currency: "USD" });
      let totalCost = totalCostValue.toLocaleString("en-US", {style: "currency", currency: "USD"});

      this.setState({
        standard,
        proId,
        matCost,
        pkgCost,
        laborCost,
        indirectManuCost,
        mrkCost,
        rsrchCost,
        totalCost,
        matCostValue,
        pkgCostValue,
        laborCostValue,
        indirectManuCostValue,
        mrkCostValue,
        rsrchCostValue,
        totalCostValue,
      });
      return true;
    });

    const actual =  await this.props.pcContract.methods
    .getActualCost(proId)
    .call();

    const actualCostData = actual.map((item,index) => {
      let matActCostValue = parseInt(actual.directMaterialCost,10);
      let pkgActCostValue = parseInt(actual.packagingMaterialCost,10);
      let laborActCostValue = parseInt(actual.directLaborCost,10);
      let indirectManuActCostValue = parseInt(actual.totalIndirectCost,10);
      let mrkActCostValue = parseInt(actual.marketingCost,10);
      let rsrchActCostValue = parseInt(actual.researchCost,10);
      let totalActCostValue = parseInt(actual.CostTOT,10); 

      let matActCost = matActCostValue.toLocaleString("en-US", { style: "currency", currency: "USD" });
      let pkgActCost = pkgActCostValue.toLocaleString("en-US", { style: "currency", currency: "USD" });
      let laborActCost = laborActCostValue.toLocaleString("en-US", { style: "currency", currency: "USD" });
      let indirectManuActCost = indirectManuActCostValue.toLocaleString("en-US", { style: "currency", currency: "USD" });
      let mrkActCost = mrkActCostValue.toLocaleString("en-US",{ style: "currency", currency: "USD" });
      let rsrchActCost = rsrchActCostValue.toLocaleString("en-US", { style: "currency", currency: "USD" });
      let totalActCost = totalActCostValue.toLocaleString("en-US", {style: "currency", currency: "USD"});
      
      
      this.setState({
        actual,
        matActCost,
        pkgActCost,
        laborActCost,
        indirectManuActCost,
        mrkActCost,
        rsrchActCost,
        totalActCost,
        matActCostValue,
        pkgActCostValue,
        laborActCostValue,
        indirectManuActCostValue,
        mrkActCostValue,
        rsrchActCostValue,
        totalActCostValue,
      });
      return true;

    });

    const flexible =  await this.props.pcContract.methods
    .getFlexibleCosts(proId)
    .call();

    const flexCostData = flexible.map((item,index) => {
      let matFlexCostValue = parseInt(flexible.directMaterialCost,10);
      let pkgFlexCostValue = parseInt(flexible.packagingMaterialCost,10);
      let laborFlexCostValue = parseInt(flexible.directLaborCost,10);
      let indirectManuFlexCostValue = parseInt(flexible.totalIndirectCost,10);
      let mrkFlexCostValue = parseInt(flexible.marketingCost,10);
      let rsrchFlexCostValue = parseInt(flexible.researchCost,10);
      let totalFlexCostValue = parseInt(flexible.CostTOT,10); 

      let matFlexCost = matFlexCostValue.toLocaleString("en-US", { style: "currency", currency: "USD" });
      let pkgFlexCost = pkgFlexCostValue.toLocaleString("en-US", { style: "currency", currency: "USD" });
      let laborFlexCost = laborFlexCostValue.toLocaleString("en-US", { style: "currency", currency: "USD" });
      let indirectManuFlexCost = indirectManuFlexCostValue.toLocaleString("en-US", { style: "currency", currency: "USD" });
      let mrkFlexCost = mrkFlexCostValue.toLocaleString("en-US",{ style: "currency", currency: "USD" });
      let rsrchFlexCost = rsrchFlexCostValue.toLocaleString("en-US", { style: "currency", currency: "USD" });
      let totalFlexCost = totalFlexCostValue.toLocaleString("en-US", {style: "currency", currency: "USD"});
      
      
      this.setState({
        actual,
        matFlexCost,
        pkgFlexCost,
        laborFlexCost,
        indirectManuFlexCost,
        mrkFlexCost,
        rsrchFlexCost,
        totalFlexCost,
        matFlexCostValue,
        pkgFlexCostValue,
        laborFlexCostValue,
        indirectManuFlexCostValue,
        mrkFlexCostValue,
        rsrchFlexCostValue,
        totalFlexCostValue,
      });
      return true;

    });

    if (this.state.totalCost === "$0.00" || this.state.totalActCost === "$0.00" || this.state.totalFlexCost === "$0.00") {
      this.setState({
        msg: "No Financial Data Found for the Given Product ID!".toUpperCase(),
      });
      this.setState({ tableVisibility: false });
    } else {
      this.setState({ tableVisibility: true });
    }

    setTimeout(() => {
      this.setState({ msg: " " });
    }, 3000);
    this.setState({ stdCostData, actualCostData , flexCostData });

  };

  onChange = async (e) => {
    this.setState({
      id: this.productIdRef.current.value,
    });
  };
 
  render() {
    let table;
    let acc = this.props.account;
    let cont1 = this.props.pcContract;
    let cont2 = this.props.pctContract;
    let web3 = this.props.Web3;
    
    if (!acc || !cont1 || !cont2 || !web3) {
      return <div> Loading..... </div>;
    }
    this.state.tableVisibility ? (table = "show") : (table = "hide");
    return(
      <div className="financial-status-container">
      <form onSubmit={this.onSubmit} className="form-container">
        <div className="form-row">
          <h4>Review Flexible-Budget Variance</h4>
          <label style={{ marginRight: "5px" }}> Product ID: </label>
          <input
            type="text"
            placeholder="e.g. pro101"
            value={this.state.id}
            onChange={this.onChange}
            ref={this.productIdRef}
            required="required"
          />
          <div>
            <input
            style={{ cursor: "pointer" }}
            type="submit"
            className="btn"
            value="VIEW FINANCIAL STATUS"
          />
          </div>
          
        </div>
        <div className="query-result">
          <p> {this.state.msg} </p>
        </div>
        <div className={`${table} costsClashContainer `}>
          <div className="std-cost-container">
            <table className="cost-data">
              <thead>
                <tr>
                  <th>CRITERIA</th>
                  <th>ACTUAL COSTS</th>
                  <th>FLEXIBLE-BUDGET VARIANCE</th>
                  <th>FLEXIBLE COSTS</th>
                  <th>SALES-BUDGET VARIANCE</th>
                  <th>STANDARD COSTS</th>   
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td> Raw Materials </td>
                  <td>{this.state.matActCost}</td>
                  <td>
                    {(Math.abs(this.state.matActCostValue - this.state.matFlexCostValue)).toLocaleString('en-US', {style:'currency', currency:'USD'})}
                  </td>
                  <td>{this.state.matFlexCost}</td>
                  <td>
                    {(this.state.matFlexCostValue - this.state.matCostValue).toLocaleString('en-US', {style:'currency', currency:'USD'})}
                  </td>
                  <td>{this.state.matCost}</td>
                </tr>
                <tr>
                  <td> Packaging Materials </td>
                  <td>{this.state.pkgActCost}</td>
                  <td>
                    {(Math.abs(this.state.pkgActCostValue - this.state.pkgFlexCostValue)).toLocaleString('en-US', {style:'currency', currency:'USD'})}
                  </td>
                  <td>{this.state.pkgFlexCost}</td>
                  <td>
                    {Math.abs((this.state.pkgFlexCostValue - this.state.pkgCostValue)).toLocaleString('en-US', {style:'currency', currency:'USD'})}
                  </td>
                  <td>{this.state.pkgCost}</td>
                </tr>
                <tr>
                  <td> Direct Labor </td>
                  <td>{this.state.laborActCost}</td>
                  <td>
                    {(Math.abs(this.state.laborActCostValue - this.state.laborFlexCostValue)).toLocaleString('en-US', {style:'currency', currency:'USD'})}
                  </td>
                  <td>{this.state.laborFlexCost}</td>
                  <td>
                    {(Math.abs(this.state.laborFlexCostValue - this.state.laborCostValue)).toLocaleString('en-US', {style:'currency', currency:'USD'})}
                  </td>
                  <td>{this.state.laborCost}</td>
                </tr>
                <tr>
                <td>Indirect Manufacturing Costs</td>
                <td>{this.state.indirectManuActCost}</td>
                  <td>
                    {(Math.abs(this.state.indirectManuActCostValue - this.state.indirectManuFlexCostValue)).toLocaleString('en-US', {style:'currency', currency:'USD'})}
                  </td>
                  <td>{this.state.indirectManuFlexCost}</td>
                  <td>
                    {(Math.abs(this.state.indirectManuFlexCostValue - this.state.indirectManuCostValue)).toLocaleString('en-US', {style:'currency', currency:'USD'})}
                  </td>
                  <td>{this.state.indirectManuCost}</td>
                </tr>
                <tr>
                  <td> Marketing </td>
                  <td>{this.state.mrkActCost}</td>
                  <td>
                    {(Math.abs(this.state.mrkActCostValue - this.state.mrkFlexCostValue)).toLocaleString('en-US', {style:'currency', currency:'USD'})}
                  </td>
                  <td>{this.state.mrkFlexCost}</td>
                  <td>
                    {(Math.abs(this.state.mrkFlexCostValue - this.state.mrkCostValue)).toLocaleString('en-US', {style:'currency', currency:'USD'})}
                  </td>
                  <td>{this.state.mrkCost}</td>
                </tr>
                <tr>
                  <td> Research </td>
                  <td>{this.state.rsrchActCost}</td>
                  <td>
                    {(Math.abs(this.state.rsrchActCostValue - this.state.rsrchFlexCostValue)).toLocaleString('en-US', {style:'currency', currency:'USD'})}
                  </td>
                  <td>{this.state.rsrchFlexCost}</td>
                  <td>
                    {(Math.abs(this.state.rsrchFlexCostValue - this.state.rsrchCostValue)).toLocaleString('en-US', {style:'currency', currency:'USD'})}
                  </td>
                  <td>{this.state.rsrchCost}</td>
                </tr>
              </tbody>

              <tfoot>
                <tr>
                  <th> TOTAL </th>
                  <td>{this.state.totalActCost}</td>
                  <td>
                    {(Math.abs(this.state.totalActCostValue - this.state.totalFlexCostValue)).toLocaleString('en-US', {style:'currency', currency:'USD'})}
                  </td>
                  <td>{this.state.totalFlexCost}</td>
                  <td>
                    {(Math.abs(this.state.totalFlexCostValue - this.state.totalCostValue)).toLocaleString('en-US', {style:'currency', currency:'USD'})}
                  </td>
                  <td>{this.state.totalCost}</td>
                </tr>
              </tfoot>
            </table>
          </div>
        </div>
      </form>
    </div>
    );
  }
}

// class SetDirectCosts extends Component {
//   render() {
//     return(
//       <div>SET DIRECT COSTS</div>
//     );
//   }
// }

class FinancialLog extends Component {
  
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
                <NavLink to="/financial-log/setActualCosts">
                  + MANAGE ACTUAL COSTS
                </NavLink>
              </li>
              <li className="link-item">
                <NavLink to="/financial-log/setFlexibleBudget">
                  + MANAGE FLEXIBLE BUDGET
                </NavLink>
              </li>
              <li className="link-item">
                <NavLink to="/financial-log/setDirectCosts">
                  + MANAGE DIRECT COSTS
                </NavLink>
              </li>
              <label style={{ marginTop: "10px" }}>
                <strong> REVIEW VARIANCE </strong>
              </label>
              <li className="link-item">
                <NavLink to="/financial-log/staticVariance">
                  + STATIC-BUDGET 
                </NavLink>
              </li>
              <li className="link-item">
                <NavLink to="/financial-log/flexibleVariance">
                  + FLEXIBLE-BUDGET 
                </NavLink>
              </li>
              {/* <li className="link-item">
                <NavLink to="/financial-log/directCostsVariance">
                  + DIRECT-COST VARIANCES 
                </NavLink>
              </li> */}
            </ul>
          </div>
          <div className="main-content">
            <Route
              path="/financial-log/setActualCosts"
              exact
              render={(props) => (
                <SetActualCosts
                  {...props}
                  account={this.props.accounts}
                  pcContract={this.props.pcContract}
                  pctContract={this.props.pctContract}
                />
              )}
            />
            <Route
              path="/financial-log/setFlexibleBudget"
              exact
              render={(props) => (
                <SetFlexibleBudget
                  {...props}
                  account={this.props.accounts}
                  pcContract={this.props.pcContract}
                  pctContract={this.props.pctContract}
                />
              )}
            />
             {/* <Route
              path="/financial-log/setDirectCosts"
              exact
              render={(props) => (
                <SetDirectCosts
                  {...props}
                  Web3={this.props.web3}
                  account={this.props.accounts}
                  pcContract={this.props.pcContract}
                  pctContract={this.props.pctContract}
                />
              )}
            /> */}
            <Route
              path="/financial-log/staticVariance"
              exact
              render={(props) => (
                <CalculateStaticVariance
                  {...props}
                  Web3={this.props.web3}
                  account={this.props.accounts}
                  pcContract={this.props.pcContract}
                  pctContract={this.props.pctContract}
                />
              )}
            />
            <Route
              path="/financial-log/flexibleVariance"
              exact
              render={(props) => (
                <CalculateFlexibleVariance
                  {...props}
                  Web3={this.props.web3}
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

export default FinancialLog;

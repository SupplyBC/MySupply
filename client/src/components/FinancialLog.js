import React, { Component } from "react";
import { BrowserRouter, Route, NavLink } from "react-router-dom";

class SetActualCosts extends Component {
  state = {
    product: "",
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

    await this.props.pcContract.methods.setActualCost(pro,matAct, pkgMatAct,
      labAct, manuIndirectActCost, mrkAct , rsrhAct)
    .send({from: this.props.account[0]}).once("receipt", (receipt) => {
      this.setState({ msg: "Actual Costs Were Set Successfully" });
      setTimeout(() => {
        this.setState({ msg: " " });
      }, 2000);
    });

    this.setState({
      product: "",
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
    const matAct = parseInt(this.state.directMaterialActCost, 10);
    const pkgMatAct = parseInt(this.state.packagingMaterialActCost,10)
    const labAct = parseInt(this.state.laborActCost, 10);
    const manuIndirectActCost = parseInt(this.state.manuIndirectActCost, 10);
    const totBudget = parseInt(this.state.budget,10);
    const mrkAct = parseInt(this.state.mrkActCost,10);
    const rsrhAct = parseInt(this.state.rsrhActCost,10);
    
    const totalActual = matAct + pkgMatAct + labAct + manuIndirectActCost
                        + mrkAct + rsrhAct;
    
    this.setState({ totalActCost: totalActual });

    console.log(pro, matAct, labAct, manuIndirectActCost, totalActual, totBudget, pkgMatAct);
    await this.props.pcContract.methods.setFlexibleCost(pro,matAct, pkgMatAct,
      labAct, manuIndirectActCost, mrkAct , rsrhAct)
    .send({from: this.props.account[0]}).once("receipt", (receipt) => {
      this.setState({ msg: "Flexible Costs Were Set Successfully" });
      setTimeout(() => {
        this.setState({ msg: " " });
      }, 2000);
    });

    this.setState({
      product: "",
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
      directMaterialActCost: this.dirMatActRef.current.value,
      packagingMaterialActCost: this.pkgMatActRef.current.value,
      laborActCost: this.labActRef.current.value,
      manuIndirectActCost: this.manIndActRef.current.value,
      mrkActCost: this.mrkActRef.current.value,
      rsrhActCost: this.rsrhActRef.current.value,
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
    let account = this.props.account;
    let contract = this.props.contract;
    if (!account || !contract) {
      return <div>Loading ..... </div>;
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
                      {(this.state.matCostValue - this.state.matActCostValue).toLocaleString('en-US', {style:'currency', currency:'USD'})}
                    </td>
                    <td>{this.state.matActCost}</td>
                  </tr>
                  <tr>
                    <td> Packaging Materials </td>
                    <td>{this.state.pkgCost}</td>
                    <td>
                      {(this.state.pkgCostValue - this.state.pkgActCostValue).toLocaleString('en-US', {style:'currency', currency:'USD'})}
                    </td>
                    <td>{this.state.pkgActCost}</td>
                  </tr>
                  <tr>
                    <td> Direct Labor </td>
                    <td>{this.state.laborCost}</td>
                    <td>
                      {(this.state.laborCostValue - this.state.laborActCostValue).toLocaleString('en-US', {style:'currency', currency:'USD'})}
                    </td>
                    <td>{this.state.laborActCost}</td>
                  </tr>
                  <tr>
                    <td> Indirect Manufacturing Costs </td>
                    <td>{this.state.indirectManuCost}</td>
                    <td>
                      {(this.state.indirectManuCostValue - this.state.indirectManuActCostValue).toLocaleString('en-US', {style:'currency', currency:'USD'})}
                    </td>
                    <td>{this.state.indirectManuActCost}</td>
                  </tr>
                  <tr>
                    <td> Marketing </td>
                    <td>{this.state.mrkCost}</td>
                    <td>
                      {(this.state.mrkCostValue - this.state.mrkActCostValue).toLocaleString('en-US', {style:'currency', currency:'USD'})}
                    </td>
                    <td>{this.state.mrkActCost}</td>
                  </tr>
                  <tr>
                    <td> Research </td>
                    <td>{this.state.rsrchCost}</td>
                    <td>
                      {(this.state.rsrchCostValue - this.state.rsrchActCostValue).toLocaleString('en-US', {style:'currency', currency:'USD'})}
                    </td>
                    <td>{this.state.rsrchActCost}</td>
                  </tr>
                </tbody>

                <tfoot>
                  <tr>
                    <th> TOTAL </th>
                    <td>{this.state.totalCost} </td>
                    <td>
                      {(this.state.totalCostValue - this.state.totalActCostValue).toLocaleString('en-US', {style:'currency', currency:'USD'}) }
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
    let account = this.props.account;
    let contract = this.props.contract;
    if (!account || !contract) {
      return <div>Loading ..... </div>;
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
                    {(this.state.matCostValue - this.state.matActCostValue).toLocaleString('en-US', {style:'currency', currency:'USD'})}
                  </td>
                  <td>{this.state.matActCost}</td>
                </tr>
                <tr>
                  <td> Packaging Materials </td>
                  <td>{this.state.pkgCost}</td>
                  <td>
                    {(this.state.pkgCostValue - this.state.pkgActCostValue).toLocaleString('en-US', {style:'currency', currency:'USD'})}
                  </td>
                  <td>{this.state.pkgActCost}</td>
                </tr>
                <tr>
                  <td> Direct Labor </td>
                  <td>{this.state.laborCost}</td>
                  <td>
                    {(this.state.laborCostValue - this.state.laborActCostValue).toLocaleString('en-US', {style:'currency', currency:'USD'})}
                  </td>
                  <td>{this.state.laborActCost}</td>
                </tr>
                <tr>
                  <td> Indirect Manufacturing Costs </td>
                  <td>{this.state.indirectManuCost}</td>
                  <td>
                    {(this.state.indirectManuCostValue - this.state.indirectManuActCostValue).toLocaleString('en-US', {style:'currency', currency:'USD'})}
                  </td>
                  <td>{this.state.indirectManuActCost}</td>
                </tr>
                <tr>
                  <td> Marketing </td>
                  <td>{this.state.mrkCost}</td>
                  <td>
                    {(this.state.mrkCostValue - this.state.mrkActCostValue).toLocaleString('en-US', {style:'currency', currency:'USD'})}
                  </td>
                  <td>{this.state.mrkActCost}</td>
                </tr>
                <tr>
                  <td> Research </td>
                  <td>{this.state.rsrchCost}</td>
                  <td>
                    {(this.state.rsrchCostValue - this.state.rsrchActCostValue).toLocaleString('en-US', {style:'currency', currency:'USD'})}
                  </td>
                  <td>{this.state.rsrchActCost}</td>
                </tr>
              </tbody>

              <tfoot>
                <tr>
                  <th> TOTAL </th>
                  <td>{this.state.totalCost} </td>
                  <td>
                    {(this.state.totalCostValue - this.state.totalActCostValue).toLocaleString('en-US', {style:'currency', currency:'USD'}) }
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
            <Route
              path="/financial-log/staticVariance"
              exact
              render={(props) => (
                <CalculateStaticVariance
                  {...props}
                  Web3={this.props.Web3}
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
                  Web3={this.props.Web3}
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

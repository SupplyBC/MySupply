import React, { Component } from "react";

class FinancialLog extends Component {
  state = { id: "" , tableVisibility: false };
  constructor(props) {
    super(props);
    this.productIdRef = React.createRef();
    this.onChange = this.onChange.bind(this);
    this.onSubmit = this.onSubmit.bind(this);
  }

  onSubmit = async (e) => {
    e.preventDefault();
    const proId = this.state.id;
    const standard = await this.props.contract.methods
    .getStdCostPlan(proId)
    .call();
    const stdCostData = standard.map( (costList , index) => {
      let matCost = parseInt(standard.directMaterialCost,10);
      let pkgCost = parseInt(standard.packagingMaterialCost,10);
      let laborCost = parseInt(standard.directLaborCost,10);
      let indirectManuCost = parseInt(standard.totalIndirectCost,10);
      let mrkCost = parseInt(standard.marketingCost,10);
      let rsrchCost= parseInt(standard.researchCost,10);
      let totalCost = parseInt(standard.CostTOT,10);
      // let stdCostList = costList.standard.packagingMaterialCost;
      this.setState({ standard , proId, matCost, pkgCost, laborCost,
        indirectManuCost, mrkCost , rsrchCost, totalCost });
        return(
          true
        );
        
    });
    if(this.state.totalCost === 0) {
      this.setState({msg: 'No Financial Data Found for the Given Product ID!'.toUpperCase()})
      this.setState({tableVisibility:false})
    } else {
      this.setState({tableVisibility:true})
    }

    setTimeout(() => {
      this.setState({ msg: " " });
    }, 3000);
    this.setState({stdCostData});
   
  };

  onChange = async (e) => {
    this.setState({
      id: this.productIdRef.current.value,
    });
  };
  render() {
    let table;
    let account = this.props.accounts;
    let contract = this.props.contract;
    if (!account || !contract) {
      return <div>Loading ..... </div>;
    }
    this.state.tableVisibility ? (table = "show") : (table = "hide");
    return (
      <div>
        <form onSubmit={this.onSubmit} className="form-container">
          <div className="form-row">
            <h4>Review Financial Status</h4>
            <label style={{ marginRight: "5px" }}> Product ID: </label>
            <input
              type="text"
              placeholder="e.g. pro101"
              value={this.state.id}
              onChange={this.onChange}
              ref={this.productIdRef}
            />

            <input
              style={{ cursor: "pointer" }}
              type="submit"
              className="btn"
              value="VIEW FINANCIAL STATUS"
            />
          </div>
          <div className = "query-result" > 
          <p> {this.state.msg} </p>
          </div>
          <div className ={`${table} costsClashContainer `} >
            <div className="std-cost-container">
              <h4>Standard Cost Sheet</h4> 
              <table  className="cost-data">
                <thead>
                  <tr>
                    <th>CRITERIA</th>
                    <th>VALUE</th>
                  </tr>
                </thead>
                <tbody>

                <tr>
                  <td> Raw Materials </td>
                  <td>{this.state.matCost}</td>
                </tr>
                <tr>
                  <td> Packaging Materials </td>
                  <td>{this.state.pkgCost}</td>
                </tr>
                <tr>
                  <td> Direct Labor </td>
                  <td>{this.state.laborCost}</td>
                </tr>
                <tr>
                  <td> Indirect Manufacturing Costs </td>
                  <td>{this.state.indirectManuCost}</td>
                </tr>
                <tr>
                  <td> Marketing </td>
                  <td>{this.state.mrkCost}</td>
                </tr>
                <tr>
                  <td> Research </td>
                  <td>{this.state.rsrchCost}</td>
                </tr>
                </tbody>

                <tfoot>
                  <tr>
                    <th> TOTAL </th>
                    <td>{this.state.totalCost} </td> 
                  </tr>
                </tfoot> 
              </table>
              </div>

            <div className="actual-cost-container">
            <h4>Actual Cost Sheet</h4> 
            <table  className="cost-data">
                <thead>
                  <tr>
                    <th>CRITERIA</th>
                    <th>VALUE</th>
                  </tr>
                </thead>
                <tbody>

                <tr>
                  <td> Raw Materials </td>
                  <td>{this.state.matCost}</td>
                </tr>
                <tr>
                  <td> Packaging Materials </td>
                  <td>{this.state.pkgCost}</td>
                </tr>
                <tr>
                  <td> Direct Labor </td>
                  <td>{this.state.laborCost}</td>
                </tr>
                <tr>
                  <td> Indirect Manufacturing Costs </td>
                  <td>{this.state.indirectManuCost}</td>
                </tr>
                <tr>
                  <td> Marketing </td>
                  <td>{this.state.mrkCost}</td>
                </tr>
                <tr>
                  <td> Research </td>
                  <td>{this.state.rsrchCost}</td>
                </tr>
                </tbody>

                <tfoot>
                  <tr>
                    <th> TOTAL </th>
                    <td>{this.state.totalCost} </td> 
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

export default FinancialLog;

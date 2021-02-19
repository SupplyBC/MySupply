import React, { Component } from "react";

class FinancialLog extends Component {
  state = { id: '' }
  constructor(props) {
    super(props);
    this.productIdRef = React.createRef();
    this.onChange = this.onChange.bind(this);
    this.onSubmit = this.onSubmit.bind(this);
  }

  onSubmit = async (e) => {
    e.preventDefault();
    const proId = this.state.id;
    let standard = await this.props.contract.methods.getStdCostPlan(proId).call();
    this.setState({standard});
    this.setState({product: " "})
  };

  onChange = async (e) => {

    this.setState({
      id: this.productIdRef.current.value,
    });
  };
  render() {
    let account = this.props.accounts;
    let contract = this.props.contract;
    if (!account || !contract) {
      return <div>Loading ..... </div>;
    }
    return (
        <div>
        <form onSubmit={this.onSubmit} className="form-container">
        <div className="form-row">
          <h4>Review Financial Affairs</h4>
          <label style={{marginRight: '5px'}}> Product ID: </label>
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
        <div className="costsClashContainer">
          <div className="std-cost-container">
            {this.state.standard}
          </div>

          <div className="actual-cost-container">
            
          </div>
        </div>
        </form>

        
        </div>
    );
  }
}

export default FinancialLog;

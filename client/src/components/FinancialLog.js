import React, { Component } from "react";

class FinancialLog extends Component {
  state = { product: "" };
  constructor(props) {
    super(props);
    this.productIdRef = React.createRef();
    this.onChange = this.onChange.bind(this);
    this.onSubmit = this.onSubmit.bind(this);
  }

  onSubmit = async (e) => {
    e.preventDefault();
  };

  onChange = async (e) => {
    this.setState({
      product: this.productIdRef.current.value,
    });
  };
  render() {
    return (
        <form onSubmit={this.handleSubmit} className="form-container">
        <div className="form-row">
          <h4>Review Financial Affairs</h4>
          <label style={{marginRight: '5px'}}> Product ID: </label>
          <input
            type="text"
            placeholder="e.g 101"
            value={this.state.product}
            ref={this.productIdRef}
            onChange={this.handleChange}
          />
          <input
            style={{ cursor: "pointer" }}
            type="submit"
            className="btn"
            value="VIEW FINANCIAL STATUS"
          />
        </div>
        </form>
    );
  }
}

export default FinancialLog;

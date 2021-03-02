import React, { Component } from "react";

class Track extends Component {
  state = { logs: [] };

  componentDidMount = async () => {};

  state = { requestID: "" };
  constructor(props) {
    super(props);
    this.requestIdRef = React.createRef();
    this.handleChange = this.handleChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
  }

  handleSubmit = async (e) => {
    e.preventDefault();
    let id = parseInt(this.state.requestID, 10);
    // await this.props.contract.methods.createLog(1, 'SHIPPED' ,'20C', '25%', 'NORMAL').send({from: this.props.account})
    let response = await this.props.contract.methods.getTrackLogs(id).call();
    console.log(response);
    let log1 = response.map(item => {
      return <div style={{backgroundColor: '#999', padding: '10px',borderBottom: '1px solid black'}}> {item = item + ", "} <br></br> </div>
    })
    let log2 = response[0]
    console.log(log1, log2);
    this.setState({ response, log1 });
    this.setState({
      requestID: "",
    });
  };

  handleChange = async (e) => {
    this.setState({
      requestID: this.requestIdRef.current.value,
    });
  };

  render() {
    let acc = this.props.account;
    let cont = this.props.contract;

    if (!acc || !cont) {
      return <div> Loading..... </div>;
    }
    return (
      <form onSubmit={this.handleSubmit} className="form-container">
        <div className="form-row">
          <h4>Track Requested Shipments </h4>
          <label style={{marginRight: '5px'}}> Request ID: </label>
          <input
            type="text"
            placeholder="e.g 101"
            value={this.state.requestID}
            ref={this.requestIdRef}
            onChange={this.handleChange}
          />
          <input
            style={{ cursor: "pointer" }}
            type="submit"
            className="btn"
            value="VIEW SHIPMENT STATUS"
          />
        </div>

        <div className="response-text">{this.state.log1}</div>
      </form>
    );
  }
}

export default Track;

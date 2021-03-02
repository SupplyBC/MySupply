import React, { Component } from "react";

function TrackImg(props) {
  if (props.status === "ABNORMAL") {
    return <img src={require("../invalid-1.svg")} alt="invalid" />;
  } else {
    return <img src={require("../valid-3.svg")} alt="valid" />;
  }
}
class TrackRecord extends Component {
  // constructor(props) {
  //   super(props);

  // }
  render() {
    let statusColor;
    const dateStr = new Date(this.props.time * 1000).toString();
    const dateArr = dateStr.split(" ", 5);
    const timestamp = dateArr.join(" ");
    if (
      this.props.material === "ABNORMAL"
        ? (statusColor = "alert-text")
        : (statusColor = "good-text")
    )
      return (
        <div className="track-record-container">
          <TrackImg status={this.props.material} />
          <ul className="record-list">
            <li className="timestamp log-item"> {timestamp}</li>
            <li className="head log-item"> {this.props.ship}</li>
            <hr className="custom-hr-full" />
            <li className="log-item">
              <strong>TEMP:</strong> {this.props.temp}
            </li>
            <li className="log-item">
              {" "}
              <strong>HUMIDITY:</strong> {this.props.humid}
            </li>
            <li className="log-item">
              <strong>STATUS:</strong>
              <span className={`${statusColor}`}> {this.props.material}</span>
            </li>
          </ul>
        </div>
      );
  }
}

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

    if (response.length === 0) {
      this.setState({
        msg: "No tracking logs are available for this request, please try again later!".toUpperCase(),
      });
    }
    setTimeout(() => {
      this.setState({ msg: "" });
    }, 3000);

    let log = response.map((item, index) => {
      const shipStatus = item.shipStatus;
      const matStatus = item.materialStatus;
      const temp = item.currentTemp;
      const humid = item.currentHumidity;
      const time = item.logTime;
      this.setState({ shipStatus, matStatus, temp, humid, time });

      return (
        <TrackRecord
          key={index}
          status={item}
          time={this.state.time}
          ship={this.state.shipStatus}
          material={this.state.matStatus}
          temp={this.state.temp}
          humid={this.state.humid}
        />
      );
    });

    this.setState({ response, log });
    this.setState({
      requestID: " ",
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
          <label style={{ marginRight: "5px" }}> Request ID: </label>
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

        <div style={{ margin: "10px 0px" }} className="query-result">
          {this.state.msg}
        </div>
        <div className="response-logs">{this.state.log} </div>
      </form>
    );
  }
}

export default Track;

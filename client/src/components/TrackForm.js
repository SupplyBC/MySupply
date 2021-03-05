import React, { Component } from "react";

function TrackImg(props) {
  if (props.status === "ABNORMAL") {
    return <img src={require("../assets/invalid-1.svg")} alt="invalid" />;
  } else {
    return <img src={require("../assets/valid-3.svg")} alt="valid" />;
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
          <TrackImg status={this.props.ship} />
          <ul className="record-list">
            <li className="timestamp log-item"> {timestamp}</li>
            <li className="head log-item"> {this.props.request}</li>
            <li style={{fontStyle: 'normal'}}className="timestamp log-item"> SHIPMENT VERIFIED</li>
            <hr className="custom-hr-full" />
            <li className="log-item">
            {this.props.description}.
            </li>
            {/* <li className="log-item">
              <strong>TEMP:</strong> {this.props.temp} °C 
            </li>
            <li className="log-item">
              <strong>HUMIDITY:</strong>  {this.props.humid} %
            </li> */}
            <li className="log-item">
              <strong>STATUS:</strong>
              <span className={`${statusColor}`}> {this.props.ship}</span>
            </li>
          </ul>
        </div>
      );
  }
}

class Track extends Component {
  state = { logs: [], wholeActive:false, isTab1Active: false , isTab2Active: false };

  componentDidMount = async () => {};

  state = { requestID: "" };

  constructor(props) {
    super(props);
    this.requestIdRef = React.createRef();
    this.handleChange = this.handleChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
    this.toggleSection1 = this.toggleSection1.bind(this);
    this.toggleSection2 = this.toggleSection2.bind(this);
  }

  toggleSection1= async(e) => {
    e.preventDefault();
    this.setState({isTab1Active: !this.state.isTab1Active ,
     active: !this.state.active})
    
  }
  toggleSection2= async(e) => {
    e.preventDefault();
    this.setState({isTab2Active: !this.state.isTab2Active,
       active: !this.state.active})
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
      const shipmentStatus = item.shipmentStatus;
      const requestStatus = item.requestStatus;
      const loggedBy = item.logger;
      const description = item.description;
      const time = item.logTime;
      this.setState({ shipmentStatus, requestStatus, loggedBy, description, time });

      return (
        <TrackRecord
          key={index}
          status={item}
          time={this.state.time}
          request={this.state.requestStatus}
          ship={this.state.shipmentStatus}
          logger ={this.state.loggedBy}
          description = {this.state.description}
        />
      );
    });

    this.setState({ response, log });
    this.setState({
      requestID: " ",
      isTab1Active: true,
      wholeActive:true
    });
    
  };

  handleChange = async (e) => {
    this.setState({
      requestID: this.requestIdRef.current.value,
    });
  };

  render() {
    let view1, view2, wholeView , activated;
    let acc = this.props.account;
    let cont = this.props.contract;

    if (!acc || !cont) {
      return <div> Loading..... </div>;
    }
    this.state.wholeActive ? wholeView ="show" : wholeView ="hide"
    this.state.isTab1Active ? view1 ="show": view1 ="hide" 
    this.state.isTab2Active ? view2 ="show" : view2 ="hide" 
    return (
      <form onSubmit={this.handleSubmit} className="form-container">
        <div className="form-row">
          <h4>Track Requested Shipments </h4>
          <label style={{ marginRight: "5px" }}> Tracking Number : </label>
          <input
            type="text"
            placeholder="e.g 101"
            value={this.state.requestID}
            ref={this.requestIdRef}
            onChange={this.handleChange}
            required = "required"
          />

          <input
            style={{ cursor: "pointer" }}
            type="submit"
            className="btn"
            value="VIEW STATUS"
          />
        </div>

        <div style={{ margin: "10px 0px" }} className="query-result">
          {this.state.msg}
        </div>
        <div className={` ${wholeView} accordion-tabs`}>
        <a href="/track" onClick={this.toggleSection1}
         className=  {`${activated}  accordion-toggle one `} >
          + TRACKING SUMMARY  </a>
          <div className={`${view1} response-logs tab`}>
            {this.state.log} 
          </div>
          <a href="/track" onClick={this.toggleSection2}
            className=  {`${this.state.active}  accordion-toggle two `} >
          + TEMPRATURE HISTORY </a>
          <div className={` ${view2} response-logs tab`}>
          
            {/* 1,2,3,4,5,6,7,8,9,10,11,12,13,14,15 */}
            <p> Chart Goes here </p>
          </div>
        </div>
        
      </form>
    );
  }
}

export default Track;

import React, { Component, useState } from "react";
import { BrowserRouter, Route, NavLink } from "react-router-dom";
import { Line } from "react-chartjs-2";
import {
  MapContainer,
  Marker,
  Popup,
  TileLayer,
  useMapEvents,
} from "react-leaflet";
import "leaflet/dist/leaflet.css";
import "leaflet-defaulticon-compatibility/dist/leaflet-defaulticon-compatibility.webpack.css";
import "leaflet-defaulticon-compatibility";
import { latLng } from "leaflet";

function UpdateMap(props) {
  let statusColor = "";
  const current = props.location;
  const [position, setPosition] = useState(null);
  let markerRef;

  const map = useMapEvents({
    resize: () => {
      map.flyTo(latLng(current), 8);
      // map.locate();
      setPosition(latLng(current));
    },

    contextmenu: () => {
      markerRef.openPopup();
    },
  });
  map.whenReady(() => {
    setTimeout(() => {
      map.invalidateSize();
    }, 1);
  });

  if (props.state === "ABNORMAL") {
    statusColor = "alert-text";
  } else {
    statusColor = "good-text";
  }

  markerRef = (ref) => {
    if (ref) {
      ref.openPopup();
    }
  };

  return position === null ? null : (
    <Marker ref={markerRef} position={latLng(props.location)}>
      <Popup>
        <div className="pop-up-container">
          <p>Current Shipment Location</p>
          <hr className="custom-hr-full"></hr>
          <p>
            <strong>{props.request.toUpperCase()}.</strong>
          </p>
          <p>
            <strong>
              STATUS: <span className={`${statusColor}`}>{props.state}</span>
            </strong>
          </p>
        </div>
      </Popup>
    </Marker>
  );
}

class Map extends Component {
  state = { currentLocation: null };
  componentWillMount = async () => {
    this.setState({ currentLocation: this.props.location });
  };

  render() {
    return (
      <MapContainer
        center={[21.943046, 50.230324]}
        zoom={5}
        tap={true}
        minZoom={5}
        maxZoom={15}
        dragging={true}
        animate={true}
        scrollWheelZoom={false}
        easeLinearity={0.4}
      >
        <TileLayer
          attribution='&copy; <a href="http://osm.org/copyright">Mapbox</a>'
          // url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          url="https://api.mapbox.com/styles/v1/mohamedkaramm/ckm2fc4rq8eu217rzz5kmw3kh/tiles/{z}/{x}/{y}?access_token=pk.eyJ1IjoibW9oYW1lZGthcmFtbSIsImEiOiJja20yODVqMm80bGdxMm9uMWx5dWxzNGw4In0.ReVGLE7NEDUxlHH-PiGKnQ"
        />
        <UpdateMap
          request={this.props.requestState}
          state={this.props.state}
          location={this.props.location}
        />
      </MapContainer>
    );
  }
}

class HistoryChart extends Component {
  constructor(props) {
    super(props);

    this.state = {
      chartData: this.props.chartData,
      tempSet: this.props.temp,
      humidSet: this.props.humid,
      timeSet: this.props.timestamp,
    };
  }

  componentDidUpdate(prevProps) {
    if (
      prevProps.temp !== this.props.temp ||
      prevProps.humid !== this.props.humid ||
      prevProps.timestamp !== this.props.timestamp
    ) {
      let { chartData } = this.state;
      chartData.labels = this.props.timestamp;
      chartData.datasets[0].data = this.props.temp;
      chartData.datasets[1].data = this.props.humid;
      this.setState({ chartData });
    }
  }

  render() {
    return (
      <Line
        data={this.state.chartData}
        width={650}
        options={{ maintainAspectRatio: false }}
      />
    );
  }
}

function TrackImg(props) {
  if (props.status === "ABNORMAL") {
    return <img className="verification-img" src={require("../assets/imgs/invalid-1.svg")} alt="invalid" />;
  } else {
    return <img className="verification-img" src={require("../assets/imgs/valid-3.svg")} alt="valid" />;
  }
 
}

function ShipImg(props) {
  
  if (props.request === 'REQUEST APPROVED' || props.request === 'DELIVERED' ) {
    if (props.status === 'NORMAL') {
      return <img className="method-img" src={require("../assets/imgs/valid.svg")} alt="invalid" />;
    }
    else {
      return <img className="method-img" src={require("../assets/imgs/invalid.svg")} alt="valid" />;
    }
    
  } else if (props.request === 'PACKAGE CREATED') {
    return <img className="method-img" src={require("../assets/imgs/box.svg")} alt="valid" />;
  } else if (props.request === 'SHIPPING PACKAGE') {
    if (props.method === 'airplane') {
      return <img className="method-img" src={require("../assets/imgs/plane.svg")} alt="airplane"/>
    } else if (props.method === 'ship') {
      return <img className="method-img" src={require("../assets/imgs/cargo-ship.svg")} alt="ship" />
    } else if (props.method === 'truck') {
      return <img className="method-img" src={require("../assets/imgs/delivery-truck.svg")} alt="truck" />
    }
    else {
      return <img className="method-img" src={require("../assets/imgs/valid.svg")} alt="valid" />;
    }
  } else if (props.request === 'OUT FOR SHIPPING' || 'READY FOR DELIVERY') {
    return <img className="method-img" src={require("../assets/imgs/delivery-truck.svg")} alt="truck" />
  } else {
    return <img className="method-img" src={require("../assets/imgs/valid.svg")} alt="valid" />;
  }
}

class TrackRecord extends Component {
  state = { tempHistory: [], humidHistory: [] };
  // constructor(props) {
  //   super(props);

  // }

  render() {
    let statusColor;
    const dateStr = new Date(this.props.time * 1000).toString();
    const dateArr = dateStr.split(" ", 5);
    const timestamp = dateArr.join(" ");
    if (
      this.props.ship === "ABNORMAL"
        ? (statusColor = "alert-text")
        : (statusColor = "good-text")
    )
      return (
        <div className="track-record-container">

          <ShipImg 
          status={this.props.ship} 
          request={this.props.request} 
          method={this.props.shipMethod}/>

          <ul className="record-list">
            <li className="timestamp log-item"> {timestamp}</li>
            <li className="head log-item"> {this.props.request}</li>
            <li style={{ fontStyle: "normal" }} className="timestamp log-item">
              SHIPMENT VERIFIED
              <TrackImg status={this.props.ship} />
            </li>
            <hr className="custom-hr-full" />
            <li className="log-item">{this.props.description}</li>
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

class Notification extends Component {
  state = { eventList: null, abnormalConditions: null, notifyElements: null , msg: '' , id: ''};
  constructor(props) {
    super(props);
    this.idRef=React.createRef();
    this.onRefresh = this.onRefresh.bind(this);
    this.onChange = this.onChange.bind(this);
    this.onSubmit = this.onSubmit.bind(this);
  }

onSubmit = async(e) => {
    e.preventDefault();
    console.log(this.state.id)
    let reqNo = this.state.id;

    const eventList = await this.props.contract.getPastEvents(
      "ShipmentStateUpdate",
      {
        fromBlock: 0,
      }
    );
    
    const abnormalConditionsFiltered = eventList.filter((item) => {
      return (item.returnValues.state === "ABNORMAL" && item.returnValues.requestNo === reqNo) ;
    });
    this.setState({msg: 'Found no notifications.'.toUpperCase})
    if(abnormalConditionsFiltered.length === 0) {
      this.setState({msg: 'Found no notifications.'.toUpperCase})
    }
    setTimeout(() => {
      this.setState({ msg: "" });
    }, 3000);

    abnormalConditionsFiltered.reverse();


    const notifyElements= abnormalConditionsFiltered.map((item, index) => {
      let request = item.returnValues.requestNo;
      let time = new Date(item.returnValues.timestamp * 1000).toString();
      const dateArr = time.split(" ", 5);
      const timestamp = dateArr.join(" ");
      let state = item.returnValues.state;

      return (
        <div className="notification" key={index}>
          <h4 className="head">ABNORMAL READINGS NOTIFICATION</h4>
          <hr className="custom-hr-full"></hr>
          <p className="subhead">
            <em>An abnormal sensor reading is detected coming from source (tracking
            no) </em><strong> {request} </strong>
            <em>at</em> <strong> {timestamp} </strong> <em> local time, shipment's current
            status is</em> <strong> {state}. </strong>
          </p>
        </div>
      );
    });

    console.log(eventList);
    console.log(abnormalConditionsFiltered);
    this.setState({ eventList, abnormalConditionsFiltered, notifyElements});
}

onChange = async(e) => {
    this.setState({id: this.idRef.current.value})
}

onRefresh = async () => {
    const eventList = await this.props.contract.getPastEvents(
      "ShipmentStateUpdate",
      {
        fromBlock: 0,
      }
    );
    
    const abnormalConditions = eventList.filter((item) => {
      return item.returnValues.state === "ABNORMAL";
    });
    this.setState({msg: 'Found no notifications.'.toUpperCase})
    if(abnormalConditions.length === 0) {
      this.setState({msg: 'Found no notifications.'.toUpperCase})
    }
    setTimeout(() => {
      this.setState({ msg: "" });
    }, 3000);

    abnormalConditions.reverse();


    const notifyElements = abnormalConditions.map((item, index) => {
      let request = item.returnValues.requestNo;
      let time = new Date(item.returnValues.timestamp * 1000).toString();
      const dateArr = time.split(" ", 5);
      const timestamp = dateArr.join(" ");
      let state = item.returnValues.state;

      return (
        <div className="notification" key={index}>
          <h4 className="head">ABNORMAL READINGS NOTIFICATION</h4>
          <hr className="custom-hr-full"></hr>
          <p className="subhead">
            <em>An abnormal sensor reading is detected coming from source (tracking
            no) </em><strong> {request} </strong>
            <em>at</em> <strong> {timestamp} </strong> <em> local time, shipment's current
            status is</em> <strong> {state}. </strong>
          </p>
        </div>
      );
    });

    console.log(eventList);
    console.log(abnormalConditions);
    console.log(notifyElements);
    this.setState({ eventList, abnormalConditions, notifyElements });
};

  render() {
    return (
      <div className="notification-panel">
          <div className="view-all-container">
            <button
              style={{
                marginRight: "10px",
                textAlign: "center",
              }}
              onClick={this.onRefresh}
              className="btn"
            >
              VIEW ALL NOTIFICATIONS
            </button>
          </div>
        <div className="panel-control">
         <form onSubmit={this.onSubmit} className="form-row">
          <input 
          type="number"
          value={this.state.id}
          ref={this.idRef}
          onChange={this.onChange}
          placeholder="Filter by tracking no (e.g. 101)" />
          <input className="btn" type="submit" value="APPLY"/>
        </form>
        
        </div>
        <div className="msg">{this.state.msg}</div>
        <div className="notification-content">{this.state.notifyElements}</div>
      </div>
    );
  }
}

class NotificationList extends Component {
  render() {
    return (
      <div>
      
      <div className="notification-center-container">
          <h4>Notification Center</h4>
          <div className="notifications-center">
            <ul style={{ padding: "0"}}>
          
              <Notification
                account={this.props.account}
                contract={this.props.contract}
              />
            </ul>
          </div>
      </div>
      
     
      </div>
    );
  }
}

class Status extends Component {
  state = {
    logs: [],
    wholeActive: false,
    isTab1Active: false,
    isTab2Active: false,
    requestID: "",
    chartData: {},
  };

  constructor(props) {
    super(props);
    this.requestIdRef = React.createRef();
    this.mapRef = React.createRef();
    this.handleChange = this.handleChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
    this.toggleSection1 = this.toggleSection1.bind(this);
    this.toggleSection2 = this.toggleSection2.bind(this);
  }

  componentWillMount = async () => {
    this.getChartData();
  };

  toggleSection1 = async (e) => {
    e.preventDefault();
    this.setState({
      isTab1Active: !this.state.isTab1Active,
      active: !this.state.active,
    });
  };
  toggleSection2 = async (e) => {
    e.preventDefault();
    this.setState({
      isTab2Active: !this.state.isTab2Active,
      active: !this.state.active,
    });
  };

  handleSubmit = async (e) => {
    e.preventDefault();
    let id = parseInt(this.state.requestID, 10);
    // await this.props.contract.methods.createLog(1, 'SHIPPED' ,'20C', '25%', 'NORMAL').send({from: this.props.account})
    let response = await this.props.contract.methods.getTrackLogs(id).call();
    let trackHistory = await this.props.contract.methods
      .getShipmentTrackData(id)
      .call();
    let tempHistory = trackHistory.temp;
    let humidHistory = trackHistory.humid;

    let locationInfo = await this.props.contract.methods
      .getShipmentLocation(id)
      .call();
    console.log(locationInfo);
    let currentLocation = locationInfo[locationInfo.length - 1];
    console.log(currentLocation);
    let lat = parseFloat(currentLocation.Latitude);
    let long = parseFloat(currentLocation.Longitude);
    let coords = [lat, long];
    this.setState({ coords });

    // let events = await this.props.contract.getPastEvents("DataSent", {
    //   fromBlock: 0,
    // });
    // let timeLogs = events.map((log) => {
    //   let logTime = new Date(log.returnValues.timestamp * 1000);
    //   let hours = logTime.getUTCHours();
    //   let minutes = logTime.getUTCMinutes().toString().padStart(2, "0");
    //   let day = logTime.getUTCDay();
    //   let month = logTime.getUTCMonth() + 1;
    //   let year = logTime.getUTCFullYear();
    //   let timestamp =
    //     day + "/" + month + "/" + year + " " + hours + ":" + minutes;

    //   // const dateArr =time.split(" ", 5);
    //   // const timestamp = dateArr.join(" ");

    //   return timestamp;
    // });

    let eventsFiltered = await this.props.contract.getPastEvents("DataSent", {
      filter: {
        requestNo: id,
      },
      fromBlock: 400,
    });

    let timeLogsFiltered = eventsFiltered.map((log) => {
      let logTime = new Date(log.returnValues.timestamp * 1000);
      let hours = logTime.getUTCHours();
      let minutes = logTime.getUTCMinutes().toString().padStart(2, "0");
      let day = logTime.getUTCDate();
      let month = logTime.getUTCMonth() + 1;
      let year = logTime.getUTCFullYear();
      let timestamp =
        day + "/" + month + "/" + year + " " + hours + ":" + minutes;

      // const dateArr =time.split(" ", 5);
      // const timestamp = dateArr.join(" ");

      return timestamp;
    });

    // console.log(events)
    console.log(eventsFiltered)
    this.setState({ trackHistory, tempHistory, humidHistory, timeLogsFiltered });

    // send data to chart
    this.getChartData(tempHistory, humidHistory, timeLogsFiltered);

    let mapEvents = await this.props.contract.getPastEvents(
      "ShipmentStateUpdate",
      {
        fromBlock: 0,
      }
    );
    console.log(mapEvents)
    let stateLogs = mapEvents[mapEvents.length - 1];
    console.log(stateLogs);
    let currentState = stateLogs.returnValues.state;
    console.log(currentState);
    this.setState({ currentState });

    let reqEvents = await this.props.contract.getPastEvents(
      "requestStateUpdate",
      {
        fromBlock: 0,
      }
    );

    let requestLogs = reqEvents[reqEvents.length - 1];
    console.log(requestLogs);
    let reqCurrentState = requestLogs.returnValues.state;
    console.log(reqCurrentState);
    this.setState({ reqCurrentState });

    if (
      response.length === 0 ||
      trackHistory.length === 0 ||
      locationInfo.length === 0 ||
      requestLogs.length === 0
    ) {
      this.setState({
        msg: "No tracking logs are available for this request, please try again later!".toUpperCase(),
        wholeActive: false,
      });
    } else {
      this.setState({ wholeActive: true });
    }
    setTimeout(() => {
      this.setState({ msg: "" });
    }, 3000);

    const shippingMethod = await this.props.contract.methods.getShipmentMethod(id).call();
    this.setState({shippingMethod})

    let log = response.map((item, index) => {
      const shipmentStatus = item.shipmentStatus;
      const requestStatus = item.requestStatus;
      const loggedBy = item.logger;
      const description = item.description;
      const time = item.logTime;
      this.setState({
        shipmentStatus,
        requestStatus,
        loggedBy,
        description,
        time,
      });

      return (
        <TrackRecord
          key={index}
          status={item}
          time={this.state.time}
          request={this.state.requestStatus}
          ship={this.state.shipmentStatus}
          logger={this.state.loggedBy}
          description={this.state.description}
          eventState = {this.state.reqCurrentState}
          shipMethod={this.state.shippingMethod}
        />
      );
    });

    this.setState({ response, log });
    this.setState({
      requestID: " ",
      isTab1Active: true,
    });
  };


  getChartData = async (temp, humid, timestamp) => {
    this.setState({
      responsive: "true",
      chartData: {
        labels: timestamp,
        datasets: [
          {
            label: "Temperature (°C)",
            data: temp,
            backgroundColor: ["rgba(255, 99, 132, 0)"],
            borderColor: ["rgba(255, 99, 132, 1)"],
            pointBackgroundColor: "rgba(255, 99, 132, 0.9)",
            borderWidth: 2,
          },
          {
            label: "Humidity (%)",
            data: humid,
            backgroundColor: ["rgba(54, 162, 235, 0)"],
            borderColor: ["rgba(54, 162, 235, 1)"],
            pointBackgroundColor: "rgba(54, 162, 235, 0.9)",
            borderWidth: 2,
          },
        ],
      },
    });
  };

  handleChange = async (e) => {
    this.setState({
      requestID: this.requestIdRef.current.value,
    });
  };

  render() {
    let view1, view2, wholeView;
    let acc = this.props.account;
    let cont = this.props.contract;
    let web3 = this.props.Web3;

    if (!acc || !cont || !web3) {
      return <div> Loading..... </div>;
    }
    this.state.wholeActive ? (wholeView = "show") : (wholeView = "hide");
    this.state.isTab1Active ? (view1 = "show") : (view1 = "hide");
    this.state.isTab2Active ? (view2 = "show") : (view2 = "hide");
    return(
      <form onSubmit={this.handleSubmit} className="form-container">
      <div className="newform-row">
        <div className="form-row">
          <h4>Track Requested Shipments </h4>
          <label style={{ marginRight: "5px" }}> Tracking Number : </label>
          <input
            type="text"
            placeholder="e.g 101"
            value={this.state.requestID}
            ref={this.requestIdRef}
            onChange={this.handleChange}
            required="required"
          />

          <input
            style={{ cursor: "pointer" }}
            type="submit"
            className="btn"
            value="VIEW STATUS"
          />
        </div>
          
      </div>
      

      <div style={{ margin: "10px 0px" }} className="query-result">
        {this.state.msg}
      </div>
      <div className={` ${wholeView} accordion-tabs`}>
        <a
          href="/track"
          onClick={this.toggleSection1}
          className={` accordion-toggle one `}
        >
          + TRACKING SUMMARY
        </a>
        <div className={`${view1} summary-container`}>
          <div className={`response-logs tab`}>{this.state.log}</div>
        </div>
        <a
          href="/track"
          onClick={this.toggleSection2}
          className={` accordion-toggle two `}
        >
          + TRACKING HISTORY
        </a>
        <div className={`${view2} history-container`}>
          <div
            style={{ marginBottom: "20px" }}
            className={` response-logs tab2`}
          >
            <div className={`chart-container`}>
              <HistoryChart
                tempData={this.state.tempHistory}
                HumidData={this.state.HumidData}
                chartData={this.state.chartData}
                temp={this.state.tempHistory}
                humid={this.state.humidHistory}
                timestamp={this.state.timeLogsFiltered}
              />
            </div>
            <div data-tap-disabled="true" className="map-container">
              <Map
                requestState={this.state.reqCurrentState}
                state={this.state.currentState}
                location={this.state.coords}
              />
            </div>
          </div>
        </div>
      </div>
    </form>
    );
  }
}

class Track extends Component {
  render() {
    let acc = this.props.account;
    let cont = this.props.contract;
    let web3 = this.props.Web3;

    if (!acc || !cont || !web3) {
      return <div> Loading..... </div>;
    }
    return (
      <div>
         <BrowserRouter>
         <div className="product-form-container">
           <div className="side-nav">
             <ul className="mini-nav-list">
               <li className="link-item">
                 <NavLink to="/track/status">+ TRACKING REQUESTS</NavLink>
               </li>
               <li className="link-item">
                 <NavLink to="/track/notifications">+ NOTIFICATION CENTER</NavLink>
               </li>
             </ul>
           </div>
           <div className="main-content">
             <Route
               path="/track/status"
               exact
               render={(props) => (
                 <Status
                   {...props}
                   Web3={this.props.Web3}
                   account={this.props.account}
                   contract={this.props.contract}
                 />
               )}
             />
             <Route
               path="/track/notifications"
               exact
               render={(props) => (
                 <NotificationList
                   {...props}
                   account={this.props.account}
                   contract={this.props.contract}
                   Web3={this.props.Web3}
                 />
               )}
             />
            
           </div>
         </div>
       </BrowserRouter>
      </div>
    );
  }
}

export default Track;

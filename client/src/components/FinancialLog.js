import React, { Component } from "react";
import { BrowserRouter, Route, NavLink } from "react-router-dom";


class ReviewStdCostSheet extends Component {
  state = { id: "", tableVisibility: false };

  constructor(props) {
    super(props);
    this.productIdRef = React.createRef();
    this.onChange = this.onChange.bind(this);
    this.onSubmit = this.onSubmit.bind(this);
  }

  componentDidMount = async () => {
    const isTrust = await this.props.pcContract.methods.isTrusted(this.props.account[0]).call();
    this.setState({ isTrust });

    // const products = await this.props.pcContract.methods.getProductsByManu(this.props.account[0]).call();

    // const isOwner = products.map(item => {
    //   if(item.manufacturer === this.props.account[0]) {
    //   return true;
    // } else {
    //   return false;
    // }
    // })
    // const strBoolIsOwner = isOwner.toString();
    // this.setState({strBoolIsOwner})
  }
  onSubmit = async (e) => {
    e.preventDefault();
    const proId = this.state.id;

    const standard = await this.props.pcContract.methods
      .getStdCostPlan(proId)
      .call();

    const stdCostData = standard.map((item, index) => {
      let matStdCostValue = parseInt(standard.directMaterialCost, 10);
      let pkgStdCostValue = parseInt(standard.packagingMaterialCost, 10);
      let laborStdCostValue = parseInt(standard.directLaborCost, 10);
      let mrkStdCostValue = parseInt(standard.marketingCost, 10);
      let rsrchStdCostValue = parseInt(standard.researchCost, 10);
      // let totalActCostValue = parseInt(actual.CostTOT,10);
      let totalStdCostValue =
        matStdCostValue +
        pkgStdCostValue +
        laborStdCostValue +
        mrkStdCostValue +
        rsrchStdCostValue;

      let matStdCost = matStdCostValue.toLocaleString("en-US", {
        style: "currency",
        currency: "USD",
      });
      let pkgStdCost = pkgStdCostValue.toLocaleString("en-US", {
        style: "currency",
        currency: "USD",
      });
      let laborStdCost = laborStdCostValue.toLocaleString("en-US", {
        style: "currency",
        currency: "USD",
      });
      let mrkStdCost = mrkStdCostValue.toLocaleString("en-US", {
        style: "currency",
        currency: "USD",
      });
      let rsrchStdCost = rsrchStdCostValue.toLocaleString("en-US", {
        style: "currency",
        currency: "USD",
      });
      let totalStdCost = totalStdCostValue.toLocaleString("en-US", {
        style: "currency",
        currency: "USD",
      });

      this.setState({
        standard,
        matStdCost,
        pkgStdCost,
        laborStdCost,
        mrkStdCost,
        rsrchStdCost,
        totalStdCost,
        matStdCostValue,
        pkgStdCostValue,
        laborStdCostValue,
        mrkStdCostValue,
        rsrchStdCostValue,
        totalStdCostValue,
      });
      return true;
    });
    if (this.state.totalStdCost === "$0.00") {
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
    this.setState({ stdCostData });
  };

  onChange = async (e) => {
    this.setState({
      id: this.productIdRef.current.value,
    });

    const products = await this.props.pcContract.methods.getProductsByManu(this.props.account[0]).call();
    const product = products.filter(item => {
      return item.productName === this.state.id;
    })

    const isOwner = product.map(item => {
      if (item.manufacturer === this.props.account[0]) {
        return true;
      } else {
        return false;
      }
    })
    const strBoolIsOwner = isOwner.toString();
    this.setState({ strBoolIsOwner, tableVisibility: false })


  };
  render() {
    let classified, table;
    if (this.state.isTrust || this.state.strBoolIsOwner === 'true') {
      classified = "show"
    } else {
      classified = "hide"
    };
    let acc = this.props.account;
    let cont1 = this.props.pcContract;
    let cont2 = this.props.pctContract;
    let web3 = this.props.Web3;

    if (!acc || !cont1 || !cont2 || !web3) {
      return <div> Loading..... </div>;
    }
    this.state.tableVisibility ? (table = "show") : (table = "hide");
    const totDirValue =
      this.state.laborStdCostValue +
      this.state.pkgStdCostValue +
      this.state.matStdCostValue;
    const totDir = totDirValue.toLocaleString("en-US", {
      style: "currency",
      currency: "USD",
    });
    const newTot = totDirValue + (totDirValue * 20 / 100) + (totDirValue * 30 / 100) + (totDirValue * 14 / 100)
    return (
      <div className="financial-status-container">
        <form onSubmit={this.onSubmit} className="form-container">
          <div className="form-row">
            <h4>Review Cost Sheet</h4>
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
                value="VIEW STANDARD COST SHEET"
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
                    <th>COST</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td> Raw Materials </td>
                    <td>{this.state.matStdCost}</td>
                  </tr>
                  <tr>
                    <td> Packaging Materials </td>
                    <td>{this.state.pkgStdCost}</td>
                  </tr>
                  <tr>
                    <td> Direct Labor </td>
                    <td>{this.state.laborStdCost}</td>
                  </tr>
                  <tr
                    style={{
                      borderTop: "1px solid",
                      borderBottom: "1px solid",
                    }}
                  >
                    <td>TOTAL DIRECT COST</td>
                    <td>{totDir}</td>
                  </tr>
                  <tr className={`${classified}`}>
                    <td> Indirect Manufacturing Costs (20%) </td>
                    <td>{(totDirValue * 20 / 100).toLocaleString("en-US", {
                      style: "currency",
                      currency: "USD",
                    })}</td>
                  </tr>
                  <tr className={`${classified}`}>
                    <td> Managerial and Funding Costs (30%) </td>
                    <td>{(totDirValue * 30 / 100).toLocaleString("en-US", {
                      style: "currency",
                      currency: "USD",
                    })}</td>
                  </tr>
                  <tr className={`${classified}`}>
                    <td> Value Added Tax (14%) </td>
                    <td>{(totDirValue * 14 / 100).toLocaleString("en-US", {
                      style: "currency",
                      currency: "USD",
                    })}</td>
                  </tr>
                  <tr className={`${classified}`} >
                    <td> Marketing </td>
                    <td>{this.state.mrkStdCost}</td>
                  </tr>
                  <tr className={`${classified}`}>
                    <td> Research </td>
                    <td>{this.state.rsrchStdCost}</td>
                  </tr>
                </tbody>

                <tfoot className={`${classified}`}>
                  <tr>
                    <th> TOTAL </th>
                    <td>{newTot.toLocaleString("en-US", {
                      style: "currency",
                      currency: "USD",
                    })} </td>
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

class ReviewActCostSheet extends Component {
  state = { id: "", tableVisibility: false };

  constructor(props) {
    super(props);
    this.productIdRef = React.createRef();
    this.onChange = this.onChange.bind(this);
    this.onSubmit = this.onSubmit.bind(this);
  }

  componentDidMount = async () => {
    const isTrust = await this.props.pcContract.methods.isTrusted(this.props.account[0]).call();
    this.setState({ isTrust });

    const products = await this.props.pcContract.methods.getProductsByManu(this.props.account[0]).call();
    const isOwner = products.map(item => {
      if (item.manufacturer === this.props.account[0]) {
        return true;
      } else {
        return false;
      }
    })
    const strBoolIsOwner = isOwner.toString()
    this.setState({ strBoolIsOwner })
  }

  onSubmit = async (e) => {
    e.preventDefault();
    const proId = this.state.id;

    const actual = await this.props.pcContract.methods
      .getActualCost(proId)
      .call();

    const actualCostData = actual.map((item, index) => {
      let matActCostValue = parseInt(actual.directMaterialCost, 10);
      let pkgActCostValue = parseInt(actual.packagingMaterialCost, 10);
      let laborActCostValue = parseInt(actual.directLaborCost, 10);
      let mrkActCostValue = parseInt(actual.marketingCost, 10);
      let rsrchActCostValue = parseInt(actual.researchCost, 10);
      // let totalActCostValue = parseInt(actual.CostTOT,10);
      let totalActCostValue =
        matActCostValue +
        pkgActCostValue +
        laborActCostValue +
        mrkActCostValue +
        rsrchActCostValue;

      let matActCost = matActCostValue.toLocaleString("en-US", {
        style: "currency",
        currency: "USD",
      });
      let pkgActCost = pkgActCostValue.toLocaleString("en-US", {
        style: "currency",
        currency: "USD",
      });
      let laborActCost = laborActCostValue.toLocaleString("en-US", {
        style: "currency",
        currency: "USD",
      });
      let mrkActCost = mrkActCostValue.toLocaleString("en-US", {
        style: "currency",
        currency: "USD",
      });
      let rsrchActCost = rsrchActCostValue.toLocaleString("en-US", {
        style: "currency",
        currency: "USD",
      });
      let totalActCost = totalActCostValue.toLocaleString("en-US", {
        style: "currency",
        currency: "USD",
      });

      this.setState({
        actual,
        matActCost,
        pkgActCost,
        laborActCost,
        mrkActCost,
        rsrchActCost,
        totalActCost,
        matActCostValue,
        pkgActCostValue,
        laborActCostValue,
        mrkActCostValue,
        rsrchActCostValue,
        totalActCostValue,
      });
      return true;
    });

    if (this.state.totalActCost === "$0.00") {
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
    this.setState({ actualCostData });
  };

  onChange = async (e) => {
    this.setState({
      id: this.productIdRef.current.value,
    });
  };
  render() {
    let classified, table;
    if (this.state.isTrust || this.state.strBoolIsOwner === 'true') {
      classified = "show"
    } else {
      classified = "hide"
    };
    let acc = this.props.account;
    let cont1 = this.props.pcContract;
    let cont2 = this.props.pctContract;
    let web3 = this.props.Web3;

    if (!acc || !cont1 || !cont2 || !web3) {
      return <div> Loading..... </div>;
    }
    this.state.tableVisibility ? (table = "show") : (table = "hide");
    const totDirValue =
      this.state.laborActCostValue +
      this.state.pkgActCostValue +
      this.state.matActCostValue;
    const totDir = totDirValue.toLocaleString("en-US", {
      style: "currency",
      currency: "USD",
    });
    const newTot = totDirValue + (totDirValue * 20 / 100) + (totDirValue * 30 / 100) + (totDirValue * 14 / 100)
    return (
      <div className="financial-status-container">
        <form onSubmit={this.onSubmit} className="form-container">
          <div className="form-row">
            <h4>Review Cost Sheet</h4>
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
                value="VIEW ACTUAL COST SHEET"
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
                    <th>COST</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td> Raw Materials </td>
                    <td>{this.state.matActCost}</td>
                  </tr>
                  <tr>
                    <td> Packaging Materials </td>
                    <td>{this.state.pkgActCost}</td>
                  </tr>
                  <tr>
                    <td> Direct Labor </td>
                    <td>{this.state.laborActCost}</td>
                  </tr>
                  <tr
                    style={{
                      borderTop: "1px solid",
                      borderBottom: "1px solid",
                    }}
                  >
                    <td>TOTAL DIRECT COST</td>
                    <td>{totDir}</td>
                  </tr>
                  <tr className={`${classified}`}>
                    <td> Indirect Manufacturing Costs (20%) </td>
                    <td>{(totDirValue * 20 / 100).toLocaleString("en-US", {
                      style: "currency",
                      currency: "USD",
                    })}</td>
                  </tr>
                  <tr className={`${classified}`}>
                    <td> Managerial and Funding Costs (30%) </td>
                    <td>{(totDirValue * 30 / 100).toLocaleString("en-US", {
                      style: "currency",
                      currency: "USD",
                    })}</td>
                  </tr>
                  <tr className={`${classified}`}>
                    <td> Value Added Tax (14%) </td>
                    <td>{(totDirValue * 14 / 100).toLocaleString("en-US", {
                      style: "currency",
                      currency: "USD",
                    })}</td>
                  </tr>
                  <tr className={`${classified}`}>
                    <td> Marketing </td>
                    <td>{this.state.mrkActCost}</td>
                  </tr>
                  <tr className={`${classified}`}>
                    <td> Research </td>
                    <td>{this.state.rsrchActCost}</td>
                  </tr>
                </tbody>

                <tfoot className={`${classified}`}>
                  <tr>
                    <th> TOTAL </th>
                    <td>{newTot.toLocaleString("en-US", {
                      style: "currency",
                      currency: "USD",
                    })} </td>
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

class SetActualCosts extends Component {
  state = {
    product: "",
    productUnitsNo: 0,
    packagingMaterialActCost: 0,
    mrkActCost: 0,
    rsrhActCost: 0,
    totalActCost: 0,
    matUnitActCost: 0,
    workHrsAct: 0,
    hourlyRateActCost: 0,
    matQtyAct: 0,
    shippingActCost: 0,
  };

  constructor(props) {
    super(props);
    this.proRef = React.createRef();
    this.unitNoRef = React.createRef();
    this.pkgMatActRef = React.createRef();
    this.mrkActRef = React.createRef();
    this.rsrhActRef = React.createRef();
    this.matUnitActRef = React.createRef();
    this.workHrsActRef = React.createRef();
    this.hourlyRateActRef = React.createRef();
    this.matQtyActRef = React.createRef();
    this.shippingActRef = React.createRef();
    this.OnChange = this.onChange.bind(this);
    this.OnSubmit = this.OnSubmit.bind(this);
  }

  OnSubmit = async (e) => {
    e.preventDefault();

    const pro = this.state.product;
    const units = this.state.productUnitsNo;
    const pkgMatAct = parseInt(this.state.packagingMaterialActCost, 10);
    // const totBudget = parseInt(this.state.budget,10);
    const mrkAct = parseInt(this.state.mrkActCost, 10);
    const rsrhAct = parseInt(this.state.rsrhActCost, 10);
    const rateAct = parseInt(this.state.hourlyRateActCost, 10);
    const hrsNoAct = parseInt(this.state.workHrsAct, 10);
    const matUnitAct = parseInt(this.state.matUnitActCost, 10);
    const matQtyAct = parseInt(this.state.matQtyAct, 10);
    const shippingAct = parseInt(this.state.shippingActCost, 10);

    // const totalActual = matAct + pkgMatAct + labAct + manuIndirectActCost
    //                     + mrkAct + rsrhAct;

    // this.setState({ totalActCost: totalActual , totBudget});

    await this.props.pcContract.methods
      .setActualCost(
        pro,
        units,
        pkgMatAct,
        matUnitAct,
        rateAct,
        hrsNoAct,
        mrkAct,
        rsrhAct,
        matQtyAct,
        shippingAct,
      )
      .send({ from: this.props.account[0] })
      .once("receipt", (receipt) => {
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
      mrkActCost: "",
      rsrhActCost: "",
      matUnitActCost: "",
      workHrsAct: "",
      hourlyRateActCost: "",
      matQtyAct: "",
      shippingActCost: ""
    });
  };

  onChange = async (e) => {
    this.setState({
      product: this.proRef.current.value,
      productUnitsNo: this.unitNoRef.current.value,
      packagingMaterialActCost: this.pkgMatActRef.current.value,
      mrkActCost: this.mrkActRef.current.value,
      rsrhActCost: this.rsrhActRef.current.value,
      matUnitActCost: this.matUnitActRef.current.value,
      workHrsAct: this.workHrsActRef.current.value,
      hourlyRateActCost: this.hourlyRateActRef.current.value,
      matQtyAct: this.matQtyActRef.current.value,
      shippingActCost: this.shippingActRef.current.value
    });
  };
  render() {
    return (
      <form onSubmit={this.OnSubmit} className="newform-container">
        <label>Product ID:</label>
        <input
          type="text"
          ref={this.proRef}
          value={this.state.product}
          placeholder="e.g. pro101"
          onChange={this.OnChange}
          required="required"
        />

        <h4> Set Production Units </h4>
        <label>Actual Production Units No: </label>
        <input
          type="number"
          ref={this.unitNoRef}
          value={this.state.productUnitsNo}
          placeholder="e.g. 50,000"
          onChange={this.OnChange}
          required="required"
        />

        <h4>Set Material Quantity</h4>
        <label>Actual Material Quantity (g):</label>
        <input
          type="number"
          ref={this.matQtyActRef}
          value={this.matQtyAct}
          placeholder="e.g. 1600"
          onChange={this.onChange}
          required="required"
        />

        <h4> Set Actual Costs </h4>

        <label>Unit Material Cost: </label>
        <input
          type="number"
          ref={this.matUnitActRef}
          value={this.state.matUnitActCost}
          placeholder="e.g. 5"
          onChange={this.OnChange}
          required="required"
        />

        <label>Packaging Materials: </label>
        <input
          type="number"
          ref={this.pkgMatActRef}
          value={this.state.packagingMaterialActCost}
          placeholder="e.g. 5000"
          onChange={this.OnChange}
          required="required"
        />

        <label>Working Hours No: </label>
        <input
          type="number"
          ref={this.workHrsActRef}
          value={this.state.workHrsAct}
          placeholder="e.g. 2000"
          onChange={this.OnChange}
          required="required"
        />

        <label>Hourly Work Rate: </label>
        <input
          type="number"
          ref={this.hourlyRateActRef}
          value={this.state.hourlyRateActCost}
          placeholder="e.g. 50"
          onChange={this.OnChange}
          required="required"
        />

        <label>Shipping Cost: </label>
        <input
          type="number"
          ref={this.shippingActRef}
          value={this.state.shippingActCost}
          placeholder="e.g. 50"
          onChange={this.OnChange}
          required="required"
        />

        <label>Marketing: </label>
        <input
          type="number"
          ref={this.mrkActRef}
          value={this.state.mrkActCost}
          placeholder="e.g. 5000"
          onChange={this.OnChange}
          required="required"
        />

        <label>Research: </label>
        <input
          type="number"
          ref={this.rsrhActRef}
          value={this.state.rsrhActCost}
          placeholder="e.g. 5000"
          onChange={this.OnChange}
          required="required"
        />

        <input type="submit" className="btn" value="SET ACTUAL COSTS" />

        <div style={{ marginTop: "20px" }} className="notify-text">
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
    packagingMaterialFlexCost: 0,
    mrkFlexCost: 0,
    rsrhFlexCost: 0,
    totalFlexCost: 0,
    workHrsFlex: 0,
    hourlyRateFlexCost: 0,
    matUnitFlexCost: 0,
    shippingFlexCost: 0
  };

  constructor(props) {
    super(props);
    this.proRef = React.createRef();
    this.unitNoRef = React.createRef();
    this.pkgMatFlexRef = React.createRef();
    this.mrkFlexRef = React.createRef();
    this.rsrhFlexRef = React.createRef();
    this.workHrsFlexRef = React.createRef();
    this.hourlyRateFlexRef = React.createRef();
    this.matUnitFlexRef = React.createRef();
    this.shippingFlexRef = React.createRef();
    this.OnChange = this.onChange.bind(this);
    this.OnSubmit = this.OnSubmit.bind(this);
  }

  OnSubmit = async (e) => {
    e.preventDefault();

    const pro = this.state.product;
    const units = this.state.productUnitsNo;
    const pkgMatFlex = parseInt(this.state.packagingMaterialFlexCost, 10);
    const mrkFlex = parseInt(this.state.mrkFlexCost, 10);
    const rsrhFlex = parseInt(this.state.rsrhFlexCost, 10);
    const rateFlex = parseInt(this.state.hourlyRateFlexCost, 10);
    const workHrsFlex = parseInt(this.state.workHrsFlex, 10);
    const matUnitFlex = parseInt(this.state.matUnitFlexCost, 10);
    const shippingFlex = parseInt(this.state.shippingFlexCost, 10);

    // const totalFlex = matFlex + pkgMatFlex + labFlex + manuIndirectFlexCost
    //                     + mrkFlex + rsrhFlex;

    // this.setState({ totalFlexCost: totalFlex});

    await this.props.pcContract.methods
      .setFlexibleCosts(
        pro,
        units,
        pkgMatFlex,
        matUnitFlex,
        rateFlex,
        workHrsFlex,
        mrkFlex,
        rsrhFlex,
        shippingFlex
      )
      .send({ from: this.props.account[0] })
      .once("receipt", (receipt) => {
        this.setState({ msg: "Flexible Costs Were Set Successfully" });
        setTimeout(() => {
          this.setState({ msg: " " });
        }, 2000);
      });

    this.setState({
      productUnitsNo: "",
      directMaterialFlexCost: "",
      packagingMaterialFlexCost: "",
      laborFlexCost: "",
      mrkFlexCost: "",
      rsrhFlexCost: "",
      workHrsFlex: "",
      hourlyRateFlexCost: "",
      matUnitFlexCost: "",
      shippingFlexCost: ""
    });
  };

  onChange = async (e) => {
    this.setState({
      product: this.proRef.current.value,
      productUnitsNo: this.unitNoRef.current.value,
      packagingMaterialFlexCost: this.pkgMatFlexRef.current.value,
      mrkFlexCost: this.mrkFlexRef.current.value,
      rsrhFlexCost: this.rsrhFlexRef.current.value,
      workHrsFlex: this.workHrsFlexRef.current.value,
      hourlyRateFlexCost: this.hourlyRateFlexRef.current.value,
      matUnitFlexCost: this.matUnitFlexRef.current.value,
      shippingFlexCost: this.shippingFlexRef.current.value
    });
  };
  render() {
    return (
      <form onSubmit={this.OnSubmit} className="newform-container">
        <label>Product ID:</label>
        <input
          type="text"
          ref={this.proRef}
          value={this.state.product}
          placeholder="e.g. pro101"
          onChange={this.OnChange}
          required="required"
        />

        <h4> Set Production Units </h4>
        <label>Flexible Production Units No: </label>
        <input
          type="number"
          ref={this.unitNoRef}
          value={this.state.productUnitsNo}
          placeholder="e.g. 50,000"
          onChange={this.OnChange}
          required="required"
        />

        <h4> Set Flexible Costs </h4>

        <label>Unit Material Cost: </label>
        <input
          type="number"
          ref={this.matUnitFlexRef}
          value={this.state.matUnitFlexCost}
          placeholder="e.g. 5"
          onChange={this.OnChange}
          required="required"
        />

        <label>Packaging Materials: </label>
        <input
          type="number"
          ref={this.pkgMatFlexRef}
          value={this.state.packagingMaterialFlexCost}
          placeholder="e.g. 5000"
          onChange={this.OnChange}
          required="required"
        />

        <label>Working Hours No: </label>
        <input
          type="number"
          ref={this.workHrsFlexRef}
          value={this.state.workHrsFlex}
          placeholder="e.g. 2000"
          onChange={this.OnChange}
          required="required"
        />

        <label>Hourly Work Rate: </label>
        <input
          type="number"
          ref={this.hourlyRateFlexRef}
          value={this.state.hourlyRateFlexCost}
          placeholder="e.g. 50"
          onChange={this.OnChange}
          required="required"
        />

        <label>Shipping Cost: </label>
        <input
          type="number"
          ref={this.shippingFlexRef}
          value={this.state.shippingFlexCost}
          placeholder="e.g. 50"
          onChange={this.OnChange}
          required="required"
        />

        <label>Marketing: </label>
        <input
          type="number"
          ref={this.mrkFlexRef}
          value={this.state.mrkFlexCost}
          placeholder="e.g. 5000"
          onChange={this.OnChange}
          required="required"
        />

        <label>Research: </label>
        <input
          type="number"
          ref={this.rsrhFlexRef}
          value={this.state.rsrhFlexCost}
          placeholder="e.g. 5000"
          onChange={this.OnChange}
          required="required"
        />

        <input type="submit" className="btn" value="SET FLEXIBLE COSTS" />

        <div style={{ marginTop: "20px" }} className="notify-text">
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
      let matCostValue = parseInt(standard.directMaterialCost, 10);
      let pkgCostValue = parseInt(standard.packagingMaterialCost, 10);
      let laborCostValue = parseInt(standard.directLaborCost, 10);
      let mrkCostValue = parseInt(standard.marketingCost, 10);
      let rsrchCostValue = parseInt(standard.researchCost, 10);
      // let totalCostValue = parseInt(standard.CostTOT,10);
      let totalStdCostValue =
        matCostValue +
        pkgCostValue +
        laborCostValue +
        mrkCostValue +
        rsrchCostValue;

      let matCost = matCostValue.toLocaleString("en-US", {
        style: "currency",
        currency: "USD",
      });
      let pkgCost = pkgCostValue.toLocaleString("en-US", {
        style: "currency",
        currency: "USD",
      });
      let laborCost = laborCostValue.toLocaleString("en-US", {
        style: "currency",
        currency: "USD",
      });
      let mrkCost = mrkCostValue.toLocaleString("en-US", {
        style: "currency",
        currency: "USD",
      });
      let rsrchCost = rsrchCostValue.toLocaleString("en-US", {
        style: "currency",
        currency: "USD",
      });
      // let totalCost = totalCostValue.toLocaleString("en-US", {style: "currency", currency: "USD"});
      let totalStdCost = totalStdCostValue.toLocaleString("en-US", {
        style: "currency",
        currency: "USD",
      });

      this.setState({
        standard,
        proId,
        matCost,
        pkgCost,
        laborCost,
        mrkCost,
        rsrchCost,
        totalStdCost,
        matCostValue,
        pkgCostValue,
        laborCostValue,
        mrkCostValue,
        rsrchCostValue,
        totalStdCostValue,
      });
      return true;
    });

    const actual = await this.props.pcContract.methods
      .getActualCost(proId)
      .call();

    const actualCostData = actual.map((item, index) => {
      let matActCostValue = parseInt(actual.directMaterialCost, 10);
      let pkgActCostValue = parseInt(actual.packagingMaterialCost, 10);
      let laborActCostValue = parseInt(actual.directLaborCost, 10);
      let mrkActCostValue = parseInt(actual.marketingCost, 10);
      let rsrchActCostValue = parseInt(actual.researchCost, 10);
      // let totalActCostValue = parseInt(actual.CostTOT,10);
      let totalActCostValue =
        matActCostValue +
        pkgActCostValue +
        laborActCostValue +
        mrkActCostValue +
        rsrchActCostValue;

      let matActCost = matActCostValue.toLocaleString("en-US", {
        style: "currency",
        currency: "USD",
      });
      let pkgActCost = pkgActCostValue.toLocaleString("en-US", {
        style: "currency",
        currency: "USD",
      });
      let laborActCost = laborActCostValue.toLocaleString("en-US", {
        style: "currency",
        currency: "USD",
      });

      let mrkActCost = mrkActCostValue.toLocaleString("en-US", {
        style: "currency",
        currency: "USD",
      });
      let rsrchActCost = rsrchActCostValue.toLocaleString("en-US", {
        style: "currency",
        currency: "USD",
      });
      let totalActCost = totalActCostValue.toLocaleString("en-US", {
        style: "currency",
        currency: "USD",
      });

      this.setState({
        actual,
        matActCost,
        pkgActCost,
        laborActCost,
        mrkActCost,
        rsrchActCost,
        totalActCost,
        matActCostValue,
        pkgActCostValue,
        laborActCostValue,
        mrkActCostValue,
        rsrchActCostValue,
        totalActCostValue,
      });
      return true;
    });

    if (
      this.state.totalCost === "$0.00" ||
      this.state.totalActCost === "$0.00"
    ) {
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
                value="VIEW VARIANCE"
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
                      {Math.abs(
                        this.state.matCostValue - this.state.matActCostValue
                      ).toLocaleString("en-US", {
                        style: "currency",
                        currency: "USD",
                      })}
                    </td>
                    <td>{this.state.matActCost}</td>
                  </tr>
                  <tr>
                    <td> Packaging Materials </td>
                    <td>{this.state.pkgCost}</td>
                    <td>
                      {Math.abs(
                        this.state.pkgCostValue - this.state.pkgActCostValue
                      ).toLocaleString("en-US", {
                        style: "currency",
                        currency: "USD",
                      })}
                    </td>
                    <td>{this.state.pkgActCost}</td>
                  </tr>
                  <tr>
                    <td> Direct Labor </td>
                    <td>{this.state.laborCost}</td>
                    <td>
                      {Math.abs(
                        this.state.laborCostValue - this.state.laborActCostValue
                      ).toLocaleString("en-US", {
                        style: "currency",
                        currency: "USD",
                      })}
                    </td>
                    <td>{this.state.laborActCost}</td>
                  </tr>
                  {/* <tr>
                    <td> Indirect Manufacturing Costs </td>
                    <td>{this.state.indirectManuCost}</td>
                    <td>
                      {Math.abs(
                        this.state.indirectManuCostValue -
                          this.state.indirectManuActCostValue
                      ).toLocaleString("en-US", {
                        style: "currency",
                        currency: "USD",
                      })}
                    </td>
                    <td>{this.state.indirectManuActCost}</td>
                  </tr> */}
                  <tr>
                    <td> Marketing </td>
                    <td>{this.state.mrkCost}</td>
                    <td>
                      {Math.abs(
                        this.state.mrkCostValue - this.state.mrkActCostValue
                      ).toLocaleString("en-US", {
                        style: "currency",
                        currency: "USD",
                      })}
                    </td>
                    <td>{this.state.mrkActCost}</td>
                  </tr>
                  <tr>
                    <td> Research </td>
                    <td>{this.state.rsrchCost}</td>
                    <td>
                      {Math.abs(
                        this.state.rsrchCostValue - this.state.rsrchActCostValue
                      ).toLocaleString("en-US", {
                        style: "currency",
                        currency: "USD",
                      })}
                    </td>
                    <td>{this.state.rsrchActCost}</td>
                  </tr>
                </tbody>

                <tfoot>
                  <tr>
                    <th> TOTAL </th>
                    <td>{this.state.totalStdCost} </td>
                    <td>
                      {Math.abs(
                        this.state.totalStdCostValue -
                        this.state.totalActCostValue
                      ).toLocaleString("en-US", {
                        style: "currency",
                        currency: "USD",
                      })}
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
      let matCostValue = parseInt(standard.directMaterialCost, 10);
      let pkgCostValue = parseInt(standard.packagingMaterialCost, 10);
      let laborCostValue = parseInt(standard.directLaborCost, 10);

      let mrkCostValue = parseInt(standard.marketingCost, 10);
      let rsrchCostValue = parseInt(standard.researchCost, 10);
      // let totalCostValue = parseInt(standard.CostTOT,10);
      let totalStdCostValue =
        matCostValue +
        pkgCostValue +
        laborCostValue +

        mrkCostValue +
        rsrchCostValue;

      let matCost = matCostValue.toLocaleString("en-US", {
        style: "currency",
        currency: "USD",
      });
      let pkgCost = pkgCostValue.toLocaleString("en-US", {
        style: "currency",
        currency: "USD",
      });
      let laborCost = laborCostValue.toLocaleString("en-US", {
        style: "currency",
        currency: "USD",
      });

      let mrkCost = mrkCostValue.toLocaleString("en-US", {
        style: "currency",
        currency: "USD",
      });
      let rsrchCost = rsrchCostValue.toLocaleString("en-US", {
        style: "currency",
        currency: "USD",
      });
      // let totalCost = totalCostValue.toLocaleString("en-US", {style: "currency", currency: "USD"});
      let totalStdCost = totalStdCostValue.toLocaleString("en-US", {
        style: "currency",
        currency: "USD",
      });

      this.setState({
        standard,
        proId,
        matCost,
        pkgCost,
        laborCost,

        mrkCost,
        rsrchCost,
        totalStdCost,
        matCostValue,
        pkgCostValue,
        laborCostValue,

        mrkCostValue,
        rsrchCostValue,
        totalStdCostValue,
      });
      return true;
    });

    const actual = await this.props.pcContract.methods
      .getActualCost(proId)
      .call();

    const actualCostData = actual.map((item, index) => {
      let matActCostValue = parseInt(actual.directMaterialCost, 10);
      let pkgActCostValue = parseInt(actual.packagingMaterialCost, 10);
      let laborActCostValue = parseInt(actual.directLaborCost, 10);

      let mrkActCostValue = parseInt(actual.marketingCost, 10);
      let rsrchActCostValue = parseInt(actual.researchCost, 10);
      // let totalActCostValue = parseInt(actual.CostTOT,10);
      let totalActCostValue =
        matActCostValue +
        pkgActCostValue +
        laborActCostValue +

        mrkActCostValue +
        rsrchActCostValue;

      let matActCost = matActCostValue.toLocaleString("en-US", {
        style: "currency",
        currency: "USD",
      });
      let pkgActCost = pkgActCostValue.toLocaleString("en-US", {
        style: "currency",
        currency: "USD",
      });
      let laborActCost = laborActCostValue.toLocaleString("en-US", {
        style: "currency",
        currency: "USD",
      });

      let mrkActCost = mrkActCostValue.toLocaleString("en-US", {
        style: "currency",
        currency: "USD",
      });
      let rsrchActCost = rsrchActCostValue.toLocaleString("en-US", {
        style: "currency",
        currency: "USD",
      });
      let totalActCost = totalActCostValue.toLocaleString("en-US", {
        style: "currency",
        currency: "USD",
      });

      this.setState({
        actual,
        matActCost,
        pkgActCost,
        laborActCost,
        mrkActCost,
        rsrchActCost,
        totalActCost,
        matActCostValue,
        pkgActCostValue,
        laborActCostValue,
        mrkActCostValue,
        rsrchActCostValue,
        totalActCostValue,
      });
      return true;
    });

    const flexible = await this.props.pcContract.methods
      .getFlexibleCosts(proId)
      .call();

    const flexCostData = flexible.map((item, index) => {
      let matFlexCostValue = parseInt(flexible.directMaterialCost, 10);
      let pkgFlexCostValue = parseInt(flexible.packagingMaterialCost, 10);
      let laborFlexCostValue = parseInt(flexible.directLaborCost, 10);

      let mrkFlexCostValue = parseInt(flexible.marketingCost, 10);
      let rsrchFlexCostValue = parseInt(flexible.researchCost, 10);
      let totalFlexCostValue =
        matFlexCostValue +
        pkgFlexCostValue +
        laborFlexCostValue +

        mrkFlexCostValue +
        rsrchFlexCostValue;

      let matFlexCost = matFlexCostValue.toLocaleString("en-US", {
        style: "currency",
        currency: "USD",
      });
      let pkgFlexCost = pkgFlexCostValue.toLocaleString("en-US", {
        style: "currency",
        currency: "USD",
      });
      let laborFlexCost = laborFlexCostValue.toLocaleString("en-US", {
        style: "currency",
        currency: "USD",
      });

      let mrkFlexCost = mrkFlexCostValue.toLocaleString("en-US", {
        style: "currency",
        currency: "USD",
      });
      let rsrchFlexCost = rsrchFlexCostValue.toLocaleString("en-US", {
        style: "currency",
        currency: "USD",
      });
      let totalFlexCost = totalFlexCostValue.toLocaleString("en-US", {
        style: "currency",
        currency: "USD",
      });

      this.setState({
        actual,
        matFlexCost,
        pkgFlexCost,
        laborFlexCost,
        mrkFlexCost,
        rsrchFlexCost,
        totalFlexCost,
        matFlexCostValue,
        pkgFlexCostValue,
        laborFlexCostValue,
        mrkFlexCostValue,
        rsrchFlexCostValue,
        totalFlexCostValue,
      });
      return true;
    });

    if (
      this.state.totalStdCost === "$0.00" ||
      this.state.totalActCost === "$0.00" ||
      this.state.totalFlexCost === "$0.00"
    ) {
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
    this.setState({ stdCostData, actualCostData, flexCostData });
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
                value="VIEW VARIANCE"
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
                      {Math.abs(
                        this.state.matActCostValue - this.state.matFlexCostValue
                      ).toLocaleString("en-US", {
                        style: "currency",
                        currency: "USD",
                      })}
                    </td>
                    <td>{this.state.matFlexCost}</td>
                    <td>
                      {Math.abs(
                        this.state.matFlexCostValue - this.state.matCostValue
                      ).toLocaleString("en-US", {
                        style: "currency",
                        currency: "USD",
                      })}
                    </td>
                    <td>{this.state.matCost}</td>
                  </tr>
                  <tr>
                    <td> Packaging Materials </td>
                    <td>{this.state.pkgActCost}</td>
                    <td>
                      {Math.abs(
                        this.state.pkgActCostValue - this.state.pkgFlexCostValue
                      ).toLocaleString("en-US", {
                        style: "currency",
                        currency: "USD",
                      })}
                    </td>
                    <td>{this.state.pkgFlexCost}</td>
                    <td>
                      {Math.abs(
                        this.state.pkgFlexCostValue - this.state.pkgCostValue
                      ).toLocaleString("en-US", {
                        style: "currency",
                        currency: "USD",
                      })}
                    </td>
                    <td>{this.state.pkgCost}</td>
                  </tr>
                  <tr>
                    <td> Direct Labor </td>
                    <td>{this.state.laborActCost}</td>
                    <td>
                      {Math.abs(
                        this.state.laborActCostValue -
                        this.state.laborFlexCostValue
                      ).toLocaleString("en-US", {
                        style: "currency",
                        currency: "USD",
                      })}
                    </td>
                    <td>{this.state.laborFlexCost}</td>
                    <td>
                      {Math.abs(
                        this.state.laborFlexCostValue -
                        this.state.laborCostValue
                      ).toLocaleString("en-US", {
                        style: "currency",
                        currency: "USD",
                      })}
                    </td>
                    <td>{this.state.laborCost}</td>
                  </tr>
                  {/* <tr>
                    <td>Indirect Manufacturing Costs</td>
                    <td>{this.state.indirectManuActCost}</td>
                    <td>
                      {Math.abs(
                        this.state.indirectManuActCostValue -
                        this.state.indirectManuFlexCostValue
                      ).toLocaleString("en-US", {
                        style: "currency",
                        currency: "USD",
                      })}
                    </td>
                    <td>{this.state.indirectManuFlexCost}</td>
                    
                    <td>
                      {Math.abs(
                        this.state.indirectManuFlexCostValue -
                        this.state.indirectManuCostValue
                      ).toLocaleString("en-US", {
                        style: "currency",
                        currency: "USD",
                      })}
                    </td>
                    <td>{this.state.indirectManuCost}</td>
                  </tr> */}
                  <tr>
                    <td> Marketing </td>
                    <td>{this.state.mrkActCost}</td>
                    <td>
                      {Math.abs(
                        this.state.mrkActCostValue - this.state.mrkFlexCostValue
                      ).toLocaleString("en-US", {
                        style: "currency",
                        currency: "USD",
                      })}
                    </td>
                    <td>{this.state.mrkFlexCost}</td>
                    <td>
                      {Math.abs(
                        this.state.mrkFlexCostValue - this.state.mrkCostValue
                      ).toLocaleString("en-US", {
                        style: "currency",
                        currency: "USD",
                      })}
                    </td>
                    <td>{this.state.mrkCost}</td>
                  </tr>
                  <tr>
                    <td> Research </td>
                    <td>{this.state.rsrchActCost}</td>
                    <td>
                      {Math.abs(
                        this.state.rsrchActCostValue -
                        this.state.rsrchFlexCostValue
                      ).toLocaleString("en-US", {
                        style: "currency",
                        currency: "USD",
                      })}
                    </td>
                    <td>{this.state.rsrchFlexCost}</td>
                    <td>
                      {Math.abs(
                        this.state.rsrchFlexCostValue -
                        this.state.rsrchCostValue
                      ).toLocaleString("en-US", {
                        style: "currency",
                        currency: "USD",
                      })}
                    </td>
                    <td>{this.state.rsrchCost}</td>
                  </tr>
                </tbody>

                <tfoot>
                  <tr>
                    <th> TOTAL </th>
                    <td>{this.state.totalActCost}</td>
                    <td>
                      {Math.abs(
                        this.state.totalActCostValue -
                        this.state.totalFlexCostValue
                      ).toLocaleString("en-US", {
                        style: "currency",
                        currency: "USD",
                      })}
                    </td>
                    <td>{this.state.totalFlexCost}</td>
                    <td>
                      {Math.abs(
                        this.state.totalFlexCostValue -
                        this.state.totalStdCostValue
                      ).toLocaleString("en-US", {
                        style: "currency",
                        currency: "USD",
                      })}
                    </td>
                    <td>{this.state.totalStdCost}</td>
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

class CalculatePriceVariance extends Component {
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
      let materialUnitStdCostValue = parseInt(standard.materialCostPerUnit);
      let hourlyStdRateValue = parseInt(standard.ratePerWorkHr, 10);
      let workHrsStdNo = parseInt(standard.workHrs, 10);
      let materialUnitStdCost = materialUnitStdCostValue.toLocaleString(
        "en-US",
        { style: "currency", currency: "USD" }
      );
      let hourlyStdRate = hourlyStdRateValue.toLocaleString("en-US", {
        style: "currency",
        currency: "USD",
      });

      this.setState({
        standard,
        proId,
        materialUnitStdCostValue,
        hourlyStdRateValue,
        materialUnitStdCost,
        hourlyStdRate,
        workHrsStdNo,
      });
      return true;
    });

    const actual = await this.props.pcContract.methods
      .getActualCost(proId)
      .call();
    const actualCostData = actual.map((item, index) => {
      let materialUnitActCostValue = parseInt(actual.materialCostPerUnit);
      let hourlyActRateValue = parseInt(actual.ratePerWorkHr, 10);
      let workHrsActNo = parseInt(actual.workHrs, 10);
      let materialUnitActCost = materialUnitActCostValue.toLocaleString(
        "en-US",
        { style: "currency", currency: "USD" }
      );
      let hourlyActRate = hourlyActRateValue.toLocaleString("en-US", {
        style: "currency",
        currency: "USD",
      });
      this.setState({
        actual,
        materialUnitActCostValue,
        hourlyActRateValue,
        materialUnitActCost,
        hourlyActRate,
        workHrsActNo,
      });
      return true;
    });

    const stdQty = await this.props.pcContract.methods
      .getStdMaterialQty(proId)
      .call();
    const actQty = await this.props.pcContract.methods
      .getActualMaterialQty(proId)
      .call();

    this.setState({ stdQty, actQty });

    if (
      this.state.materialUnitStdCost === "$0.00" ||
      this.state.materialUnitActCost === "$0.00"
    ) {
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

    let materialCalc =
      Math.abs(
        this.state.materialUnitActCostValue -
        this.state.materialUnitStdCostValue
      ) * this.state.actQty;
    let laborCalc =
      Math.abs(this.state.hourlyActRateValue - this.state.hourlyStdRateValue) *
      this.state.workHrsActNo;
    let material = materialCalc.toLocaleString("en-US", {
      style: "currency",
      currency: "USD",
    });
    let labor = laborCalc.toLocaleString("en-US", {
      style: "currency",
      currency: "USD",
    });
    this.setState({ material, labor });
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
            <h4>Review Direct-Cost Price Variance</h4>
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
                value="VIEW VARIANCE"
              />
            </div>
          </div>
          <div className="query-result">
            <p> {this.state.msg} </p>
          </div>
          <div className={`${table} costsClashContainer `}>
            <div className="std-cost-container">
              <table className="cost-data" cellSpacing="90">
                <thead>
                  <tr>
                    <th>CATEGORY</th>
                    <th>PRICE VARIANCE</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td>Direct Material </td>
                    <td>
                      {`(${this.state.materialUnitActCost} per gram - ${this.state.materialUnitStdCost} per gram)  * ${this.state.actQty} grams = ${this.state.material}`}
                    </td>
                  </tr>
                  <tr>
                    <td> Direct Labor </td>
                    <td>
                      {`(${this.state.hourlyActRate} per hour - ${this.state.hourlyStdRate} per hour )  * ${this.state.workHrsActNo} hours = ${this.state.labor}`}
                    </td>
                  </tr>
                </tbody>
                <tfoot>
                  <tr></tr>
                </tfoot>
              </table>
            </div>
          </div>
        </form>
      </div>
    );
  }
}

class CalculateQuantityVariance extends Component {
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
    console.log(standard);
    const stdCostData = standard.map((item, index) => {
      let materialUnitStdCostValue = parseInt(standard.materialCostPerUnit);
      let hourlyStdRateValue = parseInt(standard.ratePerWorkHr, 10);
      let workHrsStdNo = parseInt(standard.workHrs, 10);
      let materialUnitStdCost = materialUnitStdCostValue.toLocaleString(
        "en-US",
        { style: "currency", currency: "USD" }
      );
      let hourlyStdRate = hourlyStdRateValue.toLocaleString("en-US", {
        style: "currency",
        currency: "USD",
      });

      this.setState({
        standard,
        proId,
        materialUnitStdCostValue,
        hourlyStdRateValue,
        materialUnitStdCost,
        hourlyStdRate,
        workHrsStdNo,
      });
      return true;
    });

    const actual = await this.props.pcContract.methods
      .getActualCost(proId)
      .call();
    const actualCostData = actual.map((item, index) => {
      let materialUnitActCostValue = parseInt(actual.materialCostPerUnit);
      let hourlyActRateValue = parseInt(actual.ratePerWorkHr, 10);
      let workHrsActNo = parseInt(actual.workHrs, 10);
      let materialUnitActCost = materialUnitActCostValue.toLocaleString(
        "en-US",
        { style: "currency", currency: "USD" }
      );
      let hourlyActRate = hourlyActRateValue.toLocaleString("en-US", {
        style: "currency",
        currency: "USD",
      });
      this.setState({
        actual,
        materialUnitActCostValue,
        hourlyActRateValue,
        materialUnitActCost,
        hourlyActRate,
        workHrsActNo,
      });
      return true;
    });

    const stdQty = await this.props.pcContract.methods
      .getStdMaterialQty(proId)
      .call();
    const actQty = await this.props.pcContract.methods
      .getActualMaterialQty(proId)
      .call();

    this.setState({ stdQty, actQty });

    const actUnitsNo = await this.props.pcContract.methods
      .getActualBudgetUnits(proId)
      .call();

    this.setState({ actUnitsNo });

    if (
      this.state.materialUnitStdCost === "$0.00" ||
      this.state.materialUnitActCost === "$0.00"
    ) {
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

    let materialCalc =
      Math.abs(this.state.actQty*this.state.actUnitsNo - this.state.actUnitsNo * this.state.stdQty) *
      this.state.materialUnitStdCostValue;
      let materialInKg = materialCalc/1000;
    let laborCalc =
      Math.abs(
        this.state.workHrsActNo -
        this.state.actUnitsNo * this.state.workHrsStdNo
      ) * this.state.hourlyStdRateValue;
      let laborInKg = laborCalc/1000;
    let material = materialCalc.toLocaleString("en-US", {
      style: "currency",
      currency: "USD",
    });

    let materialKg = materialInKg.toLocaleString("en-US", {
      style: "currency",
      currency: "USD",
    });

    let labor = laborCalc.toLocaleString("en-US", {
      style: "currency",
      currency: "USD",
    });

    let laborKg = laborInKg.toLocaleString("en-US", {
      style: "currency",
      currency: "USD",
    });
    this.setState({ material, labor , materialKg , laborKg });
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
            <h4>Review Direct-Cost Quantity Variance</h4>
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
                value="VIEW VARIANCE"
              />
            </div>
          </div>
          <div className="query-result">
            <p> {this.state.msg} </p>
          </div>
          <div className={`${table} costsClashContainer `}>
            <div className="std-cost-container">
              <table className="cost-data" cellSpacing="90">
                <thead>
                  <tr>
                    <th>Category</th>
                    <th>Quantity Variance</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td>Direct Material </td>
                    <td>
                      {`(${this.state.actQty} grams * ${this.state.actUnitsNo} units - ( ${this.state.actUnitsNo} units * ${this.state.stdQty}  grams per unit) )  * ${this.state.materialUnitStdCost} per gram = ${this.state.materialKg} `}
                    </td>
                  </tr>
                  <tr>
                    <td> Direct Labor </td>
                    <td>
                      {`(${this.state.workHrsActNo} hours - ( ${this.state.actUnitsNo} units * ${this.state.workHrsStdNo} hours per unit ) )  * ${this.state.hourlyStdRate} per hour = ${this.state.laborKg}`}
                    </td>
                  </tr>
                </tbody>
                <tfoot>
                  <tr></tr>
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
                <strong> REVIEW COST SHEET </strong>
              </label>
              <li className="link-item">
                <NavLink to="/financial-log/costSheetStd">
                  + STANDARD
                </NavLink>
              </li>
              <li className="link-item">
                <NavLink to="/financial-log/costSheetAct">
                  + ACTUAL
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
              <li className="link-item">
                <NavLink to="/financial-log/priceVariance">
                  + PRICE/RATE
                </NavLink>
              </li>
              <li className="link-item">
                <NavLink to="/financial-log/quantityVariance">
                  + QUANTITY/EFFICIENCY
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
            <Route
              path="/financial-log/priceVariance"
              exact
              render={(props) => (
                <CalculatePriceVariance
                  {...props}
                  Web3={this.props.web3}
                  account={this.props.accounts}
                  pcContract={this.props.pcContract}
                  pctContract={this.props.pctContract}
                />
              )}
            />
            <Route
              path="/financial-log/quantityVariance"
              exact
              render={(props) => (
                <CalculateQuantityVariance
                  {...props}
                  Web3={this.props.web3}
                  account={this.props.accounts}
                  pcContract={this.props.pcContract}
                  pctContract={this.props.pctContract}
                />
              )}
            />
            <Route
              path="/financial-log/costSheetAct"
              exact
              render={(props) => (
                <ReviewActCostSheet
                  {...props}
                  Web3={this.props.web3}
                  account={this.props.accounts}
                  pcContract={this.props.pcContract}
                  pctContract={this.props.pctContract}
                />
              )}
            />
            <Route
              path="/financial-log/costSheetStd"
              exact
              render={(props) => (
                <ReviewStdCostSheet
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

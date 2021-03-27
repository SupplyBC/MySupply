import React, { Component } from "react";

const inventory = ["vitamin-a", "vitamin-b-complex", "plastic"];


class InventoryItem extends Component {
  render() {
    return (
      <div className="item-container">
        <div className="item-card">
          <img
            style={{ width: "80px" }}
            src={require("../assets/imgs/vitamin.svg")}
            alt="material"
          />
          <h5> {this.props.item.toUpperCase()} </h5>
        </div>
      </div>
    );
  }
}
class Inventory extends Component {
  state = { stockCount: 0 };
  constructor(props) {
    super(props);
    this.calculateStock = this.calculateStock.bind(this);
  }

  calculateStock() {
    let count = 0;
    for (let i = 0; i <= inventory.length; i++) {
      count++;
    }

    this.setState((state) => ({
      stockCount: count,
    }));
  }

  render() {
    return (
      <div className="inventory-container">
        <button className="btn" onClick={this.calculateStock}>
          
          REFRESH STOCK
        </button>
        <div className="item-container-container">
          <InventoryItem item="vitamin-c extract"  />
          <InventoryItem item="vitamin-B complex" />
          {/* <InventoryItem item="vitamin-C extract"/>
          <InventoryItem item="wheat germ oil"/> */}
          
        </div>
        {/* <div style={{marginTop: '20px'}}> Current Stock: {this.state.stockCount} </div> */}
      </div>
    );
  }
}

export default Inventory;

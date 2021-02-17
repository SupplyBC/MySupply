import React, { Component } from "react";

const inventory = ["vitamin-a", "vitamin-b-complex", "plastic"];
// const items = inventory.map(item => {
//         return `${item} `
// })
// console.log(items);

class InventoryItem extends Component {
  render() {
    return (
      <div className="item-container">
        <div className="item-card">
          <img
            style={{ width: "80px" }}
            src={require("../vitamin.svg")}
            alt="material"
          />
          <h5> {this.props.item} </h5>
          <h6>
            {this.props.stock === "OUT OF STOCK"
              ? this.props.stock
              : "IN STOCK:" + this.props.stock + "KG"}
          </h6>
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
          {" "}
          REFRESH STOCK{" "}
        </button>
        <div className="item-container-container">
          <InventoryItem item="vitamin-a" stock={100 + 932} />
          <InventoryItem item="vitamin-b-complex" stock={104 + 1342} />
          <InventoryItem item="zinc" stock="OUT OF STOCK" />
        </div>
        {/* <div style={{marginTop: '20px'}}> Current Stock: {this.state.stockCount} </div> */}
      </div>
    );
  }
}

export default Inventory;

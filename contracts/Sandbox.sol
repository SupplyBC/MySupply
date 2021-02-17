// "SPDX-License-Identifier: UNLICENSED"
pragma solidity >=0.6.2;
pragma experimental ABIEncoderV2;

contract Sandbox {
    
    // DATATYPES AND VARIABLES
    uint phaseCost = 25 ether;
    enum Status { LICENSED , UNLICENSED }
    enum SupplyStatus {CREATED , REQUESTED , SENT , DELIVERED , TERMINATED}
    
    //EVENTS
    event SupplyEvent (string eventName , address eventMaker , uint timestamp);
    event PhaseDone (string phaseName, string productDoneTo , uint cost );
    
    
    // MAPPINGS
    mapping (address => Manufacturer) manufacturerList;
    mapping (address => Supplier) supplierList;
    mapping (string => Material[]) materialList;
    mapping (string => Product) productList;
    mapping (string => Material[]) productMaterials;
    
    // STRUCTURES 
    
    struct Manufacturer {
        address manufacturerID;
        string  manufacturerName;
        Status  manufacturerStatus;
    }
    
    struct Supplier {
        address supplierID;
        string  supplierName;
        Status  supplierStatus;
    }
    
    struct Product {
        address creator;
        address currentOwner;
        string  productID;
        string  productName;
        SupplyStatus  currentStatus;
    }
    
    struct Material {
        uint materialID;
        string materialType;
        string materialName;
        string materialStrength;
    }
   
 
    // FUNCTIONS 
    
    constructor() {
        
    }
    
    function addProduct(string memory _id , string memory _name) public returns (bool) {
        productList[_id] = Product (msg.sender, msg.sender , _id , _name , SupplyStatus.CREATED);
        emit SupplyEvent ('CREATED', msg.sender , block.timestamp);
        emit PhaseDone ('R&D' , _id , phaseCost );
        return true;
    }
    
    function getProductDetails (string memory _product) public view returns (string memory , SupplyStatus) {
        return (productList[_product].productName, productList[_product].currentStatus);
    }
 
}
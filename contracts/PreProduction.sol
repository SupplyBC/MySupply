// "SPDX-License-Identifier: UNLICENSED"
pragma solidity >=0.6.2;
pragma experimental ABIEncoderV2;

contract PreProduction {

    //DATATYPES AND VARIABLES

    enum participantStatus {PENDING, VERIFIED, BLACKLISTED}
    enum materialStatus { CREATED, REQUESTED, SENT, DELIVERED , TERMINATED}
    enum productStatus {REGISTERED, UNREGISTERED}

    address        admin;

    //MAPPINGS
    mapping (address => Manufacturer) manufacturerList;
    mapping (address => Supplier) supplierList;
    mapping (string => Material) materialList;
    mapping (string => Product) productList;
    


    //EVENTS
    event Purchase (address _from , address _to , string _item, uint _cost );
    event SupplyAction (string actionName, address actionTaker , uint timestamp);


 

    // STRUCTURES
    struct Manufacturer {
        address  manuID;
        string manuName;
        participantStatus manuStatus;
    }

    struct Supplier {
        address  suppID;
        string suppName;
        participantStatus suppStatus;
    }

    struct Material {
        address creator;
        string materialID;
        string materialType;
        string materialName;
        string materialForm;
        materialStatus currentMaterialStatus;
    }

    struct Product {
        address manufacturer;
        string registerNo;
        string productName;
        string manuDate;
        string expDate;
        productStatus currentProductStatus;
    }


    // FUNCTIONS AND MODIFIERS
    constructor() {
        admin == msg.sender;
        addManufacturer(0xB38795a83e8771ccF023DaE4870F47A405dfB712,'MAN01');
        addSupplier(0xf333028b8Fc7a030F1186Db50BceF0C0607c2CF2,'SUPPLIER01');
        addSupplier(0xc3FAb39340BcD389f7571C74405E7F8C1a5E201F,'SUPPLIER02');
    }

    modifier onlyAdmin {
        require (msg.sender == admin);
        _;
    }

       function addManufacturer(
        address _id,
        string memory _name
    ) public returns (bool) {
        participantStatus defaultState = participantStatus.VERIFIED;
        manufacturerList[_id] = Manufacturer(_id, _name, defaultState);
        return true;
    }

     function addSupplier(
        address _id,
        string memory _name
    ) public returns (bool) {
        participantStatus defaultState = participantStatus.VERIFIED;
        supplierList[_id] = Supplier(_id, _name, defaultState);
        return true;
    }
    
    // function verifyManufacturer(address _id) public onlyAdmin returns (bool ) {
    //     manufacturerList[_id].manuStatus = participantStatus.VERIFIED;
    //     return true;
    // }

    function getManufacturer(address _id) public view returns (Manufacturer memory) {
        return manufacturerList[_id];
    }

     function getSupplier(address _id) public view returns (Supplier memory) {
        return supplierList[_id];
    }

    // function getManuStatus(address _id) public view returns (participantStatus) {
    //     return manufacturerList[_id].manuStatus;
    // }


    // function getSupplierStatus(address _id) public view returns (participantStatus) {
    //     return supplierList[_id].suppStatus;
    // }
    




}
/*
    THIS CONTRACT IMPLEMENTS:
    1- Adding product with its specs. (manufacturer)
    2- create material. (suppplier)
    3- request material from supplier (manufacturer)
    4- track request status (manufactuer)
    5- log tracking phases 


*/


// "SPDX-License-Identifier: UNLICENSED"
pragma solidity >=0.6.2;
pragma experimental ABIEncoderV2;  

contract NewDemoTest {
    
    // UTILS
    function strComp(string memory x , string memory y ) public pure returns (bool){
        return (keccak256(abi.encodePacked((x))) == keccak256(abi.encodePacked((y))));
    }
    
    enum Role {MANUFACTURER, SUPPLIER, DISTRIBUTOR}
    address admin;
    uint requestCount = 0;
    mapping(address => bool) participants;
    mapping(address => Product[]) products;
    mapping (string => Specs[]) productSpecs; // productID and material  
    mapping (address => Material[])  materials;   //Participant(supplier) and material
    mapping(string => Material) materialsByName;
    mapping(address => Request[]) requests; 
    mapping(uint => Log[])    trackLogs; //requestId and Log
    
    
    
    struct Participant {
        address particId;
        Role    particRole;
    }
    
    struct Product {
        address manufacturer;
        string  productId; //registration no.
        string  productName;
        string  productForm; // tablets or capsules
        
    }
    
    struct Material {
        address supplier;
        string  materialName;
        string  materialType;
        // string  materialStrength;
        string  materialForm;
        uint    createdAmount;
        uint    unitCost;
    }
    
    struct Specs {
        string  materialName;
        string  materialType;
        string  materialStrength;
        string  materialForm;
        
    }

    struct Request {
        uint  requestId;
        address fromParti;
        address toParti;
        string materialName;
        string  materialForm;
        uint amount;
        uint  issueTime;
    }
    
       struct Log {
        string  shipStatus;
        string  currentTemp;
        string  currentHumidity;
        string  materialStatus;
        uint  logTime;
    }
    
    
    // FUNCTIONS
    
    //constructor
    
    // constructor() {
        
    // }
    
    modifier onlyAdmin {
        require(msg.sender == admin);
        _;
    }
    
    // Core functions 
    // Handle participants privileges
    
    function verifyParticipant(address _participant) public  {
             participants[_participant] = true;
    }
    
    function unverifyParticipant(address _participant ) public  {
             participants[_participant] = false;
    }
         
    function isVerfied(address _participant) public view returns (bool) {
             return participants[_participant];
    }
    
    
    
    
    function addProduct(
    string memory _id,
    string memory _name,
    string memory _pForm
    ) public {
        
        Product memory pro = Product({
            productId: _id,
            productName: _name,
            productForm: _pForm,
            manufacturer: msg.sender
        });
        
        products[msg.sender].push(pro);
        
    }
    
    function addProductSpecs(
    string memory _productID,
    string memory _name,
    string memory _type,
    string memory _strength,
    string memory _form
    ) public {
    
        Specs memory spec = Specs({
            materialName: _name,
            materialType: _type,
            materialForm: _form,
            materialStrength: _strength
            
        });      
        
        productSpecs[_productID].push(spec);
        
    }
    
    function getProductsByManu(address _manufacturer) public view returns(Product[] memory) {
        return products[_manufacturer];
    }
    function getProductSpecs(string memory _product) public view returns(Specs[] memory) {
        return productSpecs[_product];
    }
    
    // By Supplier
    function createMaterial(
    string memory _name,
    string memory _type,
    string memory _form,
    uint    _amount,
    uint    _unitCost
    ) public {
        
        Material memory mat = Material({
           supplier: msg.sender,
           materialName: _name,
           materialType: _type,
           materialForm: _form,
           createdAmount: _amount,
           unitCost:      _unitCost
        });

        materials[msg.sender].push(mat);
        materialsByName[_name] = mat;
        
    }
    
    // TODOOOO
    function getMaterialBySupplier(address _supplier) public view returns(Material[] memory ) {
        return materials[_supplier];
    }
    
    // function getMaterialByName(string memory _name) public view returns (Material[] memory) {
    //     Material[] memory matTemp;
    // }
    
    
    function createRequest(address _to , string memory _material , string memory _materialForm, uint _amount) public{
        requestCount += 1;
        Request memory req = Request({
           requestId: requestCount,
           fromParti: msg.sender,
           toParti: _to,
           materialName: _material,
           materialForm: _materialForm,
           amount: _amount,
           issueTime: block.timestamp
        });
        
        requests[msg.sender].push(req);
    }
    
    
    function getMyRequests() public view returns (Request[] memory) {
        
        return requests[msg.sender];
    }
    
    function getRequestByAddress(address _participant) public  view returns(Request[] memory) {
        
        return requests[_participant];
    }
    
    
    function createLog(uint _requestId,
    string memory _shipStatus,
    string memory _currentTemp,
    string memory _currentHumid,
    string memory _materialStatus
    ) public  {
        
        Log memory myLog = Log({
            shipStatus: _shipStatus,
            currentTemp: _currentTemp,
            currentHumidity: _currentHumid,
            materialStatus: _materialStatus,
            logTime: block.timestamp
        });
        
        trackLogs[_requestId].push(myLog);
    }
    
    function getTrackLogs(uint _request) public view returns(Log[] memory) {
        return trackLogs[_request];
    }
    
    
    
}
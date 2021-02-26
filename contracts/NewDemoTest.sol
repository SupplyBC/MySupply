/*
    THIS CONTRACT IMPLEMENTATION ALLOWS A USER TO:
    
    1- Add products with their specs. (manufacturer)
    2- Create materials. (suppplier).
    3- Request materials from suppliers. (manufacturer)
    4- Track requests status. (manufacturer)
*/


// "SPDX-License-Identifier: UNLICENSED"
pragma solidity >=0.6.2;
pragma experimental ABIEncoderV2;  

contract NewDemoTest {
    
    // UTILS
    
    function strComp(string memory x , string memory y ) public pure returns (bool){
        
        return (keccak256(abi.encodePacked((x))) == keccak256(abi.encodePacked((y))));
        
    }
    
    
    address admin;
    uint    requestCount = 0;
    enum    Role                    {MANUFACTURER, SUPPLIER, DISTRIBUTOR, DRUG_AUTHORITY, BANK}
    mapping (address => bool)       participants;
    mapping (address => Product[])  products;    // manufacturer and product
    mapping (string => Specs[])     productSpecs; // productID and material  
    mapping (address => Material[]) materials;   //Participant(supplier) and material
    // mapping (string => Material)    materialList; // materials by name
    mapping (address => Request[])  requests;   // participant and requests
    mapping (uint => Log[])         trackLogs; //requestId and Log
    mapping (string => Cost)        standardProductCosts;
    mapping (string => Cost)        actualProductCosts;
    mapping(uint => uint)           requestCost;    // requestId and Total Cost.
    Material[] public  materialArr;
    
    
    struct Participant {
        address particId;
        Role    particRole;
        uint    partiBalance;
    }
    
    struct Product {
        address manufacturer;
        string  productId; //registration no.
        string  productName;
        string  productForm; // tablets or capsules
        uint    productBudget;
        
    }
    
    struct Material {
        address supplier;
        string  materialID;
        string  materialName;
        string  materialStrength;
        string  materialForm;
        uint    createdAmount;
        uint    unitCost;
    }
    
    struct Specs {
        string  materialName;
        string  materialType;
        uint    materialAmount;
        string  materialStrength;
        string  materialForm;
        
    }

    struct Request {
        uint    requestId;
        address fromParti;
        address toParti;
        string  materialName;
        string  materialForm;
        string  materialStrength;
        uint    amount;
        uint    issueTime;
    }
    
       struct Log {
        string  shipStatus;
        string  currentTemp;
        string  currentHumidity;
        string  materialStatus;
        uint    logTime;
    }
    
    struct Cost {
        uint directMaterialCost;
        uint packagingMaterialCost;
        uint marketingCost;
        uint researchCost;
        uint directLaborCost;
        uint totalIndirectCost; // indirect manufacturing costs
        uint CostTOT; // direct material + direct labor + total indirect
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
            productBudget: 0,
            manufacturer: msg.sender
        });
        
        products[msg.sender].push(pro);
        
    }
    
    function addProductSpecs(
    
    string memory _productID,
    string memory _name,
    string memory _type,
    string memory _strength,
    string memory _form,
    uint          _amount
    
    ) public {
    
        Specs memory spec = Specs({
            
            materialName: _name,
            materialType: _type,
            materialForm: _form,
            materialAmount: _amount,
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
    
    // COST ACCOUNTING STUFF START HERE
    
    function setStdCostPlan(
    
    string memory _product,
    uint    _directMatCost,
    uint    _pkgMatCost,
    uint    _directLaborCost,
    uint    _totIndirectCosts,
    uint    _mrkCost,
    uint    _rsrchCost,
    uint    _productBudget
    
        ) public {
    
    Cost memory stdCosts = Cost({
        directMaterialCost: _directMatCost,
        directLaborCost: _directLaborCost,
        totalIndirectCost: _totIndirectCosts,
        packagingMaterialCost: _pkgMatCost,
        marketingCost: _mrkCost,
        researchCost: _rsrchCost,
        CostTOT: _directMatCost + _pkgMatCost +  _directLaborCost + _totIndirectCosts
                 + _mrkCost  + _rsrchCost
       
    });
    
    standardProductCosts[_product] = stdCosts;
    
    setProductBudget(_product, _productBudget);
    
    }
    
    function setProductBudget(string memory _product, uint _budget) public {
        if(strComp(_product, products[msg.sender][0].productId)) {
            products[msg.sender][0].productBudget = _budget;
        }
       
    }
    
    
    function getStdCostPlan(string memory _product) public view returns(Cost memory) {
        return standardProductCosts[_product];
    }
    
    function setActualCost(
    
    string memory _product,
    uint _actualMatCost,
    uint _actualPkgMatCost,
    uint _actualLaborCost,
    uint _actualIndirectCost,
    uint _actualMrkCost,
    uint _actualRsrchCost
    
    ) public {
        Cost memory actualCosts = Cost({
            directMaterialCost: _actualMatCost,
            packagingMaterialCost: _actualPkgMatCost,
            marketingCost: _actualMrkCost,
            researchCost: _actualRsrchCost,
            directLaborCost: _actualLaborCost,
            totalIndirectCost: _actualIndirectCost,
            CostTOT: _actualMatCost + _actualPkgMatCost + _actualLaborCost + _actualIndirectCost
                     + _actualMrkCost + _actualRsrchCost
        });
        
        actualProductCosts[_product] = actualCosts;
    }
    
    function getActualCost(string memory _product) public view returns(Cost memory) {
        return actualProductCosts[_product];
    }

    
    // By Supplier
    
    function createMaterial(
    
    string memory _id,
    string memory _name,
    string memory _str,
    string memory _form,
    uint    _amount,
    uint    _unitCost
    
    ) public {
        
        Material memory mat = Material({
           supplier: msg.sender,
           materialID:   _id,
           materialName: _name,
           materialForm: _form,
           materialStrength: _str,
           createdAmount: _amount,
           unitCost:      _unitCost
        });

        materials[msg.sender].push(mat);
        materialArr.push(mat);
        
        
    }
    
    // TODOOOO
    
    function getMaterialsBySupplier(address _supplier) public view returns(Material[] memory ) {
        return materials[_supplier];
    }
    
    
    // Material Search 
    
    // function getMaterialsByName(string memory _name) public view returns (Material[] memory) {
        
    //     uint counter = 0;
    //     Material[] memory result = new Material[](materialArr.length);
        
    //     if(strComp(_name, materialList[_name].materialName)) {
            
    //     result[counter] = materialList[_name];
    //     counter++;
        
    //     }
        
    //     return result;
    // }
    
    


    function createRequest(
    
    address _to ,
    string memory _material ,
    string memory _materialForm,
    string memory _materialStr,
    uint _amount )
    
    public {
        
        requestCount += 1;
        Request memory req = Request({
           requestId: requestCount,
           fromParti: msg.sender,
           toParti: _to,
           materialName: _material,
           materialForm: _materialForm,
           materialStrength: _materialStr, 
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
    
    
    function createLog(
    
    uint _requestId,
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
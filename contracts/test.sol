// "SPDX-License-Identifier: UNLICENSED"
pragma solidity >=0.6.2;
pragma experimental ABIEncoderV2;  

contract NewDemoTest {

// CONTRACT CONTENT GOES HERE
    
    // UTILS
    
    function strComp(string memory x , string memory y ) public pure returns (bool){
        
        return (keccak256(abi.encodePacked((x))) == keccak256(abi.encodePacked((y))));
        
    }
    
    function toString(uint _i) internal pure returns (string memory _uintAsString) {
        
        if (_i == 0) {
            return "0";
        }
        uint j = _i;
        uint len;
        while (j != 0) {
            len++;
            j /= 10;
        }
        bytes memory bstr = new bytes(len);
        uint k = len;
        while (_i != 0) {
            k = k-1;
            uint8 temp = (48 + uint8(_i - _i / 10 * 10));
            bytes1 b1 = bytes1(temp);
            bstr[k] = b1;
            _i /= 10;
        }
        return string(bstr);
    }
    
    function concat(string memory a, string memory b) internal pure returns (string memory) {
    string memory c = ' , ';
    return string(abi.encodePacked( a, c, b));

    }

    // END OF UTILS

    
    
    address     admin;
    address     bank;
    uint        trackNoCount = 115912;
    uint        tempThreshold = 40;
    uint        humidityThreshold = 50;
    Material[]  materialArr;
    Product[]   productArr;
    uint[]      tempArr;
    uint[]      humidArr;
    enum        Role                        {MANUFACTURER, SUPPLIER, DISTRIBUTOR, DRUG_AUTHORITY , BANK}
    mapping (address => bool)               participants;
    mapping (address => Product[])          products;    // manufacturer and product
    mapping (string => Specs[])             productSpecs; // productID and material 
    mapping (string => Product)             productList; // product by id
    mapping (address => Material[])         materials;   //Participant(supplier) and material
    mapping (string => Material)            materialList; // materials by id
    mapping (address => Request[])          requests;   // participant and requests
    mapping (uint => Request)               requestList; // requests by id
    mapping (address => BatchRequest[])     batchRequests; //participant and batch requests
    mapping (uint => BatchRequest)          batchRequestsList; // request id
    mapping (uint => Log[])                 trackLogs; //requestId and Log
    mapping (uint => uint[])                tempDataLogs; // requestId and temp data
    mapping (uint => uint[])                humidDataLogs; // requestId and humid data
    mapping (string => Cost)                standardProductCosts;
    mapping (string => Cost)                actualProductCosts;
    mapping (string => Cost)                flexibleProductCosts;
    mapping (string => uint)                standardBudgetUnits;
    mapping (string => uint)                actualBudgetUnits;
    mapping (string => uint)                flexibleBudgetUnits;
    mapping (uint => uint)                  requestCost;    // requestId and Cost
    mapping (uint => Location[])            requestLocations; //request id and locations
    mapping (uint => string)                requestShipmentMethod; //request Id and shipment method  
    mapping (address => InventoryItem[])    inventory;   // participant and items inventory
    mapping (string => InventoryItem)       inventoryList;   // inventory item by item id
    mapping (address => mapping (address => BankAccount) ) userBankAccounts; // bankAddr -> userAddr -> userAcc
    event   DataSent            (uint indexed requestNo, string DataCategory ,string dataValues , uint indexed timestamp);
    event   ShipmentStateUpdate (uint indexed requestNo, string  state, uint indexed timestamp);
    event   requestStateUpdate  (address indexed who, uint indexed timestamp , string  state);
    event   BankTransact        (string txName, address indexed _from , address  _to , uint _amount , uint indexed timestamp);
    event   ProductStateUpdate  (string productId, string productName , address indexed manufacturer , string state , uint indexed timestamp);
    
    struct BankAccount {
    
        address userId;
        string  userName;
        uint    userBalance;
        bool    isActive;
    }
    
    struct Participant {
        
        address particId;
        Role    particRole;
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
        uint  materialStrength;
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
        string  materialID;
        uint    amount;
        uint    issueTime;
    }
    
    struct BatchRequest {
        uint requestId;
        address fromParti1;
        address fromParti2;
        address toParti;
        string materialID;
        uint amount;
        uint issueTime;
    }
    
       struct Log {
        address logger;
        string  requestStatus;
        string  description;
        string  shipmentStatus;
        uint    logTime;
    }
    
    struct Cost {
        uint directMaterialCost;
        uint packagingMaterialCost;
        uint marketingCost;
        uint researchCost;
        uint directLaborCost;
        uint totalIndirectCost; // indirect manufacturing costs
        uint totalDirectCost;
        uint CostTOT; // direct material + direct labor + total indirect
    }
    
    struct Location {
        string Latitude;
        string Longitude;
    }
    
    struct InventoryItem {
      string itemId;
      uint   amount;
    }
    
    // FUNCTIONS
    // MANUFACTURING STUFF GOES HERE
    
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
        productList[_id] = pro;
        productArr.push(pro);
         emit ProductStateUpdate(
        _id,
        productList[_id].productName,
        productList[_id].manufacturer,
        'UNDER-RESEARCH',
        block.timestamp
        );
    
        
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
         emit ProductStateUpdate(
        _productID,
        productList[_productID].productName,
        productList[_productID].manufacturer,
        'REGISTERED',
        block.timestamp
        );
    
        
    }
    
      
    function getProductsByManu(address _manufacturer) public view returns(Product[] memory) {
        return products[_manufacturer];
    }
    
    function getProducts() public view returns(Product[] memory) {
        return productArr;
    }
    
    function getProductById(string memory _id) public view returns(Product memory) {
        return productList[_id];
    }
    
    function getProductSpecs(string memory _product) public view returns(Specs[] memory) {
        return productSpecs[_product];
    }
    
    // END OF MANUFACTURING STUFF
    // COST ACCOUNTING STUFF GOES HERE
    
    function setStdCostPlan(
    
    string memory _product,
    uint    _unitsNo,
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
        totalDirectCost: _directMatCost + _pkgMatCost +  _directLaborCost,
        packagingMaterialCost: _pkgMatCost,
        marketingCost: _mrkCost,
        researchCost: _rsrchCost,
        CostTOT: _directMatCost + _pkgMatCost +  _directLaborCost + _totIndirectCosts + _mrkCost  + _rsrchCost
       
    });
    
    standardProductCosts[_product] = stdCosts;
    standardBudgetUnits[_product] = _unitsNo;
    setProductBudget(_product, _productBudget);
    }
    
    function setProductBudget(string memory _product, uint _budget) public {
        if(strComp(_product, products[msg.sender][0].productId)) {
            products[msg.sender][0].productBudget = _budget;
            productList[_product].productBudget = _budget;
        }
       
    }
    
    
    function getStdCostPlan(string memory _product) public view returns(Cost memory) {
        return standardProductCosts[_product];
    }
    
    function getStdBudgetUnits(string memory _product) public view returns (uint units ) {
        return standardBudgetUnits[_product];
    }
    
    function setActualCost(
    
    string memory _product,
    uint _unitsNo,
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
            totalDirectCost: _actualMatCost + _actualPkgMatCost + _actualLaborCost,
            marketingCost: _actualMrkCost,
            researchCost: _actualRsrchCost,
            directLaborCost: _actualLaborCost,
            totalIndirectCost: _actualIndirectCost,
            CostTOT: _actualMatCost + _actualPkgMatCost + _actualLaborCost + _actualIndirectCost
                     + _actualMrkCost + _actualRsrchCost
        });
        
        actualProductCosts[_product] = actualCosts;
        actualBudgetUnits[_product] = _unitsNo;
        emit ProductStateUpdate(
        _product,
        productList[_product].productName,
        productList[_product].manufacturer,
        'PRODUCTION-READY',
        block.timestamp
        );
    }
    
    function getActualCost(string memory _product) public view returns(Cost memory) {
        
        return actualProductCosts[_product];
    }
    
    function getActualBudgetUnits(string memory _product) public view returns(uint units ) {
        return actualBudgetUnits[_product];
    }
    
    
    function setFlexibleBudgetUnits(string memory _product, uint _unitsNo) public {
        flexibleBudgetUnits[_product] = _unitsNo;
    }
    
    function getFlexibleBudgetUnits(string memory _product) public view returns(uint units) {
        return flexibleBudgetUnits[_product];
    }
    
    function setFlexibleCosts(
    string memory _product,
    uint _avgMatUnitCost,
    uint _avgPkgUnitCost,
    uint _avgLaborUnitCost,
    uint _avgIndirectManuUnitCost,
    uint _flexibleMrkCost,
    uint _flexibleRsrchCost)
    public {
        uint flexibleUnits = flexibleBudgetUnits[_product];
        Cost memory flex = Cost ({
            directMaterialCost: _avgMatUnitCost*flexibleUnits,
            packagingMaterialCost: _avgPkgUnitCost*flexibleUnits,
            totalDirectCost: (_avgMatUnitCost*flexibleUnits) +(_avgPkgUnitCost*flexibleUnits) + (_avgLaborUnitCost*flexibleUnits),
            marketingCost: _flexibleMrkCost,
            researchCost: _flexibleRsrchCost,
            directLaborCost:  _avgLaborUnitCost*flexibleUnits,
            totalIndirectCost: _avgIndirectManuUnitCost*flexibleUnits,
            CostTOT: (_avgMatUnitCost*flexibleUnits) +(_avgPkgUnitCost*flexibleUnits) + (_avgLaborUnitCost*flexibleUnits)
                     + (_avgIndirectManuUnitCost*flexibleUnits)
                     + _flexibleMrkCost + _flexibleRsrchCost
        });
        
        flexibleProductCosts[_product] = flex;
        
    }
    
    function getFlexibleCosts(string memory _product) public view returns (Cost memory) {
        return flexibleProductCosts[_product];
    }
    
    // END OF  COST ACCOUNTING STUF
    // SUPPLYING STUFF GOES HERE
    
    // Creation of Material By Supplier
    
    function createMaterial(
    
    string memory _id,
    string memory _name,
    uint          _str,
    string memory _form,
    uint          _amount,
    uint          _unitCost
    
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
        materialList[_id] = mat;
        materialArr.push(mat);
        addToInventory(msg.sender, _id , _amount);
        
    }
    
    
    function getMaterialsBySupplier(address _supplier) public view returns(Material[] memory ) {
        return materials[_supplier];
    }
    
    
    // Materials to filter through
    
    function getMaterials() public view returns(Material[] memory) {
        return materialArr;
    }
    
    function getMaterialById (string memory _materialId) public view returns(Material memory) {
        return materialList[_materialId];
    }
    

    function createRequest(
    
    address _to ,
    string memory _materialId,
    uint _amount 
    )
    public {
        trackNoCount += 1573;
        Request memory req = Request({
           requestId: trackNoCount,
           fromParti: msg.sender,
           toParti: _to,
           materialID : _materialId,
           amount: _amount,
           issueTime: block.timestamp
        });
        
        requestCost[req.requestId] = req.amount * materialList[_materialId].unitCost; 
        requests[msg.sender].push(req);
        requestList[req.requestId] = req;
        emit requestStateUpdate(msg.sender, block.timestamp , 'REQUEST CREATED');
    }
    
    function createBatchRequest(
    address _fromParti2,
    address _to,
    string memory _materialId,
    uint _amount
    ) 
    public {
        trackNoCount += 2256;
        BatchRequest memory batchReq = BatchRequest({
            requestId: trackNoCount,
            fromParti1: msg.sender,
            fromParti2: _fromParti2,
            toParti: _to,
            materialID: _materialId,
            amount: _amount,
            issueTime: block.timestamp
        });
        
        requestCost[batchReq.requestId] = batchReq.amount * materialList[_materialId].unitCost;
        batchRequestsList[batchReq.requestId] = batchReq;
        batchRequests[msg.sender].push(batchReq);
        emit requestStateUpdate(msg.sender, block.timestamp , 'BATCH REQUEST CREATED');
        
    }
    
    function getRequestCost(uint _id) public view returns(uint) {
        return requestCost[_id];
    }
    
    function getMyRequests() public view returns (Request[] memory) {
        
        return requests[msg.sender];
    }
    
    function getMyBatchRequests() public view returns (BatchRequest[] memory) {
        return batchRequests[msg.sender];
    }
    
    function getRequestById(uint _id) public view returns (Request memory) {
        return requestList[_id];
    }
    
    function addToInventory(address _participant , string memory _item , uint _amount) public {
        InventoryItem memory itm = InventoryItem({
            itemId: _item,
            amount: _amount
        });
        
        inventory[_participant].push(itm);
        inventoryList[_item] = itm;
    }
    
    function updateInventory(address _participant , string memory _item , uint _amount) public {
        
        if(strComp(_item, inventory[_participant][0].itemId) ) {
            inventory[_participant][0].amount = _amount;
            inventoryList[_item].amount = _amount;
            
        }
    }
    
    function getInventory(address _participant) public view returns (InventoryItem[] memory) {
        return inventory[_participant];
    }
    
    // function getInventoryList(string memory _item) public view returns (InventoryItem memory) {
    //     return inventoryList[_item];
    // }
    
    // END OF SUPPLYING STUFF
    // BANKING STUFF GOES HERE
    // functions that has 'self' word are invokable by msg.sender
    // other functions should require admin / bank control of execution
    
    function setAsBank(address _addr) public {
        bank = _addr;
        
    }
    
    function getBank() public view returns (address) {
        return bank;
    }
    
    function createBankAccount(address _userAddr, string memory _userName) public {
        
        BankAccount memory account = BankAccount({
            
            userId:  _userAddr,
            userName: _userName,
            userBalance: 0,
            isActive: true
            
        });
        
        userBankAccounts[bank][_userAddr] = account;
        
    }
    
    function hasBankAccount(address _userAddr) public view returns (bool) {
        if (userBankAccounts[bank][_userAddr].isActive != false) {
            return true;
        }
        else {
            return false;
        }
    }
    
    function deposit (address _userAddr, uint _amount) public returns (bool) {
        
        require (_amount > 0, 'INVALID');
        if ( userBankAccounts[bank][_userAddr].userId == _userAddr) {
            uint balance = userBankAccounts[bank][_userAddr].userBalance;
            balance += _amount;
            userBankAccounts[bank][_userAddr].userBalance = balance;
            emit BankTransact ('DEPOSIT', _userAddr , _userAddr , _amount , block.timestamp);
            return true;
        }
        else {
            return false;
        }
        
    }
    
    function withdraw (address _userAddr, uint _amount) public returns (bool) {
        
        require(userBankAccounts[bank][_userAddr].userBalance > _amount , 'INSUFFICIENTBAL' );
        if (userBankAccounts[bank][_userAddr].userId == _userAddr) {
            
            uint balance = userBankAccounts[bank][_userAddr].userBalance;
            balance -= _amount;
            userBankAccounts[bank][_userAddr].userBalance = balance;
            emit BankTransact ('WITHDRAWAL', _userAddr , _userAddr , _amount , block.timestamp);
            return true;
        }
        else {
            return false;
        }
    }

    function getBalance (address _userAddr) public view returns (uint x) {
        
         if (userBankAccounts[bank][_userAddr].userId == _userAddr) {
             uint balance = userBankAccounts[bank][_userAddr].userBalance;
             return balance;
        }
    }

    
    function transfer (address _from, address _to , uint _amount) public returns (bool) {
        
         require(userBankAccounts[bank][_from].userBalance >= _amount ,
         'INSUFFICIENTBAL' );
         
        if (userBankAccounts[bank][_from].userId == _from && userBankAccounts[bank][_to].isActive == true) {
            
            uint fromBalance = userBankAccounts[bank][_from].userBalance;
            uint toBalance = userBankAccounts[bank][_to].userBalance;
            fromBalance -= _amount;
            toBalance += _amount;
            userBankAccounts[bank][_from].userBalance = fromBalance;
            userBankAccounts[bank][_to].userBalance = toBalance;
            emit BankTransact ('TRANSFER', _from , _to , _amount , block.timestamp);
            return true;
        }
        else {
            return false;
        }
        
    }
    
    function getAccountDetails(address _account) public view returns (BankAccount memory) {
        return userBankAccounts[bank][_account];
    }
    
    
    // END OF BANKING STUFF
    // TRACKING STUFF GOES HERE
    // TRACKING STEPS:
    // 1- REQUEST IS CREATED
    // 2- SUPPLIER APPROVE REQUEST AND ASSIGNS SHIPMENT LOCATION 
    // 3- SUPPLIER CREATE AND SEND SHIPMENT FOR GLOBAL TRANSMISSION
    // 4- GLOBAL TRANSMISSION SHIPS PACKAGE FOR LOCAL TRANSMISSION
    // 5- LOCAL TRANSMISSION SHIPS PACKAGE TO FINAL DESTINATION (MANUFACTURER)
    // TEMP AND HUMIDITY READINGS ARE SET DURING ALL PHASES OF SHIPMENT TRANSMISSION.
    
    //supplier
    function approveRequest(uint _requestId) public {
        createLog(_requestId, 'REQUEST APPROVED', 'NORMAL' , 'YOUR REQUEST IS BEING PROCESSED.' );
        emit requestStateUpdate(msg.sender, block.timestamp , 'REQUEST APPROVED');
        uint payment = requestCost[_requestId]/2;
        transfer(requestList[_requestId].fromParti, msg.sender, payment);
    }
    
 
    function verifyShipmentState(uint _id) public returns (string memory) {
        
        string memory status;
        
        if(tempArr[tempArr.length-1] >= tempThreshold || humidArr[humidArr.length-1] >= humidityThreshold) {
            
            status = 'ABNORMAL';
             emit ShipmentStateUpdate (_id, status , block.timestamp);
            
        } else {
            
            status = 'NORMAL';
             emit ShipmentStateUpdate (_id, status , block.timestamp);
        }
          return status;
    }
    
 
    // supplier 
    function sendShipment(uint _requestId) public {
        string memory x = inventoryList[requestList[_requestId].materialID].itemId;
        string memory y = requestList[_requestId].materialID;
        uint newAmount = inventoryList[requestList[_requestId].materialID].amount - requestList[_requestId].amount;
        string memory result = verifyShipmentState(_requestId);
        
        createLog(_requestId, 'PACKAGE CREATED',  result , 'PACKAGE IS CREATED AND SHIPMENT IS READY TO LEAVE FOR SHPPING.' );
        emit requestStateUpdate(msg.sender, block.timestamp , 'PACKAGE CREATED');
        
        createLog (_requestId, 'OUT FOR SHIPPING', result , ' YOUR SHIPMENT IS OUT FOR SHIPPING'); 
        emit requestStateUpdate(msg.sender, block.timestamp , 'PACKAGE IS OUT FOR SHIPPING');
        
        if(strComp(x,y)) {
            updateInventory(msg.sender,requestList[_requestId].materialID, newAmount);
        }
        
    }
    
    // global distributor
    function globalTransitShipment(uint _requestId) public {
        
        string memory result = verifyShipmentState(_requestId);
        
        createLog (_requestId, 'SHIPPING PACKAGE', result , ' YOUR SHIPMENT IS CURRENTLY IN TRANSIT.');
        emit requestStateUpdate(msg.sender, block.timestamp , 'IN GLOBAL TRANSIT');
        
    }
    
    //local distributor
    function localTransitShipment(uint _requestId) public {
        
         string memory result = verifyShipmentState(_requestId);
         
        createLog (_requestId, 'READY FOR DELIVERY', result , 'YOUR SHIPMENT IS SET FOR DELIVERY AND IS EXPECTED TO ARRIVE SOON.');
        emit requestStateUpdate(msg.sender, block.timestamp , 'IN LOCAL TRANSIT');
        
    }
     
    //manufacturer
    
    function receiveShipment(uint _requestId) public {
        string memory x = inventory[msg.sender][0].itemId;
        string memory y = requestList[_requestId].materialID;
        uint newAmount = inventoryList[requestList[_requestId].materialID].amount + requestList[_requestId].amount;
        
        string memory result = verifyShipmentState(_requestId);
        createLog(_requestId, 'DELIVERED' , result , 'YOUR SHIPMENT IS DELIVERED SUCCESSFULLY.');
        emit requestStateUpdate(msg.sender, block.timestamp , 'SHIPMENT DELIVERED');
        
        uint payment = requestCost[_requestId] - requestCost[_requestId]/2;
        transfer(requestList[_requestId].fromParti, msg.sender, payment);
        
       
        if(strComp(x,y)) {
            updateInventory(msg.sender,requestList[_requestId].materialID, newAmount);
        } else {
             addToInventory(msg.sender,requestList[_requestId].materialID, newAmount);
        }
    }
    
    
    function createLog(
    uint _requestId,
    string memory _requestStatus,
    string memory _shipmentStatus,
    string memory _description
    
    ) public  {
        
        Log memory myLog = Log({
            logger: msg.sender,
            requestStatus: _requestStatus,
            shipmentStatus: _shipmentStatus,
            description: _description,
            logTime: block.timestamp
        });
        
        trackLogs[_requestId].push(myLog);
        emit requestStateUpdate(msg.sender, block.timestamp , _requestStatus);
    }
    
    function setShipmentTrackData (uint _id, uint _temp , uint _humid) public {
        
        tempDataLogs[_id].push(_temp);
        tempArr.push(_temp);
        humidDataLogs[_id].push(_humid);
        humidArr.push(_humid);
        emit DataSent(_id ,'Sensors Data', concat(toString(_temp),toString(_humid)), block.timestamp);
        if(_temp >= tempThreshold || _humid >= humidityThreshold) {
            emit ShipmentStateUpdate (_id, 'ABNORMAL' , block.timestamp);
        } else {
             emit ShipmentStateUpdate (_id, 'NORMAL' , block.timestamp);
        }
    }
    
    function getShipmentTrackData (uint _id) public view returns (uint[] memory temp, uint[] memory humid) {
        return (tempDataLogs[_id],humidDataLogs[_id]);
        
    }
    
    function getTrackLogs(uint _request) public view returns(Log[] memory) {
        return trackLogs[_request];
    }
    
    
    function setShipmentLocation (uint _id, string memory _lat , string memory _long) public {
        Location memory loc = Location({
            Latitude: _lat,
            Longitude: _long
        });
        
        requestLocations[_id].push(loc);
    }
    
    function getShipmentLocation (uint _id) public view returns (Location[] memory) {
        return requestLocations[_id];
    }
    
    function setShipmentMethod(uint _id , string memory _method) public {
        requestShipmentMethod[_id] = _method;
    }
    
    function getShipmentMethod(uint _id) public view returns (string memory) {
        return requestShipmentMethod[_id];
    }
    
    // END OF TRACKING STUFF
// END OF CONTRACT

}
// "SPDX-License-Identifier: UNLICENSED"
// EVERYTHING EXCEPT TRACKING GOES HERE
pragma solidity >=0.6.2;
pragma experimental ABIEncoderV2;  

  interface PharmaChainInterface {
         function   strComp(string memory x , string memory y ) external pure returns (bool);
         event      requestStateUpdate  (address indexed who, uint indexed timestamp , string  state);
         event      BankTransact        (string txName, address indexed _from , address  _to , uint _amount , uint indexed timestamp);
    }


contract PharmaChain {
    
  
// CONTRACT CONTENT GOES HERE
    
    // UTILS
    
    function strComp(string memory x , string memory y ) public pure returns (bool){
        
        return (keccak256(abi.encodePacked((x))) == keccak256(abi.encodePacked((y))));
        
    }
    
    // END OF UTILS

    
    uint        trackNoCount = 0;
    address     admin;
    address     bank;
    Material[]  materialArr;
    Product[]   productArr;
    mapping (address => bool)               participants;
    mapping (address => Product[])          products;    // manufacturer and product
    mapping (string => Specs[])             productSpecs; // productID and material 
    mapping (string => uint)                stdMaterialQty; // std mateiral qty used in product (id) unit
    mapping (string => uint)                actMaterialQty; //  actual material qty used in product (id) unit 
    mapping (string => Product)             productList; // product by id
    mapping (string => string[])            productPhase; // product id and phases;
    mapping (address => Material[])         materials;   //Participant(supplier) and material
    mapping (string => Material)            materialList; // materials by id
    mapping (address => Request[])          requests;   // participant and requests
    mapping (uint => Request)               requestList; // requests by id
    mapping (address => BatchRequest[])     batchRequests; //participant and batch requests
    mapping (uint => BatchRequest)          batchRequestsList; // request id
    mapping (string => Cost)                standardProductCosts;
    mapping (string => Cost)                actualProductCosts;
    mapping (string => Cost)                flexibleProductCosts;
    mapping (string => uint)                standardBudgetUnits;
    mapping (string => uint)                actualBudgetUnits;
    mapping (string => uint)                flexibleBudgetUnits;
    mapping (uint => uint)                  requestCost;    // requestId and Cost
    mapping (address => InventoryItem[])    inventory;   // participant and items inventory
    mapping (string => InventoryItem)       inventoryList;   // inventory item by item id
    mapping (address => mapping (address => BankAccount) ) userBankAccounts; // bankAddr -> userAddr -> userAcc
    event   requestStateUpdate  (address indexed who, uint indexed timestamp , string  state);
    event   BankTransact        (string txName, address indexed _from , address  _to , uint _amount , uint indexed timestamp);
    
    struct BankAccount {
    
        address userId;
        string  userName;
        uint    userBalance;
        bool    isActive;
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
        uint    materialStrength;
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
        uint    requestId;
        address fromParti1;
        address fromParti2;
        address toParti;
        string  materialID;
        uint    amount;
        uint    issueTime;
    }
    
    // Cost Per Product Unit 
    struct Cost {
        uint directMaterialCost;
        uint packagingMaterialCost;
        uint materialCostPerUnit; // cost per unit material
        uint marketingCost;
        uint researchCost;
        uint directLaborCost;
        uint ratePerWorkHr; // rate per work hour
        uint workHrs;       // no of work hours
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
    
    function emitRequestStateEvent(string memory _state) public {
         emit requestStateUpdate(msg.sender, block.timestamp , _state);
    }
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
        setProductPhase(_id, 'UNDER-RESEARCH');
    
        
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
        setStdMaterialQty(_productID);
        setProductPhase(_productID , 'REGISTERED');
        
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
    
    function setProductPhase(string memory _product , string memory _phase) public {
        productPhase[_product].push(_phase);
    }
    
    function getProductPhase(string memory _product) public view returns (string[] memory phases) {
       return productPhase[_product];
    }
    
    // END OF MANUFACTURING STUFF
    // COST ACCOUNTING STUFF GOES HERE
    
    function setStdCostPlan(
    
    string  memory _product,
    uint    _unitsNo,
    uint    _unitMaterialCost,
    uint    _pkgMatCost,
    uint    _ratePerHr,
    uint    _workHrsNo,
    uint    _totIndirectCosts,
    uint    _mrkCost,
    uint    _rsrchCost,
    uint    _productBudget
    
        ) public {
    
    // uint directTotal =  _directMatCost + _pkgMatCost +  _directLaborCost;
    uint matAmount = getStdMaterialQty(_product);
    // uint total = _directMatCost + _pkgMatCost +  _directLaborCost + _totIndirectCosts + _mrkCost  + _rsrchCost;
    Cost memory stdCosts = Cost({
        directMaterialCost: matAmount * _unitMaterialCost,
        ratePerWorkHr: _ratePerHr,
        materialCostPerUnit: _unitMaterialCost,
        workHrs: _workHrsNo,
        directLaborCost: _ratePerHr * _workHrsNo,
        totalIndirectCost: _totIndirectCosts,
        totalDirectCost: 0,
        packagingMaterialCost: _pkgMatCost,
        marketingCost: _mrkCost,
        researchCost: _rsrchCost,
        CostTOT: 0
       
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
    
    function setStdMaterialQty(string memory _product) public {
        stdMaterialQty[_product] = productSpecs[_product][0].materialAmount;
    }
    
    
    function getStdCostPlan(string memory _product) public view returns(Cost memory) {
        return standardProductCosts[_product];
    }
    
    function getStdBudgetUnits(string memory _product) public view returns (uint units ) {
        return standardBudgetUnits[_product];
    }
    
    function getStdMaterialQty(string memory _product) public view returns (uint) {
        return stdMaterialQty[_product];
    }
    
    function setActualCost(
    
    string memory _product,
    uint _unitsNo,
    uint _actualPkgMatCost,
    uint _unitMaterialCost,
    uint _actualRatePerHr,
    uint _actualWorkHrsNo,
    uint _actualIndirectCost,
    uint _actualMrkCost,
    uint _actualRsrchCost
    
    ) public {
         uint matAmount = getActualMaterialQty(_product);
        // uint actDirectTotal =  _actualMatCost + _actualPkgMatCost + _actualLaborCost;
        // uint actTotal =  _actualMatCost + _actualPkgMatCost + _actualLaborCost + _actualIndirectCost + _actualMrkCost + _actualRsrchCost;
        Cost memory actualCosts = Cost({
            directMaterialCost: matAmount * _unitMaterialCost,
            packagingMaterialCost: _actualPkgMatCost,
            materialCostPerUnit: _unitMaterialCost,
            totalDirectCost: 0,
            ratePerWorkHr: _actualRatePerHr,
            workHrs: _actualWorkHrsNo,
            marketingCost: _actualMrkCost,
            researchCost: _actualRsrchCost,
            directLaborCost: _actualRatePerHr * _actualWorkHrsNo,
            totalIndirectCost: _actualIndirectCost,
            CostTOT: 0
        });
        
        actualProductCosts[_product] = actualCosts;
        actualBudgetUnits[_product] = _unitsNo;
        setProductPhase(_product, 'PRODUCTION-READY');
    }
    
    
    function getActualCost(string memory _product) public view returns(Cost memory) {
        
        return actualProductCosts[_product];
    }
    
    function setActualMaterialQty (string memory _product , uint _amount) public {
        actMaterialQty[_product] = _amount;
    }
    
    function getActualMaterialQty (string memory _product) public view returns (uint) {
        return actMaterialQty[_product];
    }
    
    function getActualBudgetUnits(string memory _product) public view returns(uint units ) {
        return actualBudgetUnits[_product];
    }
    
    function setFlexibleCosts(
    string memory _product,
    uint _unitsNo,
    uint _pkgUnitCost,
    uint _unitMaterialCost,
    uint _ratePerHr,
    uint _workHrsNo,
    uint _indirectManuUnitCost,
    uint _flexibleMrkCost,
    uint _flexibleRsrchCost)
    public {
        
         uint matAmount = getStdMaterialQty(_product);
        // uint directTotal =  _matUnitCost + _pkgUnitCost +  _laborUnitCost;
        // uint total = _matUnitCost + _pkgUnitCost +  _laborUnitCost + _indirectManuUnitCost + _flexibleMrkCost  + _flexibleRsrchCost;
        Cost memory flex = Cost ({
            directMaterialCost: matAmount * _unitMaterialCost,
            packagingMaterialCost: _pkgUnitCost,
            totalDirectCost: 0,
            ratePerWorkHr: _ratePerHr,
            workHrs: _workHrsNo,
            materialCostPerUnit: _unitMaterialCost,
            marketingCost: _flexibleMrkCost,
            researchCost: _flexibleRsrchCost,
            directLaborCost:  _ratePerHr * _workHrsNo,
            totalIndirectCost: _indirectManuUnitCost,
            CostTOT: 0
        });
        
        flexibleProductCosts[_product] = flex;
        flexibleBudgetUnits[_product] = _unitsNo;
        
    }
    
    function getFlexibleCosts(string memory _product) public view returns (Cost memory) {
        return flexibleProductCosts[_product];
    }
    
    function getFlexibleBudgetUnits(string memory _product) public view returns(uint units) {
        return flexibleBudgetUnits[_product];
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
        trackNoCount += 1;
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
        trackNoCount += 1;
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
    
    function getInventoryItemById(string memory _item) public view returns (InventoryItem memory) {
        return inventoryList[_item];
    }
    
    // END OF SUPPLYING STUFF
    // BANKING STUFF GOES HERE
    
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
// END OF CONTRACT

}
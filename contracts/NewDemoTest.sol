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
    address payable bank;
    uint    requestCount = 0;
    enum    Role                     {MANUFACTURER, SUPPLIER, DISTRIBUTOR, DRUG_AUTHORITY , BANK}
    mapping (address => bool)        participants;
    mapping (address => Product[])   products;    // manufacturer and product
    mapping (string => Specs[])      productSpecs; // productID and material  
    mapping (address => Material[])  materials;   //Participant(supplier) and material
    mapping (string => Material)     materialList; // materials by name
    mapping (address => Request[])   requests;   // participant and requests
    mapping (uint => Log[])          trackLogs; //requestId and Log
    mapping (string => Cost)         standardProductCosts;
    mapping (string => Cost)         actualProductCosts;
    mapping (uint => uint)           requestCost;    // requestId and Total Cost.
    mapping (address => mapping (address => BankAccount) ) userBankAccounts; // bankAddr -> userAddr -> userAcc
    
    Material[] public  materialArr;
    
    
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

    // COST ACCOUNTING STUFF GOES HERE
    
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
    
    // END OF  COST ACCOUNTING STUFF
    
    // Creation of Material By Supplier
    
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
        materialList[_name] = mat;
        materialArr.push(mat);
        
        
    }
    
    // TODOO : * Search Materials By Name and Type (e.g. Vitamin-a , active )
    // * send material supplier a request.
    // * calculate request cost and pay half the total cost in advance in case of request approval
    
    function getMaterialsBySupplier(address _supplier) public view returns(Material[] memory ) {
        return materials[_supplier];
    }
    

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
    
        
    // BANKING STUFF GOES HERE 
    
    // functions that has 'self' word are invokable by msg.sender
    // other functions should require admin / bank control of execution
    
    function setAsBank(address payable _addr) public {
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
    
     function selfCreateBankAccount(string memory _userName) public {
        
       createBankAccount(msg.sender, _userName);
        
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
        
        require (_amount > 0, 'Enter A Valid Deposit Amount!');
        if ( userBankAccounts[bank][_userAddr].userId == _userAddr) {
            uint balance = userBankAccounts[bank][_userAddr].userBalance;
            balance += _amount;
            userBankAccounts[bank][_userAddr].userBalance = balance;
            return true;
        }
        else {
            return false;
        }
        
    }
    
    function selfDeposit (uint _amount) public returns (bool) {
        
       return deposit(msg.sender, _amount);
        
    }
    
    function withdraw (address _userAddr, uint _amount) public returns (bool) {
        
        require(userBankAccounts[bank][_userAddr].userBalance > _amount , 'Not Enough Balance!' );
        if (userBankAccounts[bank][_userAddr].userId == _userAddr) {
            
            uint balance = userBankAccounts[bank][_userAddr].userBalance;
            balance -= _amount;
            userBankAccounts[bank][_userAddr].userBalance = balance;
            return true;
        }
        else {
            return false;
        }
    }
    
    function selfWithdraw (uint _amount) public returns (bool) {
        
       return withdraw(msg.sender, _amount);
    }
    
    function getBalance (address _userAddr) public view returns (uint x) {
        
         if (userBankAccounts[bank][_userAddr].userId == _userAddr) {
             uint balance = userBankAccounts[bank][_userAddr].userBalance;
             return balance;
        }
    }
    
    function selfGetBalance () public view returns (uint x) {
        
        return getBalance(msg.sender);
    }
    
    function transfer (address _from, address _to , uint _amount) public returns (bool) {
        
         require(userBankAccounts[bank][_from].userBalance >= _amount ,
         'Not Enough Balance to Transfer This Amount!' );
         
        if (userBankAccounts[bank][_from].userId == _from && userBankAccounts[bank][_to].isActive == true) {
            
            uint fromBalance = userBankAccounts[bank][_from].userBalance;
            uint toBalance = userBankAccounts[bank][_to].userBalance;
            fromBalance -= _amount;
            toBalance += _amount;
            userBankAccounts[bank][_from].userBalance = fromBalance;
            userBankAccounts[bank][_to].userBalance = toBalance; 
            return true;
        }
        else {
            return false;
        }
        
    }
    
     function selfTransfer (address _to , uint _amount) public returns (bool) {
        
         require(userBankAccounts[bank][msg.sender].userBalance >= _amount ,
         'You Do Not Have Enough Balance to Transfer This Amount!' );
         
        if (userBankAccounts[bank][msg.sender].userId == msg.sender
            && userBankAccounts[bank][_to].isActive == true)
        {
            uint fromBalance = userBankAccounts[bank][msg.sender].userBalance;
            uint toBalance = userBankAccounts[bank][_to].userBalance;
            fromBalance -= _amount;
            toBalance += _amount;
            userBankAccounts[bank][msg.sender].userBalance = fromBalance;
            userBankAccounts[bank][_to].userBalance = toBalance; 
            return true;
        }
        
        else {
            
            return false;
        }
        
    }
    
    
    function getAccountDetails(address _account) public view returns (BankAccount memory) {
        return userBankAccounts[bank][_account];
    }
    
    function selfGetAccountDetails() public view returns (BankAccount memory) {
        return userBankAccounts[bank][msg.sender];
    }
    
    // END OF BANKING STUFF
    
    // TRACKING STUFF GOES HERE
    
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
    
    
    // END OF TRACKING STUFF
    
    
}
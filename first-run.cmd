@ECHO OFF
ECHO FIRST-RUN.CMD IS USED TO SETUP YOUR PROJECT FILES PROPERLY FOR THE FIRST-TIME USE.
ECHO SETTING UP THE PROJECT 
ECHO.
ECHO 1- SETTING UP FILES AND DEPENDENCIES
ECHO ---------------------------
cd client
CALL npm i --save
ECHO.
ECHO DEPENDENCIES SET SUCCESSFULLY.
ECHO 2- SETTING UP SMART CONTRACTS
ECHO ---------------------------
cd .. 
CALL truffle migrate --reset --network mobile_develop
ECHO SMART CONTRACTS SET SUCCESSFULLY.
ECHO PROJECT IS ALL SET, TO RUN YOUR APPLICATION EXECUTE RUN.CMD
ECHO.
cmd /k


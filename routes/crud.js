var express = require('express');
var router = express.Router();
var Datastore = require('nedb')
, db = new Datastore({ filename: './data_files/dashboard.js', autoload: true });




router.get('/publishToCloud', function(request, response){
   var csvFilePath   ='./Data file_v1_2020-07-31T14_37_47.407Z.csv'
  var  jsonArray;
  var convertedData;
  var csvresult;
// Convert a csv file with csvtojson
// Parse large csv with stream / pipe (low mem consumption)
//converting the csv file to json
csv()
.fromFile(csvFilePath)
.then(function(convertedData){ //when parse finished, result will be emitted here.
 console.log("convertedData.length : "+convertedData.length);
 //cooking the 1st file
 //const obj = JSON.parse(convertedData);
 let file1=[];
 let quantity;
 for (i=0;i<convertedData.length;i++)
 {
    if(convertedData[i].quantity_uom=="NULL")
    {
       quantity="EACH";
    }
    else
    {
       quantity=  convertedData[i].quantity_uom;
    };
   // var item_number=convertedData
    file1.push({"transaction_type":"SYNC",
                "batch_id":"",
                "batch_number":"",
                "item_number":convertedData[i].DSID,
                "outside_process_service_flag":"",
                "org_code":"CLOUD_ITEM_MASTER",
                "description":convertedData[i].part_description,
                "template_name" : "Purchased Item",
                "source_system_code":"",
                "source_system_ref":"Design Source Conversion",
                "source_sys_ref_desc":"",
                "item_class_name": convertedData[i].product_family,
                "primary_uom": quantity,
                "life_cycle_phase":"Production",
                "item_status":"Active"
                });
       const jsonexport = require('jsonexport');
       jsonexport(file1, function(err, csv){
          if (err) return console.error(err);
          console.log(csv);
          csvresult=csv;      
      });
   // file1[i].transaction_type='SYNC';
   // convertedData[i].transaction_type='SYNC';
 };
   // break the textblock into an array of lines
   var lines = csvresult.split('\n');
   // remove one line, starting at the first position
   lines.splice(0,1);
   // join the array back into a single string
   var newtext = lines.join('\n');
   const fs = require('fs');

fs.writeFile("./data_files/outbound/EgpSystemItemsInterface.csv", newtext, function(err) {
  if(err) {
      return console.log(err);
  }
  console.log("The file was saved!");
}); 
   response.send(newtext);
});
});

router.get('/publishToCloud/:fileName', function (req, res, next) {
 var base64 = require('file-base64');
 var filePath='./data_files/download/'+req.params.fileName;
 base64.encode(filePath, function(err, base64String) {
 console.log('base64String' + base64String);
 var request = require('request'),
 username = "nnarayana@DELOITTE.com",
 password = "Welcome@12345",
 url = "https://eiiv-dev10.fa.us6.oraclecloud.com/fscmRestApi/resources/11.13.18.05/erpintegrations",
 auth = "Basic " + Buffer.from(username + ":" + password).toString("base64");
 var bodyinput={
    "OperationName":"importBulkData",	
    "DocumentContent":base64String,
    "ContentType":"zip",
    "FileName":req.params.fileName,
    "DocumentAccount":"scm$/item$/import$",
    "JobName":"/oracle/apps/ess/scm/productModel/items,ItemImportJobDef",
    "ParameterList":"#NULL,#NULL,#NULL,#NULL,#NULL",
    "CallbackURL":"http://192.168.1.101:4300/response"
};

request.post(
 {
     url : url,
     body:bodyinput,
     json:true,
     headers : {
         "Authorization" : auth
     }
 },
 function (error, response, body) {
     // Do more stuff with 'body' here
     console.log("body :" + body );
     console.log("response :" + response );
     console.log("error :" + error );
    
     if (error) { res.send(error)};
     if (response.statusCode = 201)
     { res.send(body);}
     else
     {res.send(response);}
 }
);
 
 //res.send(base64String);
 });
});
router.get('/getFiles', function(req, res, next) {
    /*db.find({}, function (err, docs) {
        if (err) return next(err);
        console.log(docs);
        res.json(docs);
    });*/
    let Client = require('ssh2-sftp-client');
    let sftp = new Client();
    console.log('Process Started');
    sftp.connect({
       host: '129.213.113.127',
       port: 22,
       username: 'ftpscmo',
       password: 'Or@cle#12345'
    }).then(() => {
       return sftp.list('/home/ftpscmo/DesignSource/Data');
    }).then(data => {
      let remotePath = '/server/path/file.txt';
      let localPath = '/local/path/file.txt';
       for (var i = 0; i < data.length; i++) {
        console.log('File Name : ' + data[i].name);
       }
       //  console.log(data, 'the data info');
       res.send(data);
    }).catch(err => {
       console.log(err, 'catch error');
       res.send(err);
    });
 
});

router.post('/postFiles', function(req, res, next) {
  db.insert(req.body, function (err, docs) {
    if (err) return next(err);
     console.log('files inserted successfully' + JSON.stringify(req.body));
     res.json(docs);
  });
});
router.put('/postFtpDetails', function (req, res, next) {
   var Datastore = require('nedb');
   console.log("Started");
   db = new Datastore({ filename: './data_files/ftp_spec.js', autoload: true });
   //db.loadDatabase();
   db.ensureIndex({ fieldName: 'ftpName',unique:true });
      console.log("Inside the update");
   db.update({ftpName:req.body.ftpName},{ $set: { action: "UPDATE",ftpHost:req.body.ftpHost,ftpPort:req.body.ftpPort,userName:req.body.userName,password:req.body.password,path:req.body.path} },{}, function (err, docs) {
      if (err) 
      {
         //console.log('files updated successfully' + JSON.stringify(req.body));
         return res.json(err);
      }
      console.log('files updated successfully' + JSON.stringify(req.body));
      res.send('{"MSG":"SUCCESS"}');
   });
   db.persistence.compactDatafile();
});
router.delete('/postFtpDetails', function (req, res, next) {
   var Datastore = require('nedb');
   console.log("Started");
   db = new Datastore({ filename: './data_files/ftp_spec.js', autoload: true });
   //db.loadDatabase();
   db.ensureIndex({ fieldName: 'ftpName',unique:true });

     // db.loadDatabase();
   console.log("Inside the delete");
   db.remove({ftpName:req.body.ftpName},{}, function (err, docs) {
      if (err) 
      {
         //console.log('files updated successfully' + JSON.stringify(req.body));
         return res.json(err);
      }
      console.log('files delete successfully' + JSON.stringify(req.body));
      res.send('{"MSG":"SUCCESS"}');
   });
   db.persistence.compactDatafile();
});

router.post('/postFtpDetails', function (req, res, next) {
   var Datastore = require('nedb');
   console.log("Started");
   db = new Datastore({ filename: './data_files/ftp_spec.js', autoload: true });
   //db.loadDatabase();
   db.ensureIndex({ fieldName: 'ftpName',unique:true });
      db.loadDatabase();
   console.log("Inside the create");
   db.insert(req.body, function (err, docs) {
      if (err) 
      {
         //console.log('files updated successfully' + JSON.stringify(req.body));
         return res.json(err);
      }
      console.log('files inserted successfully' + JSON.stringify(req.body));
      res.send('{"MSG":"SUCCESS"}');
   });
   db.persistence.compactDatafile();
});

router.get('/getFtpDetails', function (req, res, next) {
      var Datastore = require('nedb');
      console.log("Started");
      db = new Datastore({ filename: './data_files/ftp_spec.js', autoload: true });
      //db.loadDatabase();
      db.find({ }, function (err, docs) {
         // docs is [{ planet: 'Mars', system: 'solar' }]
         res.send(docs);
       });
   }); 

router.get('/itemConvRefreshFiles/:ftpName', function (req, res, next) {
   var Datastore = require('nedb');
   var ftpSpec = new Datastore({ filename: './data_files/ftp_spec.js', autoload: true });
   // let ftpDetails;
   const getFtpDetails = new Promise((resolve, reject) => {
      ftpSpec.find({ "ftpName": req.params.ftpName }, function (err, doc) {
         console.log('ftp details', doc);
         return resolve(doc);
      });
   });
   const listFiles = () => {
      getFtpDetails
         .then((ftpDetails) => {
            console.log('ftpDetails Name :' + ftpDetails[0].ftpName);
            let Client = require('ssh2-sftp-client');
            let sftp = new Client();
            console.log('Process Started');
            sftp.connect({
               host: ftpDetails[0].ftpHost,
               port: ftpDetails[0].ftpPort,
               username: ftpDetails[0].userName,
               password: ftpDetails[0].password
            }).then(() => {
               return sftp.list(ftpDetails[0].path);
            }).then(data => {
               //  console.log(data, 'the data info');
               res.send(data);
            }).catch(err => {
               console.log(err, 'catch error');
               res.send(err);
            });
         })
         .catch(error => {
            console.log(error.message);
         });
   }
   listFiles();
});


async function prepareFBDI(jsonData,moveTo,sftp) {
   var newJsonData = [];
   var csvData;
 
   var quantity;
   for (i = 0; i < jsonData.length; i++) {
 
     if (jsonData[i].quantity_uom == "NULL") {
       quantity = "EACH";
     }
     else {
       quantity = jsonData[i].quantity_uom;
     };
 
     console.log('Creating FBDI data...')
 
     newJsonData.push({
       "TRANSACTION_TYPE": "SYNC",
       "BATCH_ID": "",
       "BATCH_NUMBER": "",
       "ITEM_NUMBER": jsonData[i].DSID,
       "OUTSIDE_PROCESS_SERVICE_FLAG": "",
       "ORG_CODE": "CLOUD_ITEM_MASTER",
       "DESCRIPTION": jsonData[i].part_description,
       "TEMPLATE_NAME": "Purchased Item",
       "SOURCE_SYSTEM_CODE": "",
       "SOURCE_SYSTEM_REF": "Design Source Conversion",
       "SOURCE_SYS_REF_DESC": "",
       "ITEM_CLASS_NAME": jsonData[i].product_family,
       "PRIMARY_UOM": quantity,
       "LIFE_CYCLE_PHASE": "Production",
       "item_status": "Active",
       "NEW_ITEM_CLASS": "",
       "ASSET_TRACKED": "",
       "ALLOW_MAINTENANCE": "",
       "ENABLE_GEN_FLAG": "",
       "ASSET_CLASS": "",
       "ASSET_ITEM_TYPE": "",
       "ACTIVITY_TYPE": "",
       "ACTIVITY_CLAUSE": "",
       "ACT_NOTIF_REQ": "",
       "SHUTDOWN_TYPE": "",
       "ACTIVITY_SOURCE": "",
       "COSTING_ENABLED": "",
       "STD_LOT_SIZE": "",
       "INV_ASSET_VALUE": "",
       "INCLUDE_ROLLUP": "",
       "ORDER_COST": "",
       "MIN_SUPPLY_DAYS": "",
       "FIXED_QTY": "",
       "MIN_ORDER": "",
       "AUTO_EXP_ASN": "",
       "CARRY_COST_PERCENT": "",
       "CONSIGNED": "",
       "FIXED_DAY_SUPPLY": "",
       "FIXED_LOT_SIZE": "",
       "FIXED_ORDER_QTY": "",
       "WINDOW_DAYS": "",
       "INV_PLAN_METHOD": "",
       "SAFETY_STOCK_PLAN": "",
       "DEMAND_PERIOD": "",
       "DAYS_OF_COVER": "",
       "MIN_MIN_MAX_QTY": "",
       "MAX_MIN_MAX_QTY": "",
       "MIN_ORD_QTY": "",
       "PLANNER": "",
       "MAKE_OR_BUY": "",
       "SOURCE_SUB_INV": "",
       "REPLENISHMENT_SOURCE": "",
       "RELEASE_AUTH_REQ": "",
       "SUB_COMPONENT": "",
       "FORECAST_TYPE": "",
       "MAX_ORDER": "",
       "MAX_DAY_SUPPLY": "",
       "SOURCE_ORG": "",
       "SUBINV_RESTRICTION": "",
       "RESTRICT_LOCATORS": "",
       "CHILD_LOT_ENABLE": "",
       "CHILD_LOT_PREFIX": "",
       "CHILD_LOT_START_NUM": "",
       "CHILD_LOT_FORMAT_VAL": "",
       "COPY_LOT_ATTRIBUTE": "",
       "EXPIRATION_aCTION": "",
       "EXPIRATION_ACT_INT": "",
       "STOCKED": "",
       "START_LOT_NUM": "",
       "LOT_EXP_CONTROL": "",
       "SHELF_LIFE_DAYS": "",
       "SERIAL_NUM_CONTROL": "",
       "SERIAL_STATUS_ENABLED": "",
       "REVISION_CONTROL": "",
       "RETEST_INT": "",
       "START_LOT_PREFIX": "",
       "START_SERIAL_PREFIX": "",
       "BULK_PICKED": "",
       "CHECK_MATERIAL_SHORT": "",
       "CYCLE_COUNT_ENABLE": "",
       "DEFAULT_GRADE": "",
       "GRADE_CONTROLLED": "",
       "HOLD_DAYS": "",
       "LOT_DIVISIBLE": "",
       "MATURITY_DAYS": "",
       "DEFAULT_LOT_STATUS": "",
       "DEFAULT_SERIAL_STATUS": "",
       "LOT_SPLIT_ENABLE": "",
       "LOT_MERGE_ENABLE": "",
       "INV_ITEM": "",
       "STOCK_LOC_CONTROL": "",
       "LOT_CONTROL": "",
       "LOT_STATUS_ENABLED": "",
       "LOT_SUB_ENABLED": "",
       "LOT_TRANS_ENABLED": "",
       "TRANS_ENABLED": "",
       "POS_MEASURE_ERROR": "",
       "NEGATIVE_MEASURE_ERROR": "",
       "CHILD_LOT_GEN": "",
       "RESERVABLE": "",
       "START_SERIAL_NUM": "",
       "INV_RULE": "",
       "OUTPUT_TAX_CLASS": "",
       "SALES_ACCOUNT": "",
       "PAYMENT_TERM": "",
       "INV_ENABLED": "",
       "INVOICED": "",
       "ACCOUNTING_RULE": "",
       "AUTOCREATE_CONFIG": "",
       "ASSEMBLE_TO_ORD": "",
       "PICK_COMP": "",
       "BASE_MODEL": "",
       "EFFECTIVE_CONTROL": "",
       "CREATE_CONFIG_ITEM": "", "MATCH_CONFIG": "",
       "CONFIG_MODEL_TYPE": "", "STRUCT_ITEM_TYPE": "",
       "MANU_LEAD_TIME": "", "REPROCESS_DAYS": "",
       "TOTAL_LEAD_TIME": "", "FIXED_LEAD_TIME": "",
       "VAR_LEAD_TIME": "", "PRO_DAY": "",
       "FORECAST_CONTROL": "", "CRITICAL_COMP": "",
       "ACCEPT_EARLY_DAYS": "", "CREATE_SUPPLY": "",
       "INV_DAYS": "", "INV_WINDOW": "",
       "MAX_INV_DAY": "", "MAX_INV_WIN": "",
       "DEMAND_TIME_FENCE": "", "DEMAND_TIME_DAY": "",
       "DIST_PLAN": "", "END_ASS": "",
       "EX_FROM_BUDGET": "",
       "CALCULATE_ATP": "", "PLAN_METHOD": "",
       "PLAN_INV_POINT": "", "PLAN_TIME_FENCE": "",
       "PLAN_TIME_FENCE_DAY": "", "PRE_POINT": "",
       "RELEASE_TIME_FENCE": "", "RELEASE_TIME_FENCE_DAYS": "",
       "REPAIR_LEAD_TIME": "", "REPAIR_YIELD": "",
       "REPAIR_PROG": "", "ROUND_ORD_QTY": "",
       "SHRINK_RATE": "", "SUB_WIN_cODE": "",
       "SUB_WIN_DAYS": "", "PACK_TYPE": "",
       "CONVERSION": "", "POS_DERIVATION": "",
       "NEG_DERIVATION": "", "USER_ITEM_TYPE": "",
       "LONG_DESC": "", "FORMAT_DESC": "",
       "PRICING_UOM": "", "DEFAULT_CONTROL": "",
       "SEC_UOM": "", "TRACKING_UOM": "",
       "ENG_ITEM_FLAG": "", "ATP_COMP": "",
       "CHECK_ATP": "", "OVER_SHIP_TOLERANCE": "",
       "UNDER_SHIP_TOLERANCE": "", "OVER_RET_TOLERANCE": "",
       "UNDER_RET_TOLERANCE": "", "DOWNLOAD": "",
       "ELEC_FORMAT": "", "OM_IND": "",
       "INTERNAL_ORDER_ENABLED": "", "ATP_RULE": "",
       "CHARGE_PERIODICITY": "", "CUST_ORD_ENABLED": "",
       "DEFAULT_SHIP_ORG": "", "DEFAULT_SO_TYPE": "",
       "EL_RULE": "", "FINANCING_aLLOW": "",
       "INT_ORD": "", "PICK_RULE": "",
       "RETURNABLE": "", "RMA_REQ": "",
       "SO_PROD_TYPE": "", "BTB_ENABLED": "",
       "SHIPPABLE": "", "SHIP_MOD_COMP": "",
       "OM_TRAN_ENABLED": "", "CUST_ORD": "",
       "UNIT_WEIGHT": "", "WEIGHT_UOM": "",
       "UNIT_VOL": "", "VOLUME_UOM": "",
       "DIM_UOM": "", "LENGTH1": "", "WIDTH1": "", "HEIGHT1": "",
       "COLL": "", "CONTAINER": "", "CONT_TYPE": "", "WAREHOUSE_EQUIP": "",
       "EVENT": "", "INT_VOLUME": "", "MAX_LOAD": "", "MIN_FILL": "",
       "VEHICLE": "", "CAS_NUM": "", "HAZARD_MAT": "", "PROC_COST_ENABLED": "",
       "PROCESS_EXEC_ENABLED": "", "PROCESS_QUALITY_ENABLED": "", "PROCESS_SUP_LOC": "",
       "PROC_SUP_SUB": "", "PRO_YIELD": "", "RECIPE_ENABLED": "", "EXP_aCCOUNT": "",
       "UN_NUM": "", "UNIT_ISSUE": "", "ROUND_FACTOR": "", "REC_PERCENT": "",
       "INPUT_TCC": "", "PURCHASED": "", "PTP": "", "OUT_aSS": "",
       "OUTPUT_TYPE": "", "NEG_rEQ": "", "USE_APP_SUPPLIER": "",
       "MATCH_APP_LEVEL": "", "INV_MATCH_OPTION": "", "LIST_PRICE": "",
       "INV_CLO_PER": "", "HAZARD_cLASS": "", "DEFAULT_BUYER": "",
       "TAXABLE": "", "PURCHASABLE": "", "OP_ITEM_ENABLED": "",
       "MARKET_PRICE": "", "ASSET_CAT": "", "ALLOW_PUR_DOC": "",
       "ALL_EXP": "", "ALLOW_SUB": "", "ALLOW_REC": "", "ALLOW_UN_REC": "",
       "DAYS_eaRLY_REC": "", "RECEIPT_ROUTE": "", "EN_SHIP": "", "QTY_rEC": "",
       "QTY_REC_TOLERANCE": "", "REC_DATE": "", "CREATE_FA": "", "SERVICE_START_TYPE": "",
       "TRACK_IB": "", "ENABLE_CSS": "", "CONT_ITEM_TYPE": "", "STD_COVERAGE": "",
       "ENABLE_dEFECT_TRACK": "", "INST_CLASS": "", "BILL_TYPE": "", "REC_PART": "",
       "EN_COVER": "", "ST_DELAY": "", "SERVICE_DURATION": "", "SERVICE_DUR_PERIOD": "",
       "SER_rEQ": "", "ALLOW_SUSPEND": "", "ALLOW_TERMINATE": "", "REQ_FULL": "",
       "REQ_ITEM_aSS": "", "SERVICE_START_DELAY": "", "SERVICE_DURATION_TYPE": "",
       "ENABLE_PROV": "", "ENABLE_SB": "", "ORD_WEB": "", "BACK_ORD": "", "WEB_sTATUS": "",
       "MIN_LIC_QTY": "", "BUILD_WIP": "", "CONT_MANU": "", "WIP_LOC": "", "WIP_TYPE": "",
       "WIP_SUB_INV": "", "OVER_TOLERANCE": "", "INV_PENALTY": "", "OP_SLACK_PENALTY": "",
       "REVISION": "", "STYLE_ITEM": "", "STYLE_ITEM_NUM": "", "VERSION_ST_DATE": "",
       "VER_REV_cODE": "", "VERSION_LABEL": "", "SERVICE_ST": "", "SALES_SUB_TYPE": "",
       "GLB_ATT_CATEGORY": "", "GLB_ATT1": "", "GLB_ATT2": "", "GLB_ATT3": "", "GLB_ATT4": "",
       "GLB_ATT5": "", "GLB_ATT6": "", "GLB_ATT7": "", "GLB_ATT8": "", "GLB_ATT9": "",
       "GLB_ATT10": "", "ATT_CATEGORY": "", "ATT1": "", "ATT2": "", "ATT3": "", "ATT4": "",
       "ATT5": "", "ATT6": "", "ATT7": "", "ATT8": "", "ATT9": "", "ATT10": "", "ATT11": "",
       "ATT12": "", "ATT13": "", "ATT14": "", "ATT15": "", "ATT16": "", "ATT17": "", "ATT18": "",
       "ATT19": "", "ATT20": "", "ATT21": "", "ATT22": "", "ATT23": "", "ATT24": "", "ATT25": "",
       "ATT26": "", "ATT27": "", "ATT28": "", "ATT29": "", "ATT30": "", "ATT_NUM1": "", "ATT_NUM2": "",
       "ATT_NUM3": "", "ATT_NUM4": "", "ATT_NUM5": "", "ATT_NUM6": "", "ATT_NUM7": "", "ATT_NUM8": "",
       "ATT_NUM9": "", "ATT_NUM10": "", "ATT_DATE1": "", "ATT_DATE2": "", "ATT_DATE3": "", "ATT_DATE4": "",
       "ATT_DATE5": "", "ATT_TIME1": "", "ATT_TIME2": "", "ATT_TIME3": "", "ATT_TIME4": "", "ATT_TIME5": "",
       "GLB_ATT11": "", "GLB_ATT12": "", "GLB_ATT13": "", "GLB_ATT14": "", "GLB_ATT15": "", "GLB_ATT16": "",
       "GLB_ATT17": "", "GLB_ATT18": "", "GLB_ATT19": "", "GLB_ATT20": "", "GLB_ATT_NUM1": "", "GLB_ATT_NUM2": "",
       "GLB_ATT_NUM3": "", "GLB_ATT_NUM4": "", "GLB_ATT_NUM5": "", "GLB_ATT_DATE1": "", "GLB_ATT_DATE2": "",
       "GLB_ATT_DATE3": "", "GLB_ATT_DATE4": "", "GLB_ATT_DATE5": "", "PROC_BUS_UNIT": "", "ENFORCE_FLAG": "",
       "REPLACE_TYPE": "", "BUYER_MAIL": "", "DUMMY1": "", "DUMMY2": "", "DUMMY3": "", "DUMMY4": ""
 
 
     });
 
 
   }
 
   console.log('converting json to csv...');
 
  await converter.json2csv(newJsonData,async function (err, csv)  {
     if (err) {
         reject();
         throw err;
     }
     csvData = csv;
 
    await sftp.writeFile(moveTo, csvData, function (data) {
         console.log('csv upload completed....');
         // resolve(data);
     return 'Success';
     });
 });
 
   
 }
 module.exports.prepareFBDI =prepareFBDI;
 
 async function fetchFileFromSFTP(filename) {
   try {
     var data = [];
     console.log('start of upload to sftp server');
 
     var Client = require('ssh2-sftp-client');
     var connSettings = {
       host: '129.213.113.127',
       port: 22,
       username: 'ftpscmo',
       password: 'Or@cle#12345'
     };
     var conn = new Client();
 
     conn.on('ready', function () {
       conn.sftp(function (err, sftp) {
         if (err) throw err;
         console.log('Sftp connection created');
 
         var moveFrom = '/home/ftpscmo/DesignSource/Data/' + filename;
         var moveTo = '/home/ftpscmo/DesignSource/Data/' + 'EgpSystemItemsInterface.csv';
         return new Promise(function (resolve, reject) {
           console.log('Reading the CSV File...');
 
           sftp.createReadStream(moveFrom)
             .pipe(csv())
             .on('data', function (row) {
               data.push(row)
             })
             .on('end', async function () {
               var result = await prepareFBDI(data,moveTo,sftp);
               resolve(result);
 
               return result;
             })
             .on('error', reject);
         });
       });
     }).connect(connSettings);
 
 
   } catch (err) {
     console.log('error occured ' + err);
   }
 }
 module.exports.fetchFileFromSFTP =fetchFileFromSFTP;

module.exports = router;
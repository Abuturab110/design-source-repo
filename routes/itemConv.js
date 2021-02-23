var express = require('express');
var router = express.Router();
var csv = require('csv-parser');
const path = require('path');
const logPath = path.join(__dirname, './data_files/ItemImport.zip');

const converter = require('json-2-csv');
const { move } = require('./crud');
const AdmZip = require('adm-zip');

var Datastore = require('nedb')
  , db = new Datastore({ filename: './data_files/itemConvDB.js', autoload: true });

router.get('/getItemConvDetails', function (req, res, next) {
  db.find({}, function (err, docs) {
    if (err) return next(err);
    res.json(docs);
  });
});

router.post('/postItemConvDetails', function (req, res, next) {
  let postData = { ...req.body, "creation-date": new Date().toString(), "last-update-date": new Date().toString() };
  db.insert(postData, function (err, docs) {
    if (err) return next(err);
    console.log('files inserted successfully' + JSON.stringify(req.body));
    res.json(docs);
  });
});

router.put('/putItemConvDetails', function (req, res, next) {
  let putData = { ...req.body, "last-update-date": new Date().toString() };
  db.update({ _id: req.body._id }, { $set: putData }, {}, function (err, docs) {
    if (err)
      return res.json(err);
    res.send('{"MSG":"SUCCESS"}');
  });
});

router.delete('/deleteItemConvDetails/:id', function (req, res, next) {
  db.remove({ _id: req.params.id }, {}, function (err, docs) {
    if (err) return res.json(err);
    res.send('{"MSG":"SUCCESS"}');
  });
});


router.get('/generatefbdi/:filename', async function (req, res, next) {
  var filename = req.params.filename;
  await fetchFileFromSFTP(filename,res);
  return res.status(200).json({
    'message': 'zip upload completed....'
  });
});

async function prepareFBDI(jsonData, moveTo, sftp) {
  var newJsonData = [];
  var newJsonData2 = [];
  var csvData;
  var csvData2;

  var quantity;

  console.log('Creating FBDI data...')

  for (i = 0; i < jsonData.length; i++) {

    if (jsonData[i].quantity_uom == "NULL") {
      quantity = "EACH";
    }
    else {
      quantity = jsonData[i].quantity_uom;
    };


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
      "ITEM_STATUS": "Active",
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

    newJsonData2.push({
      "TRANSACTION_TYPE": "CREATE",
      "BATCH_ID": "",
      "OIC_FLOW_ID": "",
      "CONTROL_FILE_NAME": "",
      "BATCH_NUMBER": "",
      "ITEM_NUMBER": jsonData[i].DSID,
      "ORGANIZATION_CODE": "CLOUD_ITEM_MASTER",
      "SOURCE_SYSTEM_CODE": "",
      "SOURCE_SYSTEM_REFERENCE": "Design Source Conversion",
      "ATTRIBUTE_GROUP_CODE": "",
      "ATTRIBUTE_CHAR1": "",
      "ATTRIBUTE_CHAR2": "",
      "ATTRIBUTE_CHAR3": "",
      "ATTRIBUTE_CHAR4": "",
      "ATTRIBUTE_CHAR5": "",
      "ATTRIBUTE_CHAR6": "",
      "ATTRIBUTE_CHAR7": "",
      "ATTRIBUTE_CHAR8": "",
      "ATTRIBUTE_CHAR9": "",
      "ATTRIBUTE_CHAR10": "",
      "ATTRIBUTE_CHAR11": "",
      "ATTRIBUTE_CHAR12": "",
      "ATTRIBUTE_CHAR13": "",
      "ATTRIBUTE_CHAR14": "",
      "ATTRIBUTE_CHAR15": "",
      "ATTRIBUTE_CHAR16": "",
      "ATTRIBUTE_CHAR17": "",
      "ATTRIBUTE_CHAR18": "",
      "ATTRIBUTE_CHAR19": "",
      "ATTRIBUTE_CHAR20": "",
      "ATTRIBUTE_CHAR21": "",
      "ATTRIBUTE_CHAR22": "",
      "ATTRIBUTE_CHAR23": "",
      "ATTRIBUTE_CHAR24": "",
      "ATTRIBUTE_CHAR25": "",
      "ATTRIBUTE_CHAR26": "",
      "ATTRIBUTE_CHAR27": "",
      "ATTRIBUTE_CHAR28": "",
      "ATTRIBUTE_CHAR29": "",
      "ATTRIBUTE_CHAR30": "",
      "ATTRIBUTE_CHAR31": "",
      "ATTRIBUTE_CHAR32": "",
      "ATTRIBUTE_CHAR33": "",
      "ATTRIBUTE_CHAR34": "",
      "ATTRIBUTE_CHAR35": "",
      "ATTRIBUTE_CHAR36": "",
      "ATTRIBUTE_CHAR37": "",
      "ATTRIBUTE_CHAR38": "",
      "ATTRIBUTE_CHAR39": "",
      "ATTRIBUTE_CHAR40": "",
      "ATTRIBUTE_NUMBER1": "",
      "ATTRIBUTE_NUMBER2": "",
      "ATTRIBUTE_NUMBER3": "",
      "ATTRIBUTE_NUMBER4": "",
      "ATTRIBUTE_NUMBER5": "",
      "ATTRIBUTE_NUMBER6": "",
      "ATTRIBUTE_NUMBER7": "",
      "ATTRIBUTE_NUMBER8": "",
      "ATTRIBUTE_NUMBER9": "",
      "ATTRIBUTE_NUMBER10": "",
      "ATTRIBUTE_NUMBER11": "",
      "ATTRIBUTE_NUMBER12": "",
      "ATTRIBUTE_NUMBER13": "",
      "ATTRIBUTE_NUMBER14": "",
      "ATTRIBUTE_NUMBER15": "",
      "ATTRIBUTE_NUMBER16": "",
      "ATTRIBUTE_NUMBER17": "",
      "ATTRIBUTE_NUMBER18": "",
      "ATTRIBUTE_NUMBER19": "",
      "ATTRIBUTE_NUMBER20": "",
      "ATTRIBUTE_DATE1": "",
      "ATTRIBUTE_DATE2": "",
      "ATTRIBUTE_DATE3": "",
      "ATTRIBUTE_DATE4": "",
      "ATTRIBUTE_DATE5": "",
      "ATTRIBUTE_DATE6": "",
      "ATTRIBUTE_DATE7": "",
      "ATTRIBUTE_DATE8": "",
      "ATTRIBUTE_DATE9": "",
      "ATTRIBUTE_DATE10": "",
      "ATTRIBUTE_TIMESTAMP1": "",
      "ATTRIBUTE_TIMESTAMP2": "",
      "ATTRIBUTE_TIMESTAMP3": "",
      "ATTRIBUTE_TIMESTAMP4": "",
      "ATTRIBUTE_TIMESTAMP5": "",
      "ATTRIBUTE_TIMESTAMP6": "",
      "ATTRIBUTE_TIMESTAMP7": "",
      "ATTRIBUTE_TIMESTAMP8": "",
      "ATTRIBUTE_TIMESTAMP9": "",
      "ATTRIBUTE_TIMESTAMP10": "",
      "VERSION_START_DATE": "",
      "VERSION_REVISION_CODE": "",
      "ATTRIBUTE_NUMBER1_UOM_NAME": "",
      "ATTRIBUTE_NUMBER2_UOM_NAME": "",
      "ATTRIBUTE_NUMBER3_UOM_NAME": "",
      "ATTRIBUTE_NUMBER4_UOM_NAME": "",
      "ATTRIBUTE_NUMBER5_UOM_NAME": "",
      "ATTRIBUTE_NUMBER6_UOM_NAME": "",
      "ATTRIBUTE_NUMBER7_UOM_NAME": "",
      "ATTRIBUTE_NUMBER8_UOM_NAME": "",
      "ATTRIBUTE_NUMBER9_UOM_NAME": "",
      "ATTRIBUTE_NUMBER10_UOM_NAME": "",
      "ATTRIBUTE_NUMBER11_UOM_NAME": "",
      "ATTRIBUTE_NUMBER12_UOM_NAME": "",
      "ATTRIBUTE_NUMBER13_UOM_NAME": "",
      "ATTRIBUTE_NUMBER14_UOM_NAME": "",
      "ATTRIBUTE_NUMBER15_UOM_NAME": "",
      "ATTRIBUTE_NUMBER16_UOM_NAME": "",
      "ATTRIBUTE_NUMBER17_UOM_NAME": "",
      "ATTRIBUTE_NUMBER18_UOM_NAME": "",
      "ATTRIBUTE_NUMBER19_UOM_NAME": "",
      "ATTRIBUTE_NUMBER20_UOM_NAME": "",
      "ATTRIBUTE_NUMBER1_UE": "",
      "ATTRIBUTE_NUMBER2_UE": "",
      "ATTRIBUTE_NUMBER3_UE": "",
      "ATTRIBUTE_NUMBER4_UE": "",
      "ATTRIBUTE_NUMBER5_UE": "",
      "ATTRIBUTE_NUMBER6_UE": "",
      "ATTRIBUTE_NUMBER7_UE": "",
      "ATTRIBUTE_NUMBER8_UE": "",
      "ATTRIBUTE_NUMBER9_UE": "",
      "ATTRIBUTE_NUMBER10_UE": "",
      "ATTRIBUTE_NUMBER11_UE": "",
      "ATTRIBUTE_NUMBER12_UE": "",
      "ATTRIBUTE_NUMBER13_UE": "",
      "ATTRIBUTE_NUMBER14_UE": "",
      "ATTRIBUTE_NUMBER15_UE": "",
      "ATTRIBUTE_NUMBER16_UE": "",
      "ATTRIBUTE_NUMBER17_UE": "",
      "ATTRIBUTE_NUMBER18_UE": "",
      "ATTRIBUTE_NUMBER19_UE": "",
      "ATTRIBUTE_NUMBER20_UE": ""

    })

  }

  console.log('converting json to csv...');

  await converter.json2csv(newJsonData, async function (err, csv) {
    if (err) {
      reject();
      throw err;
    }
    csvData = csv;

    // await sftp.writeFile(moveTo, csvData, function (data) {
    //   console.log('csv upload completed....');
    //   // resolve(data);
    //   return 'Success';
    // });
  });

  await converter.json2csv(newJsonData2, async function (err, csv2) {
    if (err) {
      reject();
      throw err;
    }
    csvData2 = csv2;

    const zip = new AdmZip();

     zip.addFile('EgpSystemItemsInterface.csv', csvData, '', 0644);
    zip.addFile('EgoItemIntfEffb.csv', csvData2, '', 0644);

    
    
    zip.writeZip('./data_files/' + 'ItemImport.zip');
    // ZipToSend = await zip.toBuffer('./data_files/' + 'ItemImport.zip');
    // console.log(ZipToSend);


    // return ZipToSend;
    // await sftp.writeFile(moveTo, csvData, function (data) {
    //   console.log('csv upload completed....');
    //   // resolve(data);
    //   return 'Success';
    // });
    
  });




}
module.exports.prepareFBDI = prepareFBDI;

async function fetchFileFromSFTP(filename,res) {
  try {
    var data = [];
    console.log('start of upload to sftp server');

    var Client = require('ssh2').Client;
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
        var moveTo = '/home/ftpscmo/DesignSource/Data/' + 'ItemImport.zip';
        return new Promise(function (resolve, reject) {
          console.log('Reading the CSV File...');

          sftp.createReadStream(moveFrom)
            .pipe(csv())
            .on('data', function (row) {
              data.push(row)
            })
            .on('end', async function () {
              var result = await prepareFBDI(data, moveTo, sftp);
              console.log('buffer is........'+result);
              sftp.fastPut(('./data_files/' + 'ItemImport.zip',moveTo, (err)=>{
                resolve(result);

              }));
              
            })
            .on('error', reject);
        });
      });
    }).connect(connSettings);


  } catch (err) {
    console.log('error occured ' + err);
  }
}
module.exports.fetchFileFromSFTP = fetchFileFromSFTP;

module.exports = router;
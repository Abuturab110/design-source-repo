const fs = require('fs')
const csv = require('csv-parser')
const sftpClient = require('ssh2-sftp-client')
const jsonexport = require('jsonexport');
var AdmZip = require('adm-zip');
const db = require('./db')
, ftpServerSetupDB = db.ftpServerSetupDB
, udaConversionDB = db.udaConversionDB;
const counterFunctions = require('./counter')


const getSFTPDetails = (serverName) => {

    return new Promise((resolve, reject) => {
        ftpServerSetupDB.find({ftpName: serverName}, function(error, results)  {
            if (error) reject(error)
            else resolve( results[0])
        })
    })

} 

const readSFTPFile = (host, port, username, password, sourceDst, targetDst) => {
    let dataSet = []
    let client = new sftpClient();
    return new Promise((resolve, reject) => {

        client.connect({host, port, username, password}).then(() => {
            return client.fastGet(sourceDst,targetDst);
        }).then(() => {
            client.end();
            fs.createReadStream(targetDst)
            .pipe(csv())
            .on('data', (data) => dataSet.push(data))
            .on('end', () => {
                resolve(dataSet);
             })
             .on('error', (error) => {
                reject(error)
             });
        }).catch(err => {
            reject(err)
        });
        
    })

}

const createFBDI = (loadedData, udaMappingData) => {
    let itemsInterfaceDataSet = []
    let effDataSet = []
    let count = 0
    return new Promise((resolve, reject) => {
    counterFunctions.getNextSequenceNumber('ItemConvSeq', (error, nextVal) => {
        if (error) reject(error)
        let batchNumber = nextVal
        loadedData.forEach(data => {
            udaMappingData.filter(udaData => udaData['unspsc'] === data['assigned_UNSPSC8']).map(mapData => {
                count++
                populateItemsInterfaceData(itemsInterfaceDataSet, data, batchNumber)
                populateEFFData(effDataSet, data, mapData, batchNumber)
            })
    
        })
        resolve({itemsInterfaceDataSet, effDataSet, count })
    })

     
    })
   
}

const fetchUdaData = () => {
let transformedUdaData = [];
    return new Promise((resolve, reject) => {
        udaConversionDB.find({}, (error, docs) => {
            if(error) {
                reject(error)
            }
            let unspscSet = new Set(docs.map(doc => doc['unspsc']))
            unspscSet.forEach(unspsc => {
                let unspscObj = {unspsc}
                docs.filter(doc => doc['unspsc'] === unspsc).map(data => unspscObj[data['var-type']] = data['eff-column'])
                transformedUdaData.push(unspscObj);
            })
                 resolve(transformedUdaData)
        })
    })
    
}

function generateCSVFromFileAndZip(resultSet) {
    var zip = new AdmZip();
    resultSet.forEach(result => {
        let csvData;
        jsonexport(result.set, function(err, csv) {
            if (err) return err
            csvData = csv
         })
         let csvLines = csvData.split('\n');
         csvLines.splice(0,1);
         let newCsvData = csvLines.join('\n');
         fs.writeFileSync(result.file,newCsvData)
         zip.addLocalFile(result.file)
    })
    zip.addLocalFile('./output/properties/ItemImport.properties')
    const zipFile = 'Item_Import_'+formatDate()+'.zip';
    const zipPath = './output/' + zipFile;
    zip.writeZip(zipPath)
    return zipFile
}

const postDataToItemConvDB = (objectToBeInserted, callback) => {
    db.itemConvDB.insert(objectToBeInserted, function (err, docs) {
        if (err) return callback(err, undefined);
        callback(undefined, docs)
      });
}

const formatDate = () => {
    let todayDate = new Date()
    return `${todayDate.getDate()}_${todayDate.getMonth() + 1}_${todayDate.getFullYear()}_${todayDate.getHours()}_${todayDate.getMinutes()}_${todayDate.getSeconds()}`;
}

const processFile = async (environment, source, target) => {
    const {ftpHost: host, ftpPort: port, userName: username, password} = await getSFTPDetails(environment)
    const result = await readSFTPFile(host, port, username, password, source, target)
    const udaMappingData = await fetchUdaData()
    const generateAppropriateData = await createFBDI(result, udaMappingData)
    return generateAppropriateData
}

const populateEFFData = (dataSet, data, udaData, batchNumber) => {
     let effData = {
        TRANSACTION_TYPE: 'SYNC',
        BATCH_ID: null,
        BATCH_NUMBER: batchNumber,
        ITEM_NUMBER: data.DSID,
        ORGANIZATION_CODE: 'CLOUD_ITEM_MASTER',
        SOURCE_SYSTEM_CODE: null,
        SOURCE_SYSTEM_REFERENCE: null,
        ATTRIBUTE_GROUP_CODE: 'Ceramic fixed capacitor',
        ATTRIBUTE_CHAR1: 'Ops',
        ATTRIBUTE_CHAR2: null,
        ATTRIBUTE_CHAR3: null,
        ATTRIBUTE_CHAR4: null,
        ATTRIBUTE_CHAR5: null,
        ATTRIBUTE_CHAR6: null,
        ATTRIBUTE_CHAR7: null,
        ATTRIBUTE_CHAR8: null,
        ATTRIBUTE_CHAR9: null,
        ATTRIBUTE_CHAR10: null,
        ATTRIBUTE_CHAR11: null,
        ATTRIBUTE_CHAR12: null,
        ATTRIBUTE_CHAR13: null,
        ATTRIBUTE_CHAR14: null,
        ATTRIBUTE_CHAR15: null,
        ATTRIBUTE_CHAR16: null,
        ATTRIBUTE_CHAR17: null,
        ATTRIBUTE_CHAR18: null,
        ATTRIBUTE_CHAR19: null,
        ATTRIBUTE_CHAR20: null,
        ATTRIBUTE_NUMBER1: null,
        ATTRIBUTE_NUMBER2: null,
        ATTRIBUTE_NUMBER3: null,
        ATTRIBUTE_NUMBER4: null,
        ATTRIBUTE_NUMBER5: null,
        ATTRIBUTE_NUMBER6: null,
        ATTRIBUTE_NUMBER7: null,
        ATTRIBUTE_NUMBER8: null,
        ATTRIBUTE_NUMBER9: null,
        ATTRIBUTE_NUMBER10: null,
        ATTRIBUTE_DATE1: null,
        ATTRIBUTE_DATE2: null,
        ATTRIBUTE_DATE3: null,
        ATTRIBUTE_DATE4: null,
        ATTRIBUTE_DATE5: null,
        ATTRIBUTE_CHAR21: null,
        ATTRIBUTE_CHAR22: null,
        ATTRIBUTE_CHAR23: null,
        ATTRIBUTE_CHAR24: null,
        ATTRIBUTE_CHAR25: null,
        ATTRIBUTE_CHAR26: null,
        ATTRIBUTE_CHAR27: null,
        ATTRIBUTE_CHAR28: null,
        ATTRIBUTE_CHAR29: null,
        ATTRIBUTE_CHAR30: null,
        ATTRIBUTE_CHAR31: null,
        ATTRIBUTE_CHAR32: null,
        ATTRIBUTE_CHAR33: null,
        ATTRIBUTE_CHAR34: null,
        ATTRIBUTE_CHAR35: null,
        ATTRIBUTE_CHAR36: null,
        ATTRIBUTE_CHAR37: null,
        ATTRIBUTE_CHAR38: null,
        ATTRIBUTE_CHAR39: null,
        ATTRIBUTE_CHAR40: null,
        ATTRIBUTE_NUMBER11: null,
        ATTRIBUTE_NUMBER12: null,
        ATTRIBUTE_NUMBER13: null,
        ATTRIBUTE_NUMBER14: null,
        ATTRIBUTE_NUMBER15: null,
        ATTRIBUTE_NUMBER16: null,
        ATTRIBUTE_NUMBER17: null,
        ATTRIBUTE_NUMBER18: null,
        ATTRIBUTE_NUMBER19: null,
        ATTRIBUTE_NUMBER20: null,
        ATTRIBUTE_DATE6: null,
        ATTRIBUTE_DATE7: null,
        ATTRIBUTE_DATE8: null,
        ATTRIBUTE_DATE9: null,
        ATTRIBUTE_DATE10: null,
        ATTRIBUTE_TIMESTAMP1: null,
        ATTRIBUTE_TIMESTAMP2: null,
        ATTRIBUTE_TIMESTAMP3: null,
        ATTRIBUTE_TIMESTAMP4: null,
        ATTRIBUTE_TIMESTAMP5: null,
        ATTRIBUTE_TIMESTAMP6: null,
        ATTRIBUTE_TIMESTAMP7: null,
        ATTRIBUTE_TIMESTAMP8: null,
        ATTRIBUTE_TIMESTAMP9: null,
        ATTRIBUTE_TIMESTAMP10: null,
        VERSION_START_DATE: null,
        VERSION_REVISION_CODE: null,
        ATTRIBUTE_NUMBER1_UOM_NAME: null,
        ATTRIBUTE_NUMBER2_UOM_NAME: null,
        ATTRIBUTE_NUMBER3_UOM_NAME: null,
        ATTRIBUTE_NUMBER4_UOM_NAME: null,
        ATTRIBUTE_NUMBER5_UOM_NAME: null,
        ATTRIBUTE_NUMBER6_UOM_NAME: null,
        ATTRIBUTE_NUMBER7_UOM_NAME: null,
        ATTRIBUTE_NUMBER8_UOM_NAME: null,
        ATTRIBUTE_NUMBER9_UOM_NAME: null,
        ATTRIBUTE_NUMBER10_UOM_NAME: null,
        ATTRIBUTE_NUMBER11_UOM_NAME: null,
        ATTRIBUTE_NUMBER12_UOM_NAME: null,
        ATTRIBUTE_NUMBER13_UOM_NAME: null,
        ATTRIBUTE_NUMBER14_UOM_NAME: null,
        ATTRIBUTE_NUMBER15_UOM_NAME: null,
        ATTRIBUTE_NUMBER16_UOM_NAME: null,
        ATTRIBUTE_NUMBER17_UOM_NAME: null,
        ATTRIBUTE_NUMBER18_UOM_NAME: null,
        ATTRIBUTE_NUMBER19_UOM_NAME: null,
        ATTRIBUTE_NUMBER20_UOM_NAME: null,
        ATTRIBUTE_NUMBER1_UE: null,
        ATTRIBUTE_NUMBER2_UE: null,
        ATTRIBUTE_NUMBER3_UE: null,
        ATTRIBUTE_NUMBER4_UE: null,
        ATTRIBUTE_NUMBER5_UE: null,
        ATTRIBUTE_NUMBER6_UE: null,
        ATTRIBUTE_NUMBER7_UE: null,
        ATTRIBUTE_NUMBER8_UE: null,
        ATTRIBUTE_NUMBER9_UE: null,
        ATTRIBUTE_NUMBER10_UE: null,
        ATTRIBUTE_NUMBER11_UE: null,
        ATTRIBUTE_NUMBER12_UE: null,
        ATTRIBUTE_NUMBER13_UE: null,
        ATTRIBUTE_NUMBER14_UE: null,
        ATTRIBUTE_NUMBER15_UE: null,
        ATTRIBUTE_NUMBER16_UE: null,
        ATTRIBUTE_NUMBER17_UE: null,
        ATTRIBUTE_NUMBER18_UE: null,
        ATTRIBUTE_NUMBER19_UE: null,
        ATTRIBUTE_NUMBER20_UE: null
      };

      Object.keys(udaData).filter(filterData => filterData !== 'unspsc')
                          .map(mapData => effData[udaData[mapData]] = data[mapData.toLowerCase()]
                           && data[mapData.toLowerCase()] !== 'NULL' ?  data[mapData.toLowerCase()].replace(', ','') : effData[udaData[mapData]])

      dataSet.push(effData);

}

const populateItemsInterfaceData = (dataSet, data, batchNumber) => {
    dataSet.push({
        TRANSACTION_TYPE: 'SYNC',
        BATCH_ID: null,
        BATCH_NUMBER: batchNumber,
        ITEM_NUMBER: data.DSID,
        OUTSIDE_PROCESS_SERVICE_FLAG: null,
        ORG_CODE: 'CLOUD_ITEM_MASTER',
        DESCRIPTION: data.part_description,
        TEMPLATE_NAME: 'Copy of Purchased Item',
        SOURCE_SYSTEM_CODE: null,
        SOURCE_SYSTEM_REF: null,
        SOURCE_SYS_REF_DESC: null,
        ITEM_CLASS_NAME: data.product_family,
        PRIMARY_UOM: data.quantity && data.quantity !== 'NULL' ? data.quantity : 'Each',
        LIFE_CYCLE_PHASE: 'Production',
        ITEM_STATUS: 'Active',
        NEW_ITEM_CLASS: null,
        ASSET_TRACKED: null,
        ALLOW_MAINTENANCE: null,
        ENABLE_GEN_FLAG: null,
        ASSET_CLASS: null,
        ASSET_ITEM_TYPE: null,
        ACTIVITY_TYPE: null,
        ACTIVITY_CLAUSE: null,
        ACT_NOTIF_REQ: null,
        SHUTDOWN_TYPE: null,
        ACTIVITY_SOURCE: null,
        COSTING_ENABLED: null,
        STD_LOT_SIZE: null,
        INV_ASSET_VALUE: null,
        INCLUDE_ROLLUP: null,
        ORDER_COST: null,
        MIN_SUPPLY_DAYS: null,
        FIXED_QTY: null,
        MIN_ORDER: null,
        AUTO_EXP_ASN: null,
        CARRY_COST_PERCENT: null,
        CONSIGNED: null,
        FIXED_DAY_SUPPLY: null,
        FIXED_LOT_SIZE: null,
        FIXED_ORDER_QTY: null,
        WINDOW_DAYS: null,
        INV_PLAN_METHOD: null,
        SAFETY_STOCK_PLAN: null,
        DEMAND_PERIOD: null,
        DAYS_OF_COVER: null,
        MIN_MIN_MAX_QTY: null,
        MAX_MIN_MAX_QTY: null,
        MIN_ORD_QTY: null,
        PLANNER: null,
        MAKE_OR_BUY: null,
        SOURCE_SUB_INV: null,
        REPLENISHMENT_SOURCE: null,
        RELEASE_AUTH_REQ: null,
        SUB_COMPONENT: null,
        FORECAST_TYPE: null,
        MAX_ORDER: null,
        MAX_DAY_SUPPLY: null,
        SOURCE_ORG: null,
        SUBINV_RESTRICTION: null,
        RESTRICT_LOCATORS: null,
        CHILD_LOT_ENABLE: null,
        CHILD_LOT_PREFIX: null,
        CHILD_LOT_START_NUM: null,
        CHILD_LOT_FORMAT_VAL: null,
        COPY_LOT_ATTRIBUTE: null,
        EXPIRATION_aCTION: null,
        EXPIRATION_ACT_INT: null,
        STOCKED: null,
        START_LOT_NUM: null,
        LOT_EXP_CONTROL: null,
        SHELF_LIFE_DAYS: null,
        SERIAL_NUM_CONTROL: null,
        SERIAL_STATUS_ENABLED: null,
        REVISION_CONTROL: null,
        RETEST_INT: null,
        START_LOT_PREFIX: null,
        START_SERIAL_PREFIX: null,
        BULK_PICKED: null,
        CHECK_MATERIAL_SHORT: null,
        CYCLE_COUNT_ENABLE: null,
        DEFAULT_GRADE: null,
        GRADE_CONTROLLED: null,
        HOLD_DAYS: null,
        LOT_DIVISIBLE: null,
        MATURITY_DAYS: null,
        DEFAULT_LOT_STATUS: null,
        DEFAULT_SERIAL_STATUS: null,
        LOT_SPLIT_ENABLE: null,
        LOT_MERGE_ENABLE: null,
        INV_ITEM: null,
        STOCK_LOC_CONTROL: null,
        LOT_CONTROL: null,
        LOT_STATUS_ENABLED: null,
        LOT_SUB_ENABLED: null,
        LOT_TRANS_ENABLED: null,
        TRANS_ENABLED: null,
        POS_MEASURE_ERROR: null,
        NEGATIVE_MEASURE_ERROR: null,
        CHILD_LOT_GEN: null,
        RESERVABLE: null,
        START_SERIAL_NUM: null,
        INV_RULE: null,
        OUTPUT_TAX_CLASS: null,
        SALES_ACCOUNT: null,
        PAYMENT_TERM: null,
        INV_ENABLED: null,
        INVOICED: null,
        ACCOUNTING_RULE: null,
        AUTOCREATE_CONFIG: null,
        ASSEMBLE_TO_ORD: null,
        PICK_COMP: null,
        BASE_MODEL: null,
        EFFECTIVE_CONTROL: null,
        CREATE_CONFIG_ITEM: null,
        MATCH_CONFIG: null,
        CONFIG_MODEL_TYPE: null,
        STRUCT_ITEM_TYPE: null,
        MANU_LEAD_TIME: null,
        REPROCESS_DAYS: null,
        TOTAL_LEAD_TIME: null,
        FIXED_LEAD_TIME: null,
        VAR_LEAD_TIME: null,
        PRO_DAY: null,
        FORECAST_CONTROL: null,
        CRITICAL_COMP: null,
        ACCEPT_EARLY_DAYS: null,
        CREATE_SUPPLY: null,
        INV_DAYS: null,
        INV_WINDOW: null,
        MAX_INV_DAY: null,
        MAX_INV_WIN: null,
        DEMAND_TIME_FENCE: null,
        DEMAND_TIME_DAY: null,
        DIST_PLAN: null,
        END_ASS: null,
        EX_FROM_BUDGET: null,
        CALCULATE_ATP: null,
        PLAN_METHOD: null,
        PLAN_INV_POINT: null,
        PLAN_TIME_FENCE: null,
        PLAN_TIME_FENCE_DAY: null,
        PRE_POINT: null,
        RELEASE_TIME_FENCE: null,
        RELEASE_TIME_FENCE_DAYS: null,
        REPAIR_LEAD_TIME: null,
        REPAIR_YIELD: null,
        REPAIR_PROG: null,
        ROUND_ORD_QTY: null,
        SHRINK_RATE: null,
        SUB_WIN_cODE: null,
        SUB_WIN_DAYS: null,
        PACK_TYPE: null,
        CONVERSION: null,
        POS_DERIVATION: null,
        NEG_DERIVATION: null,
        USER_ITEM_TYPE: null,
        LONG_DESC: null,
        FORMAT_DESC: null,
        PRICING_UOM: null,
        DEFAULT_CONTROL: null,
        SEC_UOM: null,
        TRACKING_UOM: null,
        ENG_ITEM_FLAG: null,
        ATP_COMP: null,
        CHECK_ATP: null,
        OVER_SHIP_TOLERANCE: null,
        UNDER_SHIP_TOLERANCE: null,
        OVER_RET_TOLERANCE: null,
        UNDER_RET_TOLERANCE: null,
        DOWNLOAD: null,
        ELEC_FORMAT: null,
        OM_IND: null,
        INTERNAL_ORDER_ENABLED: null,
        ATP_RULE: null,
        CHARGE_PERIODICITY: null,
        CUST_ORD_ENABLED: null,
        DEFAULT_SHIP_ORG: null,
        DEFAULT_SO_TYPE: null,
        EL_RULE: null,
        FINANCING_aLLOW: null,
        INT_ORD: null,
        PICK_RULE: null,
        RETURNABLE: null,
        RMA_REQ: null,
        SO_PROD_TYPE: null,
        BTB_ENABLED: null,
        SHIPPABLE: null,
        SHIP_MOD_COMP: null,
        OM_TRAN_ENABLED: null,
        CUST_ORD: null,
        UNIT_WEIGHT: null,
        WEIGHT_UOM: null,
        UNIT_VOL: null,
        VOLUME_UOM: null,
        DIM_UOM: null,
        LENGTH1: null,
        WIDTH1: null,
        HEIGHT1: null,
        COLL: null,
        CONTAINER: null,
        CONT_TYPE: null,
        WAREHOUSE_EQUIP: null,
        EVENT: null,
        INT_VOLUME: null,
        MAX_LOAD: null,
        MIN_FILL: null,
        VEHICLE: null,
        CAS_NUM: null,
        HAZARD_MAT: null,
        PROC_COST_ENABLED: null,
        PROCESS_EXEC_ENABLED: null,
        PROCESS_QUALITY_ENABLED: null,
        PROCESS_SUP_LOC: null,
        PROC_SUP_SUB: null,
        PRO_YIELD: null,
        RECIPE_ENABLED: null,
        EXP_aCCOUNT: null,
        UN_NUM: null,
        UNIT_ISSUE: null,
        ROUND_FACTOR: null,
        REC_PERCENT: null,
        INPUT_TCC: null,
        PURCHASED: null,
        PTP: null,
        OUT_aSS: null,
        OUTPUT_TYPE: null,
        NEG_rEQ: null,
        USE_APP_SUPPLIER: null,
        MATCH_APP_LEVEL: null,
        INV_MATCH_OPTION: null,
        LIST_PRICE: null,
        INV_CLO_PER: null,
        HAZARD_cLASS: null,
        DEFAULT_BUYER: null,
        TAXABLE: null,
        PURCHASABLE: null,
        OP_ITEM_ENABLED: null,
        MARKET_PRICE: null,
        ASSET_CAT: null,
        ALLOW_PUR_DOC: null,
        ALL_EXP: null,
        ALLOW_SUB: null,
        ALLOW_REC: null,
        ALLOW_UN_REC: null,
        DAYS_eaRLY_REC: null,
        RECEIPT_ROUTE: null,
        EN_SHIP: null,
        QTY_rEC: null,
        QTY_REC_TOLERANCE: null,
        REC_DATE: null,
        CREATE_FA: null,
        SERVICE_START_TYPE: null,
        TRACK_IB: null,
        ENABLE_CSS: null,
        CONT_ITEM_TYPE: null,
        STD_COVERAGE: null,
        ENABLE_dEFECT_TRACK: null,
        INST_CLASS: null,
        BILL_TYPE: null,
        REC_PART: null,
        EN_COVER: null,
        ST_DELAY: null,
        SERVICE_DURATION: null,
        SERVICE_DUR_PERIOD: null,
        SER_rEQ: null,
        ALLOW_SUSPEND: null,
        ALLOW_TERMINATE: null,
        REQ_FULL: null,
        REQ_ITEM_aSS: null,
        SERVICE_START_DELAY: null,
        SERVICE_DURATION_TYPE: null,
        ENABLE_PROV: null,
        ENABLE_SB: null,
        ORD_WEB: null,
        BACK_ORD: null,
        WEB_sTATUS: null,
        MIN_LIC_QTY: null,
        BUILD_WIP: null,
        CONT_MANU: null,
        WIP_LOC: null,
        WIP_TYPE: null,
        WIP_SUB_INV: null,
        OVER_TOLERANCE: null,
        INV_PENALTY: null,
        OP_SLACK_PENALTY: null,
        REVISION: null,
        STYLE_ITEM: null,
        STYLE_ITEM_NUM: null,
        VERSION_ST_DATE: null,
        VER_REV_cODE: null,
        VERSION_LABEL: null,
        SERVICE_ST: null,
        SALES_SUB_TYPE: null,
        GLB_ATT_CATEGORY: null,
        GLB_ATT1: null,
        GLB_ATT2: null,
        GLB_ATT3: null,
        GLB_ATT4: null,
        GLB_ATT5: null,
        GLB_ATT6: null,
        GLB_ATT7: null,
        GLB_ATT8: null,
        GLB_ATT9: null,
        GLB_ATT10: null,
        ATT_CATEGORY: null,
        ATT1: null,
        ATT2: null,
        ATT3: null,
        ATT4: null,
        ATT5: null,
        ATT6: null,
        ATT7: null,
        ATT8: null,
        ATT9: null,
        ATT10: null,
        ATT11: null,
        ATT12: null,
        ATT13: null,
        ATT14: null,
        ATT15: null,
        ATT16: null,
        ATT17: null,
        ATT18: null,
        ATT19: null,
        ATT20: null,
        ATT21: null,
        ATT22: null,
        ATT23: null,
        ATT24: null,
        ATT25: null,
        ATT26: null,
        ATT27: null,
        ATT28: null,
        ATT29: null,
        ATT30: null,
        ATT_NUM1: null,
        ATT_NUM2: null,
        ATT_NUM3: null,
        ATT_NUM4: null,
        ATT_NUM5: null,
        ATT_NUM6: null,
        ATT_NUM7: null,
        ATT_NUM8: null,
        ATT_NUM9: null,
        ATT_NUM10: null,
        ATT_DATE1: null,
        ATT_DATE2: null,
        ATT_DATE3: null,
        ATT_DATE4: null,
        ATT_DATE5: null,
        ATT_TIME1: null,
        ATT_TIME2: null,
        ATT_TIME3: null,
        ATT_TIME4: null,
        ATT_TIME5: null,
        GLB_ATT11: null,
        GLB_ATT12: null,
        GLB_ATT13: null,
        GLB_ATT14: null,
        GLB_ATT15: null,
        GLB_ATT16: null,
        GLB_ATT17: null,
        GLB_ATT18: null,
        GLB_ATT19: null,
        GLB_ATT20: null,
        GLB_ATT_NUM1: null,
        GLB_ATT_NUM2: null,
        GLB_ATT_NUM3: null,
        GLB_ATT_NUM4: null,
        GLB_ATT_NUM5: null,
        GLB_ATT_DATE1: null,
        GLB_ATT_DATE2: null,
        GLB_ATT_DATE3: null,
        GLB_ATT_DATE4: null,
        GLB_ATT_DATE5: null,
        PROC_BUS_UNIT: null,
        ENFORCE_FLAG: null,
        REPLACE_TYPE: null,
        BUYER_MAIL: null,
        DUMMY1: null,
        DUMMY2: null,
        DUMMY3: null,
        DUMMY4: null
      });
}




module.exports = {
    processFile: processFile,
    generateCSVFromFileAndZip: generateCSVFromFileAndZip,
    postDataToItemConvDB: postDataToItemConvDB
}
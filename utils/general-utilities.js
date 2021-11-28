const fs = require('fs')
const csv = require('csv-parser')
const sftpClient = require('ssh2-sftp-client')
const jsonexport = require('jsonexport')
const db = require('./db')
const xml2js = require('xml2js')
, ftpServerSetupDB = db.ftpServerSetupDB
, udaConversionDB = db.udaConversionDB
, itemClassDB = db.unsPscClassDB
, itemFamilyDB = db.unsPscFamilyDB
, itemSegmentDB = db.unsPscSegmentDB
, commodityDB = db.unsPscCommodityDB
const counterFunctions = require('./counter')
const { Http2ServerRequest } = require('http2')
const { cloudServerSetupDB } = require('./db')
const {Item, ItemEff} = require('../models/Item')
const {ItemClass} = require('../models/ItemClass')
const {ItemCatalog, ItemCatalogCategory} = require('../models/ItemCatalog')
const { leadingComment } = require('@angular/compiler')



const getSFTPDetails = (serverName) => {
    return new Promise((resolve, reject) => {
        ftpServerSetupDB.find({ftpName: serverName}, function(error, results)  {
            if (error) reject(error)
            else resolve( results[0])
        })
    })

} 

const readSFTPFile = async ({ftpHost: host, ftpPort: port, userName: username, password}, sourceDst, targetDst) => {
    let dataSet = []
    let client = new sftpClient();
    await client.connect({host, port, username, password})
    await client.fastGet(sourceDst,targetDst)
    await client.end()

    return new Promise((resolve, reject) => {
        fs.createReadStream(targetDst)
            .pipe(csv())
            .on('data', (data) => dataSet.push(data))
            .on('end', () => {
                resolve(dataSet)
             })
             .on('error', (error) => {
                reject(error)
             });

    })   
}

const createFBDINew = async (loadedData, udaMappingData) => {
    let itemsConv = []
    let itemsConvEff = []
    let itemProperties = []
    let batchNumber = await counterFunctions.getNextSequenceNumberNew('ItemConvSeq')
    populateItemProperties(itemProperties, batchNumber)
    for(let data of loadedData) {
        for(let udaData of udaMappingData){
            if(udaData['unspsc'] === data['assigned_UNSPSC8']) {

            let {description: commodity} = await getCommodity(udaData.unspsc)
            populateItemsInterfaceData(itemsConv, data, batchNumber)
            populateEFFData(itemsConvEff, data, udaData, batchNumber, commodity)

            }
       }

    }
     return [
     {name: 'Item', data: itemsConv},
     {name: 'ItemEff', data: itemsConvEff},
     {name: 'ItemProperties', data: itemProperties},
     {name: 'itemBatchNumber', data: batchNumber}
    ]
}

const formatUdaEffColumns = (effColumnName) => {
    let newColumnName = ''
    let columnNameArray = effColumnName.split('_')
    for (let i=0; i < columnNameArray.length; i++ ) {
        if (i === 0)   newColumnName += columnNameArray[i].toLowerCase()
        else {
            columnNameArray[i] = columnNameArray[i].charAt(0).toUpperCase() + columnNameArray[i].slice(1).toLowerCase()
            newColumnName +=columnNameArray[i]
        }
    }
    return newColumnName
}

const fetchUdaData = () => {
let transformedUdaData = [];
    return new Promise((resolve, reject) => {
        udaConversionDB.find({}, (error, docs) => {
            if(error)  reject(error)
            let unspscSet = new Set(docs.map(doc => doc['unspsc']))
            unspscSet.forEach(unspsc => {
                let unspscObj = {unspsc}
                docs.filter(doc => doc['unspsc'] === unspsc).map(data => unspscObj[data['var-type']] = formatUdaEffColumns(data['eff-column']))
                transformedUdaData.push(unspscObj);
            })
                 resolve(transformedUdaData)
        })
    })
    
}

const fetchUdaPerUnspsc = (unspsc) => {
    return new Promise((resolve, reject) => {
        udaConversionDB.find({unspsc}, (error, docs) => {
            error ? reject(error) : resolve(docs)
        })
    })
}

const getCsvForm = (dataToBeWritten, writeHeaders = false) => {
    return new Promise((resolve, reject) => {
        jsonexport(dataToBeWritten, function(err, csv) {
            if (err) reject(err)
            let newCsvData = csv
            if (!writeHeaders) {
            let csvLines = csv.split('\n');
            csvLines.splice(0,1);
            newCsvData = csvLines.join('\n');
            }
            resolve(newCsvData)
            })
    })
}

const postDataToItemConvDB = (postData) => {
    return new Promise((resolve, reject) => {
        db.itemConvDB.insert(postData, function (err, docs) {
            err ? reject(err) : resolve(docs);
          });
    })
}

const formatDate = () => {
    let todayDate = new Date()
    return `${todayDate.getDate()}_${todayDate.getMonth() + 1}_${todayDate.getFullYear()}_${todayDate.getHours()}_${todayDate.getMinutes()}_${todayDate.getSeconds()}`;
}

const formatDateMinUnderscores = () => {
    let todayDate = new Date()
    return `${todayDate.getFullYear()}${todayDate.getMonth() + 1}${todayDate.getDate()}_${todayDate.getHours()}${todayDate.getMinutes()}${todayDate.getSeconds()}`
}

const fetchPreRequisiteData = async (dataArray) => {
let itemClassConvData = []
let itemFamilyConvData = []
let itemSegmentConvData = []
let itemDff = []
let dffContext = []
let dffContextCategory = []
let dffContextSegment = []
let dffContextUsage = []
let dffPage = []
let dffPageTaskFlow = []
let dffSegment = []
let dffUsage = []
let itemClass
let itemFamily
let itemSegment
let itemCommodity
let udaArray
let itemCatalog = []
let itemCatalogCategory = []
let catalogProperties = []
const catalogName = 'DSPurchasingCatalog'
let batchId = await counterFunctions.getNextSequenceNumberNew('ItemCatalogSeq')
const uniqueUnspscList = new Set(dataArray.map(data => data['assigned_UNSPSC8']))
    await populateDFF(itemDff)
    await populateDFFContextSegment(dffContextSegment)
    await populateDffUsage(dffUsage)
    await populateItemCatalog(itemCatalog, catalogName, batchId)
    await populateItemCatalogProperties(catalogProperties, batchId)
for (const unspsc of uniqueUnspscList) {
    itemCommodity = await getCommodity(unspsc)
    itemClass = await getItemClass(unspsc)
    itemFamily = await getItemFamily(unspsc)
    itemSegment = await getItemSegment(unspsc)
    udaArray = await fetchUdaPerUnspsc(unspsc)
    await populateItemDFFContext(dffContext, itemCommodity.description)
    await populateDFFContextCategory(dffContextCategory,itemCommodity.description, itemClass.description)
    await populateDFFContextUsage(dffContextUsage, itemCommodity.description)
    await populateDFFPage(dffPage,itemCommodity.description, itemClass.description)
    await populateDFFPageTaskFlow(dffPageTaskFlow,itemCommodity.description, itemClass.description)
    for (const udaData of udaArray) {
    await populateDFFSegment(dffSegment,itemCommodity.description, udaData)
    }
    await populateItemClass(itemClassConvData, itemClass.description, itemFamily.description )
    await populateItemFamily(itemFamilyConvData, itemFamily.description, itemSegment.description )
    await populateItemSegment(itemSegmentConvData, itemSegment.description )
    await populateItemCatalogCategory(itemCatalogCategory, itemClass.description,catalogName, batchId)
}
return [
    {name: 'ItemClass', data: itemClassConvData},
    {name: 'ItemFamily', data:itemFamilyConvData},
    {name: 'ItemSegment', data: itemSegmentConvData},
    {name: 'Dff', data: itemDff},
    {name: 'DffContext', data: dffContext},
    {name: 'DffContextCategory', data: dffContextCategory},
    {name: 'DffContextSegment', data: dffContextSegment},
    {name: 'DffContextUsage', data: dffContextUsage},
    {name: 'DffPage', data: dffPage},
    {name: 'DffPageTaskFlow', data: dffPageTaskFlow},
    {name: 'DffSegment', data: dffSegment},
    {name: 'DffUsage', data: dffUsage},
    {name: 'ItemCatalog', data: itemCatalog},
    {name: 'ItemCatalogCategories', data: itemCatalogCategory},
    {name: 'ItemCatalogProperties', data: catalogProperties},
    {name: 'ItemCatalogBatchId', data: batchId}
    ]
}

const populateItemCatalogProperties = async(catalogProperties, batchId) => {
    const catalogPropertiesObj = {
        c1: '/oracle/apps/ess/scm/productModel/items/',
        c2: 'CatalogImportJobDef',
        c3: 'egpcatalogimport',
        c4: batchId,
        c5: null,
        c6: null
    }

    catalogProperties.push(catalogPropertiesObj)
}

const populateItemProperties = async(itemProperties, batchId) => {
    const itemPropertiesObj = {
        c1: '/oracle/apps/ess/scm/productModel/items/',
        c2: 'ItemImportJobDef',
        c3: 'ItemImport',
        c4: batchId,
        c5: null,
        c6: null,
        c7: null,
        c8: null,
        c9: null,
        c10: null
    }

    itemProperties.push(itemPropertiesObj)
}

const populateItemCatalogCategory = async(itemCatalogCategory, itemClass, catalogName, batchId) => {
    const itemCatalogCategoryObj = new ItemCatalogCategory()
    itemCatalogCategoryObj.transactionType = 'SYNC'
    itemCatalogCategoryObj.batchId = batchId
    itemCatalogCategoryObj.catalogCode = catalogName
    itemCatalogCategoryObj.categoryName = itemClass
    itemCatalogCategoryObj.categoryCode = itemClass
    itemCatalogCategoryObj.startDateActive = '2020-07-09'
    itemCatalogCategory.push({...itemCatalogCategoryObj})
    
}

const populateItemCatalog = async(itemCatalog, catalogName, batchId) => {
    const itemCatalogObj = new ItemCatalog()
    itemCatalogObj.transactionType = 'SYNC'
    itemCatalogObj.batchId = batchId
    itemCatalogObj.catalogName = catalogName
    itemCatalogObj.catalogCode = catalogName
    itemCatalogObj.startDate = '2021-06-01'
    itemCatalog.push({...itemCatalogObj})
}

const populateDffUsage = async(dffUsage) => {
    const dffUsageObj =   {
        'FND_APP_DESCRIPTIVE_FLEXFIELD.DescriptiveFlexfieldCode': 'EGO_ITEM_EFF',
        'FND_APP_DESCRIPTIVE_FLEXFIELD.ApplicationId': 10010,
        FlexfieldUsageCode: 'EGO_ITEM_DL'
      }
    dffUsage.push(dffUsageObj)
}

const populateDFFSegment = async(dffSegment, itemCommodity, udaData) => {
    const dffSegmentObj = {
        'FND_APP_DESCRIPTIVE_FLEXFIELD.DescriptiveFlexfieldCode': 'EGO_ITEM_EFF',
        'FND_APP_DESCRIPTIVE_FLEXFIELD.ApplicationId': 10010,
        'ORA_FND_APP_DESCRIPTIVE_FLEXFIELD_CONTEXT.ContextCode': itemCommodity,
        SegmentCode: udaData['column-name'],
        SegmentIdentifier:  udaData['column-name'].replace(/_/g,''),
        ColumnName: udaData['eff-column'],
        Name: udaData['column-name'],
        Description: udaData['column-name'],
        Prompt: udaData['column-name'],
        ShortPrompt: udaData['column-name'],
        TerminologyHelpText: null,
        InFieldHelpText: null,
        SequenceNumber: 20,
        EnabledFlag: 'Y',
        DisplayType: 'TEXT_BOX',
        DisplayWidth: null,
        DisplayHeight: null,
        CheckboxCheckedValue: null,
        CheckboxUncheckedValue: null,
        RequiredFlag: 'N',
        RangeType: null,
        DefaultType: null,
        DefaultValue: null,
        DefaultValueNumber: null,
        DefaultValueDate: null,
        DefaultValueTimestamp: null,
        DerivationValue: null,
        ReadOnlyFlag: 'N',
        BIEnabledFlag: 'Y',
        BIEqualizationTag: null,
        IndexedFlag: 'N',
        MultirowUniqueKeyFlag: 'N',
        ShowValueDescription: 'N',
        CreationDate: new Date().toISOString(),
        CreatedBy: 'CUSTOMIZED_USER',
        LastUpdateDate: new Date().toISOString(),
        LastUpdatedBy: 'CUSTOMIZED_USER',
        LastUpdateLogin: null,
        ValueSetCode: udaData['eff-column'].includes('CHAR') ? 'XX_DSO_CHAR': 'XX_DSO_NUMBER',
        UomClassCode: null
    }
    dffSegment.push(dffSegmentObj)
}

const populateDFFPageTaskFlow =  async(dffPageTaskFlow, itemCommodity, itemClass) => {
    let pageCode = itemCommodity.replace(/\s/g,'')
    const dffPageTaskFlowObj =   {
        'FND_APP_DESCRIPTIVE_FLEXFIELD.DescriptiveFlexfieldCode': 'EGO_ITEM_EFF',
        'FND_APP_DESCRIPTIVE_FLEXFIELD.ApplicationId': 10010,
        'ORA_FND_APP_DESCRIPTIVE_FLEXFIELD_USAGE.FlexfieldUsageCode': 'EGO_ITEM_DL',
        'ORA_FND_APP_DESCRIPTIVE_FLEXFIELD_PAGE.CategoryCode': itemClass.replace(/\s/g,''),
        'ORA_FND_APP_DESCRIPTIVE_FLEXFIELD_PAGE.PageCode': pageCode.substring(0,30),
        ContextCode: itemCommodity,
        ContextCategoryCode: itemClass,
        SequenceNumber: 10,
        CreationDate: new Date().toISOString(),
        CreatedBy: 'CUSTOMIZED_USER',
        LastUpdateDate: new Date().toISOString(),
        LastUpdatedBy: 'CUSTOMIZED_USER',
        LastUpdateLogin: null
      }

      dffPageTaskFlow.push(dffPageTaskFlowObj)
}

const populateDFFPage = async(dffPage, itemCommodity, itemClass) => {
    let pageCode = itemCommodity.replace(/\s/g,'')
    const dffPageObj =   {
        'FND_APP_DESCRIPTIVE_FLEXFIELD.DescriptiveFlexfieldCode': 'EGO_ITEM_EFF',
        'FND_APP_DESCRIPTIVE_FLEXFIELD.ApplicationId': 10010,
        'ORA_FND_APP_DESCRIPTIVE_FLEXFIELD_USAGE.FlexfieldUsageCode': 'EGO_ITEM_DL',
        CategoryCode: itemClass.description,
        PageCode: pageCode.substring(0,30),
        ProtectedFlag: 'N',
        SequenceNumber: 10,
        Name: itemCommodity,
        Description: itemCommodity,
        InstructionHelpText: '',
        CreationDate: new Date().toISOString(),
        CreatedBy: 'CUSTOMIZED_USER',
        LastUpdateDate: new Date().toISOString(),
        LastUpdatedBy: 'CUSTOMIZED_USER',
        LastUpdateLogin: null
      }

      dffPage.push(dffPageObj)
}

const populateDFFContextUsage = async(dffContextUsage, itemCommodity) => {
    const dffContextUsageObj =   {
        'FND_APP_DESCRIPTIVE_FLEXFIELD.DescriptiveFlexfieldCode': 'EGO_ITEM_EFF',
        'FND_APP_DESCRIPTIVE_FLEXFIELD.ApplicationId': 10010,
        'ORA_FND_APP_DESCRIPTIVE_FLEXFIELD_CONTEXT.ContextCode': itemCommodity,
        FlexfieldUsageCode: 'EGO_ITEM_DL',
        ViewPrivilegeName: '',
        EditPrivilegeName: '',
        CreationDate: new Date().toISOString(),
        CreatedBy: 'CUSTOMIZED_USER',
        LastUpdateDate: new Date().toISOString(),
        LastUpdatedBy: 'CUSTOMIZED_USER',
        LastUpdateLogin: null
      }
    dffContextUsage.push(dffContextUsageObj)
}


const populateDFFContextSegment = async(dffContextSegment) => {
 const dffContextSegmentObj =   {
    'FND_APP_DESCRIPTIVE_FLEXFIELD.DescriptiveFlexfieldCode': 'EGO_ITEM_EFF',
    'FND_APP_DESCRIPTIVE_FLEXFIELD.ApplicationId': 10010,
    ContextCode: 'Context Data Element',
    SegmentCode: 'Context Segment',
    SegmentIdentifier: '',
    ColumnName: 'CONTEXT_CODE',
    Name: 'Context Segment',
    Description: 'Context Segment Description',
    Prompt: 'Context Value',
    ShortPrompt: 'Context Value',
    TerminologyHelpText: '',
    InFieldHelpText: '',
    DisplayType: 'TEXT_BOX',
    DisplayWidth: 30,
    RequiredFlag: 'N',
    DefaultType: '',
    DefaultValue: '',
    DerivationValue: '',
    ReadOnlyFlag: 'N',
    BIEnabledFlag: 'N',
    BIEqualizationTag: '',
    CreationDate: new Date().toISOString(),
    CreatedBy: 'CUSTOMIZED_USER',
    LastUpdateDate: new Date().toISOString(),
    LastUpdatedBy: 'CUSTOMIZED_USER',
    LastUpdateLogin: null,
    ValueSetCode: ''
  }

  dffContextSegment.push(dffContextSegmentObj)
}

const populateDFFContextCategory = async(dffContextCategory, itemCommodity, itemClass) =>{
    const dffContextCatObj =   {
        'FND_APP_DESCRIPTIVE_FLEXFIELD.DescriptiveFlexfieldCode': 'EGO_ITEM_EFF',
        'FND_APP_DESCRIPTIVE_FLEXFIELD.ApplicationId': 10010,
        'ORA_FND_APP_DESCRIPTIVE_FLEXFIELD_CONTEXT.ContextCode': itemCommodity,
        CategoryCode: itemClass,
        CreationDate: new Date().toISOString(),
        CreatedBy: 'CUSTOMIZED_USER',
        LastUpdateDate: new Date().toISOString(),
        LastUpdatedBy: 'CUSTOMIZED_USER',
        LastUpdateLogin: null
      }

      dffContextCategory.push(dffContextCatObj)
}

const populateItemDFFContext = async(dffContext, itemCommodity) => {
    const dffContextObj =   {
        'FND_APP_DESCRIPTIVE_FLEXFIELD.DescriptiveFlexfieldCode': 'EGO_ITEM_EFF',
        'FND_APP_DESCRIPTIVE_FLEXFIELD.ApplicationId': 10010,
        ContextCode: itemCommodity,
        ContextIdentifier: itemCommodity.replace(/\s/g,''),
        Name: itemCommodity,
        Description: itemCommodity,
        InstructionHelpText: '',
        EnabledFlag: 'Y',
        MultirowFlag: 'N',
        TranslatableFlag: 'N',
        CreationDate: new Date().toISOString(),
        CreatedBy: 'CUSTOMIZED_USER',
        LastUpdateDate: new Date().toISOString(),
        LastUpdatedBy: 'CUSTOMIZED_USER',
        LastUpdateLogin: null
      }

      dffContext.push(dffContextObj)
}

const populateDFF = async(itemDff) => {
    const itemDFFObj =   {
        DescriptiveFlexfieldCode: 'EGO_ITEM_EFF',
        ApplicationId: 10010,
        Name: 'Item Extended Attributes',
        Description: 'Extended fields for item properties',
        Delimiter: '-',
        CreationDate: new Date().toISOString(),
        CreatedBy: 'CUSTOMIZED_USER',
        LastUpdateDate: new Date().toISOString(),
        LastUpdatedBy: 'CUSTOMIZED_USER',
        LastUpdateLogin: null
     };

     itemDff.push(itemDFFObj)
}

const populateItemSegment = async (itemSegmentConvData, itemSegment) => {
    const itemSegmentObj = new ItemClass()
    itemSegmentObj.itemClassCode = itemSegment.replace(/\s/g, '')
    itemSegmentObj.itemClassName = itemSegment
    itemSegmentObj.description = itemSegment
    itemSegmentObj.parentItemClassCode = 'ROOT_ICC'
    itemSegmentConvData.push({...itemSegmentObj})
}

const populateItemFamily = async (itemFamilyConvData, itemFamily, itemSegment) => {
    const itemFamilyObj = new ItemClass()
    itemFamilyObj.itemClassCode = itemFamily.replace(/\s/g, '')
    itemFamilyObj.itemClassName = itemFamily
    itemFamilyObj.description = itemFamily
    itemFamilyObj.parentItemClassCode = itemSegment.replace(/\s/g, '')
    itemFamilyConvData.push({...itemFamilyObj})
}

const populateItemClass = async (itemClassConvData, itemClass, itemFamily) => {
    const itemClassObj = new ItemClass()
    itemClassObj.itemClassCode = itemClass.replace(/\s/g, '')
    itemClassObj.itemClassName = itemClass
    itemClassObj.description = itemClass
    itemClassObj.parentItemClassCode = itemFamily.replace(/\s/g, '')
    itemClassConvData.push({...itemClassObj})
}


const getItemClass = (unspsc) => {
    return new Promise ((resolve, reject) => {
        itemClassDB.findOne({class: parseInt(unspsc.substring(0,6) + '00')}, (error, docs) => {
            error ? reject(error) : resolve(docs)
        })
    })
}

const getItemFamily = (unspsc) => {
    return new Promise ((resolve, reject) => {
        itemFamilyDB.findOne({family: parseInt(unspsc.substring(0,4) + '0000')}, (error, docs) => {
            error ? reject(error) : resolve(docs)
        })
    })
}

const getItemSegment = (unspsc) => {
    return new Promise ((resolve, reject) => {
        itemSegmentDB.findOne({segment: parseInt(unspsc.substring(0,2) + '000000')}, (error, docs) => {
            error ? reject(error) : resolve(docs)
        })
    })
}

const getCommodity = (unspsc) => {
    return new Promise((resolve, reject) => {
        commodityDB.findOne({commodity: parseInt(unspsc)}, (error, docs) => {
            error ? reject(error) :  resolve(docs)
        })
    })
}



const populateEFFData = (dataSet, data, udaData, batchNumber, commodity) => {
    const itemEff = new ItemEff();
    itemEff.transactionType = 'Sync'
    itemEff.batchNumber = batchNumber
    itemEff.itemNumber = data.DSID
    itemEff.organizationCode = 'CLOUD_ITEM_MASTER'
    itemEff.attributeGroupCode = commodity
    Object.keys(udaData).filter(filterData => filterData !== 'unspsc')
                          .map(mapData => itemEff[udaData[mapData]] = data[mapData.toLowerCase()]
                           && data[mapData.toLowerCase()] !== 'NULL' ?  data[mapData.toLowerCase()].replace(', ','') : itemEff[udaData[mapData]])
    dataSet.push({...itemEff});
}

const populateItemsInterfaceData = (dataSet, data, batchNumber) => {
    const item = new Item()
    item.transactionType = 'SYNC'
    item.batchNumber = batchNumber
    item.itemNumber = data.DSID
    item.orgCode = 'CLOUD_ITEM_MASTER'
    item.description = data.part_description
    item.templateName = 'Copy of Purchased Item'
    item.itemClassName = data.product_family
    item.primaryUOM = data.quantity && data.quantity !== 'NULL' ? data.quantity : 'Each'
    item.lifeCyclePhase = 'Production'
    item.itemStatus = 'Active'
    dataSet.push({...item})
}

const editASMFile = (asmLocation, filename) => {
       
        return new Promise((resolve, reject) => {
            const data =  fs.readFileSync(asmLocation)
            xml2js.parseString(data, (err, result) => {
                if(err) reject(err)
                result.MigrationProcessCSVMetadataVO.MigrationProcessCSVMetadataVORow[0].ProcessName[0] = filename
                result.MigrationProcessCSVMetadataVO.MigrationProcessCSVMetadataVORow[0].ProcessDescription[0] = filename
                result.MigrationProcessCSVMetadataVO.MigrationProcessCSVMetadataVORow[0].ProcessDate[0] = new Date().toISOString()
                const builder = new xml2js.Builder()
                const edittedData = builder.buildObject(result)
                fs.writeFileSync(asmLocation, edittedData)
                resolve()
            })
        })
}

module.exports = {
    getSFTPDetails,
    readSFTPFile,
    getCsvForm,
    formatDate,
    formatDateMinUnderscores,
    fetchUdaData,
    fetchUdaPerUnspsc,
    createFBDINew,
    fetchPreRequisiteData,
    postDataToItemConvDB,
    editASMFile
}
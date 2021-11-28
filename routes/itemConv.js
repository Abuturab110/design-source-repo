const utils = require('../utils/general-utilities')
var express = require('express');
var router = express.Router();
const dbSet = require('../utils/db')
, db = dbSet.itemConvDB
,itemConvHomeDB = dbSet.itemConvHomeDB
,itemClassConversionHomeDB = dbSet.itemClassConversionHomeDB
const counterFunctions = require('../utils/counter')
const fs = require('fs')
const admZip = require('adm-zip')
const base64 = require('file-base64')
const request = require('request')
const Client = require('ssh2-sftp-client')

router.get('/getItemConvDetails', function(req, res, next) {
    db.find({}).exec(function (err, docs) {
      if (err) return next(err);
      res.send(docs);
  })
})


router.get('/getItemConvHomeDetails', function(req, res, next) {
  itemConvHomeDB.find({}, function (err, docs) {
      if (err) return next(err);
      res.send(docs);
  });
});

router.get('/getItemClassConvHome', function(req, res, next) {
  itemClassConversionHomeDB.find({}, function (err, docs) {
      if (err) return next(err);
      res.send(docs);
  });
});

router.post('/postItemConvDetails', function(req, res, next) {
  let postData = {...req.body, 'creation-date': new Date().toISOString(), 'last-update-date': new Date().toISOString()};
  db.insert(postData, function (err, docs) {
    if (err) return next(err);
     res.send(docs);
  });
});

router.put('/putItemConvDetails', function (req, res, next) {
  const putData = {...req.body, 'last-update-date': new Date().toISOString()}
     db.update({_id:req.body._id},{ $set: putData },{}, function (err, docs) {
     if (err) return next(err);
     res.send('{"MSG":"SUCCESS"}');
  });
});

router.delete('/deleteItemConvDetails/:id', function (req, res, next) {
  db.remove({_id:req.params.id},{}, function (err, docs) {
     if (err) return next(err);
     res.send('{"MSG":"SUCCESS"}');
  });
});

router.get('/createFBDI', async function(req, res, next) {
  if (!req.query.environment) {
    return res.status(400).send({
      error: 'No environment specified'
    })
  }

  if (!req.query.filename) {
    return res.status(400).send({
      error: 'No filename specified'
    })
  }

  const environment = req.query.environment;
  const filename = req.query.filename;
  const sourceDst = `/home/ftpscmo/DesignSource/Data/${filename}`
  const targetDst =  `./output/${filename}`
  const currentDate = utils.formatDate()
  const asmCurrentDate = utils.formatDateMinUnderscores()
  try {
  const ftpServerDetails = await utils.getSFTPDetails(environment)
  const fileData = await utils.readSFTPFile(ftpServerDetails,sourceDst, targetDst)
  const preRequisiteData = await utils.fetchPreRequisiteData(fileData)

  /*Item Class*/
  let zip = new admZip()
  const itemClassCsv = await utils.getCsvForm(preRequisiteData[0].data)
  await utils.editASMFile('./output/properties/ITEMCLASS/ASM_SETUP_CSV_METADATA.xml', 'Manage Item Class_' + asmCurrentDate)
  fs.writeFileSync('./output/EGP_ITEM_CLASS.csv',itemClassCsv)
  zip.addLocalFile('./output/EGP_ITEM_CLASS.csv')
  zip.addLocalFile('./output/properties/ITEMCLASS/ASM_SETUP_CSV_METADATA.xml')
  const itemClassConvFileName = `${preRequisiteData[0].name}_${currentDate}.zip`
  zip.writeZip(`./output/${itemClassConvFileName}`)
  /*End of Item Class*/

  /* Item Family */
  zip = new admZip()
  const itemFamilyCsv = await utils.getCsvForm(preRequisiteData[1].data)
  await utils.editASMFile('./output/properties/ITEMFAMILY/ASM_SETUP_CSV_METADATA.xml', 'Manage Item Family_' + asmCurrentDate)
  fs.writeFileSync('./output/EGP_ITEM_CLASS.csv',itemFamilyCsv)
  zip.addLocalFile('./output/EGP_ITEM_CLASS.csv')
  zip.addLocalFile('./output/properties/ITEMFAMILY/ASM_SETUP_CSV_METADATA.xml')
  const itemFamilyConvFileName = `${preRequisiteData[1].name}_${currentDate}.zip`
  zip.writeZip(`./output/${itemFamilyConvFileName}`)
  /* End of Item Family */

  /* Item Segment */
  zip = new admZip()
  const itemSegmentCsv = await utils.getCsvForm(preRequisiteData[2].data)
  await utils.editASMFile('./output/properties/ITEMSEGMENT/ASM_SETUP_CSV_METADATA.xml', 'Manage Item Segment_' + asmCurrentDate)
  fs.writeFileSync('./output/EGP_ITEM_CLASS.csv',itemSegmentCsv)
  zip.addLocalFile('./output/EGP_ITEM_CLASS.csv')
  zip.addLocalFile('./output/properties/ITEMSEGMENT/ASM_SETUP_CSV_METADATA.xml')
  const itemSegmentConvFileName = `${preRequisiteData[2].name}_${currentDate}.zip`
  zip.writeZip(`./output/${itemSegmentConvFileName}`)
  /* End of Item Segment */

  /* UDA */
  zip = new admZip()
  const dffCsv = await utils.getCsvForm(preRequisiteData[3].data, true) 
  const dffContextCsv = await utils.getCsvForm(preRequisiteData[4].data, true) 
  const dffContextCategoryCsv = await utils.getCsvForm(preRequisiteData[5].data, true) 
  const dffContextSegmentCsv = await utils.getCsvForm(preRequisiteData[6].data, true) 
  const dffContextUsageCsv = await utils.getCsvForm(preRequisiteData[7].data, true) 
  const dffPageCsv = await utils.getCsvForm(preRequisiteData[8].data, true) 
  const dffPageTaskFlowCsv = await utils.getCsvForm(preRequisiteData[9].data, true) 
  const dffSegmentCsv = await utils.getCsvForm(preRequisiteData[10].data, true) 
  const dffUsageCsv = await utils.getCsvForm(preRequisiteData[11].data, true) 
  await utils.editASMFile('./output/properties/UDACONV/ASM_SETUP_CSV_METADATA.xml', 'Manage UDA_' + asmCurrentDate)
  fs.writeFileSync('./output/FND_APP_DESCRIPTIVE_FLEXFIELD.csv',dffCsv)
  fs.writeFileSync('./output/ORA_FND_APP_DESCRIPTIVE_FLEXFIELD_CONTEXT.csv',dffContextCsv)
  fs.writeFileSync('./output/ORA_FND_APP_DESCRIPTIVE_FLEXFIELD_CONTEXT_CATEGORY.csv',dffContextCategoryCsv)
  fs.writeFileSync('./output/ORA_FND_APP_DESCRIPTIVE_FLEXFIELD_CONTEXT_SEGMENT.csv',dffContextSegmentCsv)
  fs.writeFileSync('./output/ORA_FND_APP_DESCRIPTIVE_FLEXFIELD_CONTEXT_USAGE.csv',dffContextUsageCsv)
  fs.writeFileSync('./output/ORA_FND_APP_DESCRIPTIVE_FLEXFIELD_PAGE.csv',dffPageCsv)
  fs.writeFileSync('./output/ORA_FND_APP_DESCRIPTIVE_FLEXFIELD_PAGE_TASK_FLOW.csv',dffPageTaskFlowCsv)
  fs.writeFileSync('./output/ORA_FND_APP_DESCRIPTIVE_FLEXFIELD_SEGMENT.csv',dffSegmentCsv)
  fs.writeFileSync('./output/ORA_FND_APP_DESCRIPTIVE_FLEXFIELD_USAGE.csv',dffUsageCsv)
  zip.addLocalFile('./output/FND_APP_DESCRIPTIVE_FLEXFIELD.csv')
  zip.addLocalFile('./output/ORA_FND_APP_DESCRIPTIVE_FLEXFIELD_CONTEXT.csv')
  zip.addLocalFile('./output/ORA_FND_APP_DESCRIPTIVE_FLEXFIELD_CONTEXT_CATEGORY.csv')
  zip.addLocalFile('./output/ORA_FND_APP_DESCRIPTIVE_FLEXFIELD_CONTEXT_SEGMENT.csv')
  zip.addLocalFile('./output/ORA_FND_APP_DESCRIPTIVE_FLEXFIELD_CONTEXT_USAGE.csv')
  zip.addLocalFile('./output/ORA_FND_APP_DESCRIPTIVE_FLEXFIELD_PAGE.csv')
  zip.addLocalFile('./output/ORA_FND_APP_DESCRIPTIVE_FLEXFIELD_PAGE_TASK_FLOW.csv')
  zip.addLocalFile('./output/ORA_FND_APP_DESCRIPTIVE_FLEXFIELD_SEGMENT.csv')
  zip.addLocalFile('./output/ORA_FND_APP_DESCRIPTIVE_FLEXFIELD_USAGE.csv')
  zip.addLocalFile('./output/properties/UDACONV/ASM_SETUP_CSV_METADATA.xml')
  const udaConvFileName = `Manage Item Attribute Groups and Attributes_${currentDate}.zip`
  zip.writeZip(`./output/${udaConvFileName}`)
  /* End of UDA */

  zip = new admZip()
  const itemCatalogCsv = await utils.getCsvForm(preRequisiteData[12].data)
  const itemCatalogCategoryCsv = await utils.getCsvForm(preRequisiteData[13].data)
  const itemCatalogPropertiesCsv = await utils.getCsvForm(preRequisiteData[14].data)
  fs.writeFileSync('./output/EgpCategorySetsInterface.csv',itemCatalogCsv)
  fs.writeFileSync('./output/EgpCategoriesInterface.csv',itemCatalogCategoryCsv)
  fs.writeFileSync('./output/properties/catalogImport.properties',itemCatalogPropertiesCsv)
  zip.addLocalFile('./output/EgpCategorySetsInterface.csv')
  zip.addLocalFile('./output/EgpCategoriesInterface.csv')
  zip.addLocalFile('./output/properties/catalogImport.properties')
  const itemCatalogConvFileName = `egpcatalogimport_${currentDate}.zip`
  zip.writeZip(`./output/${itemCatalogConvFileName}`)
  const udaData = await utils.fetchUdaData()
  const itemConvData = await utils.createFBDINew(fileData, udaData)
  zip = new admZip()
  const itemCsv = await utils.getCsvForm(itemConvData[0].data)
  const itemEffCsv = await utils.getCsvForm(itemConvData[1].data)
  const itemPropCSV = await utils.getCsvForm(itemConvData[2].data)
  fs.writeFileSync('./output/EgpSystemItemsInterface.csv', itemCsv)
  fs.writeFileSync('./output/EgoItemIntfEffb.csv', itemEffCsv)
  fs.writeFileSync('./output/properties/ItemImport.properties', itemPropCSV)
  zip.addLocalFile('./output/EgpSystemItemsInterface.csv')
  zip.addLocalFile('./output/EgoItemIntfEffb.csv')
  zip.addLocalFile('./output/properties/ItemImport.properties')
  const itemConvFileName = `ItemImport_${currentDate}.zip`
  zip.writeZip(`./output/${itemConvFileName}`)
  const itemCatalogBatchId =  preRequisiteData[15].data
  const itemBatchId = itemConvData[3].data
  res.send({
    run: filename,
    fbdi: itemConvFileName,
    'item-class': itemClassConvFileName,
    'item-family': itemFamilyConvFileName,
    'item-segment': itemSegmentConvFileName,
    'uda-conv' : udaConvFileName,
    'item-catalog': itemCatalogConvFileName,
    'total-records': fileData.length,
    'item-batch-id': itemBatchId,
    'catalog-batch-id': itemCatalogBatchId,
     success: itemConvData[0].data.length,
     error: fileData.length - itemConvData[0].data.length
  })
 } catch(e) {
    res.status(500).send(e)
 }
})

router.post('/insertItemConvDetails', async function(req, res, next) {
  const insertObj =  {
    'request-id': '',
    'run': req.body.run,
    'fbdi': req.body.fbdi,
    'item-class': req.body['item-class'],
    'item-family': req.body['item-family'],
    'item-segment': req.body['item-segment'],
    'uda-conv': req.body['uda-conv'],
    'item-catalog': req.body['item-catalog'],
    'item-batch-id': req.body[ 'item-batch-id'],
    'catalog-batch-id': req.body['catalog-batch-id'],
    'fbdi-status': 'Completed',
    'cloud-process-status': '',
    'total-records': req.body['total-records'],
    'success': req.body.success,
    'error': req.body.error,
    'creation-date': new Date().toString(),
    'last-update-date': new Date().toString()
}

  try {
    await utils.postDataToItemConvDB(insertObj)
    res.send({
      result: 'File Posted Successfully'
    })
  } catch (err) {
    res.status(500).send(err)
  }

})

router.get('/publishToCloud', function (req, res, next) {

  if (!req.query.filename) return res.json({
    error: 'Filename not provided'
  })

  if (!req.query.userName) return res.json({
    error: 'Username not provided'
  })

  if (!req.query.password) return res.json({
    error: 'Password not provided'
  })

  if (!req.query.cloudInstanceLink) return res.json({
    error: 'Cloud Instance link not provided'
  })

  if (!req.query.itemBatchId) return res.json({
    error: 'Batch id not generated'
  })

  const filename = req.query.filename
   const itemBatchId = req.query.itemBatchId
  const username =  req.query.userName
  const password = req.query.password
  const url = req.query.cloudInstanceLink
  let filePath='./output/'+ filename;

  base64.encode(filePath, function(err, base64String) {
          
      auth = "Basic " + Buffer.from(username + ":" + password).toString("base64");
      var bodyinput={
        "OperationName" : "importBulkData",	
        "DocumentContent" : base64String,
        "ContentType" : "zip",
        "FileName": filename,
        "DocumentAccount" : "scm$/item$/import$",
        "JobName" : "/oracle/apps/ess/scm/productModel/items,ItemImportJobDef",
        "ParameterList" : `#NULL,#NULL,#NULL,#NULL,#NULL,#NULL,#NULL`,
        "CallbackURL" : "http://192.168.1.4:4300/response"
    };
    
    request.post({ url : url, body : bodyinput, json : true,  headers : { "Authorization" : auth } }, function (error, response, body) {
      console.log('In request post')   
      if (error) return next(error)
      if (response.statusCode = 201) {
          res.json(body)
      } else {
         res.json(response)
      }
        });
    });
});


router.get('/publishItemCatalogToCloud', function (req, res, next) {
  if (!req.query.filename) return res.json({
    error: 'Filename not provided'
  })

  if (!req.query.userName) return res.status(400).send({
    error: 'Username not provided'
  })

  if (!req.query.password) return res.status(400).send({
    error: 'Password not provided'
  })

  if (!req.query.cloudInstanceLink) return res.status(400).send({
    error: 'Cloud Instance link not provided'
  })
  if (!req.query.itemCatalogBatchId) return res.status(400).send({
    error: 'Batch id not generated'
  })

  const filename = req.query.filename
   const itemCatalogBatchId = req.query.itemCatalogBatchId
   const username =  req.query.userName
   const password = req.query.password
   const url = req.query.cloudInstanceLink

  let filePath='./output/'+ filename;

  base64.encode(filePath, function(err, base64String) {
  console.log('base64String' + base64String);
      
  auth = "Basic " + Buffer.from(username + ":" + password).toString("base64");
  var bodyinput={
     "OperationName":"importBulkData",	
     "DocumentContent":base64String,
     "ContentType":"zip",
     "FileName": filename,
     "DocumentAccount":"scm$/item$/import$",
     "JobName":"/oracle/apps/ess/scm/productModel/items,CatalogImportJobDef",
     "ParameterList":`${itemCatalogBatchId},#NULL,#NULL`,
     "CallbackURL":"http://192.168.1.4:4300/response"
 };
 
 request.post({ url : url, body:bodyinput, json:true,  headers : { "Authorization" : auth } }, function (error, response, body) {
      if (error)   return res.status(400).send(error);
      if (response.statusCode = 201)
      { res.json(body);}
      else
      {res.json(response);}
    }
  );
});
});

router.get('/getFtpDetails', function (req, res, next) {
  dbSet.ftpServerSetupDB.find({ }, function (error, docs) {
    if(error) return next(error)
        res.send(docs);
      });
  }); 

  router.get('/itemConvRefreshFiles/:ftpName', function (req, res, next) {
    const getFtpDetails = new Promise((resolve, reject) => {
       dbSet.ftpServerSetupDB.find({ "ftpName": req.params.ftpName }, function (error, doc) {
         if(error) reject(error)
           return resolve(doc);
       });
    });
    const listFiles = () => {
       getFtpDetails
          .then((ftpDetails) => {
             let sftp = new Client();
             sftp.connect({
                host: ftpDetails[0].ftpHost,
                port: ftpDetails[0].ftpPort,
                username: ftpDetails[0].userName,
                password: ftpDetails[0].password
             }).then(() => {
                return sftp.list(ftpDetails[0].path);
             }).then(data => {
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


module.exports = router;
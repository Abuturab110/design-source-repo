const utils = require('../utils/general-utilities')
var express = require('express');
var router = express.Router();
const dbSet = require('../utils/db')
, db = dbSet.itemConvDB;
const base64 = require('file-base64');
const request = require('request');
const Client = require('ssh2-sftp-client');

router.get('/getItemConvDetails', function(req, res, next) {
    db.find({}, function (err, docs) {
        if (err) return next(err);
        res.json(docs);
    });
});

router.post('/postItemConvDetails', function(req, res, next) {
  let postData = {...req.body, "creation-date": new Date().toString(), "last-update-date": new Date().toString()};
  db.insert(postData, function (err, docs) {
    if (err) return next(err);
     console.log('files inserted successfully' + JSON.stringify(req.body));
     res.json(docs);
  });
});

router.put('/putItemConvDetails', function (req, res, next) {
     db.update({_id:req.body._id},{ $set: req.body },{}, function (err, docs) {
     if (err) return next(err);
     res.json('{"MSG":"SUCCESS"}');
  });
});

router.delete('/deleteItemConvDetails/:id', function (req, res, next) {
  db.remove({_id:req.params.id},{}, function (err, docs) {
     if (err) return next(err);
     res.json('{"MSG":"SUCCESS"}');
  });
});

router.get('/createFBDI', function(req, res, next) {
  if (!req.query.environment) {
    return next({
      error: 'No environment specified'
    })
  }

  if (!req.query.filename) {
    return next({
      error: 'No filename specified'
    })
  }


  const environment = req.query.environment;
  const filename = req.query.filename;
  const sourceDst = `/home/ftpscmo/DesignSource/Data/${filename}`
  const targetDst =  `./output/${filename}`
  let count;
  utils.processFile(environment, sourceDst, targetDst).then((result) => {
    const resultObj = [
    {
      set: result.itemsInterfaceDataSet,
      file: './output/EgpSystemItemsInterface.csv'
    },
    {
      set: result.effDataSet,
      file: './output/EgoItemIntfEffb.csv'
    }]
   count = result.count
   const zipFileName = utils.generateCSVFromFileAndZip(resultObj)
    res.json({
      run: filename,
      fbdi: zipFileName,
      count: count
    })
  }).catch((error) => {
    next({
      error: error
    })
  })

})

router.post('/insertItemConvDetails', function(req, res, next) {
  const insertObj =  {
    'request-id': '',
    'run': req.body.run,
    'fbdi': req.body.fbdi,
    'fbdi-status': 'Completed',
    'cloud-process-status': '',
    'total-records': req.body.count,
    'success': req.body.count,
    'error': 0,
    'creation-date': new Date().toString(),
    'last-update-date': new Date().toString()
}

utils.postDataToItemConvDB(insertObj, (error, result) => {
  if (error) return next(error)
  res.json({
    result: 'File Posted Successfully'
  })
})

})

router.get('/publishToCloud', function (req, res, next) {
  if (!req.query.filename) return res.json({
    error: 'Filename not provided'
  })

  let filePath='./output/'+req.query.filename;

  base64.encode(filePath, function(err, base64String) {
  console.log('base64String' + base64String);
      
    username =  req.query.userName,
    password = req.query.password,
    url = req.query.cloudInstanceLink, 
  
  auth = "Basic " + Buffer.from(username + ":" + password).toString("base64");
  var bodyinput={
     "OperationName":"importBulkData",	
     "DocumentContent":base64String,
     "ContentType":"zip",
     "FileName":req.query.filename,
     "DocumentAccount":"scm$/item$/import$",
     "JobName":"/oracle/apps/ess/scm/productModel/items,ItemImportJobDef",
     "ParameterList":"#NULL,#NULL,#NULL,#NULL,#NULL",
     "CallbackURL":"http://192.168.1.4:4300/response"
 };
 
 request.post({ url : url, body:bodyinput, json:true,  headers : { "Authorization" : auth } }, function (error, response, body) {
      if (error) {  return next(error)};
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
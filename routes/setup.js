var express = require('express');
var router = express.Router();
const multer = require('multer');
const readXlsxFile = require('read-excel-file/node');
const db = require('../utils/db')
, cloudServerSetupDB = db.cloudServerSetupDB
, ftpServerSetupDB = db.ftpServerSetupDB
, unsPscSegmentDB = db.unsPscSegmentDB
, unsPscFamilyDB = db.unsPscFamilyDB
, unsPscClassDB = db.unsPscClassDB
, unsPscCommodityDB = db.unsPscCommodityDB;

const  fileFilter = (req, file, cb) => {
        if (!file.originalname.match(/\.(xlsx)$/)) {
            return cb(new Error('Invalid file format'))
        }

        cb(undefined, true)
};
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, './resources/');
  },
  filename: (req, file, cb) => {
    cb(null, `${Date.now()}-${file.originalname}`);
  },
});
const upload = multer({ storage, fileFilter });

router.put('/putFtpServerDetails', function (req, res, next) {
  let putData = {...req.body, "last-update-date": new Date().toString()};
     ftpServerSetupDB.update({_id:req.body._id},{ $set: putData },{}, function (err, docs) {
     if (err) 
        return res.json(err);
     res.send('{"MSG":"SUCCESS"}');
  });
});

router.delete('/deleteFtpServerDetails/:id', function (req, res, next) {
  ftpServerSetupDB.remove({_id:req.params.id},{}, function (err, docs) {
     if (err) return res.json(err);
     res.send('{"MSG":"SUCCESS"}');
  });
});

router.post('/postFtpServerDetails', function (req, res, next) {
  let postData = {...req.body, "creation-date": new Date().toString(), "last-update-date": new Date().toString()};
  ftpServerSetupDB.insert(postData, function (err, docs) {
     if (err) return res.json(err);
     res.send('{"MSG":"SUCCESS"}');
  });
});

router.get('/getFtpServerDetails', function (req, res, next) {
  ftpServerSetupDB.find({}).sort({}).skip().limit().exec(function (err, docs) {
    let totalCount = 0;
    if (err) return next(err);
    docs.forEach(doc => {
      totalCount++;
    })
    ftpServerSetupDB.find({}).skip((req.query.pageIndex*req.query.pageSize)).limit(req.query.pageSize).exec(function (err, docs) {
      if (err) return next(err);
      docs.push({Total:totalCount });
      res.send(docs);
  });
 });
}); 

router.get('/getCloudServerDetails', function(req, res, next) {
  cloudServerSetupDB.find({}).sort({}).skip().limit().exec(function (err, docs) {
    let totalCount = 0;
    if (err) return next(err);
    docs.forEach(doc => {
      totalCount++;
    })
    cloudServerSetupDB.find({}).skip((req.query.pageIndex*req.query.pageSize)).limit(req.query.pageSize).exec(function (err, docs) {
      if (err) return next(err);
      docs.push({Total:totalCount });
      res.send(docs);
  });
 });
 });

 router.get('/getCloudServerForItemConversion', function(req, res, next) {
     cloudServerSetupDB.find({}, function (err, docs) {
      if (err) return next(err);
      res.json(docs);
});
});

router.get('/getUnspscSegmentDetails', function(req, res, next) {
  unsPscSegmentDB.find({}).sort({}).skip().limit().exec(function (err, docs) {
    let totalCount = 0;
    if (err) return next(err);
    docs.forEach(doc => {
      totalCount++;
    })
    unsPscSegmentDB.find({}).skip((req.query.pageIndex*req.query.pageSize)).limit(req.query.pageSize).exec(function (err, docs) {
      if (err) return next(err);
      docs.push({Total:totalCount });
      res.send(docs);
  });
 });
 });

router.get('/getUnspscFamilyDetails', function(req, res, next) {
  
  unsPscFamilyDB.find({}).sort({}).skip().limit().exec(function (err, docs) {
    let totalCount = 0;
    if (err) return next(err);
    docs.forEach(doc => {
      totalCount++;
    })
    unsPscFamilyDB.find({}).skip((req.query.pageIndex*req.query.pageSize)).limit(req.query.pageSize).exec(function (err, docs) {
      if (err) return next(err);
      docs.push({Total:totalCount });
      res.send(docs);
  });
 });
    
});

router.get('/getUnspscClassDetails', function(req, res, next) {
  unsPscClassDB.find({}).sort({}).skip().limit().exec(function (err, docs) {
    let totalCount = 0;
    if (err) return next(err);
    docs.forEach(doc => {
      totalCount++;
    })
    unsPscClassDB.find({}).skip((req.query.pageIndex*req.query.pageSize)).limit(req.query.pageSize).exec(function (err, docs) {
      if (err) return next(err);
      docs.push({Total:totalCount });
      res.send(docs);
  });
 });
});

router.get('/getUnspscCommodityDetails', function(req, res, next) {
  unsPscCommodityDB.find({}).sort({}).skip().limit().exec(function (err, docs) {
    let totalCount = 0;
    if (err) return next(err);
    docs.forEach(doc => {
      totalCount++;
    })
    unsPscCommodityDB.find({}).skip((req.query.pageIndex*req.query.pageSize)).limit(req.query.pageSize).exec(function (err, docs) {
      if (err) return next(err);
      docs.push({Total:totalCount });
      res.send(docs);
  });
 });
});

router.post('/postCloudServerDetails', function(req, res, next) {
  let postData = {...req.body, "creation-date": new Date().toString(), "last-update-date": new Date().toString()};
  cloudServerSetupDB.insert(postData, function (err, docs) {
    if (err) return next(err);
       res.send('{"MSG":"SUCCESS"}');
  });
});

router.put('/putCloudServerDetails', function (req, res, next) {
  let putData = {...req.body, "last-update-date": new Date().toString()};
  cloudServerSetupDB.update({_id:req.body._id},{ $set: putData},{}, function (err, docs) {
     if (err) return res.json(err);
     res.send('{"MSG":"SUCCESS"}');
  });
});

router.delete('/deleteCloudServerDetails/:id', function (req, res, next) {
  cloudServerSetupDB.remove({_id:req.params.id},{}, function (err, docs) {
     if (err) return res.json(err);
     res.send('{"MSG":"SUCCESS"}');
  });
});

router.post('/postUnspscSegment', function(req, res, next) {
  let postData = {...req.body, "creation-date": new Date().toString(), "last-update-date": new Date().toString()};
  unsPscSegmentDB.insert(postData, function (err, docs) {
    if (err) return next(err);
       res.send('{"MSG":"SUCCESS"}');
  });
});

router.put('/putUnspscSegment', function (req, res, next) {
  let putData = {...req.body, "last-update-date": new Date().toString()};
  unsPscSegmentDB.update({_id:req.body._id},{ $set: putData},{}, function (err, docs) {
     if (err) return res.json(err);
     res.send('{"MSG":"SUCCESS"}');
  });
});

router.delete('/deleteUnspscSegment/:id', function (req, res, next) {
  unsPscSegmentDB.remove({_id:req.params.id},{}, function (err, docs) {
     if (err) return res.json(err);
     res.send('{"MSG":"SUCCESS"}');
  });
});

router.post('/postUnspscFamily', function(req, res, next) {
  let postData = {...req.body, "creation-date": new Date().toString(), "last-update-date": new Date().toString()};
  unsPscFamilyDB.insert(postData, function (err, docs) {
    if (err) return next(err);
       res.send('{"MSG":"SUCCESS"}');
  });
});

router.put('/putUnspscFamily', function (req, res, next) {
  let putData = {...req.body, "last-update-date": new Date().toString()};
  unsPscFamilyDB.update({_id:req.body._id},{ $set: putData},{}, function (err, docs) {
     if (err) return res.json(err);
     res.send('{"MSG":"SUCCESS"}');
  });
});

router.delete('/deleteUnspscFamily/:id', function (req, res, next) {
  unsPscFamilyDB.remove({_id:req.params.id},{}, function (err, docs) {
     if (err) return res.json(err);
     res.send('{"MSG":"SUCCESS"}');
  });
});

router.post('/postUnspscClass', function(req, res, next) {
  let postData = {...req.body, "creation-date": new Date().toString(), "last-update-date": new Date().toString()};
  unsPscClassDB.insert(postData, function (err, docs) {
    if (err) return next(err);
       res.send('{"MSG":"SUCCESS"}');
  });
});

router.put('/putUnspscClass', function (req, res, next) {
  let putData = {...req.body, "last-update-date": new Date().toString()};
  unsPscClassDB.update({_id:req.body._id},{ $set: putData},{}, function (err, docs) {
     if (err) return res.json(err);
     res.send('{"MSG":"SUCCESS"}');
  });
});

router.delete('/deleteUnspscClass/:id', function (req, res, next) {
  unsPscClassDB.remove({_id:req.params.id},{}, function (err, docs) {
     if (err) return res.json(err);
     res.send('{"MSG":"SUCCESS"}');
  });
});

router.post('/postUnspscCommodity', function(req, res, next) {
  let postData = {...req.body, "creation-date": new Date().toString(), "last-update-date": new Date().toString()};
  unsPscCommodityDB.insert(postData, function (err, docs) {
    if (err) return next(err);
       res.send('{"MSG":"SUCCESS"}');
  });
});

router.put('/putUnspscCommodity', function (req, res, next) {
  let putData = {...req.body, "last-update-date": new Date().toString()};
  unsPscCommodityDB.update({_id:req.body._id},{ $set: putData},{}, function (err, docs) {
     if (err) return res.json(err);
     res.send('{"MSG":"SUCCESS"}');
  });
});

router.delete('/deleteUnspscCommodity/:id', function (req, res, next) {
  unsPscCommodityDB.remove({_id:req.params.id},{}, function (err, docs) {
     if (err) return res.json(err);
     res.send('{"MSG":"SUCCESS"}');
  });
});


router.post('/uploadUnspscMappings', upload.single('upload'), function(req,res, next) {
    readFileToUpload(req.file.filename, (error, udaEntries) => {
    if(error) return res.status(500).send({error})
      res.send({msg:'success'})
  })
})

const readFileToUpload = (fileName, cb) => {
  let path ='./resources/' + fileName;
    readXlsxFile(path,{ getSheets: true }).then((sheets)=> {
     sheets.forEach((obj)=>{
  let udaEntries = [];
    readXlsxFile(path,{sheet: obj.name}).then((rows)=> {
      rows.shift();
      let name =obj.name;
      rows.forEach((row) => {
          let udaEntry = {
               name : '' + row[0],
              "description":row[1]
          };
          udaEntries.push(udaEntry);
      })
      if(obj.name =='Segment'){
        udaEntries.forEach(udaEntry => {
          let putData = {...udaEntry, "last-update-date": new Date().toString()};
          unsPscSegmentDB.update({segment: udaEntry.name, 'description': udaEntry['description']},{ $set: putData },{upsert: true}, function (updateErr, docs) {
           if (updateErr) return res.status(500).send({error:updateErr})
      });
})
}
if(obj.name =='Family'){
  udaEntries.forEach(udaEntry => {
    let putData = {...udaEntry, "last-update-date": new Date().toString()};
    unsPscFamilyDB.update({family: udaEntry.name, 'description': udaEntry['description']},{ $set: putData },{upsert: true}, function (updateErr, docs) {
     if (updateErr) return res.status(500).send({error:updateErr})
     
  });
})
}
if(obj.name =='Class'){
  udaEntries.forEach(udaEntry => {
    let putData = {...udaEntry, "last-update-date": new Date().toString()};
    unsPscClassDB.update({class: udaEntry.name, 'description': udaEntry['description']},{ $set: putData },{upsert: true}, function (updateErr, docs) {
     if (updateErr) return res.status(500).send({error:updateErr})
     });
})
}
if(obj.name =='Commodity'){
  udaEntries.forEach(udaEntry => {
    let putData = {...udaEntry, "last-update-date": new Date().toString()};
    unsPscCommodityDB.update({commodity: udaEntry.name, 'description': udaEntry['description']},{ $set: putData },{upsert: true}, function (updateErr, docs) {
     if (updateErr) return res.status(500).send({error:updateErr})
     
  });
})
}
  cb(undefined, udaEntries);
  }).catch(error => { 
    console.log(error);
    cb(error, undefined)
     })
 })
 })
}
module.exports = router;
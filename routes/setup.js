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
  let putData = {...req.body, "last-update-date": new Date().toISOString()};
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
  let postData = {...req.body, "creation-date": new Date().toISOString(), "last-update-date": new Date().toISOString()};
  ftpServerSetupDB.insert(postData, function (err, docs) {
     if (err) return res.json(err);
     res.send('{"MSG":"SUCCESS"}');
  });
});

router.get('/getFtpServerDetails', function (req, res, next) {
    ftpServerSetupDB.find({}, function (err, docs) {
      if (err) return next(err);
      res.send(docs)
  })
 })

router.get('/getCloudServerDetails', function(req, res, next) {
    cloudServerSetupDB.find({}, function (err, docs) {
      if (err) return next(err);
      res.send(docs)
  })
 })

 router.get('/getCloudServerForItemConversion', function(req, res, next) {
     cloudServerSetupDB.find({}, function (err, docs) {
      if (err) return next(err);
      res.json(docs);
});
});

router.get('/getUnspscSegmentDetails', function(req, res, next) {
    unsPscSegmentDB.find({}, function (err, docs) {
      if (err) return next(err)
      res.send(docs)
  })
 })

router.get('/getUnspscFamilyDetails', function(req, res, next) {
    unsPscFamilyDB.find({}, function (err, docs) {
      if (err) return next(err)
      res.send(docs)
  })
 })

router.get('/getUnspscClassDetails', function(req, res, next) {
    unsPscClassDB.find({}, function (err, docs) {
      if (err) return next(err)
      res.send(docs)
  })
 })

router.get('/getUnspscCommodityDetails', function(req, res, next) {
    unsPscCommodityDB.find({}, function (err, docs) {
      if (err) return next(err)
      res.send(docs)
  })
 })



router.post('/postCloudServerDetails', function(req, res, next) {
  let postData = {...req.body, "creation-date": new Date().toISOString(), "last-update-date": new Date().toISOString()};
  cloudServerSetupDB.insert(postData, function (err, docs) {
    if (err) return next(err);
       res.send('{"MSG":"SUCCESS"}');
  });
});

router.put('/putCloudServerDetails', function (req, res, next) {
  let putData = {...req.body, "last-update-date": new Date().toISOString()};
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
  let postData = {...req.body, "creation-date": new Date().toISOString(), "last-update-date": new Date().toISOString()};
  unsPscSegmentDB.insert(postData, function (err, docs) {
    if (err) return next(err);
       res.send('{"MSG":"SUCCESS"}');
  });
});

router.put('/putUnspscSegment', function (req, res, next) {
  let putData = {...req.body, "last-update-date": new Date().toISOString()};
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
  let postData = {...req.body, "creation-date": new Date().toISOString(), "last-update-date": new Date().toISOString()};
  unsPscFamilyDB.insert(postData, function (err, docs) {
    if (err) return next(err);
       res.send('{"MSG":"SUCCESS"}');
  });
});

router.put('/putUnspscFamily', function (req, res, next) {
  let putData = {...req.body, "last-update-date": new Date().toISOString()};
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
  let postData = {...req.body, "creation-date": new Date().toISOString(), "last-update-date": new Date().toISOString()};
  unsPscClassDB.insert(postData, function (err, docs) {
    if (err) return next(err);
       res.send('{"MSG":"SUCCESS"}');
  });
});

router.put('/putUnspscClass', function (req, res, next) {
  let putData = {...req.body, "last-update-date": new Date().toISOString()};
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
  let postData = {...req.body, "creation-date": new Date().toISOString(), "last-update-date": new Date().toISOString()};
  unsPscCommodityDB.insert(postData, function (err, docs) {
    if (err) return next(err);
       res.send('{"MSG":"SUCCESS"}');
  });
});

router.put('/putUnspscCommodity', function (req, res, next) {
  let putData = {...req.body, "last-update-date": new Date().toISOString()};
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


router.post('/uploadUnspscMappings', upload.single('upload'), async function(req,res, next) {
  try {
    await readFileToUpload(req.file.filename)
    res.send({msg:'success'})
  } catch(error) {
    res.status(500).send({error})
  }
})

const readFileToUpload = async (fileName) => {
  let path ='./resources/' + fileName;
  let sheetArray = [];
  
  sheetArray = await readXlsxFile(path,{ getSheets: true})  
  
  if(!sheetArray) { throw new Error('No sheets in file') }

  for (let sheet of sheetArray) {
    let udaEntries = [];
    let rows = []
    rows = await readXlsxFile(path,{sheet: sheet.name}) 
    
    if(!rows) {  throw new Error('No rows in sheet ' + sheet.name) }

    rows.shift();
    rows.forEach((row) => {
      let udaEntry = {
            name : row[0],
            description :row[1]
          };
          udaEntries.push(udaEntry);
      })
      if(sheet.name === 'Segment') {

        udaEntries.forEach(udaEntry => {
          let putData = {...udaEntry, 'last-update-date': new Date().toISOString()};
          unsPscSegmentDB.update({segment: udaEntry.name, description: udaEntry.description},{ $set: putData },{upsert: true}, function (updateErr, docs) {
            if (updateErr) throw new Error(updateErr)
          });
        })
      }
      if(sheet.name === 'Family') {

        udaEntries.forEach(udaEntry => {
          let putData = {...udaEntry, 'last-update-date': new Date().toISOString()};
          unsPscFamilyDB.update({family: udaEntry.name, description: udaEntry.description},{ $set: putData },{upsert: true}, function (updateErr, docs) {
          if (updateErr) throw new Error(updateErr)
          
        });
      })
      }
      if(sheet.name === 'Class') {

        udaEntries.forEach(udaEntry => {
          let putData = {...udaEntry, 'last-update-date': new Date().toISOString()};
          unsPscClassDB.update({class: udaEntry.name, description: udaEntry.description},{ $set: putData },{upsert: true}, function (updateErr, docs) {
          if (updateErr) throw new Error(updateErr)

          });
      })
      }
      if(sheet.name === 'Commodity') {

        udaEntries.forEach(udaEntry => {
          let putData = {...udaEntry, 'last-update-date': new Date().toISOString()};
          unsPscCommodityDB.update({commodity: udaEntry.name, description: udaEntry.description},{ $set: putData },{upsert: true}, function (updateErr, docs) {
          if (updateErr) throw new Error(updateErr)
          
        });
      })
     }
    }
    return 'Success';
 }
module.exports = router;
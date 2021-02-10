var express = require('express');
var router = express.Router();
var Datastore = require('nedb')
, cloudServerSetupDB = new Datastore({ filename: './data_files/cloudServerSetupDB.js', autoload: true })
, ftpServerSetupDB = new Datastore({ filename: './data_files/ftpServerSetupDB.js', autoload: true });

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
  ftpServerSetupDB.find({ }, function (err, docs) {
     if (err) return next(err);
       res.send(docs);
      });
  }); 

router.get('/getCloudServerDetails', function(req, res, next) {
  cloudServerSetupDB.find({}, function (err, docs) {
        if (err) return next(err);
        res.json(docs);
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


module.exports = router;
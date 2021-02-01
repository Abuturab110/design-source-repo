var express = require('express');
var router = express.Router();
var Datastore = require('nedb')
, cloudServerSetupDB = new Datastore({ filename: './data_files/cloudServerSetupDB.js', autoload: true })
, ftpServerSetupDB = new Datastore({ filename: './data_files/ftpServerSetupDB.js', autoload: true });

router.put('/putFtpServerDetails', function (req, res, next) {
     ftpServerSetupDB.update({_id:req.body._id},{ $set: req.body },{}, function (err, docs) {
     if (err) 
        return res.json(err);
     res.send('{"MSG":"SUCCESS"}');
  });
});

router.delete('/deleteFtpServerDetails', function (req, res, next) {
  ftpServerSetupDB.remove({_id:req.body._id},{}, function (err, docs) {
     if (err) return res.json(err);
     res.send('{"MSG":"SUCCESS"}');
  });
});

router.post('/postFtpServerDetails', function (req, res, next) {
  ftpServerSetupDB.insert(req.body, function (err, docs) {
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
  cloudServerSetupDB.insert(req.body, function (err, docs) {
    if (err) return next(err);
       res.send('{"MSG":"SUCCESS"}');
  });
});

router.put('/putCloudDetails', function (req, res, next) {
  cloudServerSetupDB.update({_id:req.body._id},{ $set: req.body},{}, function (err, docs) {
     if (err) return res.json(err);
     res.send('{"MSG":"SUCCESS"}');
  });
});

router.delete('/deleteCloudServerDetails', function (req, res, next) {
  cloudServerSetupDB.remove({_id:req.body._id},{}, function (err, docs) {
     if (err) return res.json(err);
     res.send('{"MSG":"SUCCESS"}');
  });
});


module.exports = router;
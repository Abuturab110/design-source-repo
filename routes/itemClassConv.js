const utils = require('../utils/general-utilities')
var express = require('express');
var router = express.Router();
const dbSet = require('../utils/db')
, itemClassConvDB = dbSet.itemClassConvDB;
const base64 = require('file-base64');
const request = require('request');
const Client = require('ssh2-sftp-client');

router.get('/getItemConvDetails', function(req, res, next) {
  itemClassConvDB.find({}, function (err, docs) {
        if (err) return next(err);
        res.json(docs);
    });
});

router.post('/postItemConvDetails', function(req, res, next) {
  let postData = {...req.body, "creation-date": new Date().toString(), "last-update-date": new Date().toString()};
  itemClassConvDB.insert(postData, function (err, docs) {
    if (err) return next(err);
     console.log('files inserted successfully' + JSON.stringify(req.body));
     res.json(docs);
  });
});

router.put('/putItemConvDetails', function (req, res, next) {
  itemClassConvDB.update({_id:req.body._id},{ $set: req.body },{}, function (err, docs) {
     if (err) return next(err);
     res.json('{"MSG":"SUCCESS"}');
  });
});

router.delete('/deleteItemConvDetails/:id', function (req, res, next) {
  itemClassConvDB.remove({_id:req.params.id},{}, function (err, docs) {
     if (err) return next(err);
     res.json('{"MSG":"SUCCESS"}');
  });
});

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

module.exports = router;
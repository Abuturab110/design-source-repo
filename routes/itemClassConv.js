const utils = require('../utils/general-utilities')
var express = require('express');
var router = express.Router();
const dbSet = require('../utils/db')
, itemClassConvDB = dbSet.itemClassConvDB;
const base64 = require('file-base64');
const request = require('request');
const Client = require('ssh2-sftp-client');

router.get('/getItemClassConvDetails', function(req, res, next) {
  itemClassConvDB.find({}, function (err, docs) {
        if (err) return next(err);
        res.json(docs);
    });
});

router.post('/postItemClassConvDetails', function(req, res, next) {
  let postData = {...req.body, "creation-date": new Date().toString(), "last-update-date": new Date().toString()};
  itemClassConvDB.insert(postData, function (err, docs) {
    if (err) return next(err);
     console.log('files inserted successfully' + JSON.stringify(req.body));
     res.json(docs);
  });
});

router.put('/putItemClassConvDetails', function (req, res, next) {
  itemClassConvDB.update({_id:req.body._id},{ $set: req.body },{}, function (err, docs) {
     if (err) return next(err);
     res.json('{"MSG":"SUCCESS"}');
  });
});

router.delete('/deleteItemConvClassDetails/:id', function (req, res, next) {
  itemClassConvDB.remove({_id:req.params.id},{}, function (err, docs) {
     if (err) return next(err);
     res.json('{"MSG":"SUCCESS"}');
  });
});

module.exports = router;
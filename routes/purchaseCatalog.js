const utils = require('../utils/general-utilities')
var express = require('express');
var router = express.Router();
const dbSet = require('../utils/db')
, purchasingCatalogDB = dbSet.purchasingCatalogDB;
const base64 = require('file-base64');
const request = require('request');
const Client = require('ssh2-sftp-client');

router.get('/getPurchaseCatalogDetails', function(req, res, next) {
  purchasingCatalogDB.find({}, function (err, docs) {
        if (err) return next(err);
        res.json(docs);
    });
});

router.post('/postPurchaseCatalogDetails', function(req, res, next) {
  let postData = {...req.body, "creation-date": new Date().toString(), "last-update-date": new Date().toString()};
  purchasingCatalogDB.insert(postData, function (err, docs) {
    if (err) return next(err);
     console.log('files inserted successfully' + JSON.stringify(req.body));
     res.json(docs);
  });
});

router.put('/putPurchaseCatalog', function (req, res, next) {
  purchasingCatalogDB.update({_id:req.body._id},{ $set: req.body },{}, function (err, docs) {
     if (err) return next(err);
     res.json('{"MSG":"SUCCESS"}');
  });
});

router.delete('/deletePurchaseCatalog/:id', function (req, res, next) {
  purchasingCatalogDB.remove({_id:req.params.id},{}, function (err, docs) {
     if (err) return next(err);
     res.json('{"MSG":"SUCCESS"}');
  });
});


module.exports = router;
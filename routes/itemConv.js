var express = require('express');
var router = express.Router();
var Datastore = require('nedb')
, db = new Datastore({ filename: './data_files/itemConvDB.js', autoload: true });

router.get('/getItemConvDetails', function(req, res, next) {
    db.find({}, function (err, docs) {
        if (err) return next(err);
        res.json(docs);
    });
});

router.post('/postItemConvDetails', function(req, res, next) {
  db.insert(req.body, function (err, docs) {
    if (err) return next(err);
     console.log('files inserted successfully' + JSON.stringify(req.body));
     res.json(docs);
  });
});


module.exports = router;
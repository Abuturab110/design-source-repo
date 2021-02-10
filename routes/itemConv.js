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
  let postData = {...req.body, "creation-date": new Date().toString(), "last-update-date": new Date().toString()};
  db.insert(postData, function (err, docs) {
    if (err) return next(err);
     console.log('files inserted successfully' + JSON.stringify(req.body));
     res.json(docs);
  });
});

router.put('/putItemConvDetails', function (req, res, next) {
  let putData = {...req.body, "last-update-date": new Date().toString()};
     db.update({_id:req.body._id},{ $set: putData },{}, function (err, docs) {
     if (err) 
        return res.json(err);
     res.send('{"MSG":"SUCCESS"}');
  });
});

router.delete('/deleteItemConvDetails/:id', function (req, res, next) {
  db.remove({_id:req.params.id},{}, function (err, docs) {
     if (err) return res.json(err);
     res.send('{"MSG":"SUCCESS"}');
  });
});

module.exports = router;
var express = require('express');
var router = express.Router();
var Datastore = require('nedb')
, udaConversionDB = new Datastore({ filename: './data_files/udaConversionDB.js', autoload: true });

router.put('/putUdaConvDetails', function (req, res, next) {
    let putData = {...req.body, "last-update-date": new Date().toString()};
    udaConversionDB.update({_id:req.body._id},{ $set: putData },{}, function (err, docs) {
    if (err) return res.json(err);
    res.send('{"MSG":"SUCCESS"}');
 });
});

router.delete('/deleteUdaConvDetails/:id', function (req, res, next) {
    udaConversionDB.remove({_id:req.params.id},{}, function (err, docs) {
    if (err) return res.json(err);
    res.send('{"MSG":"SUCCESS"}');
 });
});

router.post('/postUdaConvDetails', function (req, res, next) {
    let postData = {...req.body, "creation-date": new Date().toString(), "last-update-date": new Date()};
    udaConversionDB.insert(postData, function (err, docs) {
    if (err) return res.json(err);
    res.send('{"MSG":"SUCCESS"}');
 });
});

router.get('/getUdaConvDetails', function (req, res, next) {
    udaConversionDB.find({ }, function (err, docs) {
    if (err) return next(err);
      res.send(docs);
     });
 }); 

 module.exports = router;
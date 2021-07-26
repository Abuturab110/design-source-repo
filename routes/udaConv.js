var express = require('express');
var router = express.Router();
var pageCount= 0;
const multer = require('multer');
const readXlsxFile = require('read-excel-file/node');
const db = require('../utils/db')
, udaConversionDB = db.udaConversionDB
  itemUdaHomeDB = db.itemUdaHomeDB;
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
    let postData = {...req.body, "creation-date": new Date().toString(), "last-update-date": new Date().toString()};
    udaConversionDB.insert(postData, function (err, docs) {
    if (err) return res.json(err);
    res.send('{"MSG":"SUCCESS"}');
 });
});

router.get('/getUdaConvDetails', function (req, res, next) {
    udaConversionDB.find({}, function (err, docs) {
      if (err) return next(err);
      res.send(docs);
  });
 });

 router.get('/getUdaSetupHome', function (req, res, next) {
    itemUdaHomeDB.find({ }, function (err, docs) {
    if (err) return next(err);
      res.send(docs);
     });
 });

 router.post('/uploadUdaMappings', upload.single('upload'), (req, res) => {
    let udaEntries = readFileToUpload(req.file.filename, (error, udaEntries) => {
        udaEntries.forEach(udaEntry => {
                   let putData = {...udaEntry, "last-update-date": new Date().toString()};
                    udaConversionDB.update({unspsc: udaEntry.unspsc, 'descriptive-name': udaEntry['descriptive-name']},{ $set: putData },{upsert: true}, function (updateErr, docs) {
                    if (updateErr) return res.status(500).send()
                 });
        })
        res.send()
    })
 })

 const readFileToUpload = (fileName, cb) => {
    let path ='./resources/' + fileName;
    let udaEntries = [];
    readXlsxFile(path).then((rows)=> {
        rows.shift();
        rows.forEach((row) => {
            let udaEntry = {
                "unspsc": '' + row[0],
                "descriptive-name":row[1],
                "column-name":row[2],
                "var-type":row[3],
                "control-file-name":row[4],
                "attribute-group-code":row[5],
                "eff-column":row[6]
            };
            udaEntries.push(udaEntry);
        })
        cb(undefined, udaEntries);
    })
 }

 const insertUpdateRecords = function(udaEntries) {
  

    return 'success'
 }

 module.exports = router;
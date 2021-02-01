var express = require('express');
var router = express.Router();
var Datastore = require('nedb')
, db = new Datastore({ filename: './data_files/dashboard.js', autoload: true });

router.get('/getFiles', function(req, res, next) {
    /*db.find({}, function (err, docs) {
        if (err) return next(err);
        console.log(docs);
        res.json(docs);
    });*/
    let Client = require('ssh2-sftp-client');
    let sftp = new Client();
    console.log('Process Started');
    sftp.connect({
       host: '129.213.113.127',
       port: 22,
       username: 'ftpscmo',
       password: 'Or@cle#12345'
    }).then(() => {
       return sftp.list('/home/ftpscmo/DesignSource/Data');
    }).then(data => {
      let remotePath = '/server/path/file.txt';
      let localPath = '/local/path/file.txt';
       for (var i = 0; i < data.length; i++) {
        console.log('File Name : ' + data[i].name);
       }
       //  console.log(data, 'the data info');
       res.send(data);
    }).catch(err => {
       console.log(err, 'catch error');
       res.send(err);
    });
 
});

router.post('/postFiles', function(req, res, next) {
  db.insert(req.body, function (err, docs) {
    if (err) return next(err);
     console.log('files inserted successfully' + JSON.stringify(req.body));
     res.json(docs);
  });
});
router.put('/postFtpDetails', function (req, res, next) {
   var Datastore = require('nedb');
   console.log("Started");
   db = new Datastore({ filename: './data_files/ftp_spec.js', autoload: true });
   //db.loadDatabase();
   db.ensureIndex({ fieldName: 'ftpName',unique:true });
      console.log("Inside the update");
   db.update({ftpName:req.body.ftpName},{ $set: { action: "UPDATE",ftpHost:req.body.ftpHost,ftpPort:req.body.ftpPort,userName:req.body.userName,password:req.body.password,path:req.body.path} },{}, function (err, docs) {
      if (err) 
      {
         //console.log('files updated successfully' + JSON.stringify(req.body));
         return res.json(err);
      }
      console.log('files updated successfully' + JSON.stringify(req.body));
      res.send('{"MSG":"SUCCESS"}');
   });
   db.persistence.compactDatafile();
});
router.delete('/postFtpDetails', function (req, res, next) {
   var Datastore = require('nedb');
   console.log("Started");
   db = new Datastore({ filename: './data_files/ftp_spec.js', autoload: true });
   //db.loadDatabase();
   db.ensureIndex({ fieldName: 'ftpName',unique:true });

     // db.loadDatabase();
   console.log("Inside the delete");
   db.remove({ftpName:req.body.ftpName},{}, function (err, docs) {
      if (err) 
      {
         //console.log('files updated successfully' + JSON.stringify(req.body));
         return res.json(err);
      }
      console.log('files delete successfully' + JSON.stringify(req.body));
      res.send('{"MSG":"SUCCESS"}');
   });
   db.persistence.compactDatafile();
});

router.post('/postFtpDetails', function (req, res, next) {
   var Datastore = require('nedb');
   console.log("Started");
   db = new Datastore({ filename: './data_files/ftp_spec.js', autoload: true });
   //db.loadDatabase();
   db.ensureIndex({ fieldName: 'ftpName',unique:true });
      db.loadDatabase();
   console.log("Inside the create");
   db.insert(req.body, function (err, docs) {
      if (err) 
      {
         //console.log('files updated successfully' + JSON.stringify(req.body));
         return res.json(err);
      }
      console.log('files inserted successfully' + JSON.stringify(req.body));
      res.send('{"MSG":"SUCCESS"}');
   });
   db.persistence.compactDatafile();
});

router.get('/getFtpDetails', function (req, res, next) {
      var Datastore = require('nedb');
      console.log("Started");
      db = new Datastore({ filename: './data_files/ftp_spec.js', autoload: true });
      //db.loadDatabase();
      db.find({ }, function (err, docs) {
         // docs is [{ planet: 'Mars', system: 'solar' }]
         res.send(docs);
       });
   }); 

router.get('/itemConvRefreshFiles/:ftpName', function (req, res, next) {
   var Datastore = require('nedb');
   var ftpSpec = new Datastore({ filename: './data_files/ftp_spec.js', autoload: true });
   // let ftpDetails;
   const getFtpDetails = new Promise((resolve, reject) => {
      ftpSpec.find({ "ftpName": req.params.ftpName }, function (err, doc) {
         console.log('ftp details', doc);
         return resolve(doc);
      });
   });
   const listFiles = () => {
      getFtpDetails
         .then((ftpDetails) => {
            console.log('ftpDetails Name :' + ftpDetails[0].ftpName);
            let Client = require('ssh2-sftp-client');
            let sftp = new Client();
            console.log('Process Started');
            sftp.connect({
               host: ftpDetails[0].ftpHost,
               port: ftpDetails[0].ftpPort,
               username: ftpDetails[0].userName,
               password: ftpDetails[0].password
            }).then(() => {
               return sftp.list(ftpDetails[0].path);
            }).then(data => {
               //  console.log(data, 'the data info');
               res.send(data);
            }).catch(err => {
               console.log(err, 'catch error');
               res.send(err);
            });
         })
         .catch(error => {
            console.log(error.message);
         });
   }
   listFiles();
});
module.exports = router;
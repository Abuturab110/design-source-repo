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
       for (var i = 0; i < data.length; i++) {
          console.log('File Name : ' + data[i].name);
       }
       //  console.log(data, 'the data info');
       res.send(data);
    }).catch(err => {
       console.log(err, 'catch error');
       res.send('Hello World');
    });
 
});

router.post('/postFiles', function(req, res, next) {
  db.insert(req.body, function (err, docs) {
    if (err) return next(err);
     console.log('files inserted successfully' + JSON.stringify(req.body));
     res.json(docs);
  });
});

module.exports = router;
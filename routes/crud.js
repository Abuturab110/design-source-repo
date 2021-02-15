var express = require('express');
var router = express.Router();
var Datastore = require('nedb')
, db = new Datastore({ filename: './data_files/dashboard.js', autoload: true });

router.get('/publishToCloud', function(request, response){
   var csvFilePath   ='./Data file_v1_2020-07-31T14_37_47.407Z.csv'
  var  jsonArray;
  var convertedData;
  var csvresult;
// Convert a csv file with csvtojson
// Parse large csv with stream / pipe (low mem consumption)
//converting the csv file to json
csv()
.fromFile(csvFilePath)
.then(function(convertedData){ //when parse finished, result will be emitted here.
 console.log("convertedData.length : "+convertedData.length);
 //cooking the 1st file
 //const obj = JSON.parse(convertedData);
 let file1=[];
 let quantity;
 for (i=0;i<convertedData.length;i++)
 {
    if(convertedData[i].quantity_uom=="NULL")
    {
       quantity="EACH";
    }
    else
    {
       quantity=  convertedData[i].quantity_uom;
    };
   // var item_number=convertedData
    file1.push({"transaction_type":"SYNC",
                "batch_id":"",
                "batch_number":"",
                "item_number":convertedData[i].DSID,
                "outside_process_service_flag":"",
                "org_code":"CLOUD_ITEM_MASTER",
                "description":convertedData[i].part_description,
                "template_name" : "Purchased Item",
                "source_system_code":"",
                "source_system_ref":"Design Source Conversion",
                "source_sys_ref_desc":"",
                "item_class_name": convertedData[i].product_family,
                "primary_uom": quantity,
                "life_cycle_phase":"Production",
                "item_status":"Active"
                });
       const jsonexport = require('jsonexport');
       jsonexport(file1, function(err, csv){
          if (err) return console.error(err);
          console.log(csv);
          csvresult=csv;      
      });
   // file1[i].transaction_type='SYNC';
   // convertedData[i].transaction_type='SYNC';
 };
   // break the textblock into an array of lines
   var lines = csvresult.split('\n');
   // remove one line, starting at the first position
   lines.splice(0,1);
   // join the array back into a single string
   var newtext = lines.join('\n');
   const fs = require('fs');

fs.writeFile("./data_files/outbound/EgpSystemItemsInterface.csv", newtext, function(err) {
  if(err) {
      return console.log(err);
  }
  console.log("The file was saved!");
}); 
   response.send(newtext);
});
});

router.get('/publishToCloud/:fileName', function (req, res, next) {
 var base64 = require('file-base64');
 var filePath='./data_files/download/'+req.params.fileName;
 base64.encode(filePath, function(err, base64String) {
 console.log('base64String' + base64String);
 var request = require('request'),
 username = "nnarayana@DELOITTE.com",
 password = "Welcome@12345",
 url = "https://eiiv-dev10.fa.us6.oraclecloud.com/fscmRestApi/resources/11.13.18.05/erpintegrations",
 auth = "Basic " + Buffer.from(username + ":" + password).toString("base64");
 var bodyinput={
    "OperationName":"importBulkData",	
    "DocumentContent":base64String,
    "ContentType":"zip",
    "FileName":req.params.fileName,
    "DocumentAccount":"scm$/item$/import$",
    "JobName":"/oracle/apps/ess/scm/productModel/items,ItemImportJobDef",
    "ParameterList":"#NULL,#NULL,#NULL,#NULL,#NULL",
    "CallbackURL":"http://192.168.1.101:4300/response"
};

request.post(
 {
     url : url,
     body:bodyinput,
     json:true,
     headers : {
         "Authorization" : auth
     }
 },
 function (error, response, body) {
     // Do more stuff with 'body' here
     console.log("body :" + body );
     console.log("response :" + response );
     console.log("error :" + error );
    
     if (error) { res.send(error)};
     if (response.statusCode = 201)
     { res.send(body);}
     else
     {res.send(response);}
 }
);
 
 //res.send(base64String);
 });
});
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
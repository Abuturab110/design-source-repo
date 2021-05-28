const db = require('../utils/db')
const express = require('express');
const { Console } = require('console');
const router = express.Router()

router.get('/getRecentRuns', function (_req, _res, next) {
    let recentRunRecords = [];
    let  processName = "";
    db.itemConvDB.find({}, { action: 0 ,_id:0}, function (error, _docs) {
        if(error) return next(error)
        processName = "Item Conversion";
        mergeTableRecords(_docs,recentRunRecords,processName);
    db.itemClassConvDB.find({}, { action: 0 ,_id:0}, function (error, _docs) {
        if(error) return next(error)
      let  processName = "Item Class Conversion";
        mergeTableRecords(_docs,recentRunRecords,processName);
    db.udaConfigurationDB.find({}, { action: 0 ,_id:0}, function (error, _docs) {
          if(error) return next(error)
          processName = "UDA Configuration";
          mergeTableRecords(_docs,recentRunRecords,processName);
    db.purchasingCatalogDB.find({}, { action: 0 ,_id:0}, function (error, _docs) {
            if(error) return next(error)
            processName = "Purchase Catalog";
            let entries = mergeTableRecords(_docs,recentRunRecords,processName);
            _res.json(entries);
          })
       })
     })
  })
});

  const mergeTableRecords = function(_docs,recentRunRecords,processName) {
    _docs.forEach(doc => {
        recentRunRecords.push({
            'process-name': processName,
            'request-id': doc['request-id'],
            'fbdi': doc['fbdi'],
            'start-time': formatDate(doc['creation-date']),
            'records-processed': doc['total-records'],
        });
      });
      return recentRunRecords;
 }

  router.get('/pieDetails', function(_req, res, next) {
      let label=[];
      let labelCount = []
      db.itemConvDB.find({}, { action: 0 ,_id:0}, function(error, docs) {
          if ( error) return next(error)
      let itemCount = countPiaRecords(docs);
          label.push('Item Conversion')
          labelCount.push(itemCount)
      db.itemClassConvDB.find({}, { action: 0 ,_id:0}, function(error, docs) {
      let itemCount = countPiaRecords(docs);
          label.push('Item Class Conversion')
          labelCount.push(itemCount)
      db.udaConfigurationDB.find({}, { action: 0 ,_id:0}, function(error, docs) {
      let itemCount = countPiaRecords(docs);
          label.push('UDA Configuration')
          labelCount.push(itemCount)
      db.purchasingCatalogDB.find({}, { action: 0 ,_id:0}, function(error, docs) {
      let itemCount = countPiaRecords(docs);
          label.push('Purchasing Catalog')
          labelCount.push(itemCount)
                res.json({label: label, 'label-count': labelCount})
              })
            })
        })  
      }) 
  })
  const countPiaRecords = function(docs) {
    let count = 0
    docs.forEach(doc => {
      count+=doc['total-records']
    })
      return count;
 }

  router.get('/lineDetails', function(_req, res, next) {
    let label=[];
    let labelCount = []
    let chartData = [];
    db.itemConvDB.find({}, { action: 0 ,_id:0}, function(error, docs) {
      let newDocs = docs.map((doc)=>{
            doc['creation-date'] = new Date(doc['creation-date']).valueOf();
            return doc;
          });
          newDocs.sort((a, b)=>{
            return a['creation-date'] - b['creation-date'];
          });
        if ( error) return next(error)
        for (let i=0; i<newDocs.length; i++) {
            if (i==7) break
            label.push(formatLineDate(newDocs[i]['creation-date']))
            labelCount.push(newDocs[i]['total-records'])
        }
         chartData.push({ data:labelCount, label: 'Item Conversion'})
        db.itemClassConvDB.find({}, { action: 0 ,_id:0}, function(error, docs) {
          let newDocs = docs.map((doc)=>{
              doc['creation-date'] = new Date(doc['creation-date']).valueOf();
              return doc;
            });
            newDocs.sort((a, b)=>{
              return a['creation-date'] - b['creation-date'];
            });
          if ( error) return next(error)
          for (let i=0; i<newDocs.length; i++) {
              if (i==7) break
              label.push(formatLineDate(newDocs[i]['creation-date']))
              labelCount.push(newDocs[i]['total-records'])
          }
           chartData.push({ data:labelCount, label: 'Item Class Conversion'})
            db.udaConfigurationDB.find({}, { action: 0 ,_id:0}, function(error, docs) {
            let newDocs = docs.map((doc)=>{
                doc['creation-date'] = new Date(doc['creation-date']).valueOf();
                return doc;
              });
              newDocs.sort((a, b)=>{
                return a['creation-date'] - b['creation-date'];
              });
            if ( error) return next(error)
            for (let i=0; i<newDocs.length; i++) {
                if (i==7) break
                label.push(formatLineDate(newDocs[i]['creation-date']))
                labelCount.push(newDocs[i]['total-records'])
            }
             chartData.push({ data:labelCount, label: 'UDA Configuration'})
             db.purchasingCatalogDB.find({}, { action: 0 ,_id:0}, function(error, docs) {
              let newDocs = docs.map((doc)=>{
                  doc['creation-date'] = new Date(doc['creation-date']).valueOf();
                  return doc;
                });
                newDocs.sort((a, b)=>{
                  return a['creation-date'] - b['creation-date'];
                });
              if ( error) return next(error)
              for (let i=0; i<newDocs.length; i++) {
                  if (i==7) break
                  label.push(formatLineDate(newDocs[i]['creation-date']))
                  labelCount.push(newDocs[i]['total-records'])
              }
               chartData.push({ data:labelCount, label: 'Purchasing Catalog'})
               res.json({label: label, 'chart-data': chartData})
          })
        })
      })
    })
})

  router.get('/getCardDetails', function (_req, res, next) {
    let totalRuns = 0
    let transactionTotal = 0
    let successTotal = 0
    let errorTotal = 0
    db.itemConvDB.find({}, { action: 0 ,_id:0}, function (error, docs) {
        if(error) return next(error)

        docs.forEach(doc => {
            totalRuns++;
            transactionTotal+= doc['total-records']
            successTotal+= doc['success']
            errorTotal+= doc['error']
        })
        const cardDetails = [
            {
            info: 'Total Runs',
            value: totalRuns,
            "img-src": 'transaction-runs.png' 
            },
            {
            info: 'Transactions Total',
            value: transactionTotal,
            "img-src": 'transaction-count.png' 
            },
            {
            info: 'Transactions Success',
            value: successTotal,
            "img-src": 'transaction-success.png' 
            },
            {
            info: 'Transactions Errors',
            value: errorTotal,
            "img-src": 'transaction-error.png' 
            }
        ]
       res.json(cardDetails);
     });
  });

  function formatDate(dateString) {
      let newDate = new Date(dateString)
      let month = (newDate.getMonth() + 1) < 10 ? '0'+(newDate.getMonth() + 1) : (newDate.getMonth() + 1)
      let date = newDate.getDate() < 10 ? '0'+newDate.getDate() : newDate.getDate();
      let hours = newDate.getHours() < 10 ? '0'+newDate.getHours() : newDate.getHours()
      let minutes = newDate.getMinutes() < 10 ? '0'+newDate.getMinutes(): newDate.getMinutes()
      let seconds = newDate.getSeconds() < 10 ? '0'+newDate.getSeconds() : newDate.getSeconds()
      return `${newDate.getFullYear()}-${month}-${date} ${hours}:${minutes}:${seconds}`
  }

  function formatLineDate(dateString) {
    let newDate = new Date(dateString)
    let month = (newDate.getMonth() + 1) < 10 ? '0'+(newDate.getMonth() + 1) : (newDate.getMonth() + 1)
    let date = newDate.getDate() < 10 ? '0'+newDate.getDate() : newDate.getDate();
    let hours = newDate.getHours() < 10 ? '0'+newDate.getHours() : newDate.getHours()
    let minutes = newDate.getMinutes() < 10 ? '0'+newDate.getMinutes(): newDate.getMinutes()
    return `${month}/${date} ${hours}:${minutes}`
}

  module.exports = router;
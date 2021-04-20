const db = require('../utils/db')
const express = require('express')
const router = express.Router()


router.get('/getRecentRuns', function (req, res, next) {
    let recentRunRecords = [];
    db.itemConvDB.find({}, { action: 0 ,_id:0}, function (error, docs) {
        if(error) return next(error)
        docs.forEach(doc => {

        recentRunRecords.push({
            'process-name': 'Item Conversion',
            'request-id': doc['request-id'],
            'fbdi': doc['fbdi'],
            'start-time': formatDate(doc['creation-date']),
            'records-processed': doc['total-records'],
        })

       });
       res.json(recentRunRecords);
     });
  });

  router.get('/pieDetails', function(req, res, next) {
      let label=[];
      let labelCount = []
      let count = 0
      db.itemConvDB.find({}, { action: 0 ,_id:0}, function(error, docs) {
          if ( error) return next(error)
          docs.forEach(doc => {
            count+=doc['total-records']
          })
          label.push('Item Conversion')
          labelCount.push(count)
          res.json({label: label, 'label-count': labelCount})
      })
  })

  router.get('/lineDetails', function(req, res, next) {
    let label=[];
    let labelCount = []
    let count = 0
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
        chartData.push({ data: labelCount, label: 'Item Conversion'})
        res.json({label: label, 'chart-data': chartData})
    })
})

  router.get('/getCardDetails', function (req, res, next) {
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
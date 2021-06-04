const db = require('../utils/db')
const express = require('express');
const { Console } = require('console');
const router = express.Router()

router.get('/getRecentRuns', function (req, res, next) {
    let recentRunRecords = [];
    let  processName = "";
    Array.prototype.skip=skip;
    Array.prototype.limit=limit;
    db.itemConvDB.find({}, { action: 0 ,_id:0}, function (error, docs) {
        if(error) return next(error)
        processName = "Item Conversion";
        mergeTableRecords(docs,recentRunRecords,processName);
    db.itemClassConvDB.find({}, { action: 0 ,_id:0}, function (error, docs) {
        if(error) return next(error)
        let  processName = "Item Class Conversion";
        mergeTableRecords(docs,recentRunRecords,processName);
    db.udaConfigurationDB.find({}, { action: 0 ,_id:0}, function (error, docs) {
          if(error) return next(error)
          processName = "UDA Configuration";
          mergeTableRecords(docs,recentRunRecords,processName);
    db.purchasingCatalogDB.find({}, { action: 0 ,_id:0}, function (error, docs) {
            if(error) return next(error)
            processName = "Purchase Catalog";
            let  mergedRecords = mergeTableRecords(docs,recentRunRecords,processName);
            let totalCount = 0
            mergedRecords.forEach(doc => {
                totalCount++
            })
        let  pageRecords =  mergedRecords.skip(req.query.pageIndex*req.query.pageLength).limit(req.query.pageLength);
        pageRecords.push({Total:totalCount});
            res.json(pageRecords);
          })
       })
     })
  })
});

function limit(c){
  return this.filter((x,i)=>{
  if(i<=(c-1)){return true}
  })
}

  function skip(c){
    return this.filter((x,i)=>{
    if(i>(c-1)){return true}
    })
  }

  const mergeTableRecords = function(docs,recentRunRecords,processName) {
    docs.forEach(doc => {
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

  router.get('/pieDetails', function(req, res, next) {
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

  router.get('/lineDetails', function(req, res, next) {
    let chartData = [];
    let itemsChartData = [];
    let label1=[];
    db.itemConvDB.find({}, { action: 0 ,_id:0}, function(error, docs) {
      let label =  'Item Conversion';
      let items =  counLineRecords(docs,label);
       items.forEach(item => {
        itemsChartData.push(item);
        })
      
    db.itemClassConvDB.find({}, { action: 0 ,_id:0}, function(error, docs) {
      let label = 'Item Class Conversion';
        let items = counLineRecords(docs,label);
          items.forEach(item => {
            itemsChartData.push(item)
         })
       
    db.udaConfigurationDB.find({}, { action: 0 ,_id:0}, function(error, docs) {
      let label =  'UDA Configuration';
              let items =  counLineRecords(docs,label);
               items.forEach(item => {
                itemsChartData.push(item)
             })
              
    db.purchasingCatalogDB.find({}, { action: 0 ,_id:0}, function(error, docs) {
      let label =  'Purchasing Catalog';       
      let items =  counLineRecords(docs,label);
              items.forEach(item => {
                itemsChartData.push(item)
             })
             let sortedResults = sortByDate(itemsChartData).slice(0,7);
               let itemConversion = []
               let itemClassConversion = []
               let udaConfiguration = []
               let purchaseCatalog = []
               let dateLabel = [];
               sortedResults.forEach(item => {
                switch(item.label) {
                  case 'Item Conversion':
                    itemConversion.push(item.count);
                    itemClassConversion.push(0);
                     udaConfiguration.push(0);
                     purchaseCatalog.push(0);
                     dateLabel.push(item.date);
                    break;
                  case 'Item Class Conversion':
                    itemConversion.push(0);  
                    itemClassConversion.push(item.count);
                    udaConfiguration.push(0);
                    purchaseCatalog.push(0);
                    dateLabel.push(item.date);
                    break;
                  case 'UDA Configuration':
                      itemConversion.push(0);  
                      itemClassConversion.push(0);
                      udaConfiguration.push(item.count);
                      purchaseCatalog.push(0);
                      dateLabel.push(item.date);
                    break;
                  case 'Purchasing Catalog':
                      itemConversion.push(0);  
                      itemClassConversion.push(0);
                      udaConfiguration.push(0);
                      dateLabel.push(item.date);
                      purchaseCatalog.push(item.count);
                    break;
                  }
                });
             chartData.push({ data:itemConversion, label: 'Item Conversion'})
             chartData.push({ data:itemClassConversion, label: 'Item Class Conversion'})
             chartData.push({ data:udaConfiguration, label: 'UDA Configuration'})
             chartData.push({ data:purchaseCatalog, label: 'Purchasing Catalog'})
             res.json({label: dateLabel, 'chart-data': chartData})
          })
         })
     })
})
})
const counLineRecords = function(docs ,label) {
  let items = []
  let newDocs = docs.map((doc)=>{
  doc['creation-date'] = new Date(doc['creation-date']).valueOf();
                  return doc;
                });
       newDocs.sort((a, b)=>{
             return a['creation-date'] - b['creation-date'];
                });
              for (let i=0; i<newDocs.length; i++) {
                  if (i==7) break
                  items.push({'date':formatLineDate(newDocs[i]['creation-date']), 'count':newDocs[i]['total-records'],'label' :label})
              }
  let results = groupByRecords(items);
       return (results)
}

const groupByRecords = function (labelCount) {
  var result = [];
  labelCount.reduce(function(res, value) {
    if (!res[value.date]) {
      res[value.date] = { date: value.date, count: 0 ,label:value.label};
      result.push(res[value.date])
    }
    res[value.date].count += value.count;
    return res;
  }, {});
  return result;
}

const sortByDate = arr => {
  const sorter = (a, b) => {
    return new Date(a.date) - new Date(b.date);
  }
 return arr.sort(sorter);
 };

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
    //return `${month}/${date} ${hours}:${minutes}`
    return `${month}/${date}`
   
}

// function formatLineGraphDate(dateString) {
//   let newDate = new Date(dateString)
//   let month = (newDate.getMonth() + 1) < 10 ? '0'+(newDate.getMonth() + 1) : (newDate.getMonth() + 1)
//   let date = newDate.getDate() < 10 ? '0'+newDate.getDate() : newDate.getDate();
//   let hours = newDate.getHours() < 10 ? '0'+newDate.getHours() : newDate.getHours()
//   let minutes = newDate.getMinutes() < 10 ? '0'+newDate.getMinutes(): newDate.getMinutes()
//     return `${month}/${date}`
// }


  module.exports = router;
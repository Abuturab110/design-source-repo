const db = require('./db')



const getNextSequenceNumber = (dbName, callback) => {
   
    getCurrentSequenceNumber(dbName, (error, currentSequenceValue) => {
        let newValue = +currentSequenceValue + 1
        if (error) return callback(error, undefined)
          db.sequenceDB.update({name: dbName},{$set: {seqValue: newValue} }, {}, function(error1, docs) {
            if(error1) return callback(error1, undefined)
            return callback(undefined, newValue)
          })
    })
   
}

const getCurrentSequenceNumber = (dbName, callback) => {
    let currentSequenceValue;
    db.sequenceDB.findOne({name: dbName}, function(err, docs) {
        if(err) {
            return callback(err, undefined)
        }
        currentSequenceValue = docs.seqValue
        return callback(undefined, +currentSequenceValue)
    })

}

const getNextSequenceNumberNew = async (dbName) => {
    let currentSequenceValue = await getCurrentSequenceNumberNew(dbName)
    let newSequenceValue = await getNextSequenceNumberValue(dbName, currentSequenceValue)
    return newSequenceValue
}

const getNextSequenceNumberValue = (dbName, currentSequenceValue) => {
    return new Promise((resolve, reject) => {
        db.sequenceDB.update({name: dbName},{$set: {seqValue: (+currentSequenceValue + 1)} }, {upsert: true}, function(seqError, docs) {
            seqError? reject(seqError): resolve(+currentSequenceValue + 1) 
        })
    })
}

const getCurrentSequenceNumberNew = (dbName) => {
    return new Promise ((resolve, reject) => {
        db.sequenceDB.findOne({name: dbName}, function(err, docs) {
            if(err) reject(err)
            let seqValue = docs && Object.keys(docs).length > 0 ? docs.seqValue : 0
            resolve(seqValue)
        })
    })
   

}

const createSequenceNumber = (dbName, value, callback) => {
    db.sequenceDB.insert({name: dbName, seqValue: value}, function(error, docs) {
        if(error) {
        return callback(error, undefined)
        }
        return callback(undefined, dbName+ 'Sequence Created with Value ' + value)
    })
}

const  resetSequenceNumber = (dbName, value, callback) => {
    db.sequenceDB.update({name: dbName},{$set: {seqValue: value} }, {}, function(error, newValue) {
        if(error) return callback(error, undefined) 
       return  callback(undefined, dbName+ 'Sequence reset with Value ' + value)
      })
}

module.exports = {
    getNextSequenceNumber: getNextSequenceNumber,
    getNextSequenceNumberNew,
    getCurrentSequenceNumberNew,
    getCurrentSequenceNumber: getCurrentSequenceNumber,
    createSequenceNumber: createSequenceNumber,
    resetSequenceNumber: resetSequenceNumber
}
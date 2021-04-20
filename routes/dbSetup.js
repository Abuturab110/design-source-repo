var express = require('express');
var router = express.Router();
const db = require('../utils/db')
const counterFunctions = require('../utils/counter')


router.get('/createSequence', (req, res) => {
   
    if(!req.query.sequenceName) {
        res.send({
            error: 'Please pass sequence Name'
        })
    }
    const sequenceName = req.query.sequenceName
    const seqValue = req.query.sequenceValue || 0
    counterFunctions.createSequenceNumber(sequenceName, seqValue, (error, response) => {
        if(error) return res.send({error})
        res.send({
            success: response
        })
    })
   
});

router.get('/nextSequenceValue', (req, res) => {
   
    if(!req.query.sequenceName) {
        res.send({
            error: 'Please pass sequence Name'
        })
    }
    const sequenceName = req.query.sequenceName
    counterFunctions.getNextSequenceNumber(sequenceName, (error, nextVal) => {
        if (error) {
            return res.send( {
                error
            })
         }
         res.send({
            counterValue: nextVal
        })
    })

});


module.exports = router;
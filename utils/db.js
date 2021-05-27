const Datastore = require('nedb')

let db = {
    udaConversionDB: new Datastore({ filename: './data_files/udaConversionDB.js', autoload: true }),
    cloudServerSetupDB: new Datastore({ filename: './data_files/cloudServerSetupDB.js', autoload: true }),
    ftpServerSetupDB: new Datastore({ filename: './data_files/ftpServerSetupDB.js', autoload: true }),
    itemConvDB: new Datastore({ filename: './data_files/itemConvDB.js', autoload: true }),
    dashboardDB: new Datastore({ filename: './data_files/dashboardDB.js', autoload: true }),
    sequenceDB: new Datastore({ filename: './data_files/sequenceDB.js', autoload: true }),

    itemConvHomeDB: new Datastore({ filename: './data_files/itemConvHomeDB.js', autoload: true }),
    itemUdaHomeDB: new Datastore({ filename: './data_files/itemUdaHomeDB.js', autoload: true }),
    itemClassConversionHomeDB: new Datastore({ filename: './data_files/itemClassConversionHomeDB.js', autoload: true }),

    unspscSetupDB: new Datastore({ filename: './data_files/unsPscSetupDB.js', autoload: true }),
    unsPscSegmentDB: new Datastore({ filename: './data_files/unsPscSegmentDB.js', autoload: true }),
    unsPscFamilyDB: new Datastore({ filename: './data_files/unsPscFamilyDB.js', autoload: true }),
    unsPscClassDB: new Datastore({ filename: './data_files/unsPscClassDB.js', autoload: true }),
    unsPscCommodityDB: new Datastore({ filename: './data_files/unsPscCommodityDB.js', autoload: true }),

}


module.exports =  db
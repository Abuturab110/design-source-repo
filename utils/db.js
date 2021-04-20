const Datastore = require('nedb')

let db = {
    udaConversionDB: new Datastore({ filename: './data_files/udaConversionDB.js', autoload: true }),
    cloudServerSetupDB: new Datastore({ filename: './data_files/cloudServerSetupDB.js', autoload: true }),
    ftpServerSetupDB: new Datastore({ filename: './data_files/ftpServerSetupDB.js', autoload: true }),
    itemConvDB: new Datastore({ filename: './data_files/itemConvDB.js', autoload: true }),
    dashboardDB: new Datastore({ filename: './data_files/dashboardDB.js', autoload: true }),
    sequenceDB: new Datastore({ filename: './data_files/sequenceDB.js', autoload: true }),
}


module.exports =  db
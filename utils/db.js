const Datastore = require('nedb')

let db = {
    udaConversionDB: new Datastore({ filename: './data_files/udaConversionDB.js', autoload: true }),
    cloudServerSetupDB: new Datastore({ filename: './data_files/cloudServerSetupDB.js', autoload: true }),
    ftpServerSetupDB: new Datastore({ filename: './data_files/ftpServerSetupDB.js', autoload: true }),
    itemConvDB: new Datastore({ filename: './data_files/itemConvDB.js', autoload: true }),
    dashboardDB: new Datastore({ filename: './data_files/dashboardDB.js', autoload: true }),
    sequenceDB: new Datastore({ filename: './data_files/sequenceDB.js', autoload: true }),
    itemClassConvDB: new Datastore({ filename: './data_files/itemClassConvDB.js', autoload: true }),
    udaConfigurationDB: new Datastore({ filename: './data_files/udaConfigurationDB.js', autoload: true }),
    purchasingCatalogDB: new Datastore({ filename: './data_files/purchasingCatalogDB.js', autoload: true }),
}


module.exports =  db
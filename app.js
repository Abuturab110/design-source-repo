var express = require('express');
var path = require('path');
var bodyParser = require('body-parser');
var crudRoute = require('./routes/crud.js');
let dashboardRoute = require('./routes/dashboard.js')
var itemConvRoute = require('./routes/itemConv.js');
var setupRoute = require('./routes/setup.js');
var udaConvRoute = require('./routes/udaConv.js');
var dbSetupRoute = require('./routes/dbSetup.js');
var app = express();
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({'extended':'false'}));
console.log(__dirname);
app.use(express.static(path.join(__dirname, 'dist','design-source')));
app.use('/api/dashboard', crudRoute);
app.use('/api/dashboardDetails', dashboardRoute)
app.use('/api/itemConv', itemConvRoute);
app.use('/api/setup', setupRoute);
app.use('/api/udaConv', udaConvRoute);
app.use('/api/dbSetup', dbSetupRoute);


module.exports = app;
var express = require('express');
var path = require('path');
var bodyParser = require('body-parser');
var sample = require('./routes/crud.js');
var itemConvRoute = require('./routes/itemConv.js');
var setupRoute = require('./routes/setup.js');
var udaConvRoute = require('./routes/udaConv.js');
var app = express();
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({'extended':'false'}));
console.log(__dirname);
app.use(express.static(path.join(__dirname, 'dist','design-source')));
app.use('/api/dashboard', sample);
app.use('/api/itemConv', itemConvRoute);
app.use('/api/setup', setupRoute);
app.use('/api/udaConv', udaConvRoute);


module.exports = app;
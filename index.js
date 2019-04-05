'use strict';

require('dotenv').config();
console.log(process.env.PORT, 'port', process.env.MONGODB_URI, 'uri')
// Start up DB Server
const mongoose = require('mongoose');
const options = {
  useNewUrlParser:true,
  useCreateIndex: true,
};
// mongoose.connect(process.env.MONGODB_URI, options);

// Start the web server
require('./src/app.js').start(process.env.PORT);

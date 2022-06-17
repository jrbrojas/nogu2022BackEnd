const express = require("express");
const envJson = require("./env.json");
const api = require("./routes/api");
var app = express();
var fs = require('fs');
var https = require('https');
var http = require('http');

const port = process.env.PORT || 3000;

//PRODUCCION
process.env = envJson[process.env.NODE_ENV || "qa"];

//DESARROLLO
//process.env = envJson[process.env.NODE_ENV || "dev"];

process.env.PORT = port;

app.use(express.json());

app.use("/api/v1", api);

//app.listen(port);
var path = require('path');
var options = {
    key: fs.readFileSync(path.join(path.resolve('.'), '/src/ssl/private.key')),
    cert: fs.readFileSync(path.join(path.resolve('.'), '/src/ssl/certificate.crt')),
    ca: fs.readFileSync(path.join(path.resolve('.'), '/src/ssl/ca_bundle.crt'))
};

//http.createServer(app).listen(port);
https.createServer(options, app).listen(port);


//https.createServer(options, app).listen(port);
//https.createServer(options, app).listen(443);























/*const express = require("express");
const envJson = require("./env.json");
const api = require("./routes/api");
var app = express();

const port = process.env.PORT || 3000;

//PRODUCCION
process.env = envJson[process.env.NODE_ENV || "qa"];

//DESARROLLO
//process.env = envJson[process.env.NODE_ENV || "dev"];

process.env.PORT = port;

app.use(express.json());

app.use("/api/v1", api);

app.listen(port);
*/
const express = require("express");
const apis = express.Router();
const apiUsuario = require("./api/usuarios");
const apiFormulario = require("./api/formulario");
const apiMantenimiento = require("./api/manteminiento");

let allowCrossDomain = function (req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers", "*");
  next();
};
apis.use(allowCrossDomain);

var cors = require('cors');

//enables cors
apis.use(cors({
  'allowedHeaders': ['sessionId', 'Content-Type'],
  'exposedHeaders': ['sessionId'],
  'origin': '*',
  'methods': 'GET,HEAD,PUT,PATCH,POST,DELETE',
  'preflightContinue': false
}))

const jwt = require("jsonwebtoken");

apis.use(async (req, res, next) => {
  var nextApi = true;
  if (req.url.includes("/login") == true || req.url.includes("/mantenimiento/") == true) {
    nextApi = true;
  }
  if (nextApi) {
    next();
  } else {
    var token;
    if (req.headers.authorization)
      token = req.headers.authorization.replace("Bearer ", "");
    else return res.status(401).json({ message: "No Autorizado", uri: req.url });
    jwt.verify(token, process.env.llavejwt, function (err, decoded) {
      if (err) {
        return res.status(401).json({ err });
      } else {
        next();
      }
    });
  }
});

apis.use("/formulario", apiFormulario);
apis.use("/mantenimiento", apiMantenimiento);
apis.use("/usuario", apiUsuario);
module.exports = apis;

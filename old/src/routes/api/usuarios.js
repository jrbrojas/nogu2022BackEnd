const express = require("express");
const router = express.Router();
const {
  postLogin,
} = require("../../controllers/usuariosController");

router.post("/login", postLogin);

module.exports = router;
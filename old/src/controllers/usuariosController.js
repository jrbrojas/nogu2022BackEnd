const con = require("./config");
const jwt = require("jsonwebtoken");
const request = require('request');

const postLogin = async (req, res) => {
  try {
    if (req != null) {
      var data = req.body.models;
      var sql = "select id from public.usuario where name_user = '" + data.name_user + "' and clave = '" + data.clave + "'";
      const respConNS = await con.query(sql, async (err, resp) => {
        console.log(err);
        if (err) {
          return res.status(500).json({ token: '', statuscode: '500', mensaje: 'Error validar datos' });
        }
        if (resp.rowCount > 0) {
          var token = jwt.sign(
            { id: resp.rows[0].id },
            process.env.llavejwt
          );
          return res.status(200).json({ token: token, statuscode: '200', mensaje: 'Login correcto' });
        } else {
          return res.status(200).json({ token: '', statuscode: '203', mensaje: 'Login incorrecto' });
        }
      });
    } else {
      return res.status(500).json({ token: '', statuscode: '500', mensaje: 'Error validar datos' });
    }
  } catch (error) {
    console.log(error);
    return res.status(500).json({ token: '', statuscode: '500', mensaje: 'Error deconocido' });
  }
};

module.exports = {
  postLogin
};

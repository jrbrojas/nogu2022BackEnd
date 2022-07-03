const con = require("./config");
const sql = require("./consultas");
const jwt = require("jsonwebtoken");
const request = require('request');
const logger = require("../utils/logger");
const fs = require('fs');
const crypto = require('crypto');
const path = require('path');

const getList = async (req, res) => {
    try {
        const respCon = await con.query("select * from public.trasmite_opciones");
        return res.status(200).json({ data: respCon });
    } catch (error) {
        logger.error(error);
        return res.status(500).json({ data: error });
    }
};

const postList = async (req, res) => {
    try {
        var data = req.body;
        const respCon = await con.query("select * from public.trasmite_opciones");
        return res.status(200).json({ data: respCon });
    } catch (error) {
        logger.error(error);
        return res.status(500).json({ data: error });
    }
};

const postInsertA = async (req, rest) => {
    try {
        if (req != null) {
            var dataInsert = JSON.parse(req.body.models);
            var token = false;
            var recaptcha = false;
            var url = 'https://www.google.com/recaptcha/api/siteverify?secret=' + process.env.keyRecaptcha + '&response=' + dataInsert.captchaResponseToken;
            const verifiqueR = await request.get(url, async function (error, response, body) {
                if (!error && response.statusCode == 200) {
                    var bodyConvert = JSON.parse(body);
                    if (bodyConvert.success) {
                        recaptcha = true;
                    }
                }
                const verifiqueT = await jwt.verify(dataInsert.token, process.env.llavejwt, async function (err, decoded) {
                    if (!err) {
                        token = true;
                    }
                    if (token == true || recaptcha == true) {
                        var q1 = (await sql.insert_datos_basicos(dataInsert.datosBasicosModuleSend)).toString();
                        var q2 = (await sql.insert_datos_apoderado(dataInsert.datosApoderadoModuleSend)).toString();
                        var q3 = (await sql.insert_datos_laborales(dataInsert.datosLaboralesModuleSend)).toString();
                        var q4 = (await sql.insert_tamite_opciones(dataInsert.datosTamiteOpcionesModuleSend)).toString();
                        var q5 = (await sql.insert_datos_bien(dataInsert.datosBienModuleSend)).toString();
                        var datos = ('1 , 0, ' + q1 + ', ' + q2 + ', ' + q3 + ', ' + q4 + ', ' + q5 + ', 0');
                        var query = "select * from insertPerNatural(" + datos + ")";
                        const resp = await con.query(query, async (err, res) => {
                            if (err) {
                                logger.error(err + ' ||| ' + query);
                                logger.error(res);
                                return rest.status(404).json({ data: err, mensaje: "Error al guardar", statuscode: 404 });
                            }
                            if (res.rowCount > 0) {
                                return rest.status(200).json({ data: res.rows[0], mensaje: res.rows[0].mensaje, statuscode: 200 });
                            }
                            return rest.status(500).json({
                                data: error,
                                mensaje: "Error en el servicio",
                                statuscode: 500,
                            });
                        });
                    } else {
                        return rest.status(200).json({ data: [], mensaje: "reCaptcha no validado", statuscode: 203, });
                    }
                });
            });
        }
    } catch (error) {
        logger.error(error);
        return rest.status(500).json({
            data: error,
            mensaje: "Error al guardar datos",
            statuscode: 500,
        });
    }
};

const postInsertB = async (req, rest) => {
    try {
        if (req != null) {
            var dataInsert = JSON.parse(req.body.models);
            var token = false;
            var recaptcha = false;
            var url = 'https://www.google.com/recaptcha/api/siteverify?secret=' + process.env.keyRecaptcha + '&response=' + dataInsert.captchaResponseToken;
            const verifiqueR = await request.get(url, async function (error, response, body) {
                if (!error && response.statusCode == 200) {
                    var bodyConvert = JSON.parse(body);
                    if (bodyConvert.success) {
                        recaptcha = true;
                    }
                }
                const verifiqueT = await jwt.verify(dataInsert.token, process.env.llavejwt, async function (err, decoded) {
                    if (!err) {
                        token = true;
                    }
                    if (token == true || recaptcha == true) {
                        if (dataInsert.contribuyenteModuleArr.length == undefined || dataInsert.contribuyenteModuleArr.length < 1) {
                            return rest.status(203).json({
                                data: [],
                                mensaje: "Falta ingresar Contribuyentes",
                                statuscode: 203,
                            });
                        }
                        var q1 = (await sql.insert_datos_entidad(dataInsert.datosEntityModuleSend)).toString();
                        var q2 = (await sql.insert_datos_entidad_uif(dataInsert.datosEntityUifModuleSend)).toString();
                        var q3 = (await sql.insert_tamite_opciones(dataInsert.datosTamiteOpcionesModuleSend)).toString();
                        var q4 = (await sql.insert_datos_bien(dataInsert.datosBienModuleSend)).toString();
                        var datos = ('1, 0, ' + q1 + ', ' + q2 + ', ' + q3 + ', ' + q4 + ', 0');
                        var query = "select * from insertPerJuridica(" + datos + ")";
                        const resp = await con.query(query, async (err, res) => {
                            if (err) {
                                logger.error(err + ' ||| ' + query);
                                logger.error(res);
                                return rest.status(404).json({ data: err, mensaje: "Error al guardar", statuscode: 404 });
                            }
                            if (res.rowCount > 0) {
                                var cont = await dataInsert.contribuyenteModuleArr.forEach(async element => {
                                    var q5 = (await sql.insert_contribuyentes(element, res.rows[0].new_numero_servicio)).toString();
                                    var query2 = "select * from insertContribuyentes(" + q5 + ")";
                                    const respCon5 = await con.query(query2, async (err8, res) => {
                                        if (err8) {
                                        logger.error(err8 + ' ||| ' + query2);
                                        logger.error(res);
                                        }
                                    });
                                });
                                return rest.status(200).json({ data: res.rows[0], mensaje: res.rows[0].mensaje, statuscode: 200 });
                            }
                            return rest.status(500).json({
                                data: error,
                                mensaje: "Error en el servicio",
                                statuscode: 500,
                            });
                        });
                    } else {
                        return rest.status(200).json({ data: [], mensaje: "reCaptcha no validado", statuscode: 203, });
                    }
                });
            });
        }
    } catch (error) {
        logger.error(error);
        return rest.status(500).json({
            data: [],
            mensaje: "Error desconicidos",
            statuscode: 500,
        });
    }
};

/////////////////////////////////////////// UPDATE

const postUpdateA = async (req, rest) => {
    try {
        if (req != null) {
            var dataInsert = JSON.parse(req.body.models);
            var token = false;
            var recaptcha = false;
            var url = 'https://www.google.com/recaptcha/api/siteverify?secret=' + process.env.keyRecaptcha + '&response=' + dataInsert.captchaResponseToken;
            const verifiqueR = await request.get(url, async function (error, response, body) {
                if (!error && response.statusCode == 200) {
                    var bodyConvert = JSON.parse(body);
                    if (bodyConvert.success) {
                        recaptcha = true;
                    }
                }
                const verifiqueT = await jwt.verify(dataInsert.token, process.env.llavejwt, async function (err, decoded) {
                    if (!err) {
                        token = true;
                    }
                });
                if (token == true || recaptcha == true) {
                    var q1 = (await sql.insert_datos_basicos(dataInsert.datosBasicosModuleSend)).toString();
                        var q2 = (await sql.insert_datos_apoderado(dataInsert.datosApoderadoModuleSend)).toString();
                        var q3 = (await sql.insert_datos_laborales(dataInsert.datosLaboralesModuleSend)).toString();
                        var q4 = (await sql.insert_tamite_opciones(dataInsert.datosTamiteOpcionesModuleSend)).toString();
                        var q5 = (await sql.insert_datos_bien(dataInsert.datosBienModuleSend)).toString();
                        var datos = ('2 , 0, ' + q1 + ', ' + q2 + ', ' + q3 + ', ' + q4 + ', ' + q5 + ', ' + dataInsert.datosBasicosModuleSend.numero_servicio);
                        var query = "select * from insertPerNatural(" + datos + ")";
                        const resp = await con.query(query, async (err, res) => {
                            if (err) {
                                logger.error(err + ' ||| ' + query);
                                logger.error(res);
                                return rest.status(404).json({ data: err, mensaje: "Error al guardar", statuscode: 404 });
                            }
                            if (res.rowCount > 0) {
                                return rest.status(200).json({ data: res.rows[0], mensaje: res.rows[0].mensaje, statuscode: 200 });
                            }
                            return rest.status(500).json({
                                data: error,
                                mensaje: "Error en el servicio",
                                statuscode: 500,
                            });
                        });
                } else {
                    return rest.status(200).json({ data: [], mensaje: "No autorizado", statuscode: 203, });
                }
            });
        }
    } catch (error) {
        logger.error(error);
        return rest.status(500).json({
            data: [],
            mensaje: "Error al actualizar datos",
            statuscode: 500,
        });
    }
};

const postUpdateB = async (req, rest) => {
    try {
        if (req != null) {
            var dataInsert = JSON.parse(req.body.models);
            var token = false;
            var recaptcha = false;
            var url = 'https://www.google.com/recaptcha/api/siteverify?secret=' + process.env.keyRecaptcha + '&response=' + dataInsert.captchaResponseToken;
            const verifiqueR = await request.get(url, async function (error, response, body) {
                if (!error && response.statusCode == 200) {
                    var bodyConvert = JSON.parse(body);
                    if (bodyConvert.success) {
                        recaptcha = true;
                    }
                }
                const verifiqueT = await jwt.verify(dataInsert.token, process.env.llavejwt, async function (err, decoded) {
                    if (!err) {
                        token = true;
                    }
                    if (token == true || recaptcha == true) {
                        if (dataInsert.contribuyenteModuleArr.length == undefined || dataInsert.contribuyenteModuleArr.length < 1) {
                            return rest.status(203).json({
                                data: [],
                                mensaje: "Falta ingresar Contribuyentes",
                                statuscode: 203,
                            });
                        }
                        var q1 = (await sql.insert_datos_entidad(dataInsert.datosEntityModuleSend)).toString();
                        var q2 = (await sql.insert_datos_entidad_uif(dataInsert.datosEntityUifModuleSend)).toString();
                        var q3 = (await sql.insert_tamite_opciones(dataInsert.datosTamiteOpcionesModuleSend)).toString();
                        var q4 = (await sql.insert_datos_bien(dataInsert.datosBienModuleSend)).toString();
                        var datos = ('2, 0, ' + q1 + ', ' + q2 + ', ' + q3 + ', ' + q4 + ', ' + dataInsert.datosEntityModuleSend.numero_servicio);
                        var query = "select * from insertPerJuridica(" + datos + ")";
                        const resp = await con.query(query, async (err, res) => {
                            if (err) {
                                logger.error(err + ' ||| ' + query);
                                logger.error(res);
                                return rest.status(404).json({ data: err, mensaje: "Error al guardar", statuscode: 404 });
                            }
                            if (res.rowCount > 0) {
                                var cont = await dataInsert.contribuyenteModuleArr.forEach(async element => {
                                    var q5 = (await sql.insert_contribuyentes(element, dataInsert.datosEntityModuleSend.numero_servicio)).toString();
                                    var query2 = "select * from insertContribuyentes(" + q5 + ")";
                                    const respCon5 = await con.query(query2, async (err8, resIC) => {
                                        if (err8) {
                                            logger.error(err8 + ' ||| ' + query2);
                                            logger.error(res);
                                        }
                                    });
                                });
                                return rest.status(200).json({ data: res.rows[0], mensaje: res.rows[0].mensaje, statuscode: 200 });
                            }
                            return rest.status(500).json({
                                data: error,
                                mensaje: "Error en el servicio",
                                statuscode: 500,
                            });
                        });
                    } else {
                        return rest.status(200).json({ data: [], mensaje: "No autorizado", statuscode: 203, });
                    }
                });
            });
        }
    } catch (error) {
        logger.error(error);
        return rest.status(500).json({
            data: [],
            mensaje: "Error al guardar datos",
            statuscode: 500,
        });
    }
};

const postDeleteContribuyente = async (req, rest) => {
    try {
        var data = req.body;
        var query = ("delete from public.contribuyentes where id = " + data.models.id);
        const respConNS = await con.query(query, async (err, rest) => {
            logger.error(err);
        });
        return rest.status(200).json({
            data: [],
            mensaje: "Eliminado correctamente",
            statuscode: 200,
        });
    } catch (error) {
        logger.error(error);
        return rest.status(500).json({
            data: [],
            mensaje: "Error al desconocido",
            statuscode: 500,
        });
    }
}

const postConsultaPlacaVahicular = async (req, rest) => {
    try {
        var data = req.body;
        //var query = ("select * from buscarPlacaVahiculo('" + data.models.f_num_placa + "', " + data.models.f_tipo + ", '" + data.models.f_num_placa2 + "')");
        var query = ("select * from buscarPlacaVahiculo('" + data.models.f_num_placa + "', " + data.models.f_tipo + ")");
        const respConNS = await con.query(query, async (err, res) => {
            if (err) {
                logger.error(query);
                logger.error(err);
            }
            if (res.rowCount > 0) {
                return rest.status(200).json({ data: res.rows, mensaje: "DATA CORRECTA", statuscode: 200 });
            }
            return rest.status(202).json({
                data: err,
                mensaje: "NO SE ENCONTRO RESULTADOS PARA LA PLACA: " + data.models.f_num_placa,
                statuscode: 404,
            });
        });
    } catch (error) {
        logger.error(error);
        return rest.status(500).json({
            data: [],
            mensaje: "Error al desconocido",
            statuscode: 500,
        });
    }
}

const postInsertKardex = async (req, rest) => {
    try {
        var data = req.body.models;
        console.log(data.archivo_name);
        
        let detalle_numero_servicioF = data.detalle_numero_servicio.toString().replace(', , ', ', ');
        detalle_numero_servicioF = detalle_numero_servicioF.toString().replace('[, ', '[');

        var route = crypto.randomBytes(20).toString('hex');
        var query = ("select insertKardex('" + 
            data.kardex_numero + "', '" + 
            data.numero_placa + "', '" + 
            data.adquiriente + "', '" + 
            data.transferente + "', '" + 
            //data.archivo_byte + "', '" + 
            data.archivo_type + "', '" + 
            data.archivo_name + "', '" + 
            route + "', " + 
            data.archivo_size + ", " + 
            detalle_numero_servicioF + 
        ")");
        console.log(query);
        const respConNS = await con.query(query, async (err, res) => {
            if (err) {
                logger.error(err);
                return rest.status(404).json({ data: err, mensaje: "Error al guardar", statuscode: 404 });
            }
            fs.writeFile("/BACKEND_DEV/FileServer/kardex/" + route, new Buffer(data.archivo_byte, "base64"), (err) => {
                if (err) throw err;
                console.log("El archivo se guardó correctamente!");
            }); 
            return rest.status(200).json({ data: res.rows, mensaje: "GUARDADO CORRECTAMENTE", statuscode: 200 });
        });
    } catch (error) {
        logger.error(error);
        return rest.status(500).json({
            data: [],
            mensaje: "Error al desconocido",
            statuscode: 500,
        });
    }
}

const postListarKardex = async (req, rest) => {
    try {
        var data = req.body.models;
        
        var query = (
            "select " +
            "   kar.id, " +
            "   to_char(kar.fecha_registro,'DD/MM/YYYY') as fecha_registro, " +
            "   kar.kardex_numero, " +
            "   kar.numero_placa, " +
            "   kar.adquiriente, " +
            "   kar.transferente, " +
            "   arc.id as idArchivo, " +
            //"   arc.archivo_type, " +
            "   arc.archivo_route, " +
            "   arc.archivo_name " +
            "from public.kardex kar " +
            "inner join public.kardex_archivo arc on arc.id_kardex = kar.id " +
            "where kar.estado = 1 " +
            "and (kar.numero_placa like '%" + data.numero_placa + "%' and kar.kardex_numero like '%" + data.kardex_numero + "%') order by kar.fecha_registro desc "
        );

        console.log(query);

        const respConNS = await con.query(query, async (err, res) => {
            if (err) {
                logger.error(err);
                return rest.status(404).json({ data: err, mensaje: err.toString(), statuscode: 404 });
            }
            return rest.status(200).json({ data: res.rows, mensaje: "DATA CORRECTA", statuscode: 200 });
        });
    } catch (error) {
        logger.error(error);
        return rest.status(500).json({
            data: [],
            mensaje: "Error al desconocido",
            statuscode: 500,
        });
    }
}

const postDescrgarKardex = async (req, rest) => {
    try {
        var data = req.body.models;
        
        var query = (
            "select " +
            //"   arc.archivo_byte, " +
            "   arc.id as idArchivo, " +
            "   arc.archivo_type, " +
            "   arc.archivo_route, " +
            "   arc.archivo_size, " +
            "   arc.archivo_name " +
            "from public.kardex_archivo arc " +
            "where arc.id = " + data.idArchivo
        );
        const respConNS = await con.query(query, async (err, res) => {
            if (err) {
                logger.error(err);
                return rest.status(404).json({ data: err, mensaje: err.toString(), statuscode: 404 });
            }
            var fileLocation = path.join('C:/backend_dev/FileServer/kardex', res.rows[0].archivo_route);
            console.log(fileLocation);
            rest.download(fileLocation, res.rows[0].archivo_route);
        });
    } catch (error) {
        logger.error(error);
        return rest.status(500).json({
            data: [],
            mensaje: "Error al desconocido",
            statuscode: 500,
        });
    }
}

module.exports = {
    getList,
    postInsertA,
    postInsertB,
    postList,
    postUpdateA,
    postUpdateB,
    postDeleteContribuyente,
    postConsultaPlacaVahicular,
    postInsertKardex,
    postListarKardex,
    postDescrgarKardex
};
const con = require("./config");
const sql = require("./consultas");
const jwt = require("jsonwebtoken");
const request = require('request');

const getList = async (req, res) => {
    const respCon = await con.query("select * from public.trasmite_opciones");
    return res.status(200).json({ data: respCon });
};

const postList = async (req, res) => {
    var data = req.body;
    const respCon = await con.query("select * from public.trasmite_opciones");
    return res.status(200).json({ data: respCon });
};

const postInsertA = async (req, rest) => {
    if (req != null) {
        try {
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
                        var query6 = (await sql.get_num_servicio()).toString();
                        const respConNSS = await con.query(query6, async (err1, res) => {
                            logger.error(err1);
                            if (err1) {
                                return rest.status(404).json({ data: err1, mensaje: "Error al guardar", statuscode: 404 });
                            }
                            if (res.rowCount > 0) {
                                var numero_servicio = (res.rows[0].numero_servicio + 1);
                                var query7 = (await sql.insert_num_servicio(numero_servicio)).toString();
                                const respConNS = await con.query(query7, async (err2, res) => {
                                    logger.error(err2);
                                    if (err2) {
                                        var arr = [];
                                        arr.push({ "sql": "delete from public.numero_servicio where numero_servicio = " + numero_servicio });
                                        arr.push({ "sql": "delete from public.datos_bien where numero_servicio = " + numero_servicio });
                                        arr.push({ "sql": "delete from public.trasmite_opciones where numero_servicio = " + numero_servicio });
                                        arr.push({ "sql": "delete from public.datos_entidad where numero_servicio = " + numero_servicio });
                                        arr.push({ "sql": "delete from public.datos_entidad_uif where numero_servicio = " + numero_servicio });
                                        arr.push({ "sql": "delete from public.contribuyentes where numero_servicio = " + numero_servicio });
                                        arr.push({ "sql": "delete from public.datos_apoderado where numero_servicio = " + numero_servicio });
                                        arr.push({ "sql": "delete from public.datos_basicos where numero_servicio = " + numero_servicio });
                                        arr.push({ "sql": "delete from public.datos_laborales where numero_servicio = " + numero_servicio });
                                        var cont = await arr.forEach(async element => {
                                            const respConNS = await con.query(element.sql, async (err, rest) => {
                                                logger.error(err);
                                            });
                                        });
                                        return rest.status(404).json({ data: err2, mensaje: "Error al guardar", statuscode: 404 });
                                    }
                                    if (res.rowCount > 0) {
                                        var query1 = (await sql.insert_tamite_opciones(dataInsert.datosTamiteOpcionesModuleSend, numero_servicio)).toString();
                                        var query3 = (await sql.insert_datos_laborales(dataInsert.datosLaboralesModuleSend, numero_servicio)).toString();
                                        var query2 = (await sql.insert_datos_basicos(dataInsert.datosBasicosModuleSend, numero_servicio)).toString();
                                        const respCon1 = await con.query(query1, async (err3, res) => {
                                            logger.error(err3);
                                            if (err3) {
                                                var arr = [];
                                                arr.push({ "sql": "delete from public.numero_servicio where numero_servicio = " + numero_servicio });
                                                arr.push({ "sql": "delete from public.datos_bien where numero_servicio = " + numero_servicio });
                                                arr.push({ "sql": "delete from public.trasmite_opciones where numero_servicio = " + numero_servicio });
                                                arr.push({ "sql": "delete from public.datos_entidad where numero_servicio = " + numero_servicio });
                                                arr.push({ "sql": "delete from public.datos_entidad_uif where numero_servicio = " + numero_servicio });
                                                arr.push({ "sql": "delete from public.contribuyentes where numero_servicio = " + numero_servicio });
                                                arr.push({ "sql": "delete from public.datos_apoderado where numero_servicio = " + numero_servicio });
                                                arr.push({ "sql": "delete from public.datos_basicos where numero_servicio = " + numero_servicio });
                                                arr.push({ "sql": "delete from public.datos_laborales where numero_servicio = " + numero_servicio });
                                                var cont = await arr.forEach(async element => {
                                                    const respConNS = await con.query(element.sql, async (err, rest) => {
                                                        logger.error(err);
                                                    });
                                                });
                                                return rest.status(404).json({ data: err3, mensaje: "Error al guardar", statuscode: 404 });
                                            }
                                            if (res.rowCount > 0) {
                                                const respCon2 = await con.query(query2, async (err4, res) => {
                                                    logger.error(err4);
                                                    if (err4) {
                                                        var arr = [];
                                                        arr.push({ "sql": "delete from public.numero_servicio where numero_servicio = " + numero_servicio });
                                                        arr.push({ "sql": "delete from public.datos_bien where numero_servicio = " + numero_servicio });
                                                        arr.push({ "sql": "delete from public.trasmite_opciones where numero_servicio = " + numero_servicio });
                                                        arr.push({ "sql": "delete from public.datos_entidad where numero_servicio = " + numero_servicio });
                                                        arr.push({ "sql": "delete from public.datos_entidad_uif where numero_servicio = " + numero_servicio });
                                                        arr.push({ "sql": "delete from public.contribuyentes where numero_servicio = " + numero_servicio });
                                                        arr.push({ "sql": "delete from public.datos_apoderado where numero_servicio = " + numero_servicio });
                                                        arr.push({ "sql": "delete from public.datos_basicos where numero_servicio = " + numero_servicio });
                                                        arr.push({ "sql": "delete from public.datos_laborales where numero_servicio = " + numero_servicio });
                                                        var cont = await arr.forEach(async element => {
                                                            const respConNS = await con.query(element.sql, async (err, rest) => {
                                                                logger.error(err);
                                                            });
                                                        });
                                                        return rest.status(404).json({ data: err4, mensaje: "Error al guardar", statuscode: 404 });
                                                    }
                                                    if (res.rowCount > 0) {
                                                        const respCon3 = await con.query(query3, async (err5, res) => {
                                                            logger.error(err5);
                                                            if (err5) {
                                                                var arr = [];
                                                                arr.push({ "sql": "delete from public.numero_servicio where numero_servicio = " + numero_servicio });
                                                                arr.push({ "sql": "delete from public.datos_bien where numero_servicio = " + numero_servicio });
                                                                arr.push({ "sql": "delete from public.trasmite_opciones where numero_servicio = " + numero_servicio });
                                                                arr.push({ "sql": "delete from public.datos_entidad where numero_servicio = " + numero_servicio });
                                                                arr.push({ "sql": "delete from public.datos_entidad_uif where numero_servicio = " + numero_servicio });
                                                                arr.push({ "sql": "delete from public.contribuyentes where numero_servicio = " + numero_servicio });
                                                                arr.push({ "sql": "delete from public.datos_apoderado where numero_servicio = " + numero_servicio });
                                                                arr.push({ "sql": "delete from public.datos_basicos where numero_servicio = " + numero_servicio });
                                                                arr.push({ "sql": "delete from public.datos_laborales where numero_servicio = " + numero_servicio });
                                                                var cont = await arr.forEach(async element => {
                                                                    const respConNS = await con.query(element.sql, async (err, rest) => {
                                                                        logger.error(err);
                                                                    });
                                                                });
                                                                return rest.status(404).json({ data: err5, mensaje: "Error al guardar", statuscode: 404 });
                                                            }
                                                            if (res.rowCount > 0) {
                                                                if (dataInsert.datosTamiteOpcionesModuleSend.tipo_opcion == 2) {
                                                                    var query4 = (await sql.insert_datos_apoderado(dataInsert.datosApoderadoModuleSend, numero_servicio)).toString();
                                                                    const respCon4 = await con.query(query4, async (err6, res) => {
                                                                        logger.error(err6);
                                                                        if (err6) {
                                                                            var arr = [];
                                                                            arr.push({ "sql": "delete from public.numero_servicio where numero_servicio = " + numero_servicio });
                                                                            arr.push({ "sql": "delete from public.datos_bien where numero_servicio = " + numero_servicio });
                                                                            arr.push({ "sql": "delete from public.trasmite_opciones where numero_servicio = " + numero_servicio });
                                                                            arr.push({ "sql": "delete from public.datos_entidad where numero_servicio = " + numero_servicio });
                                                                            arr.push({ "sql": "delete from public.datos_entidad_uif where numero_servicio = " + numero_servicio });
                                                                            arr.push({ "sql": "delete from public.contribuyentes where numero_servicio = " + numero_servicio });
                                                                            arr.push({ "sql": "delete from public.datos_apoderado where numero_servicio = " + numero_servicio });
                                                                            arr.push({ "sql": "delete from public.datos_basicos where numero_servicio = " + numero_servicio });
                                                                            arr.push({ "sql": "delete from public.datos_laborales where numero_servicio = " + numero_servicio });
                                                                            var cont = await arr.forEach(async element => {
                                                                                const respConNS = await con.query(element.sql, async (err, rest) => {
                                                                                    logger.error(err);
                                                                                });
                                                                            });
                                                                            return rest.status(404).json({ data: err6, mensaje: "Error al guardar", statuscode: 404 });
                                                                        }
                                                                        if (res.rowCount > 0) {
                                                                            if (/*tamite_opciones.tipo_tramite == 1 || */dataInsert.datosTamiteOpcionesModuleSend.tipo_tramite == 2) {
                                                                                var query5 = (await sql.insert_datos_bien(dataInsert.datosBienModuleSend, numero_servicio)).toString();
                                                                                const respCon5 = await con.query(query5, async (err7, res) => {
                                                                                    logger.error(err7);
                                                                                    if (err7) {
                                                                                        var arr = [];
                                                                                        arr.push({ "sql": "delete from public.numero_servicio where numero_servicio = " + numero_servicio });
                                                                                        arr.push({ "sql": "delete from public.datos_bien where numero_servicio = " + numero_servicio });
                                                                                        arr.push({ "sql": "delete from public.trasmite_opciones where numero_servicio = " + numero_servicio });
                                                                                        arr.push({ "sql": "delete from public.datos_entidad where numero_servicio = " + numero_servicio });
                                                                                        arr.push({ "sql": "delete from public.datos_entidad_uif where numero_servicio = " + numero_servicio });
                                                                                        arr.push({ "sql": "delete from public.contribuyentes where numero_servicio = " + numero_servicio });
                                                                                        arr.push({ "sql": "delete from public.datos_apoderado where numero_servicio = " + numero_servicio });
                                                                                        arr.push({ "sql": "delete from public.datos_basicos where numero_servicio = " + numero_servicio });
                                                                                        arr.push({ "sql": "delete from public.datos_laborales where numero_servicio = " + numero_servicio });
                                                                                        var cont = await arr.forEach(async element => {
                                                                                            const respConNS = await con.query(element.sql, async (err, rest) => {
                                                                                                logger.error(err);
                                                                                            });
                                                                                        });
                                                                                        return rest.status(404).json({ data: err7, mensaje: "Error al guardar", statuscode: 404 });
                                                                                    }
                                                                                    if (res.rowCount > 0) {
                                                                                        const respConExit = await con.query(('select * from public.datos_basicos where numero_servicio = ' + numero_servicio), async (errExi1, resExi) => {
                                                                                            logger.error(errExi1);
                                                                                            if (errExi1) {
                                                                                                var arr = [];
                                                                                                arr.push({ "sql": "delete from public.numero_servicio where numero_servicio = " + numero_servicio });
                                                                                                arr.push({ "sql": "delete from public.datos_bien where numero_servicio = " + numero_servicio });
                                                                                                arr.push({ "sql": "delete from public.trasmite_opciones where numero_servicio = " + numero_servicio });
                                                                                                arr.push({ "sql": "delete from public.datos_entidad where numero_servicio = " + numero_servicio });
                                                                                                arr.push({ "sql": "delete from public.datos_entidad_uif where numero_servicio = " + numero_servicio });
                                                                                                arr.push({ "sql": "delete from public.contribuyentes where numero_servicio = " + numero_servicio });
                                                                                                arr.push({ "sql": "delete from public.datos_apoderado where numero_servicio = " + numero_servicio });
                                                                                                arr.push({ "sql": "delete from public.datos_basicos where numero_servicio = " + numero_servicio });
                                                                                                arr.push({ "sql": "delete from public.datos_laborales where numero_servicio = " + numero_servicio });
                                                                                                var cont = await arr.forEach(async element => {
                                                                                                    const respConNS = await con.query(element.sql, async (err, rest) => {
                                                                                                        logger.error(err);
                                                                                                    });
                                                                                                });
                                                                                                return rest.status(404).json({ data: [], mensaje: "Error al guardar", statuscode: 404 });
                                                                                            }
                                                                                            if (resExi.rows.length > 0) {
                                                                                                return rest.status(200).json({ data: [], mensaje: "Datos Registrados Correctamente", statuscode: 200, serie: numero_servicio });
                                                                                            } else {
                                                                                                var arr = [];
                                                                                                arr.push({ "sql": "delete from public.numero_servicio where numero_servicio = " + numero_servicio });
                                                                                                arr.push({ "sql": "delete from public.datos_bien where numero_servicio = " + numero_servicio });
                                                                                                arr.push({ "sql": "delete from public.trasmite_opciones where numero_servicio = " + numero_servicio });
                                                                                                arr.push({ "sql": "delete from public.datos_entidad where numero_servicio = " + numero_servicio });
                                                                                                arr.push({ "sql": "delete from public.datos_entidad_uif where numero_servicio = " + numero_servicio });
                                                                                                arr.push({ "sql": "delete from public.contribuyentes where numero_servicio = " + numero_servicio });
                                                                                                arr.push({ "sql": "delete from public.datos_apoderado where numero_servicio = " + numero_servicio });
                                                                                                arr.push({ "sql": "delete from public.datos_basicos where numero_servicio = " + numero_servicio });
                                                                                                arr.push({ "sql": "delete from public.datos_laborales where numero_servicio = " + numero_servicio });
                                                                                                var cont = await arr.forEach(async element => {
                                                                                                    const respConNS = await con.query(element.sql, async (err, rest) => {
                                                                                                        logger.error(err);
                                                                                                    });
                                                                                                });
                                                                                                return rest.status(404).json({ data: [], mensaje: "Error al guardar", statuscode: 404 });
                                                                                            }
                                                                                        });
                                                                                    }
                                                                                });
                                                                            } else {
                                                                                const respCon5 = await con.query(query5, async (err8, res) => {
                                                                                    logger.error(err8);
                                                                                    if (err8) {
                                                                                        var arr = [];
                                                                                        arr.push({ "sql": "delete from public.numero_servicio where numero_servicio = " + numero_servicio });
                                                                                        arr.push({ "sql": "delete from public.datos_bien where numero_servicio = " + numero_servicio });
                                                                                        arr.push({ "sql": "delete from public.trasmite_opciones where numero_servicio = " + numero_servicio });
                                                                                        arr.push({ "sql": "delete from public.datos_entidad where numero_servicio = " + numero_servicio });
                                                                                        arr.push({ "sql": "delete from public.datos_entidad_uif where numero_servicio = " + numero_servicio });
                                                                                        arr.push({ "sql": "delete from public.contribuyentes where numero_servicio = " + numero_servicio });
                                                                                        arr.push({ "sql": "delete from public.datos_apoderado where numero_servicio = " + numero_servicio });
                                                                                        arr.push({ "sql": "delete from public.datos_basicos where numero_servicio = " + numero_servicio });
                                                                                        arr.push({ "sql": "delete from public.datos_laborales where numero_servicio = " + numero_servicio });
                                                                                        var cont = await arr.forEach(async element => {
                                                                                            const respConNS = await con.query(element.sql, async (err, rest) => {
                                                                                                logger.error(err);
                                                                                            });
                                                                                        });
                                                                                        return rest.status(404).json({ data: err8, mensaje: "Error al guardar", statuscode: 404 });
                                                                                    }
                                                                                    if (res.rowCount > 0) {
                                                                                        const respConExit = await con.query(('select * from public.datos_basicos where numero_servicio = ' + numero_servicio), async (errExi1, resExi) => {
                                                                                            logger.error(errExi1);
                                                                                            if (errExi1) {
                                                                                                var arr = [];
                                                                                                arr.push({ "sql": "delete from public.numero_servicio where numero_servicio = " + numero_servicio });
                                                                                                arr.push({ "sql": "delete from public.datos_bien where numero_servicio = " + numero_servicio });
                                                                                                arr.push({ "sql": "delete from public.trasmite_opciones where numero_servicio = " + numero_servicio });
                                                                                                arr.push({ "sql": "delete from public.datos_entidad where numero_servicio = " + numero_servicio });
                                                                                                arr.push({ "sql": "delete from public.datos_entidad_uif where numero_servicio = " + numero_servicio });
                                                                                                arr.push({ "sql": "delete from public.contribuyentes where numero_servicio = " + numero_servicio });
                                                                                                arr.push({ "sql": "delete from public.datos_apoderado where numero_servicio = " + numero_servicio });
                                                                                                arr.push({ "sql": "delete from public.datos_basicos where numero_servicio = " + numero_servicio });
                                                                                                arr.push({ "sql": "delete from public.datos_laborales where numero_servicio = " + numero_servicio });
                                                                                                var cont = await arr.forEach(async element => {
                                                                                                    const respConNS = await con.query(element.sql, async (err, rest) => {
                                                                                                        logger.error(err);
                                                                                                    });
                                                                                                });
                                                                                                return rest.status(404).json({ data: [], mensaje: "Error al guardar", statuscode: 404 });
                                                                                            }
                                                                                            if (resExi.rows.length > 0) {
                                                                                                return rest.status(200).json({ data: [], mensaje: "Datos Registrados Correctamente", statuscode: 200, serie: numero_servicio });
                                                                                            } else {
                                                                                                var arr = [];
                                                                                                arr.push({ "sql": "delete from public.numero_servicio where numero_servicio = " + numero_servicio });
                                                                                                arr.push({ "sql": "delete from public.datos_bien where numero_servicio = " + numero_servicio });
                                                                                                arr.push({ "sql": "delete from public.trasmite_opciones where numero_servicio = " + numero_servicio });
                                                                                                arr.push({ "sql": "delete from public.datos_entidad where numero_servicio = " + numero_servicio });
                                                                                                arr.push({ "sql": "delete from public.datos_entidad_uif where numero_servicio = " + numero_servicio });
                                                                                                arr.push({ "sql": "delete from public.contribuyentes where numero_servicio = " + numero_servicio });
                                                                                                arr.push({ "sql": "delete from public.datos_apoderado where numero_servicio = " + numero_servicio });
                                                                                                arr.push({ "sql": "delete from public.datos_basicos where numero_servicio = " + numero_servicio });
                                                                                                arr.push({ "sql": "delete from public.datos_laborales where numero_servicio = " + numero_servicio });
                                                                                                var cont = await arr.forEach(async element => {
                                                                                                    const respConNS = await con.query(element.sql, async (err, rest) => {
                                                                                                        logger.error(err);
                                                                                                    });
                                                                                                });
                                                                                                return rest.status(404).json({ data: [], mensaje: "Error al guardar", statuscode: 404 });
                                                                                            }
                                                                                        });
                                                                                    }
                                                                                });
                                                                                const respConExit = await con.query(('select * from public.datos_basicos where numero_servicio = ' + numero_servicio), async (errExi1, resExi) => {
                                                                                    logger.error(errExi1);
                                                                                    if (errExi1) {
                                                                                        var arr = [];
                                                                                        arr.push({ "sql": "delete from public.numero_servicio where numero_servicio = " + numero_servicio });
                                                                                        arr.push({ "sql": "delete from public.datos_bien where numero_servicio = " + numero_servicio });
                                                                                        arr.push({ "sql": "delete from public.trasmite_opciones where numero_servicio = " + numero_servicio });
                                                                                        arr.push({ "sql": "delete from public.datos_entidad where numero_servicio = " + numero_servicio });
                                                                                        arr.push({ "sql": "delete from public.datos_entidad_uif where numero_servicio = " + numero_servicio });
                                                                                        arr.push({ "sql": "delete from public.contribuyentes where numero_servicio = " + numero_servicio });
                                                                                        arr.push({ "sql": "delete from public.datos_apoderado where numero_servicio = " + numero_servicio });
                                                                                        arr.push({ "sql": "delete from public.datos_basicos where numero_servicio = " + numero_servicio });
                                                                                        arr.push({ "sql": "delete from public.datos_laborales where numero_servicio = " + numero_servicio });
                                                                                        var cont = await arr.forEach(async element => {
                                                                                            const respConNS = await con.query(element.sql, async (err, rest) => {
                                                                                                logger.error(err);
                                                                                            });
                                                                                        });
                                                                                        return rest.status(404).json({ data: [], mensaje: "Error al guardar", statuscode: 404 });
                                                                                    }
                                                                                    if (resExi.rows.length > 0) {
                                                                                        return rest.status(200).json({ data: [], mensaje: "Datos Registrados Correctamente", statuscode: 200, serie: numero_servicio });
                                                                                    } else {
                                                                                        var arr = [];
                                                                                        arr.push({ "sql": "delete from public.numero_servicio where numero_servicio = " + numero_servicio });
                                                                                        arr.push({ "sql": "delete from public.datos_bien where numero_servicio = " + numero_servicio });
                                                                                        arr.push({ "sql": "delete from public.trasmite_opciones where numero_servicio = " + numero_servicio });
                                                                                        arr.push({ "sql": "delete from public.datos_entidad where numero_servicio = " + numero_servicio });
                                                                                        arr.push({ "sql": "delete from public.datos_entidad_uif where numero_servicio = " + numero_servicio });
                                                                                        arr.push({ "sql": "delete from public.contribuyentes where numero_servicio = " + numero_servicio });
                                                                                        arr.push({ "sql": "delete from public.datos_apoderado where numero_servicio = " + numero_servicio });
                                                                                        arr.push({ "sql": "delete from public.datos_basicos where numero_servicio = " + numero_servicio });
                                                                                        arr.push({ "sql": "delete from public.datos_laborales where numero_servicio = " + numero_servicio });
                                                                                        var cont = await arr.forEach(async element => {
                                                                                            const respConNS = await con.query(element.sql, async (err, rest) => {
                                                                                                logger.error(err);
                                                                                            });
                                                                                        });
                                                                                        return rest.status(404).json({ data: [], mensaje: "Error al guardar", statuscode: 404 });
                                                                                    }
                                                                                });
                                                                            }
                                                                        }
                                                                    });
                                                                } else {
                                                                    if (/*tamite_opciones.tipo_tramite == 1 || */dataInsert.datosTamiteOpcionesModuleSend.tipo_tramite == 2) {
                                                                        var query5 = (await sql.insert_datos_bien(dataInsert.datosBienModuleSend, numero_servicio)).toString();
                                                                        const respCon5 = await con.query(query5, async (err8, res) => {
                                                                            logger.error(err8);
                                                                            if (err8) {
                                                                                var arr = [];
                                                                                arr.push({ "sql": "delete from public.numero_servicio where numero_servicio = " + numero_servicio });
                                                                                arr.push({ "sql": "delete from public.datos_bien where numero_servicio = " + numero_servicio });
                                                                                arr.push({ "sql": "delete from public.trasmite_opciones where numero_servicio = " + numero_servicio });
                                                                                arr.push({ "sql": "delete from public.datos_entidad where numero_servicio = " + numero_servicio });
                                                                                arr.push({ "sql": "delete from public.datos_entidad_uif where numero_servicio = " + numero_servicio });
                                                                                arr.push({ "sql": "delete from public.contribuyentes where numero_servicio = " + numero_servicio });
                                                                                arr.push({ "sql": "delete from public.datos_apoderado where numero_servicio = " + numero_servicio });
                                                                                arr.push({ "sql": "delete from public.datos_basicos where numero_servicio = " + numero_servicio });
                                                                                arr.push({ "sql": "delete from public.datos_laborales where numero_servicio = " + numero_servicio });
                                                                                var cont = await arr.forEach(async element => {
                                                                                    const respConNS = await con.query(element.sql, async (err, rest) => {
                                                                                        logger.error(err);
                                                                                    });
                                                                                });
                                                                                return rest.status(404).json({ data: err8, mensaje: "Error al guardar", statuscode: 404 });
                                                                            }
                                                                            if (res.rowCount > 0) {
                                                                                const respConExit = await con.query(('select * from public.datos_basicos where numero_servicio = ' + numero_servicio), async (errExi1, resExi) => {
                                                                                    logger.error(errExi1);
                                                                                    if (errExi1) {
                                                                                        var arr = [];
                                                                                        arr.push({ "sql": "delete from public.numero_servicio where numero_servicio = " + numero_servicio });
                                                                                        arr.push({ "sql": "delete from public.datos_bien where numero_servicio = " + numero_servicio });
                                                                                        arr.push({ "sql": "delete from public.trasmite_opciones where numero_servicio = " + numero_servicio });
                                                                                        arr.push({ "sql": "delete from public.datos_entidad where numero_servicio = " + numero_servicio });
                                                                                        arr.push({ "sql": "delete from public.datos_entidad_uif where numero_servicio = " + numero_servicio });
                                                                                        arr.push({ "sql": "delete from public.contribuyentes where numero_servicio = " + numero_servicio });
                                                                                        arr.push({ "sql": "delete from public.datos_apoderado where numero_servicio = " + numero_servicio });
                                                                                        arr.push({ "sql": "delete from public.datos_basicos where numero_servicio = " + numero_servicio });
                                                                                        arr.push({ "sql": "delete from public.datos_laborales where numero_servicio = " + numero_servicio });
                                                                                        var cont = await arr.forEach(async element => {
                                                                                            const respConNS = await con.query(element.sql, async (err, rest) => {
                                                                                                logger.error(err);
                                                                                            });
                                                                                        });
                                                                                        return rest.status(404).json({ data: err8, mensaje: "Error al guardar", statuscode: 404 });
                                                                                    }
                                                                                    if (resExi.rows.length > 0) {
                                                                                        return rest.status(200).json({ data: [], mensaje: "Datos Registrados Correctamente", statuscode: 200, serie: numero_servicio });
                                                                                    } else {
                                                                                        var arr = [];
                                                                                        arr.push({ "sql": "delete from public.numero_servicio where numero_servicio = " + numero_servicio });
                                                                                        arr.push({ "sql": "delete from public.datos_bien where numero_servicio = " + numero_servicio });
                                                                                        arr.push({ "sql": "delete from public.trasmite_opciones where numero_servicio = " + numero_servicio });
                                                                                        arr.push({ "sql": "delete from public.datos_entidad where numero_servicio = " + numero_servicio });
                                                                                        arr.push({ "sql": "delete from public.datos_entidad_uif where numero_servicio = " + numero_servicio });
                                                                                        arr.push({ "sql": "delete from public.contribuyentes where numero_servicio = " + numero_servicio });
                                                                                        arr.push({ "sql": "delete from public.datos_apoderado where numero_servicio = " + numero_servicio });
                                                                                        arr.push({ "sql": "delete from public.datos_basicos where numero_servicio = " + numero_servicio });
                                                                                        arr.push({ "sql": "delete from public.datos_laborales where numero_servicio = " + numero_servicio });
                                                                                        var cont = await arr.forEach(async element => {
                                                                                            const respConNS = await con.query(element.sql, async (err, rest) => {
                                                                                                logger.error(err);
                                                                                            });
                                                                                        });
                                                                                        return rest.status(404).json({ data: [], mensaje: "Error al guardar", statuscode: 404 });
                                                                                    }
                                                                                });
                                                                            }
                                                                        });
                                                                    } else {
                                                                        const respConExit = await con.query(('select * from public.datos_basicos where numero_servicio = ' + numero_servicio), async (errExi1, resExi) => {
                                                                            logger.error(errExi1);
                                                                            if (errExi1) {
                                                                                var arr = [];
                                                                                arr.push({ "sql": "delete from public.numero_servicio where numero_servicio = " + numero_servicio });
                                                                                arr.push({ "sql": "delete from public.datos_bien where numero_servicio = " + numero_servicio });
                                                                                arr.push({ "sql": "delete from public.trasmite_opciones where numero_servicio = " + numero_servicio });
                                                                                arr.push({ "sql": "delete from public.datos_entidad where numero_servicio = " + numero_servicio });
                                                                                arr.push({ "sql": "delete from public.datos_entidad_uif where numero_servicio = " + numero_servicio });
                                                                                arr.push({ "sql": "delete from public.contribuyentes where numero_servicio = " + numero_servicio });
                                                                                arr.push({ "sql": "delete from public.datos_apoderado where numero_servicio = " + numero_servicio });
                                                                                arr.push({ "sql": "delete from public.datos_basicos where numero_servicio = " + numero_servicio });
                                                                                arr.push({ "sql": "delete from public.datos_laborales where numero_servicio = " + numero_servicio });
                                                                                var cont = await arr.forEach(async element => {
                                                                                    const respConNS = await con.query(element.sql, async (err, rest) => {
                                                                                        logger.error(err);
                                                                                    });
                                                                                });
                                                                                return rest.status(404).json({ data: [], mensaje: "Error al guardar", statuscode: 404 });
                                                                            }
                                                                            if (resExi.rows.length > 0) {
                                                                                return rest.status(200).json({ data: [], mensaje: "Datos Registrados Correctamente", statuscode: 200, serie: numero_servicio });
                                                                            } else {
                                                                                var arr = [];
                                                                                arr.push({ "sql": "delete from public.numero_servicio where numero_servicio = " + numero_servicio });
                                                                                arr.push({ "sql": "delete from public.datos_bien where numero_servicio = " + numero_servicio });
                                                                                arr.push({ "sql": "delete from public.trasmite_opciones where numero_servicio = " + numero_servicio });
                                                                                arr.push({ "sql": "delete from public.datos_entidad where numero_servicio = " + numero_servicio });
                                                                                arr.push({ "sql": "delete from public.datos_entidad_uif where numero_servicio = " + numero_servicio });
                                                                                arr.push({ "sql": "delete from public.contribuyentes where numero_servicio = " + numero_servicio });
                                                                                arr.push({ "sql": "delete from public.datos_apoderado where numero_servicio = " + numero_servicio });
                                                                                arr.push({ "sql": "delete from public.datos_basicos where numero_servicio = " + numero_servicio });
                                                                                arr.push({ "sql": "delete from public.datos_laborales where numero_servicio = " + numero_servicio });
                                                                                var cont = await arr.forEach(async element => {
                                                                                    const respConNS = await con.query(element.sql, async (err, rest) => {
                                                                                        logger.error(err);
                                                                                    });
                                                                                });
                                                                                return rest.status(404).json({ data: [], mensaje: "Error al guardar", statuscode: 404 });
                                                                            }
                                                                        });
                                                                    }
                                                                }
                                                            }
                                                        });
                                                    }
                                                });
                                            }
                                        });
                                    }
                                });
                            }
                        });
                    } else {
                        return rest.status(200).json({ data: [], mensaje: "reCaptcha no validado", statuscode: 203, });
                    }
                });
            });
        } catch (error) {
            return rest.status(500).json({
                data: error,
                mensaje: "Error al guardar datos",
                statuscode: 500,
            });
        }
    }
};

const postInsertB = async (req, rest) => {
    if (req != null) {
        try {
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
                        var query6 = (await sql.get_num_servicio()).toString();
                        const respConNSS = await con.query(query6, async (err1, res) => {
                            logger.error(err1);
                            if (err1) {
                                return rest.status(404).json({ data: err1, mensaje: "Error al guardar", statuscode: 404 });
                            }
                            if (res.rowCount > 0) {
                                var numero_servicio = (res.rows[0].numero_servicio + 1);
                                var query7 = (await sql.insert_num_servicio(numero_servicio)).toString();
                                const respConNS = await con.query(query7, async (err2, res) => {
                                    logger.error(err2);
                                    if (err2) {
                                        var arr = [];
                                        arr.push({ "sql": "delete from public.numero_servicio where numero_servicio = " + numero_servicio });
                                        arr.push({ "sql": "delete from public.datos_bien where numero_servicio = " + numero_servicio });
                                        arr.push({ "sql": "delete from public.trasmite_opciones where numero_servicio = " + numero_servicio });
                                        arr.push({ "sql": "delete from public.datos_entidad where numero_servicio = " + numero_servicio });
                                        arr.push({ "sql": "delete from public.datos_entidad_uif where numero_servicio = " + numero_servicio });
                                        arr.push({ "sql": "delete from public.contribuyentes where numero_servicio = " + numero_servicio });
                                        arr.push({ "sql": "delete from public.datos_apoderado where numero_servicio = " + numero_servicio });
                                        arr.push({ "sql": "delete from public.datos_basicos where numero_servicio = " + numero_servicio });
                                        arr.push({ "sql": "delete from public.datos_laborales where numero_servicio = " + numero_servicio });
                                        var cont = await arr.forEach(async element => {
                                            const respConNS = await con.query(element.sql, async (err, rest) => {
                                                logger.error(err);
                                            });
                                        });
                                        return rest.status(404).json({ data: err2, mensaje: "Error al guardar", statuscode: 404 });
                                    }
                                    if (res.rowCount > 0) {
                                        var query_to = (await sql.insert_tamite_opciones(dataInsert.datosTamiteOpcionesModuleSend, numero_servicio)).toString();
                                        const respConTO = await con.query(query_to, async (err3, res) => {
                                            logger.error(err3);
                                            if (err3) {
                                                var arr = [];
                                                arr.push({ "sql": "delete from public.numero_servicio where numero_servicio = " + numero_servicio });
                                                arr.push({ "sql": "delete from public.datos_bien where numero_servicio = " + numero_servicio });
                                                arr.push({ "sql": "delete from public.trasmite_opciones where numero_servicio = " + numero_servicio });
                                                arr.push({ "sql": "delete from public.datos_entidad where numero_servicio = " + numero_servicio });
                                                arr.push({ "sql": "delete from public.datos_entidad_uif where numero_servicio = " + numero_servicio });
                                                arr.push({ "sql": "delete from public.contribuyentes where numero_servicio = " + numero_servicio });
                                                arr.push({ "sql": "delete from public.datos_apoderado where numero_servicio = " + numero_servicio });
                                                arr.push({ "sql": "delete from public.datos_basicos where numero_servicio = " + numero_servicio });
                                                arr.push({ "sql": "delete from public.datos_laborales where numero_servicio = " + numero_servicio });
                                                var cont = await arr.forEach(async element => {
                                                    const respConNS = await con.query(element.sql, async (err, rest) => {
                                                        logger.error(err);
                                                    });
                                                });
                                                return rest.status(404).json({ data: err3, mensaje: "Error al guardar", statuscode: 404 });
                                            }
                                            if (res.rowCount > 0) {
                                                if (res.rowCount > 0) {
                                                    var query3 = (await sql.insert_datos_entidad_uif(dataInsert.datosEntityUifModuleSend, numero_servicio)).toString();
                                                    var query2 = (await sql.insert_datos_entidad(dataInsert.datosEntityModuleSend, numero_servicio)).toString();
                                                    const respCon2 = await con.query(query2, async (err4, res) => {
                                                        logger.error(err4);
                                                        if (err4) {
                                                            var arr = [];
                                                            arr.push({ "sql": "delete from public.numero_servicio where numero_servicio = " + numero_servicio });
                                                            arr.push({ "sql": "delete from public.datos_bien where numero_servicio = " + numero_servicio });
                                                            arr.push({ "sql": "delete from public.trasmite_opciones where numero_servicio = " + numero_servicio });
                                                            arr.push({ "sql": "delete from public.datos_entidad where numero_servicio = " + numero_servicio });
                                                            arr.push({ "sql": "delete from public.datos_entidad_uif where numero_servicio = " + numero_servicio });
                                                            arr.push({ "sql": "delete from public.contribuyentes where numero_servicio = " + numero_servicio });
                                                            arr.push({ "sql": "delete from public.datos_apoderado where numero_servicio = " + numero_servicio });
                                                            arr.push({ "sql": "delete from public.datos_basicos where numero_servicio = " + numero_servicio });
                                                            arr.push({ "sql": "delete from public.datos_laborales where numero_servicio = " + numero_servicio });
                                                            var cont = await arr.forEach(async element => {
                                                                const respConNS = await con.query(element.sql, async (err, rest) => {
                                                                    logger.error(err);
                                                                });
                                                            });
                                                            return rest.status(404).json({ data: err4, mensaje: "Error al guardar", statuscode: 404 });
                                                        }
                                                        if (res.rowCount > 0) {
                                                            const respCon3 = await con.query(query3, async (err5, res) => {
                                                                logger.error(err5);
                                                                if (err5) {
                                                                    var arr = [];
                                                                    arr.push({ "sql": "delete from public.numero_servicio where numero_servicio = " + numero_servicio });
                                                                    arr.push({ "sql": "delete from public.datos_bien where numero_servicio = " + numero_servicio });
                                                                    arr.push({ "sql": "delete from public.trasmite_opciones where numero_servicio = " + numero_servicio });
                                                                    arr.push({ "sql": "delete from public.datos_entidad where numero_servicio = " + numero_servicio });
                                                                    arr.push({ "sql": "delete from public.datos_entidad_uif where numero_servicio = " + numero_servicio });
                                                                    arr.push({ "sql": "delete from public.contribuyentes where numero_servicio = " + numero_servicio });
                                                                    arr.push({ "sql": "delete from public.datos_apoderado where numero_servicio = " + numero_servicio });
                                                                    arr.push({ "sql": "delete from public.datos_basicos where numero_servicio = " + numero_servicio });
                                                                    arr.push({ "sql": "delete from public.datos_laborales where numero_servicio = " + numero_servicio });
                                                                    var cont = await arr.forEach(async element => {
                                                                        const respConNS = await con.query(element.sql, async (err, rest) => {
                                                                            logger.error(err);
                                                                        });
                                                                    });
                                                                    return rest.status(404).json({ data: err5, mensaje: "Error al guardar", statuscode: 404 });
                                                                }
                                                                if (res.rowCount > 0) {
                                                                    if (dataInsert.datosTamiteOpcionesModuleSend.tipo_tramite == 2) {
                                                                        var query4 = (await sql.insert_datos_bien(dataInsert.datosBienModuleSend, numero_servicio)).toString();
                                                                        const respCon4 = await con.query(query4, async (err6, res) => {
                                                                            logger.error(err6);
                                                                            if (err6) {
                                                                                var arr = [];
                                                                                arr.push({ "sql": "delete from public.numero_servicio where numero_servicio = " + numero_servicio });
                                                                                arr.push({ "sql": "delete from public.datos_bien where numero_servicio = " + numero_servicio });
                                                                                arr.push({ "sql": "delete from public.trasmite_opciones where numero_servicio = " + numero_servicio });
                                                                                arr.push({ "sql": "delete from public.datos_entidad where numero_servicio = " + numero_servicio });
                                                                                arr.push({ "sql": "delete from public.datos_entidad_uif where numero_servicio = " + numero_servicio });
                                                                                arr.push({ "sql": "delete from public.contribuyentes where numero_servicio = " + numero_servicio });
                                                                                arr.push({ "sql": "delete from public.datos_apoderado where numero_servicio = " + numero_servicio });
                                                                                arr.push({ "sql": "delete from public.datos_basicos where numero_servicio = " + numero_servicio });
                                                                                arr.push({ "sql": "delete from public.datos_laborales where numero_servicio = " + numero_servicio });
                                                                                var cont = await arr.forEach(async element => {
                                                                                    const respConNS = await con.query(element.sql, async (err, rest) => {
                                                                                        logger.error(err);
                                                                                    });
                                                                                });
                                                                                return rest.status(404).json({ data: err6, mensaje: "Error al guardar", statuscode: 404 });
                                                                            }
                                                                            if (res.rowCount > 0) {
                                                                                var cont = await dataInsert.contribuyenteModuleArr.forEach(async element => {
                                                                                    var query5 = (await sql.insert_contribuyentes(element, numero_servicio)).toString();
                                                                                    const respCon5 = await con.query(query5, async (err7, res) => {
                                                                                        logger.error(err7);
                                                                                        if (err7) {
                                                                                            var arr = [];
                                                                                            arr.push({ "sql": "delete from public.numero_servicio where numero_servicio = " + numero_servicio });
                                                                                            arr.push({ "sql": "delete from public.datos_bien where numero_servicio = " + numero_servicio });
                                                                                            arr.push({ "sql": "delete from public.trasmite_opciones where numero_servicio = " + numero_servicio });
                                                                                            arr.push({ "sql": "delete from public.datos_entidad where numero_servicio = " + numero_servicio });
                                                                                            arr.push({ "sql": "delete from public.datos_entidad_uif where numero_servicio = " + numero_servicio });
                                                                                            arr.push({ "sql": "delete from public.contribuyentes where numero_servicio = " + numero_servicio });
                                                                                            arr.push({ "sql": "delete from public.datos_apoderado where numero_servicio = " + numero_servicio });
                                                                                            arr.push({ "sql": "delete from public.datos_basicos where numero_servicio = " + numero_servicio });
                                                                                            arr.push({ "sql": "delete from public.datos_laborales where numero_servicio = " + numero_servicio });
                                                                                            var cont = await arr.forEach(async element => {
                                                                                                const respConNS = await con.query(element.sql, async (err, rest) => {
                                                                                                    logger.error(err);
                                                                                                });
                                                                                            });
                                                                                        }
                                                                                    });
                                                                                });
                                                                                const respConExit = await con.query(('select * from public.datos_entidad where numero_servicio = ' + numero_servicio), async (errExi1, resExi) => {
                                                                                    logger.error(errExi1);
                                                                                    if (errExi1) {
                                                                                        var arr = [];
                                                                                        arr.push({ "sql": "delete from public.numero_servicio where numero_servicio = " + numero_servicio });
                                                                                        arr.push({ "sql": "delete from public.datos_bien where numero_servicio = " + numero_servicio });
                                                                                        arr.push({ "sql": "delete from public.trasmite_opciones where numero_servicio = " + numero_servicio });
                                                                                        arr.push({ "sql": "delete from public.datos_entidad where numero_servicio = " + numero_servicio });
                                                                                        arr.push({ "sql": "delete from public.datos_entidad_uif where numero_servicio = " + numero_servicio });
                                                                                        arr.push({ "sql": "delete from public.contribuyentes where numero_servicio = " + numero_servicio });
                                                                                        arr.push({ "sql": "delete from public.datos_apoderado where numero_servicio = " + numero_servicio });
                                                                                        arr.push({ "sql": "delete from public.datos_basicos where numero_servicio = " + numero_servicio });
                                                                                        arr.push({ "sql": "delete from public.datos_laborales where numero_servicio = " + numero_servicio });
                                                                                        var cont = await arr.forEach(async element => {
                                                                                            const respConNS = await con.query(element.sql, async (err, rest) => {
                                                                                                logger.error(err);
                                                                                            });
                                                                                        });
                                                                                        return rest.status(404).json({ data: [], mensaje: "Error al guardar", statuscode: 404 });
                                                                                    }
                                                                                    if (resExi.rows.length > 0) {
                                                                                        return rest.status(200).json({ data: [], mensaje: "Datos Registrados Correctamente", statuscode: 200, serie: numero_servicio });
                                                                                    } else {
                                                                                        var arr = [];
                                                                                        arr.push({ "sql": "delete from public.numero_servicio where numero_servicio = " + numero_servicio });
                                                                                        arr.push({ "sql": "delete from public.datos_bien where numero_servicio = " + numero_servicio });
                                                                                        arr.push({ "sql": "delete from public.trasmite_opciones where numero_servicio = " + numero_servicio });
                                                                                        arr.push({ "sql": "delete from public.datos_entidad where numero_servicio = " + numero_servicio });
                                                                                        arr.push({ "sql": "delete from public.datos_entidad_uif where numero_servicio = " + numero_servicio });
                                                                                        arr.push({ "sql": "delete from public.contribuyentes where numero_servicio = " + numero_servicio });
                                                                                        arr.push({ "sql": "delete from public.datos_apoderado where numero_servicio = " + numero_servicio });
                                                                                        arr.push({ "sql": "delete from public.datos_basicos where numero_servicio = " + numero_servicio });
                                                                                        arr.push({ "sql": "delete from public.datos_laborales where numero_servicio = " + numero_servicio });
                                                                                        var cont = await arr.forEach(async element => {
                                                                                            const respConNS = await con.query(element.sql, async (err, rest) => {
                                                                                                logger.error(err);
                                                                                            });
                                                                                        });
                                                                                        return rest.status(404).json({ data: [], mensaje: "Error al guardar", statuscode: 404 });
                                                                                    }
                                                                                });
                                                                            }
                                                                        });
                                                                    } else {
                                                                        var cont = await dataInsert.contribuyenteModuleArr.forEach(async element => {
                                                                            var query5 = (await sql.insert_contribuyentes(element, numero_servicio)).toString();
                                                                            const respCon5 = await con.query(query5, async (err8, res) => {
                                                                                logger.error(err8);
                                                                                if (err8) {
                                                                                    var arr = [];
                                                                                    arr.push({ "sql": "delete from public.numero_servicio where numero_servicio = " + numero_servicio });
                                                                                    arr.push({ "sql": "delete from public.datos_bien where numero_servicio = " + numero_servicio });
                                                                                    arr.push({ "sql": "delete from public.trasmite_opciones where numero_servicio = " + numero_servicio });
                                                                                    arr.push({ "sql": "delete from public.datos_entidad where numero_servicio = " + numero_servicio });
                                                                                    arr.push({ "sql": "delete from public.datos_entidad_uif where numero_servicio = " + numero_servicio });
                                                                                    arr.push({ "sql": "delete from public.contribuyentes where numero_servicio = " + numero_servicio });
                                                                                    arr.push({ "sql": "delete from public.datos_apoderado where numero_servicio = " + numero_servicio });
                                                                                    arr.push({ "sql": "delete from public.datos_basicos where numero_servicio = " + numero_servicio });
                                                                                    arr.push({ "sql": "delete from public.datos_laborales where numero_servicio = " + numero_servicio });
                                                                                    var cont = await arr.forEach(async element => {
                                                                                        const respConNS = await con.query(element.sql, async (err, rest) => {
                                                                                            logger.error(err);
                                                                                        });
                                                                                    });
                                                                                }
                                                                            });
                                                                        });
                                                                        const respConExit = await con.query(('select * from public.datos_entidad where numero_servicio = ' + numero_servicio), async (errExi1, resExi) => {
                                                                            logger.error(errExi1);
                                                                            if (errExi1) {
                                                                                var arr = [];
                                                                                arr.push({ "sql": "delete from public.numero_servicio where numero_servicio = " + numero_servicio });
                                                                                arr.push({ "sql": "delete from public.datos_bien where numero_servicio = " + numero_servicio });
                                                                                arr.push({ "sql": "delete from public.trasmite_opciones where numero_servicio = " + numero_servicio });
                                                                                arr.push({ "sql": "delete from public.datos_entidad where numero_servicio = " + numero_servicio });
                                                                                arr.push({ "sql": "delete from public.datos_entidad_uif where numero_servicio = " + numero_servicio });
                                                                                arr.push({ "sql": "delete from public.contribuyentes where numero_servicio = " + numero_servicio });
                                                                                arr.push({ "sql": "delete from public.datos_apoderado where numero_servicio = " + numero_servicio });
                                                                                arr.push({ "sql": "delete from public.datos_basicos where numero_servicio = " + numero_servicio });
                                                                                arr.push({ "sql": "delete from public.datos_laborales where numero_servicio = " + numero_servicio });
                                                                                var cont = await arr.forEach(async element => {
                                                                                    const respConNS = await con.query(element.sql, async (err, rest) => {
                                                                                        logger.error(err);
                                                                                    });
                                                                                });
                                                                                return rest.status(404).json({ data: [], mensaje: "Error al guardar", statuscode: 404 });
                                                                            }
                                                                            if (resExi.rows.length > 0) {
                                                                                return rest.status(200).json({ data: [], mensaje: "Datos Registrados Correctamente", statuscode: 200, serie: numero_servicio });
                                                                            } else {
                                                                                var arr = [];
                                                                                arr.push({ "sql": "delete from public.numero_servicio where numero_servicio = " + numero_servicio });
                                                                                arr.push({ "sql": "delete from public.datos_bien where numero_servicio = " + numero_servicio });
                                                                                arr.push({ "sql": "delete from public.trasmite_opciones where numero_servicio = " + numero_servicio });
                                                                                arr.push({ "sql": "delete from public.datos_entidad where numero_servicio = " + numero_servicio });
                                                                                arr.push({ "sql": "delete from public.datos_entidad_uif where numero_servicio = " + numero_servicio });
                                                                                arr.push({ "sql": "delete from public.contribuyentes where numero_servicio = " + numero_servicio });
                                                                                arr.push({ "sql": "delete from public.datos_apoderado where numero_servicio = " + numero_servicio });
                                                                                arr.push({ "sql": "delete from public.datos_basicos where numero_servicio = " + numero_servicio });
                                                                                arr.push({ "sql": "delete from public.datos_laborales where numero_servicio = " + numero_servicio });
                                                                                var cont = await arr.forEach(async element => {
                                                                                    const respConNS = await con.query(element.sql, async (err, rest) => {
                                                                                        logger.error(err);
                                                                                    });
                                                                                });
                                                                                return rest.status(404).json({ data: [], mensaje: "Error al guardar", statuscode: 404 });
                                                                            }
                                                                        });
                                                                    }
                                                                }
                                                            });
                                                        }
                                                    });
                                                }
                                            }
                                        })
                                    }
                                });
                            }
                        });
                    } else {
                        return rest.status(200).json({ data: [], mensaje: "reCaptcha no validado", statuscode: 203, });
                    }
                });
            });
        } catch (error) {
            return rest.status(500).json({
                data: [],
                mensaje: "Error desconicidos",
                statuscode: 500,
            });
        }
    }
};

/////////////////////////////////////////// UPDATE

const postUpdateA = async (req, rest) => {
    if (req != null) {
        try {
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
                    var query3 = (await sql.update_datos_laborales(dataInsert.datosLaboralesModuleSend)).toString();
                    var query2 = (await sql.update_datos_basicos(dataInsert.datosBasicosModuleSend)).toString();
                    const respCon2 = await con.query(query2, async (err, res) => {
                        logger.error(err);
                        if (err) {
                            return rest.status(404).json({ data: err, mensaje: "Error al actualizar", statuscode: 404 });
                        }
                        if (res.rowCount > 0) {
                            const respCon3 = await con.query(query3, async (err, res) => {
                                logger.error(err);
                                if (err) {
                                    return rest.status(404).json({ data: err, mensaje: "Error al actualizar", statuscode: 404 });
                                }
                                if (res.rowCount > 0) {
                                    if (dataInsert.datosTamiteOpcionesModuleSend.tipo_opcion == 2) {
                                        var query4 = (await sql.update_datos_apoderado(dataInsert.datosApoderadoModuleSend)).toString();
                                        const respCon4 = await con.query(query4, async (err, res) => {
                                            logger.error(err);
                                            if (err) {
                                                return rest.status(404).json({ data: err, mensaje: "Error al actualizar", statuscode: 404 });
                                            }
                                            if (res.rowCount > 0) {
                                                if (/*dataInsert.datosTamiteOpcionesModuleSend.tipo_tramite == 1 || */dataInsert.datosTamiteOpcionesModuleSend.tipo_tramite == 2) {
                                                    var query5 = (await sql.update_datos_bien(dataInsert.datosBienModuleSend)).toString();
                                                    const respCon5 = await con.query(query5, async (err, res) => {
                                                        logger.error(err);
                                                        if (err) {
                                                            return rest.status(404).json({ data: err, mensaje: "Error al actualizar", statuscode: 404 });
                                                        }
                                                        //if (res.rowCount > 0) {
                                                        return rest.status(200).json({ data: [], mensaje: "Datos Actualizados correctamente", statuscode: 200 });
                                                        //}
                                                    });
                                                } else {
                                                    return rest.status(200).json({ data: [], mensaje: "Datos Actualizados correctamente", statuscode: 200 });
                                                }
                                            }
                                        });
                                    } else {
                                        const respApoDelete = await con.query("delete from public.datos_apoderado where numero_servicio = " + dataInsert.datosTamiteOpcionesModuleSend.numero_servicio, async (err, res) => {
                                            logger.error(err);
                                            if (/*dataInsert.datosTamiteOpcionesModuleSend.tipo_tramite == 1 || */dataInsert.datosTamiteOpcionesModuleSend.tipo_tramite == 2) {
                                                var query5 = (await sql.update_datos_bien(dataInsert.datosBienModuleSend)).toString();
                                                const respCon5 = await con.query(query5, async (err, res) => {
                                                    logger.error(err);
                                                    if (err) {
                                                        return rest.status(404).json({ data: err, mensaje: "Error al actualizar", statuscode: 404 });
                                                    }
                                                    //if (res.rowCount > 0) {
                                                    return rest.status(200).json({ data: [], mensaje: "Datos Actualizados correctamente", statuscode: 200 });
                                                    //}
                                                });
                                            } else {
                                                return rest.status(200).json({ data: [], mensaje: "Datos Actualizados correctamente", statuscode: 200 });
                                            }
                                        });
                                    }
                                }
                            });
                        }
                    });
                } else {
                    return rest.status(200).json({ data: [], mensaje: "No autorizado", statuscode: 203, });
                }
            });
        } catch (error) {
            return rest.status(500).json({
                data: [],
                mensaje: "Error al actualizar datos",
                statuscode: 500,
            });
        }
    }
};

const postUpdateB = async (req, rest) => {
    if (req != null) {
        try {
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
                            return rest.status(203).json({ data: [], mensaje: "Falta ingresar Contribuyentes", statuscode: 203, });
                        }
                        var query3 = (await sql.update_datos_entidad_uif(dataInsert.datosEntityUifModuleSend)).toString();
                        var query2 = (await sql.update_datos_entidad(dataInsert.datosEntityModuleSend)).toString();
                        const respCon2 = await con.query(query2, async (err, res) => {
                            logger.error(err);
                            if (err) {
                                return rest.status(404).json({ data: err, mensaje: "Error al actualizar", statuscode: 404 });
                            }
                            if (res.rowCount > 0) {
                                const respCon3 = await con.query(query3, async (err, res) => {
                                    logger.error(err);
                                    if (err) {
                                        return rest.status(404).json({ data: err, mensaje: "Error al actualizar", statuscode: 404 });
                                    }
                                    if (res.rowCount > 0) {
                                        if (dataInsert.datosTamiteOpcionesModuleSend.tipo_tramite == 2) {
                                            var query4 = (await sql.update_datos_bien(dataInsert.datosBienModuleSend)).toString();
                                            const respCon4 = await con.query(query4, async (err, res) => {
                                                logger.error(err);
                                                if (err) {
                                                    return rest.status(404).json({ data: err, mensaje: "Error al actualizar", statuscode: 404 });
                                                }
                                                if (res.rowCount > 0) {
                                                    var sqlDelete = "delete from public.contribuyentes where numero_servicio = " + dataInsert.datosTamiteOpcionesModuleSend.numero_servicio;
                                                    const resDelete = await con.query(sqlDelete, async (err, res) => {
                                                        logger.error(err);
                                                    });
                                                    var cont = await dataInsert.contribuyenteModuleArr.forEach(async element => {
                                                        var insertNewC = (await sql.insert_contribuyentes(element, dataInsert.datosEntityModuleSend.numero_servicio)).toString();
                                                        const respCon5 = await con.query(insertNewC, async (err, res) => {
                                                            logger.error(err);
                                                        });
                                                    });
                                                    return rest.status(200).json({ data: [], mensaje: "Datos Actualizados correctamente", statuscode: 200 });
                                                }
                                            });
                                        } else {
                                            var sqlDelete = "delete from public.contribuyentes where numero_servicio = " + dataInsert.datosTamiteOpcionesModuleSend.numero_servicio;
                                            const resDelete = await con.query(sqlDelete, async (err, res) => {
                                                logger.error(err);
                                            });
                                            var cont = await dataInsert.contribuyenteModuleArr.forEach(async element => {
                                                var insertNewC = (await sql.insert_contribuyentes(element, dataInsert.datosEntityModuleSend.numero_servicio)).toString();
                                                const respCon5 = await con.query(insertNewC, async (err, res) => {
                                                    logger.error(err);
                                                });
                                            });
                                            return rest.status(200).json({ data: [], mensaje: "Datos Actualizados correctamente", statuscode: 200 });
                                        }
                                    }
                                });
                            }
                        });
                    } else {
                        return rest.status(200).json({ data: [], mensaje: "No autorizado", statuscode: 203, });
                    }
                });
            });
        } catch (error) {
            return rest.status(500).json({
                data: [],
                mensaje: "Error al guardar datos",
                statuscode: 500,
            });
        }
    }
};

const postDelete = async (req, rest) => {
    var data = req.body;
    try {
        //if (data.models.tipo == 1) {
        var arr = [];
        arr.push({ "sql": "delete from public.numero_servicio where numero_servicio = " + data.models.numero_servicio });
        arr.push({ "sql": "delete from public.datos_bien where numero_servicio = " + data.models.numero_servicio });
        arr.push({ "sql": "delete from public.trasmite_opciones where numero_servicio = " + data.models.numero_servicio });
        arr.push({ "sql": "delete from public.datos_entidad where numero_servicio = " + data.models.numero_servicio });
        arr.push({ "sql": "delete from public.datos_entidad_uif where numero_servicio = " + data.models.numero_servicio });
        arr.push({ "sql": "delete from public.contribuyentes where numero_servicio = " + data.models.numero_servicio });
        arr.push({ "sql": "delete from public.datos_apoderado where numero_servicio = " + data.models.numero_servicio });
        arr.push({ "sql": "delete from public.datos_basicos where numero_servicio = " + data.models.numero_servicio });
        arr.push({ "sql": "delete from public.datos_laborales where numero_servicio = " + data.models.numero_servicio });
        var cont = await arr.forEach(async element => {
            const respConNS = await con.query(element.sql, async (err, rest) => {
                logger.error(err);
            });
        });
        return rest.status(200).json({
            data: [],
            mensaje: "Eliminado correctamente",
            statuscode: 200,
        });
    } catch (error) {
        return rest.status(500).json({
            data: [],
            mensaje: "Error al desconocido",
            statuscode: 500,
        });
    }
};

module.exports = {
    getList,
    postInsertA,
    postInsertB,
    postList,
    postUpdateA,
    postUpdateB,
    postDelete
};
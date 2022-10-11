const con = require("./config");
const sql = require("./consultas");
const jwt = require("jsonwebtoken");
const request = require('request');
const logger = require("../utils/logger");
const fs = require('fs');
const crypto = require('crypto');
const path = require('path');
const { Console } = require("console");

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
                        console.log('===================================');
                        console.log(q2);
                        console.log('===================================');
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
        //var query = ("select * from buscarPlacaVahiculo('" + data.models.f_num_placa + "', " + data.models.f_tipo + ")");


        var query = "SELECT 'NATURAL' as type, " +
        "BIEN.tipo_bien as bien_tipo_bien, " +
        "BIEN.tipo_transferencia as bien_tipo_transferencia, " +
        "upper(coalesce(BIEN.num_placa, '')) as bien_num_placa, " +
        "upper(coalesce(BIEN.moneda, '')) as bien_moneda, " +
        "BIEN.valor as bien_valor, " +
        "BIEN.targeta_propiedad as bien_targeta_propiedad, " +
        "BIEN.mp_otro as bien_mp_otro, " +
        "BIEN.mp_otros_describir as bien_mp_otros_describir, " +
        "BIEN.numero_tarjeta_propiedad as bien_numero_tarjeta_propiedad, " +
        "BIEN.mp_compra_venta as bien_mp_compra_venta, " +
        "BIEN.mp_donacion as bien_mp_donacion, " +
        "BIEN.mp_permuta as bien_mp_permuta, " +
        "BIEN.mp_dacion_pago as bien_mp_dacion_pago, " +
        "BIEN.mp_anticipo_legitima as bien_mp_anticipo_legitima, " +
        "upper(coalesce(BIEN.marca, '')) as bien_marca, " +
        "upper(coalesce(BIEN.modelo, '')) as bien_modelo, " +
        "OPCIONES.tipo_persona as opciones_tipo_persona, " +
        "OPCIONES.tipo_opcion as opciones_tipo_opcion, " +
        "OPCIONES.tipo_tramite as opciones_tipo_tramite, " +
        "OPCIONES.created_at as opciones_created_at, " +
        "OPCIONES.tipo_condicion as opciones_tipo_condicion, " +
        "OPCIONES.inestadokardex as opciones_inestadokardex, " +
        "BASICOS.id as basicos_id, " +
        "BASICOS.num_documento as basicos_num_documento, " +
        "coalesce(DOC_BASICOS.nombrecompleto, BASICOS.otro_documento) as basicos_nombre_tipo_documento, " +
        "upper(BASICOS.nombres) as basicos_nombres, " +
        "upper(BASICOS.apellidos) as basicos_apellidos, " +
        "upper(coalesce(BASICOS.pais_origen, '')) as basicos_pais_origen, " +
        "upper(BASICOS.ciudad) as basicos_ciudad, " +
        "BASICOS.fecha_nacimiento as basicos_fecha_nacimiento, " +
        "upper(PAIS_BASICOS.nombre) as basicos_nombre_pais_nacionalidad, " +
        "coalesce(EST_CIVIL_BASICOS.nombre, '') as basicos_nombre_estado_civil, " +
        "BASICOS.separa_patrimonio as basicos_separa_patrimonio, " +
        "upper(coalesce(BASICOS.partida, '')) as basicos_partida, " +
        "upper(coalesce(BASICOS.sede, '')) as basicos_sede, " +
        "upper(coalesce(BASICOS.domicilio, '')) as basicos_domicilio, " +
        "BASICOS.telefono_uno as basicos_telefono_uno, " +
        "(case when BASICOS.separa_patrimonio = 0 then 1 else 0 end) as isseparacionpatrimonio, " + 
        "(case when BASICOS.separa_patrimonio = 0 then 0 else 1 end) as isnoseparacionpatrimonio, " + 
        "BASICOS.telefono_dos as basicos_telefono_dos, " +
        "upper(coalesce(BASICOS.nombre_conyugue, '')) as basicos_nombre_conyugue, " +
        "upper(coalesce(BASICOS.cuidad_origen, '')) as basicos_cuidad_origen, " +
        "BASICOS.distrito as basicos_distrito, " +
        "BASICOS.extranjero as basicos_extranjero, " +
        "(case when BASICOS.id_estado_civil = 2 then 1 else 0 end) as basico_iscasado, " +
        "(case when BASICOS.id_estado_civil = 2 then 0 else 1 end) as basico_isnocasado, " +
        "upper(coalesce(DIS_BASICOS.nombre, '')) as basicos_nombre_distrito, " +
        "upper(coalesce(PRO_BASICOS.nombre, '')) as basicos_nombre_provincia, " +
        "upper(coalesce(DEP_BASICOS.nombre, '')) as basicos_nombre_departamento, " +
        "upper(coalesce(BASICOS.nombre_conyugue_documento, '')) as basicos_nombre_conyugue_documento, " +
        "BASICOS.conyugue_fecha_nacimiento as basicos_conyugue_fecha_nacimiento, " +
        "LABORALES.id as laborales_id, " +
        "upper(coalesce(LABORALES.profesion, '')) as laborales_profesion, " +
        "LABORALES.of_haberes as laborales_of_haberes, " +
        "LABORALES.of_prestamos_familiares as laborales_of_prestamos_familiares, " +
        "LABORALES.of_venta_bien_inmieble as laborales_of_venta_bien_inmieble, " +
        "LABORALES.of_rentas as laborales_of_rentas, " +
        "LABORALES.of_donacion as laborales_of_donacion, " +
        "LABORALES.of_prestamos_bancario as laborales_of_prestamos_bancario, " +
        "LABORALES.of_herencia as laborales_of_herencia, " +
        "LABORALES.of_venta_vehiculo as laborales_of_venta_vehiculo, " +
        "LABORALES.of_comercio as laborales_of_comercio, " +
        "LABORALES.of_otros_describir as laborales_of_otros_describir, " +
        "LABORALES.of_otros_describir_text as laborales_of_otros_describir_text, " +
        "LABORALES.mp_efectivo as laborales_mp_efectivo, " +
        "LABORALES.mp_deposito_cuenta as laborales_mp_deposito_cuenta, " +
        "LABORALES.mp_bien_inmueble as laborales_mp_bien_inmueble, " +
        "LABORALES.mp_cheque as laborales_mp_cheque, " +
        "LABORALES.mp_transferencia_bancaria as laborales_mp_transferencia_bancaria, " +
        "LABORALES.mp_bien_mueble as laborales_mp_bien_mueble, " +
        "LABORALES.mp_otros_describir as laborales_mp_otros_describir, " +
        "LABORALES.mp_otros_describir_text as laborales_mp_otros_describir_text, " +
        "LABORALES.of_donacion_pago as laborales_of_donacion_pago, " +
        "APODERADO.id as apoderado_id, " +
        "APODERADO.num_documento as apoderado_num_documento, " +
        "coalesce(DOC_APODERADO.nombre, APODERADO.otro_documento) as apoderado_nombre_tipo_documento, " +
        "upper(APODERADO.nombres) as apoderado_nombres, " +
        "upper(APODERADO.apellidos) as apoderado_apellidos, " +
        "upper(APODERADO.domicilio) as apoderado_domicilio, " +
        "1 as opciones_tipo_persona_natural, " +
        "0 as opciones_tipo_persona_juridica, " +
        "upper(APODERADO.profesion) as apoderado_profesion, " +
        "upper(APODERADO.nacionalidad) as apoderado_nacionalidad, " +
        "coalesce(EST_CIVIL_APODERADO.nombre, '') as apoderado_nombre_estado_civil, " +
        "APODERADO.registro_poder as apoderado_registro_poder, " +
        "upper(APODERADO.conyugue_nombres) as apoderado_conyugue_nombres, " +
        "upper(coalesce(DIS_APODERADO.nombre, '')) as apoderado_nombre_distrito, " +
        "upper(coalesce(PRO_APODERADO.nombre, '')) as apoderado_nombre_distrito, " +
        "upper(coalesce(DEP_APODERADO.nombre, '')) as apoderado_nombre_distrito, " +
        "upper(APODERADO.sede_registral) as apoderado_sede_registral, " +
        "(CASE WHEN coalesce(APODERADO.id, 0) > 0 THEN 1 ELSE 0 END) AS isApoderado, (CASE WHEN coalesce(APODERADO.id, 0) = 0 THEN 1 ELSE 0 END) AS isNoApoderado, 0 AS biActivo " +
        "FROM public.datos_bien BIEN " +
        "inner join public.datos_basicos BASICOS ON BASICOS.numero_servicio = BIEN.numero_servicio " +
        "inner join public.trasmite_opciones OPCIONES ON OPCIONES.numero_servicio = BIEN.numero_servicio " +
        "inner join public.datos_laborales LABORALES ON LABORALES.numero_servicio = BIEN.numero_servicio " +
        "left join public.datos_apoderado APODERADO ON APODERADO.numero_servicio = BIEN.numero_servicio " +
        "inner join public.tipo_documento DOC_BASICOS ON DOC_BASICOS.id = BASICOS.id_tipo_documento " +
        "left join public.paises PAIS_BASICOS ON PAIS_BASICOS.id = BASICOS.id_pais_nacionalidad " +
        "left join public.estado_civil EST_CIVIL_BASICOS ON EST_CIVIL_BASICOS.id = BASICOS.id_estado_civil " +
        "left join public.distrito DIS_BASICOS ON DIS_BASICOS.id = BASICOS.id_ubigeo " +
        "left join public.provincia PRO_BASICOS ON PRO_BASICOS.id = DIS_BASICOS.idprovincia " +
        "left join public.departamento DEP_BASICOS ON DEP_BASICOS.id = PRO_BASICOS.iddepartamento " +
        "left join public.tipo_documento DOC_APODERADO ON DOC_APODERADO.id = APODERADO.id_tipo_documento " +
        "left join public.estado_civil EST_CIVIL_APODERADO ON EST_CIVIL_APODERADO.id = APODERADO.id_estado_civil " +
        "left join public.distrito DIS_APODERADO ON DIS_APODERADO.id = APODERADO.id_ubigeo " +
        "left join public.provincia PRO_APODERADO ON PRO_APODERADO.id = DIS_APODERADO.idprovincia " +
        "left join public.departamento DEP_APODERADO ON DEP_APODERADO.id = PRO_APODERADO.iddepartamento " +
        "WHERE BIEN.tipo_bien = 0 " +
        "and OPCIONES.tipo_persona = 2 " +
        "and length(upper(replace(BIEN.num_placa, ' ', ''))) > 5 " +
        "and BIEN.mp_compra_venta = (case when " + data.models.f_tipo + " = 1 then 0 else BIEN.mp_compra_venta end) " +
        "and BIEN.mp_donacion = (case when  " + data.models.f_tipo + " = 2 then 0 else BIEN.mp_donacion end) " +
        "and BIEN.mp_permuta = (case when  " + data.models.f_tipo + " = 3 then 0 else BIEN.mp_permuta end) " +
        "and upper(replace(coalesce(BIEN.num_placa, ''), ' ', '')) = (upper(replace('" + data.models.f_num_placa + "', ' ', ''))) " +
        "and coalesce(OPCIONES.inEstadoKardex, 0) = 0 " +
        "ORDER BY BIEN.num_placa DESC ";
        const respConNS = await con.query(query, async (err, res) => {
            if (err) {
                logger.error(query);
                logger.error(err);
            }
                var query2 = "SELECT 'JURIDICA' as type, " +
                "BIEN.num_placa as bien_num_placa, " +
                "BIEN.moneda as bien_moneda, " +
                "BIEN.valor as bien_valor, " +
                "BIEN.marca as bien_marca, " +
                "BIEN.modelo as bien_modelo, " +
                "OPCIONES.tipo_persona as opciones_tipo_persona, " +
                "OPCIONES.tipo_opcion as opciones_tipo_opcion, " +
                "OPCIONES.tipo_tramite as opciones_tipo_tramite, " +
                "OPCIONES.created_at as opciones_created_at, " +
                "OPCIONES.tipo_condicion as opciones_tipo_condicion, " +
                "ENTIDAD.id as entidad_id, " +
                "ENTIDAD.ruc as entidad_ruc, " +
                "ENTIDAD.razonsocial as entidad_razonsocial, " +
                "ENTIDAD.direccion as entidad_direccion, " +
                "ENTIDAD.otros_describir as entidad_otros_describir, " +
                "ENTIDAD.otro_opcion as entidad_otro_opcion, " +
                "ENTIDAD.partida_registral as entidad_partida_registral, " +
                "ENTIDAD.sede_registral as entidad_sede_registral, " +
                "DIS_ENTIDAD.nombre as entidad_nombre_distrito, " +
                "PRO_ENTIDAD.nombre as entidad_nombre_provincia, " +
                "DEP_ENTIDAD.nombre as entidad_nombre_departamento, " +
                "ENTIDAD_UIF.id as entidad_uif_id, " +
                "PAIS_ENTIDAD_UIF.nombre as entidad_uif_nombre_pais, " +
                "ENTIDAD_UIF.of_giro_negocio as entidad_uif_of_giro_negocio, " +
                "ENTIDAD_UIF.of_prestamos_socios as entidad_uif_of_prestamos_socios, " +
                "ENTIDAD_UIF.of_venta_bien_inmueble as entidad_uif_of_venta_bien_inmueble, " +
                "ENTIDAD_UIF.of_intermediacion_financiera as entidad_uif_of_intermediacion_financiera, " +
                "ENTIDAD_UIF.of_prestamo_bancario as entidad_uif_of_prestamo_bancario, " +
                "ENTIDAD_UIF.of_prestamo_terceros as entidad_uif_of_prestamo_terceros, " +
                "ENTIDAD_UIF.of_venta_activos as entidad_uif_of_venta_activos, " +
                "ENTIDAD_UIF.of_otros_escribir_of as entidad_uif_of_otros_escribir_of, " +
                "ENTIDAD_UIF.of_otros_escribir_of_text as entidad_uif_of_otros_escribir_of_text, " +
                "ENTIDAD_UIF.mp_efectivo as entidad_uif_mp_efectivo, " +
                "ENTIDAD_UIF.mp_deposito_cuenta as entidad_uif_mp_deposito_cuenta, " +
                "ENTIDAD_UIF.mp_bien_inmueble as entidad_uif_mp_bien_inmueble, " +
                "ENTIDAD_UIF.mp_cheque as entidad_uif_mp_cheque, " +
                "ENTIDAD_UIF.mp_transferencia_bancaria as entidad_uif_mp_transferencia_bancaria, " +
                "ENTIDAD_UIF.mp_bien_mueble as entidad_uif_mp_bien_mueble, " +
                "ENTIDAD_UIF.mp_otros_describir as entidad_uif_mp_otros_describir, " +
                "ENTIDAD_UIF.mp_otros_describir_text as entidad_uif_mp_otros_describir_text, " +
                "REPRESENTANTES.id as representantes_id, " +
                "upper(coalesce(DOC_REPRESENTANTES.nombre, '')) as representantes_nombre_tipo_documento, " +
                "upper(coalesce(REPRESENTANTES.otro_documento, '')) as representantes_otro_documento, " +
                "upper(coalesce(REPRESENTANTES.numero_documento, '')) as representantes_numero_documento, " +
                "upper(coalesce(REPRESENTANTES.nombres, '')) as representantes_nombres, " +
                "upper(coalesce(PAIS_REPRESENTANTES.nombre, '')) as representantes_nombre_pais_nacionalidad, " +
                "upper(coalesce(EST_CIVIL_REPRESENTANTES.nombre, '')) as representantes_nombre_estado_civil, " +
                "upper(coalesce(REPRESENTANTES.domicilio, '')) as representantes_domicilio, " +
                "upper(coalesce(REPRESENTANTES.profecion_ocupacion, '')) as representantes_profecion_ocupacion, " +
                "REPRESENTANTES.inscripcion_registral as representantes_inscripcion_registral, " +
                "REPRESENTANTES.separa_patrimonio as representantes_separa_patrimonio, " +
                "upper(coalesce(REPRESENTANTES.partida, '')) as representantes_partida, " +
                "upper(coalesce(REPRESENTANTES.sede, '')) as representantes_sede, " +
                "0 as opciones_tipo_persona_natural, " +
                "1 as opciones_tipo_persona_juridica, " +
                "upper(coalesce(REPRESENTANTES.nombre_conyugue, '')) as representantes_nombre_conyugue, " +
                "upper(coalesce(REPRESENTANTES.nombre_conyugue_documento, '')) as representantes_nombre_conyugue_documento, " +
                "REPRESENTANTES.conyugue_fecha_nacimiento as representantes_conyugue_fecha_nacimiento " +
                "FROM public.datos_bien BIEN " +
                "inner join public.datos_entidad ENTIDAD ON ENTIDAD.numero_servicio = BIEN.numero_servicio " +
                "inner join public.datos_entidad_uif ENTIDAD_UIF ON ENTIDAD_UIF.numero_servicio = BIEN.numero_servicio " +
                "inner join public.contribuyentes REPRESENTANTES ON REPRESENTANTES.numero_servicio = BIEN.numero_servicio " +
                "inner join public.trasmite_opciones OPCIONES ON OPCIONES.numero_servicio = BIEN.numero_servicio " +
                "left join public.distrito DIS_ENTIDAD ON DIS_ENTIDAD.id = ENTIDAD.id_distrito " +
                "left join public.provincia PRO_ENTIDAD ON PRO_ENTIDAD.id = DIS_ENTIDAD.idprovincia " +
                "left join public.departamento DEP_ENTIDAD ON DEP_ENTIDAD.id = PRO_ENTIDAD.iddepartamento " +
                "left join public.paises PAIS_ENTIDAD_UIF ON PAIS_ENTIDAD_UIF.id = ENTIDAD_UIF.id_pais " +
                "left join public.tipo_documento DOC_REPRESENTANTES ON DOC_REPRESENTANTES.id = REPRESENTANTES.id_tipo_documento " +
                "left join public.paises PAIS_REPRESENTANTES ON PAIS_REPRESENTANTES.id = REPRESENTANTES.id_pais_nacionalidad " +
                "left join public.estado_civil EST_CIVIL_REPRESENTANTES ON EST_CIVIL_REPRESENTANTES.id = REPRESENTANTES.id_estado_civil " +
                "left join public.distrito DIS_REPRESENTANTES ON DIS_REPRESENTANTES.id = REPRESENTANTES.id_distrito " +
                "left join public.provincia PRO_REPRESENTANTES ON PRO_REPRESENTANTES.id = DIS_REPRESENTANTES.idprovincia " +
                "left join public.departamento DEP_REPRESENTANTES ON DEP_REPRESENTANTES.id = PRO_REPRESENTANTES.iddepartamento " +
                "WHERE BIEN.tipo_bien = 0 " +
                "and OPCIONES.tipo_persona = 1 " +
                "and length(upper(replace(BIEN.num_placa, ' ', ''))) > 5 " +
                "and BIEN.mp_compra_venta = (case when " + data.models.f_tipo + " = 1 then 0 else BIEN.mp_compra_venta end) " +
                "and BIEN.mp_donacion = (case when  " + data.models.f_tipo + " = 2 then 0 else BIEN.mp_donacion end) " +
                "and BIEN.mp_permuta = (case when  " + data.models.f_tipo + " = 3 then 0 else BIEN.mp_permuta end) " +
                "and upper(replace(coalesce(BIEN.num_placa, ''), ' ', '')) = (upper(replace('" + data.models.f_num_placa + "', ' ', ''))) " +
                "and coalesce(OPCIONES.inEstadoKardex, 0) = 0 " +
                "ORDER BY BIEN.num_placa DESC; ";
                console.log(query2);
                const respCon = await con.query(query2, async (errJur, resJur) => {
                    if (errJur) {
                        logger.error(query2);
                        logger.error(errJur);
                    }
                    var result = {
                        natural: res.rows,
                        juridica: resJur.rows
                    }
                    return rest.status(200).json({ data: result, mensaje: "DATA CORRECTA", statuscode: 200 });
                });
            //}
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
            fs.writeFile("/BACKEND/FileServer/kardex/" + route, new Buffer(data.archivo_byte, "base64"), (err) => {
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
            var fileLocation = path.join('C:/backend/FileServer/kardex', res.rows[0].archivo_route);
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

const postDelete = async (req, rest) => {
    try {
        var data = req.body;
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
        logger.error(error);
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
    postDeleteContribuyente,
    postConsultaPlacaVahicular,
    postInsertKardex,
    postListarKardex,
    postDescrgarKardex,
    postDelete
};
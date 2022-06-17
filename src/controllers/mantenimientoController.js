const con = require("./config");
const sql = require("./consultas");
const jwt = require("jsonwebtoken");
const request = require('request');
const logger = require("../utils/logger");

const getListTipoDocumento = async (req, res) => {
    try {
        const respConNS = await con.query("select * from public.tipo_documento order by inorden", async (err, resp) => {
            logger.error(err);
            if (err) {
                logger.error(err)
                return res.status(404).json({ data: [], mensaje: "Error al consultar datos", statuscode: 500 });
            }
            return res.status(200).json({ data: resp.rows, mensaje: "Lista registros", statuscode: 200 });
        });
    } catch (error) {
        logger.error(error)
        return res.status(500).json({ data: [], mensaje: "Error al consultar datos", statuscode: 500 });
    }
};

const getListPaises = async (req, res) => {
    try {
        const respCon = await con.query("select * from public.paises");
        return res.status(200).json({ data: respCon.rows, mensaje: "Lista paises", statuscode: 200 });
    } catch (error) {
        logger.error(error);
        return res.status(500).json({ data: [], mensaje: "Error al consultar datos", statuscode: 500 });
    }
};

const getListEstadoCivil = async (req, res) => {
    try {
        const respCon = await con.query("select * from public.estado_civil");
        return res.status(200).json({ data: respCon.rows, mensaje: "Lista estados civiles", statuscode: 200 });
    } catch (error) {
        logger.error(error);
        return res.status(500).json({ data: [], mensaje: "Error al consultar datos", statuscode: 500 });
    }
};

const posUbigeo = async (req, res) => {
    try {
        var data = req.body;
        //var sql = (await sql.post_ubigeo(data.models.id)).toString();
        var where = data.models.id == 0 ? "" : " where dis.id = " + id;
        var sql = "select dis.id as id, concat(dep.nombre, ' - ', pro.nombre , ' - ', dis.nombre) as nombre from public.distrito dis " +
            "inner join public.provincia pro on dis.idprovincia  = pro.id " +
            "inner join public.departamento dep on pro.iddepartamento  = dep.id " +
            where;
        const respConNS = await con.query(sql, async (err, resp) => {
            logger.error(err)
            if (err) {
                logger.error(err)
                return res.status(404).json({ data: [], mensaje: "Error al consultar datos", statuscode: 500 });
            }
            return res.status(200).json({ data: resp.rows, mensaje: "Lista registros", statuscode: 200 });
        });
    } catch (error) {
        logger.error(error)
        return res.status(500).json({ data: [], mensaje: "Error al consultar datos", statuscode: 500 });
    }
};

const postListRegistros = async (req, res) => {
    try {
        var data = req.body;
        if (data != null) {
            var numeFil = "";
            if (data.models.numero_servicio > 0) {
                numeFil = " and (ns.numero_servicio = " + data.models.numero_servicio + ") ";
            }
            const respCo = await con.query("select count(*) from public.numero_servicio", async (err, rest_count) => {
                if (err) {
                    logger.error(err);
                    return res.status(404).json({ data: [], mensaje: "Error al consultar datos", statuscode: 500 });
                }
                var sql = "select ns.numero_servicio, " +
                    " case when b.id is null then e.id else b.id end as id, " +
                    " case when b.id is null then e.id else b.id end as estado, " +
                    " case when b.id is null then e.id else b.id end as index, " +
                    " case when e.razonsocial is null then concat(b.nombres, ' ', b.apellidos) else e.razonsocial end as nombre, " +
                    " t.tipo_condicion, " +
                    " t.tipo_opcion, " +
                    " to_char(t.created_at,'DD/MM/YYYY') as created_at," +
                    " t.tipo_persona, " +
                    " t.tipo_tramite " +
                    " from public.numero_servicio ns  " +
                    " left join public.datos_entidad e on e.numero_servicio = ns.numero_servicio  and e.id is not null  " +
                    " left join public.datos_basicos b on b.numero_servicio = ns.numero_servicio  and b.id is not null  " +
                    " inner join public.trasmite_opciones t on t.numero_servicio = ns.numero_servicio  " +
                    " where (e.razonsocial like upper('%" + data.models.nombre + "%') or concat(b.nombres, ' ', b.apellidos) " + 
                    " like upper('%" + data.models.nombre + "%') " + numeFil + " or ns.numero_servicio::text like '%" + data.models.nombre + "%') order by ns.numero_servicio desc" +
                    //" LIMIT " + 20 + "OFFSET " + 10;
                    " LIMIT " + data.models.pageNumber + "OFFSET " + (data.models.pageSize - 10);
                const respConNS = await con.query(sql, async (err2, resp_basicos) => {
                    if (err2) {
                        logger.error(err2);
                        return res.status(404).json({ data: [], mensaje: "Error al consultar datos", count: 0, statuscode: 500 });
                    }
                    return res.status(200).json({ data: resp_basicos.rows, mensaje: "Lista registros", count: parseInt(rest_count.rows[0].count), statuscode: 200 });
                });
            });
            

        } else {
            return res.status(200).json({ data: [], mensaje: "Error al leer datos", statuscode: 204 });
        }
    } catch (error) {
        logger.error(error);
        return res.status(500).json({ data: [], mensaje: "Error al consultar datos", statuscode: 500 });
    }
};

const postListRegistrosNaturalPDF = async (req, res) => {
    try {
        var data = req.body;
        if (data != null) {
            var select_datos_basicos = (await sql.select_datos_basicos(data.models.numero_servicio, data.models.tipoQuery)).toString();
            var select_datos_apoderado = (await sql.select_datos_apoderado(data.models.numero_servicio, data.models.tipoQuery)).toString();
            var select_datos_laborales = (await sql.select_datos_laborales(data.models.numero_servicio, data.models.tipoQuery)).toString();
            var select_bien = (await sql.select_bien(data.models.numero_servicio, data.models.tipoQuery)).toString();
            var select_trasmite_opciones = (await sql.select_trasmite_opciones(data.models.numero_servicio, data.models.tipoQuery)).toString();
            var resp = [];
            const respConNS = await con.query(select_datos_basicos, async (err, resp_basicos) => {
                logger.error(err);
                if (err)
                    return res.status(404).json({ data: [], mensaje: "No se pudo validar el documento.|Mensaje al Usuario", statuscode: 500 });
                const respConNS = await con.query(select_datos_apoderado, async (err, resp_apoderado) => {
                    logger.error(err);
                    if (err)
                        return res.status(404).json({ data: [], mensaje: "No se pudo validar el documento.|Mensaje al Usuario", statuscode: 500 });
                    const respConNS = await con.query(select_datos_laborales, async (err, resp_laborales) => {
                        logger.error(err);
                        if (err)
                            return res.status(404).json({ data: [], mensaje: "No se pudo validar el documento.|Mensaje al Usuario", statuscode: 500 });
                        const respConNS = await con.query(select_trasmite_opciones, async (err, resp_opciones) => {
                            logger.error(err);
                            if (err)
                                return res.status(404).json({ data: [], mensaje: "No se pudo validar el documento.|Mensaje al Usuario", statuscode: 500 });
                            if (resp_opciones.rows.length > 0) {
                                if (resp_opciones.rows[0].tipo_tramite == 2) {
                                  const respConNS = await con.query(select_bien, async (err, resp_bien) => {
                                    resp.push(resp_basicos.rows.length > 0 ? resp_basicos.rows[0] : []);
                                    resp.push(resp_apoderado.rows.length > 0 ? resp_apoderado.rows[0] : []);
                                    resp.push(resp_laborales.rows.length > 0 ? resp_laborales.rows[0] : []);
                                    resp.push(resp_bien.rows.length > 0 ? resp_bien.rows[0] : []);
                                    resp.push(resp_opciones.rows.length > 0 ? resp_opciones.rows[0] : []);
                                    return res.status(200).json({ data: resp, mensaje: "datos", statuscode: 200 });
                                  });
                                } else {
                                  resp.push(resp_basicos.rows.length > 0 ? resp_basicos.rows[0] : []);
                                  resp.push(resp_apoderado.rows.length > 0 ? resp_apoderado.rows[0] : []);
                                  resp.push(resp_laborales.rows.length > 0 ? resp_laborales.rows[0] : []);
                                  resp.push([]);
                                  resp.push(resp_opciones.rows.length > 0 ? resp_opciones.rows[0] : []);
                                  return res.status(200).json({ data: resp, mensaje: "datos", statuscode: 200 });
                                }
                            } else {
                                return res.status(200).json({ data: [], mensaje: "Error al leer datos", statuscode: 204 });
                            }
                        });
                    });
                });
            });
        } else {
            return res.status(200).json({ data: [], mensaje: "Error al leer datos", statuscode: 204 });
        }
    } catch (error) {
        logger.error(error);
        return res.status(500).json({ data: [], mensaje: "Error al consultar datos", statuscode: 500 });
    }
};

const postListRegistrosJuridicaPDF = async (req, res) => {
    try {
        var data = req.body;
        if (data != null) {
            var select_datos_entidad = (await sql.select_datos_entidad(data.models.numero_servicio, data.models.tipoQuery)).toString();
            var select_datos_entidad_uif = (await sql.select_datos_entidad_uif(data.models.numero_servicio, data.models.tipoQuery)).toString();
            var select_contribuyentes = (await sql.select_contribuyentes(data.models.numero_servicio, data.models.tipoQuery)).toString();
            var select_trasmite_opciones = (await sql.select_trasmite_opciones(data.models.numero_servicio, data.models.tipoQuery)).toString();
            var select_bien = (await sql.select_bien(data.models.numero_servicio, data.models.tipoQuery)).toString();
            var resp = [];
            const respConNS = await con.query(select_datos_entidad, async (err, resp_datos_entidad) => {
                logger.error(err);
                if (err)
                    return res.status(404).json({ data: [], mensaje: "No se pudo validar el documento.|Mensaje al Usuario", statuscode: 500 });
                const respConNS = await con.query(select_datos_entidad_uif, async (err, resp_select_datos_entidad_uif) => {
                    logger.error(err);
                    if (err)
                        return res.status(404).json({ data: [], mensaje: "No se pudo validar el documento.|Mensaje al Usuario", statuscode: 500 });
                    const respConNS = await con.query(select_trasmite_opciones, async (err, resp_select_trasmite_opciones) => {
                        logger.error(err);
                        if (err)
                            return res.status(404).json({ data: [], mensaje: "No se pudo validar el documento.|Mensaje al Usuario", statuscode: 500 });
                        const respConNS = await con.query(select_contribuyentes, async (err, resp_select_contribuyentes) => {
                            logger.error(err);
                            if (err)
                                return res.status(404).json({ data: [], mensaje: "No se pudo validar el documento.|Mensaje al Usuario", statuscode: 500 });
                            if (resp_select_trasmite_opciones.rows.length > 0) {
                                if (resp_select_trasmite_opciones.rows[0].tipo_tramite == 2) {
                                    const respConNS = await con.query(select_bien, async (err, resp_select_bien) => {
                                        resp.push(resp_datos_entidad.rows.length > 0 ? resp_datos_entidad.rows[0] : []);
                                        resp.push(resp_select_datos_entidad_uif.rows.length > 0 ? resp_select_datos_entidad_uif.rows[0] : []);
                                        resp.push(resp_select_trasmite_opciones.rows.length > 0 ? resp_select_trasmite_opciones.rows[0] : []);
                                        resp.push(resp_select_bien.rows.length > 0 ? resp_select_bien.rows[0] : []);
                                        resp.push(resp_select_contribuyentes.rows.length > 0 ? resp_select_contribuyentes.rows : []);
                                        return res.status(200).json({ data: resp, mensaje: "datos", statuscode: 200 });
                                    });
                                } else {
                                    resp.push(resp_datos_entidad.rows.length > 0 ? resp_datos_entidad.rows[0] : []);
                                    resp.push(resp_select_datos_entidad_uif.rows.length > 0 ? resp_select_datos_entidad_uif.rows[0] : []);
                                    resp.push(resp_select_trasmite_opciones.rows.length > 0 ? resp_select_trasmite_opciones.rows[0] : []);
                                    resp.push([]);
                                    resp.push(resp_select_contribuyentes.rows.length > 0 ? resp_select_contribuyentes.rows : []);
                                    return res.status(200).json({ data: resp, mensaje: "datos", statuscode: 200 });
                                }
                            } else {
                                return res.status(200).json({ data: [], mensaje: "Error al leer datos", statuscode: 204 });
                            }
                        });
                    });
                });
            });
        } else {
            return res.status(200).json({ data: [], mensaje: "Error al leer datos", statuscode: 204 });
        }
    } catch (error) {
        return res.status(500).json({ data: [], mensaje: "Error al consultar datos", statuscode: 500 });
    }
};

const postFilDocumento = async (req, res) => {
    try {
        var data = req.body.models;
        if (data.tipo == 1) {
            const respConNS = await con.query("select e.numero_servicio, upper(e.razonsocial) as entidad from public.datos_entidad e where e.ruc = '" + data.numeroDocumento + "' order by e.id desc limit 1", async (err, resp) => {
                logger.error(err);
                if (err) {
                    return res.status(404).json({ data: [], mensaje: "No se pudo validar el documento.|Mensaje al Usuario", statuscode: 500 });
                }
                if (resp.rows.length > 0) {
                    var numero_servicio = resp.rows[0]['numero_servicio'];
                    var entidad = resp.rows[0]['entidad'];
                    var select_datos_entidad = (await sql.select_datos_entidad(numero_servicio, data.tipoQuery)).toString();
                    var select_datos_entidad_uif = (await sql.select_datos_entidad_uif(numero_servicio, data.tipoQuery)).toString();
                    var select_contribuyentes = (await sql.select_contribuyentes(numero_servicio, data.tipoQuery)).toString();
                    var select_trasmite_opciones = (await sql.select_trasmite_opciones(numero_servicio, data.tipoQuery)).toString();
                    var select_bien = (await sql.select_bien(numero_servicio, data.tipoQuery)).toString();
                    const respConNS = await con.query(select_datos_entidad, async (err, resp_datos_entidad) => {
                        logger.error(err);
                        if (err)
                            return res.status(404).json({ data: [], mensaje: "No se pudo validar el documento.|Mensaje al Usuario", statuscode: 500 });
                        const respConNS = await con.query(select_datos_entidad_uif, async (err, resp_select_datos_entidad_uif) => {
                            logger.error(err);
                            if (err)
                                return res.status(404).json({ data: [], mensaje: "No se pudo validar el documento.|Mensaje al Usuario", statuscode: 500 });
                            const respConNS = await con.query(select_trasmite_opciones, async (err, resp_select_trasmite_opciones) => {
                                logger.error(err);
                                if (err)
                                    return res.status(404).json({ data: [], mensaje: "No se pudo validar el documento.|Mensaje al Usuario", statuscode: 500 });
                                const respConNS = await con.query(select_contribuyentes, async (err, resp_select_contribuyentes) => {
                                    logger.error(err);
                                    if (err)
                                        return res.status(404).json({ data: [], mensaje: "No se pudo validar el documento.|Mensaje al Usuario", statuscode: 500 });
                                    if (resp_select_trasmite_opciones.rows.length > 0) {
                                        if (resp_select_trasmite_opciones.rows[0].tipo_tramite == 2) {
                                            const respConNS = await con.query(select_bien, async (err, resp_select_bien) => {
                                                var resp = ({
                                                    resp_datos_entidad: resp_datos_entidad.rows.length > 0 ? resp_datos_entidad.rows[0] : null,
                                                    resp_select_datos_entidad_uif: resp_select_datos_entidad_uif.rows.length > 0 ? resp_select_datos_entidad_uif.rows[0] : null,
                                                    resp_select_trasmite_opciones: resp_select_trasmite_opciones.rows.length > 0 ? resp_select_trasmite_opciones.rows[0] : null,
                                                    resp_select_bien: resp_select_bien.rows.length > 0 ? resp_select_bien.rows[0] : null,
                                                    resp_select_contribuyentes: resp_select_contribuyentes.rows.length > 0 ? resp_select_contribuyentes.rows : null
                                                });
                                                return res.status(200).json({ data: resp, mensaje: "Se cargó último registro correctamente.|" + entidad, statuscode: 200 });
                                            });
                                        } else {
                                            var resp = ({
                                                resp_datos_entidad: resp_datos_entidad.rows.length > 0 ? resp_datos_entidad.rows[0] : null,
                                                resp_select_datos_entidad_uif: resp_select_datos_entidad_uif.rows.length > 0 ? resp_select_datos_entidad_uif.rows[0] : null,
                                                resp_select_trasmite_opciones: resp_select_trasmite_opciones.rows.length > 0 ? resp_select_trasmite_opciones.rows[0] : null,
                                                resp_select_bien: null,
                                                resp_select_contribuyentes: resp_select_contribuyentes.rows.length > 0 ? resp_select_contribuyentes.rows : null
                                            });
                                            return res.status(200).json({ data: resp, mensaje: "Se cargó último registro correctamente.|" + entidad, statuscode: 200 });
                                        }
                                    } else {
                                        return res.status(200).json({ data: [], mensaje: "Error al leer datos", statuscode: 204 });
                                    }
                                });
                            });
                        });
                    });
                } else {
                    return res.status(200).json({ data: resp, mensaje: "No se encontrarón datos.|Mensaje al Usuario", statuscode: 202 });
                }
            });
        } else {
            const respConNS = await con.query("select b.numero_servicio, concat(upper(b.apellidos), ' ', upper(b.nombres)) as persona from public.datos_basicos b where b.num_documento = '" + data.numeroDocumento + "' order by b.id desc limit 1", async (err, resp) => {
                logger.error(err);
                if (err) {
                    return res.status(404).json({ data: [], mensaje: "No se pudo validar el documento.|Mensaje al Usuario", statuscode: 500 });
                }
                if (resp.rows.length > 0) {
                    var numero_servicio = resp.rows[0]['numero_servicio'];
                    var persona = resp.rows[0]['persona'];
                    var select_datos_basicos = (await sql.select_datos_basicos(numero_servicio, data.tipoQuery)).toString();
                    var select_datos_apoderado = (await sql.select_datos_apoderado(numero_servicio, data.tipoQuery)).toString();
                    var select_datos_laborales = (await sql.select_datos_laborales(numero_servicio, data.tipoQuery)).toString();
                    var select_bien = (await sql.select_bien(numero_servicio, data.tipoQuery)).toString();
                    var select_trasmite_opciones = (await sql.select_trasmite_opciones(numero_servicio, data.tipoQuery)).toString();
                    const respConNS = await con.query(select_datos_basicos, async (err, resp_basicos) => {
                        logger.error(err);
                        if (err)
                            return res.status(404).json({ data: [], mensaje: "No se pudo validar el documento.|Mensaje al Usuario", statuscode: 500 });
                        const respConNS = await con.query(select_datos_apoderado, async (err, resp_apoderado) => {
                            logger.error(err);
                            if (err)
                                return res.status(404).json({ data: [], mensaje: "No se pudo validar el documento.|Mensaje al Usuario", statuscode: 500 });
                            const respConNS = await con.query(select_datos_laborales, async (err, resp_laborales) => {
                                logger.error(err);
                                if (err)
                                    return res.status(404).json({ data: [], mensaje: "No se pudo validar el documento.|Mensaje al Usuario", statuscode: 500 });
                                const respConNS = await con.query(select_trasmite_opciones, async (err, resp_opciones) => {
                                    logger.error(err);
                                    if (err)
                                        return res.status(404).json({ data: [], mensaje: "No se pudo validar el documento.|Mensaje al Usuario", statuscode: 500 });
                                    const respConNS = await con.query(select_bien, async (err, resp_bien) => {
                                        logger.error(err);
                                        if (err)
                                            return res.status(404).json({ data: [], mensaje: "No se pudo validar el documento.|Mensaje al Usuario", statuscode: 500 });
                                        var resp = ({
                                            resp_basicos: resp_basicos.rows.length > 0 ? resp_basicos.rows[0] : null,
                                            resp_apoderado: resp_apoderado.rows.length > 0 ? resp_apoderado.rows[0] : null,
                                            resp_laborales: resp_laborales.rows.length > 0 ? resp_laborales.rows[0] : null,
                                            resp_bien: resp_bien.rows.length > 0 ? resp_bien.rows[0] : null,
                                            resp_opciones: resp_opciones.rows.length > 0 ? resp_opciones.rows[0] : null
                                        });
                                        return res.status(200).json({ data: resp, mensaje: "Se cargo último registro correctamente.|" + persona, statuscode: 200 });
                                    });
                                });
                            });
                        });
                    });
                } else {
                    return res.status(200).json({ data: resp, mensaje: "No se encontrarón datos.|Mensaje al Usuario", statuscode: 202 });
                }
            });
        }
    } catch (error) {
        return res.status(500).json({
            data: [],
            mensaje: "Error al desconocido.|Mensaje al Usuario",
            statuscode: 500,
        });
    }
};


module.exports = {
    posUbigeo,
    postFilDocumento,
    getListTipoDocumento,
    getListPaises,
    getListEstadoCivil,
    postListRegistros,
    postListRegistrosNaturalPDF,
    postListRegistrosJuridicaPDF
};
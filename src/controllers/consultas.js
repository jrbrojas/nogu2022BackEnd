const jwt = require("jsonwebtoken");
const request = require('request');

exports.buscarPlacaVahiculoJuridica = async (data) => {
    return "SELECT " +
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
        "DOC_REPRESENTANTES.nombre as representantes_nombre_tipo_documento, " +
        "REPRESENTANTES.otro_documento as representantes_otro_documento, " +
        "REPRESENTANTES.numero_documento as representantes_numero_documento, " +
        "REPRESENTANTES.nombres as representantes_nombres, " +
        "PAIS_REPRESENTANTES.nombre as representantes_nombre_pais_nacionalidad, " +
        "EST_CIVIL_REPRESENTANTES.nombre as representantes_nombre_estado_civil, " +
        "REPRESENTANTES.domicilio as representantes_domicilio, " +
        "REPRESENTANTES.profecion_ocupacion as representantes_profecion_ocupacion, " +
        "REPRESENTANTES.inscripcion_registral as representantes_inscripcion_registral, " +
        "REPRESENTANTES.separa_patrimonio as representantes_separa_patrimonio, " +
        "REPRESENTANTES.partida as representantes_partida, " +
        "REPRESENTANTES.sede as representantes_sede, " +
        "REPRESENTANTES.nombre_conyugue as representantes_nombre_conyugue, " +
        "REPRESENTANTES.nombre_conyugue_documento as representantes_nombre_conyugue_documento, " +
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
        "inner join public.tipo_documento DOC_REPRESENTANTES ON DOC_REPRESENTANTES.id = REPRESENTANTES.id_tipo_documento " +
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
}

exports.buscarPlacaVahiculoNatural = async (data) => {
    return "SELECT " +
        "BIEN.tipo_bien as bien_tipo_bien, " +
        "BIEN.tipo_transferencia as bien_tipo_transferencia, " +
        "BIEN.num_placa as bien_num_placa, " +
        "BIEN.moneda as bien_moneda, " +
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
        "BIEN.marca as bien_marca, " +
        "BIEN.modelo as bien_modelo, " +
        "OPCIONES.tipo_persona as opciones_tipo_persona, " +
        "OPCIONES.tipo_opcion as opciones_tipo_opcion, " +
        "OPCIONES.tipo_tramite as opciones_tipo_tramite, " +
        "OPCIONES.created_at as opciones_created_at, " +
        "OPCIONES.tipo_condicion as opciones_tipo_condicion, " +
        "OPCIONES.inestadokardex as opciones_inestadokardex, " +
        "BASICOS.id as basicos_id, " +
        "BASICOS.num_documento as basicos_num_documento, " +
        "DOC_BASICOS.nombrecompleto as basicos_nombre_tipo_documento, " +
        "BASICOS.otro_documento as basicos_otro_documento, " +
        "BASICOS.nombres as basicos_nombres, " +
        "BASICOS.apellidos as basicos_apellidos, " +
        "BASICOS.pais_origen as basicos_pais_origen, " +
        "BASICOS.ciudad as basicos_ciudad, " +
        "BASICOS.fecha_nacimiento as basicos_fecha_nacimiento, " +
        "PAIS_BASICOS.nombre as basicos_nombre_pais_nacionalidad, " +
        "EST_CIVIL_BASICOS.nombre as basicos_nombre_estado_civil, " +
        "BASICOS.separa_patrimonio as basicos_separa_patrimonio, " +
        "BASICOS.partida as basicos_partida, " +
        "BASICOS.sede as basicos_sede, " +
        "BASICOS.domicilio as basicos_domicilio, " +
        "BASICOS.telefono_uno as basicos_telefono_uno, " +
        "BASICOS.telefono_dos as basicos_telefono_dos, " +
        "BASICOS.nombre_conyugue as basicos_nombre_conyugue, " +
        "BASICOS.cuidad_origen as basicos_cuidad_origen, " +
        "BASICOS.distrito as basicos_distrito, " +
        "BASICOS.extranjero as basicos_extranjero, " +
        "DIS_BASICOS.nombre as basicos_nombre_distrito, " +
        "PRO_BASICOS.nombre as basicos_nombre_provincia, " +
        "DEP_BASICOS.nombre as basicos_nombre_departamento, " +
        "BASICOS.nombre_conyugue_documento as basicos_nombre_conyugue_documento, " +
        "BASICOS.conyugue_fecha_nacimiento as basicos_conyugue_fecha_nacimiento, " +
        "LABORALES.id as laborales_id, " +
        "LABORALES.profesion as laborales_profesion, " +
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
        "DOC_APODERADO.nombre as apoderado_nombre_tipo_documento, " +
        "APODERADO.otro_documento as apoderado_otro_documento, " +
        "APODERADO.nombres as apoderado_nombres, " +
        "APODERADO.apellidos as apoderado_apellidos, " +
        "APODERADO.domicilio as apoderado_domicilio, " +
        "APODERADO.nacionalidad as apoderado_nacionalidad, " +
        "EST_CIVIL_APODERADO.nombre as apoderado_nombre_estado_civil, " +
        "APODERADO.profesion as apoderado_profesion, " +
        "APODERADO.registro_poder as apoderado_registro_poder, " +
        "APODERADO.conyugue_nombres as apoderado_conyugue_nombres, " +
        "DIS_APODERADO.nombre as apoderado_nombre_distrito, " +
        "PRO_APODERADO.nombre as apoderado_nombre_distrito, " +
        "DEP_APODERADO.nombre as apoderado_nombre_distrito, " +
        "APODERADO.sede_registral as apoderado_sede_registral " +
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
}

exports.insert_tamite_opciones = async (data) => {
    var fecha = new Date();
    var newFecha =
        fecha.getMonth() + 1 +
        "/" +
        fecha.getDate() +
        "/" +
        fecha.getFullYear();
    return (data.tipo_persona + ", " +
        data.tipo_opcion + ", " +
        data.tipo_tramite + ", " +
        data.tipo_condicion + ", " +
        "'" + newFecha + "' ");
};

exports.insert_datos_laborales = async (data) => {
    return "'" + data.profesion + "', " +
        "'" + data.centro_trabajo + "', " +
        "" + data.funcion_publica + ", " +
        "'" + data.cargo_publico + "', " +
        "" + data.familiar_cargo + ", " +
        "'" + data.familiar_nombres + "', " +
        "'" + data.familiar_car + "', " +
        "'" + data.id_familiar_pais + "', " +
        "" + data.informar_uif + ", " +
        "" + data.oficial_cumplimiento + ", " +
        "" + (data.of_haberes == true ? 0 : 1) + ", " +
        "" + (data.of_prestamos_familiares == true ? 0 : 1) + ", " +
        "" + (data.of_venta_bien_inmieble == true ? 0 : 1) + ", " +
        "" + (data.of_rentas == true ? 0 : 1) + ", " +
        "" + (data.of_donacion == true ? 0 : 1) + ", " +
        "" + (data.of_prestamos_bancario == true ? 0 : 1) + ", " +
        "" + (data.of_herencia == true ? 0 : 1) + ", " +
        "" + (data.of_venta_vehiculo == true ? 0 : 1) + ", " +
        "" + (data.of_comercio == true ? 0 : 1) + ", " +
        "" + (data.of_otros_describir == true ? 0 : 1) + ", " +
        "'" + data.of_otros_describir_text + "', " +
        "" + (data.mp_efectivo == true ? 0 : 1) + ", " +
        "" + (data.mp_deposito_cuenta == true ? 0 : 1) + ", " +
        "" + (data.mp_bien_inmueble == true ? 0 : 1) + ", " +
        "" + (data.mp_cheque == true ? 0 : 1) + ", " +
        "" + (data.mp_transferencia_bancaria == true ? 0 : 1) + ", " +
        "" + (data.mp_bien_mueble == true ? 0 : 1) + ", " +
        "" + (data.mp_otros_describir == true ? 0 : 1) + ", " +
        "'" + data.mp_otros_describir_text + "', " +
        "" + (data.of_donacion_pago == true ? 0 : 1) + " ";
};

exports.insert_datos_apoderado = async (data) => {
    return "" + data.id_tipo_documento + ", " +
        "'" + data.otro_documento + "', " +
        "'" + data.num_documento + "', " +
        "'" + data.nombres + "', " +
        "'" + data.apellidos + "', " +
        (this.formato_fecha(data.fecha_nacimiento) == null ?  ("" + null + ", ") : ("'" + this.formato_fecha(data.fecha_nacimiento) + "', ")) +
        "'" + data.nacionalidad + "', " +
        "'" + data.profesion + "', " +
        "'" + data.registro_poder + "', " +
        "'" + data.correo + "', " +
        "'" + data.conyugue_nombres + "', " +
        "" + data.id_estado_civil + ", " +
        "" + data.id_ubigeo + ", " +
        "'" + data.domicilio + "', " + 
        "'" + data.sede_registral + "', " + 
        " '" + data.celular + "' ";
};


exports.insert_datos_basicos = async (data) => {
    return "'" + data.num_documento + "', " +
        "" + data.id_tipo_documento + ", " +
        "'" + data.otro_documento + "', " +
        "'" + data.nombres + "', " +
        "'" + data.apellidos + "', " +
        "'" + data.pais_origen + "', " +
        "'" + data.ciudad + "', " +
       (this.formato_fecha(data.fecha_nacimiento) == null ?  ("" + null + ", ") : ("'" + this.formato_fecha(data.fecha_nacimiento) + "', ")) +
        "" + data.id_pais_nacionalidad + ", " +
        "" + data.id_estado_civil + ", " +
        "" + data.separa_patrimonio + ", " +
        "'" + data.partida + "', " +
        "'" + data.sede + "', " +
        "'" + data.nombre_conyugue_documento + "', " +
        (this.formato_fecha(data.conyugue_fecha_nacimiento) == null ?  ("" + null + ", ") : ("'" + this.formato_fecha(data.conyugue_fecha_nacimiento) + "', ")) +
        "'" + data.domicilio + "', " +
        "'" + data.telefono_uno + "', " +
        "'" + data.telefono_dos + "', " +
        "'" + data.correo_electronico + "', " +
        "'" + data.nombre_conyugue + "', " +
        "'" + data.cuidad_origen + "', " +
        "'" + data.distrito + "', " +
        "" + data.id_ubigeo + ", " +
        "" + data.extranjero + " ";
};

////////////////////7
exports.insert_datos_bien = async (data) => {
    return ("" + data.tipo_bien + ", " +
        "'" + data.tipo_transferencia + "', " +
        "'" + data.num_placa + "', " +
        "'" + data.marca + "', " +
        "'" + data.modelo + "', " +
        "'" + data.moneda + "', " +
        "'" + data.valor + "', " +
        "" + data.targeta_propiedad + ", " +
        "" + (data.mp_compra_venta == true ? 0 : 1) + ", " +
        "" + (data.mp_donacion == true ? 0 : 1) + ", " +
        "" + (data.mp_permuta == true ? 0 : 1) + ", " +
        "" + (data.mp_dacion_pago == true ? 0 : 1) + ", " +
        "" + (data.mp_otro == true ? 0 : 1) + ", " +
        "'" + data.mp_otros_describir + "', " +
        "'" + data.numero_tarjeta_propiedad + "', " +
        "" + (data.mp_anticipo_legitima == true ? 0 : 1));
};
//////////////////

//RUCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCC

exports.insert_datos_entidad_uif = async (data) => {
    return ("" + data.obigado_informar + ", " +
        "" + data.designo_oficial_cumplimiento + ", " +
        "" + data.expuesta25 + ", " +
        "'" + data.nombres + "', " +
        "'" + data.cargo + "', " +
        "" + data.id_pais + ", " +
        "" + (data.of_giro_negocio == true ? 0 : 1) + ", " +
        "" + (data.of_prestamos_socios == true ? 0 : 1) + ", " +
        "" + (data.of_venta_bien_inmueble == true ? 0 : 1) + ", " +
        "" + (data.of_intermediacion_financiera == true ? 0 : 1) + ", " +
        "" + (data.of_prestamo_bancario == true ? 0 : 1) + ", " +
        "" + (data.of_prestamo_terceros == true ? 0 : 1) + ", " +
        "" + (data.of_venta_activos == true ? 0 : 1) + ", " +
        "" + (data.of_otros_escribir_of == true ? 0 : 1) + ", " +
        "'" + data.of_otros_escribir_of_text + "', " +
        "" + (data.mp_efectivo == true ? 0 : 1) + ", " +
        "" + (data.mp_deposito_cuenta == true ? 0 : 1) + ", " +
        "" + (data.mp_bien_inmueble == true ? 0 : 1) + ", " +
        "" + (data.mp_cheque == true ? 0 : 1) + ", " +
        "" + (data.mp_transferencia_bancaria == true ? 0 : 1) + ", " +
        "" + (data.mp_bien_mueble == true ? 0 : 1) + ", " +
        "" + (data.mp_otros_describir == true ? 0 : 1) + ", " +
        "'" + data.mp_otros_describir_text + "' ");
};

exports.insert_datos_entidad = async (data) => {
    return ("'" + data.ruc + "', " +
        "'" + data.razonsocial + "', " +
        "'" + data.direccion + "', " +
        "'" + data.telefono + "', " +
        "'" + data.correo + "', " +
        "'" + data.id_distrito + "', " +
        "" + (data.principal_contribuyente == true ? 0 : 1) + ", " +
        "" + (data.declaracion_jurada == true ? 0 : 1) + ", " +
        "" + (data.comercial == true ? 0 : 1) + ", " +
        "" + (data.industrial == true ? 0 : 1) + ", " +
        "" + (data.construccion == true ? 0 : 1) + ", " +
        "" + (data.transporte == true ? 0 : 1) + ", " +
        "" + (data.pesca == true ? 0 : 1) + ", " +
        "" + (data.intermediacion_financiera == true ? 0 : 1) + ", " +
        "" + (data.hoteles_restaurantes == true ? 0 : 1) + ", " +
        "" + (data.agricultura == true ? 0 : 1) + ", " +
        "" + (data.ensenanza == true ? 0 : 1) + ", " +
        "" + (data.suministro_electricidad_gas == true ? 0 : 1) + ", " +
        "'" + data.partida_registral + "', " +
        "'" + data.sede_registral + "', " +
        "'" + data.otros_describir + "', " +
        "" + (data.otro_opcion == true ? 0 : 1) + " ");
};

exports.insert_contribuyentes = async (data, numero_servicio) => {
    return ("" + data.id + ", " +
        "" + data.id_tipo_documento + ", " +
        "'" + data.otro_documento + "', " +
        "'" + data.numero_documento + "', " +
        "'" + data.nombres + "', " +
        (this.formato_fecha(data.fecha_nacimiento) == null ?  ("" + null + ", ") : ("'" + this.formato_fecha(data.fecha_nacimiento) + "', ")) +
        "" + data.id_pais_nacionalidad + ", " +
        "" + data.id_estado_civil + ", " +
        "'" + data.domicilio + "', " +
        "'" + data.id_distrito + "', " +
        "'" + data.profecion_ocupacion + "', " +
        "'" + data.telefono + "', " +
        "'" + data.inscripcion_registral + "', " +
         "" + (data.separa_patrimonio == null ? 0 : data.separa_patrimonio) + ", " +
         "'" + data.partida + "', " +
         "'" + data.sede + "', " +
         "'" + data.nombre_conyugue + "', " +
         "'" + data.nombre_conyugue_documento + "', " +
         "'" + data.conyugue_fecha_nacimiento + "', " +
        "" + numero_servicio);
};

exports.select_datos_basicos = async (numero_servicio, tipoQuery) => {
    var sql = 'select ' +
        'apellidos,' +
        'distrito, ' +
        'ciudad,' +
        'correo_electronico,' +
        'cuidad_origen, ' +
        'domicilio,' +
        "to_char(fecha_nacimiento,'DD/MM/YYYY') as fecha_nacimiento," +
        'id_estado_civil,' +
        (tipoQuery == false ? 'id_pais_nacionalidad, ' : 'paises.nombre as id_pais_nacionalidad, ') +
        'id_tipo_documento,' +
        'nombre_conyugue,' +
        'nombre_conyugue_documento,' +
        "to_char(conyugue_fecha_nacimiento,'DD/MM/YYYY') as conyugue_fecha_nacimiento," +
        'nombres,' +
        'num_documento,' +
        'otro_documento,' +
        'pais_origen, ' +
        'partida,' +
        'sede,' +
        'separa_patrimonio,' +
        'telefono_dos,' +
        'telefono_uno, ' +
        'numero_servicio, ' +
        (tipoQuery == false ? ' id_ubigeo, ' : "case when datos_basicos.id_ubigeo = 0 then '' else concat(departamento.nombre, ' - ', provincia.nombre, ' - ', distrito.nombre) end as id_ubigeo, ") +
        'extranjero ' +
        'from public.datos_basicos ' +
        'left join paises on paises.id = datos_basicos.id_pais_nacionalidad ' +
        'left join distrito on distrito.id = datos_basicos.id_ubigeo ' +
        'left join provincia on provincia.id = distrito.idprovincia ' +
        'left join departamento on departamento.id = provincia.iddepartamento ' +
        'where numero_servicio = ' + numero_servicio;
    return sql;
};

exports.select_datos_apoderado_fill = async (num_documento, tipoQuery) => {
    return sql = 'select ' +
        'apellidos,' +
        'conyugue_nombres,' +
        'correo,' +
        (tipoQuery == false ? ' id_ubigeo, ' : "case when datos_apoderado.id_ubigeo = 0 then '' else concat(departamento.nombre, ' - ', provincia.nombre, ' - ', distrito.nombre) end as ubigeo, ") +
        'domicilio,' +
        "to_char(fecha_nacimiento,'DD/MM/YYYY') as fecha_nacimiento," +
        'id_tipo_documento,' +
        'nacionalidad, ' +
        (tipoQuery == false ? 'id_estado_civil, ' : 'estado_civil.nombre as id_estado_civil, ') +
        'nombres,' +
        'num_documento,' +
        'otro_documento,' +
        'profesion,' +
        "coalesce(sede_registral, '') as sede_registral, " +
        "coalesce(celular, '') as celular, " +
        'registro_poder, ' +
        'numero_servicio ' +
        'from public.datos_apoderado ' +
        'left join distrito on distrito.id = datos_apoderado.id_ubigeo ' +
        'left join provincia on provincia.id = distrito.idprovincia ' +
        'left join departamento on departamento.id = provincia.iddepartamento ' +
        "left join public.estado_civil on estado_civil.id = datos_apoderado.id_estado_civil where num_documento = '" + num_documento + "'";
};

exports.select_datos_apoderado = async (numero_servicio, tipoQuery) => {
    return sql = 'select ' +
        'apellidos,' +
        'conyugue_nombres,' +
        'correo,' +
        (tipoQuery == false ? ' id_ubigeo, ' : "case when datos_apoderado.id_ubigeo = 0 then '' else concat(departamento.nombre, ' - ', provincia.nombre, ' - ', distrito.nombre) end as ubigeo, ") +
        'domicilio,' +
        "to_char(fecha_nacimiento,'DD/MM/YYYY') as fecha_nacimiento," +
        'id_tipo_documento,' +
        'nacionalidad, ' +
        (tipoQuery == false ? 'id_estado_civil, ' : 'estado_civil.nombre as id_estado_civil, ') +
        'nombres,' +
        'num_documento,' +
        'otro_documento,' +
        'profesion,' +
        "coalesce(sede_registral, '') as sede_registral, " +
        "coalesce(celular, '') as celular, " +
        'registro_poder, ' +
        'numero_servicio ' +
        'from public.datos_apoderado ' +
        'left join distrito on distrito.id = datos_apoderado.id_ubigeo ' +
        'left join provincia on provincia.id = distrito.idprovincia ' +
        'left join departamento on departamento.id = provincia.iddepartamento ' +
        "left join public.estado_civil on estado_civil.id = datos_apoderado.id_estado_civil where numero_servicio = " + numero_servicio + "";
};

exports.select_datos_laborales = async (numero_servicio, tipoQuery) => {
    return sql = 'select ' +
        'cargo_publico, ' +
        'centro_trabajo, ' +
        'familiar_car, ' +
        'familiar_cargo, ' +
        'familiar_nombres, ' +
        'funcion_publica, ' +
        (tipoQuery == false ? 'id_familiar_pais, ' : 'paises.nombre as id_familiar_pais, ') +
        'informar_uif, ' +
        'mp_bien_inmueble, ' +
        'mp_bien_mueble, ' +
        'mp_cheque, ' +
        'mp_deposito_cuenta, ' +
        'mp_efectivo, ' +
        'mp_otros_describir, ' +
        'mp_otros_describir_text, ' +
        'mp_transferencia_bancaria, ' +
        'of_comercio, ' +
        'of_donacion, ' +
        'of_donacion_pago, ' +
        'of_haberes, ' +
        'of_herencia, ' +
        'of_otros_describir, ' +
        'of_otros_describir_text, ' +
        'of_prestamos_bancario, ' +
        'of_prestamos_familiares, ' +
        'of_rentas, ' +
        'of_venta_bien_inmieble, ' +
        'of_venta_vehiculo, ' +
        'oficial_cumplimiento, ' +
        'numero_servicio, ' +
        'profesion from public.datos_laborales ' +
        'left join paises on paises.id = datos_laborales.id_familiar_pais where numero_servicio = ' + numero_servicio;
};

exports.select_datos_entidad = async (numero_servicio, tipoQuery) => {
    return sql = 'select ' +
        'ruc, ' +
        'razonsocial, ' +
        'partida_registral, ' +
        'sede_registral, ' +
        'direccion, ' +
        'telefono, ' +
        'correo, ' +
        (tipoQuery == false ? ' id_distrito, ' : "case when datos_entidad.id_distrito = 0 then '' else concat(departamento.nombre, ' - ', provincia.nombre, ' - ', distrito.nombre) end as ubigeo, ") +
        'id_distrito, ' +
        'principal_contribuyente, ' +
        'declaracion_jurada, ' +
        'comercial, ' +
        'industrial, ' +
        'construccion, ' +
        'transporte, ' +
        'pesca, ' +
        'intermediacion_financiera, ' +
        'hoteles_restaurantes, ' +
        'agricultura, ' +
        'ensenanza, ' +
        'suministro_electricidad_gas, ' +
        'otros_describir, ' +
        'otro_opcion, ' +
        'numero_servicio ' +
        'from public.datos_entidad ' +
        'left join distrito on distrito.id = datos_entidad.id_distrito ' +
        'left join provincia on provincia.id = distrito.idprovincia ' +
        'left join departamento on departamento.id = provincia.iddepartamento where numero_servicio = ' + numero_servicio;
};

exports.select_datos_entidad_uif = async (numero_servicio, tipoQuery) => {
    return sql = 'select ' +
        'obigado_informar, ' +
        'designo_oficial_cumplimiento, ' +
        'expuesta25, ' +
        'nombres, ' +
        'cargo, ' +
        (tipoQuery == false ? 'id_pais, ' : 'paises.nombre as id_pais, ') +
        'of_giro_negocio, ' +
        'of_prestamos_socios, ' +
        'of_venta_bien_inmueble, ' +
        'of_intermediacion_financiera, ' +
        'of_prestamo_bancario, ' +
        'of_prestamo_terceros, ' +
        'of_venta_activos, ' +
        'of_otros_escribir_of, ' +
        'of_otros_escribir_of_text, ' +
        'mp_efectivo, ' +
        'mp_deposito_cuenta, ' +
        'mp_bien_inmueble, ' +
        'mp_cheque, ' +
        'mp_transferencia_bancaria, ' +
        'mp_bien_mueble, ' +
        'mp_otros_describir, ' +
        'mp_otros_describir_text, ' +
        'numero_servicio ' +
        'from public.datos_entidad_uif ' +
        'left join paises on paises.id = datos_entidad_uif.id_pais where numero_servicio = ' + numero_servicio;
};

exports.select_contribuyentes = async (numero_servicio, tipoQuery) => {
    return sql = 'select contribuyentes.id, ' +
        (tipoQuery == false ? 'id_tipo_documento, ' : 'tipo_documento.nombre as id_tipo_documento, ') +
        'otro_documento, ' +
        'numero_documento, ' +
        'nombres, ' +
        "to_char(fecha_nacimiento,'DD/MM/YYYY') as fecha_nacimiento," +
        (tipoQuery == false ? 'id_pais_nacionalidad, ' : 'paises.nombre as id_pais_nacionalidad, ') +
        (tipoQuery == false ? 'id_estado_civil, ' : 'estado_civil.nombre as id_estado_civil, ') +
        (tipoQuery == false ? ' id_distrito, ' : "case when contribuyentes.id_distrito = 0 then '' else concat(departamento.nombre, ' - ', provincia.nombre, ' - ', distrito.nombre) end as ubigeo, ") +
        'id_distrito, ' +
        'domicilio, ' +
        'separa_patrimonio, ' +
        'partida, ' +
        'sede, ' +
        'nombre_conyugue, ' +
        'nombre_conyugue_documento, ' +
        'conyugue_fecha_nacimiento, ' +
        'profecion_ocupacion, ' +
        'telefono, ' +
        'inscripcion_registral,' +
        'numero_servicio ' +
        'from public.contribuyentes ' +
        'left join distrito on distrito.id = contribuyentes.id_distrito ' +
        'left join provincia on provincia.id = distrito.idprovincia ' +
        'left join departamento on departamento.id = provincia.iddepartamento ' +
        'left join estado_civil on estado_civil.id = contribuyentes.id_estado_civil ' +
        'left join tipo_documento on tipo_documento.id = contribuyentes.id_tipo_documento ' +
        'left join paises on paises.id = contribuyentes.id_pais_nacionalidad where numero_servicio = ' + numero_servicio;
};

exports.select_bien = async (numero_servicio, tipoQuery) => {
    return 'select ' +
        'id, tipo_bien, ' +
        'tipo_transferencia, ' +
        'num_placa, ' +
        'marca, ' +
        'modelo, ' +
        'moneda, ' +
        'valor2 as valor, ' +
        'targeta_propiedad, ' +
        'numero_servicio, ' +
        'mp_otro, ' +
        'mp_otros_describir, ' +
        'numero_tarjeta_propiedad, ' +
        'mp_compra_venta, ' +
        'mp_donacion, ' +
        'mp_permuta, ' +
        'mp_dacion_pago, ' +
        'mp_anticipo_legitima ' +
        'from public.datos_bien where numero_servicio = ' + numero_servicio;
}

exports.select_trasmite_opciones = async (numero_servicio, tipoQuery) => {
    return "select id, tipo_persona, tipo_opcion, tipo_tramite, numero_servicio, tipo_condicion from public.trasmite_opciones where numero_servicio = " + numero_servicio;
}

exports.get_num_servicio = async () => {
    return sql = "select * from public.numero_servicio order by id desc limit 1";
};

exports.insert_num_servicio = async (newSerie) => {
    var fecha = new Date();
    var newFecha =
        fecha.getMonth() + 1 +
        "/" +
        fecha.getDate() +
        "/" +
        fecha.getFullYear();
    return sql = "insert into public.numero_servicio (numero_servicio, serie, fecha) values(" + newSerie + ", '" + this.codigo(newSerie) + "', '" + newFecha + "')";
};

exports.codigo = (number) => "0".repeat(8 - number.toString().length) + number.toString();

exports.validateJWT = async (token) => {
    const verifique = await jwt.verify(token, process.env.llavejwt, async function (err, decoded) {
        if (err) {
            return true;
        } else {
            return false;
        }
    });
}

exports.validateRecaptcha = async (token) => {
    var url = 'https://www.google.com/recaptcha/api/siteverify?secret=6LeUXrwZAAAAAOExlg6sQ_2_VEZI9vBixQZLBO_f&response=' + token;
    const verifique = await request.get(url, async function (error, response, body) {
        if (!error && response.statusCode == 200) {
            var bodyConvert = JSON.parse(body);
            if (bodyConvert.success) {
                return true;
            }
            return false;
        }
        return false;
    });
}


//UPDATE
exports.update_datos_laborales = async (data) => {
    var valores = "profesion = '" + data.profesion + "', " +
        "centro_trabajo = '" + data.centro_trabajo + "', " +
        "funcion_publica = " + data.funcion_publica + ", " +
        "cargo_publico = '" + data.cargo_publico + "', " +
        "familiar_cargo = " + data.familiar_cargo + ", " +
        "familiar_nombres = '" + data.familiar_nombres + "', " +
        "familiar_car = '" + data.familiar_car + "', " +
        "id_familiar_pais = '" + data.id_familiar_pais + "', " +
        "informar_uif = " + data.informar_uif + ", " +
        "oficial_cumplimiento = " + data.oficial_cumplimiento + ", " +
        "of_haberes = " + (data.of_haberes == true ? 0 : 1) + ", " +
        "of_prestamos_familiares = " + (data.of_prestamos_familiares == true ? 0 : 1) + ", " +
        "of_venta_bien_inmieble = " + (data.of_venta_bien_inmieble == true ? 0 : 1) + ", " +
        "of_rentas = " + (data.of_rentas == true ? 0 : 1) + ", " +
        "of_donacion = " + (data.of_donacion == true ? 0 : 1) + ", " +
        "of_donacion_pago = " + (data.of_donacion_pago == true ? 0 : 1) + ", " +
        "of_prestamos_bancario = " + (data.of_prestamos_bancario == true ? 0 : 1) + ", " +
        "of_herencia = " + (data.of_herencia == true ? 0 : 1) + ", " +
        "of_venta_vehiculo = " + (data.of_venta_vehiculo == true ? 0 : 1) + ", " +
        "of_comercio = " + (data.of_comercio == true ? 0 : 1) + ", " +
        "of_otros_describir = " + (data.of_otros_describir == true ? 0 : 1) + ", " +
        "of_otros_describir_text = '" + data.of_otros_describir_text + "', " +
        "mp_efectivo = " + (data.mp_efectivo == true ? 0 : 1) + ", " +
        "mp_deposito_cuenta = " + (data.mp_deposito_cuenta == true ? 0 : 1) + ", " +
        "mp_bien_inmueble = " + (data.mp_bien_inmueble == true ? 0 : 1) + ", " +
        "mp_cheque = " + (data.mp_cheque == true ? 0 : 1) + ", " +
        "mp_transferencia_bancaria = " + (data.mp_transferencia_bancaria == true ? 0 : 1) + ", " +
        "mp_bien_mueble = " + (data.mp_bien_mueble == true ? 0 : 1) + ", " +
        "mp_otros_describir = " + (data.mp_otros_describir == true ? 0 : 1) + ", " +
        "mp_otros_describir_text = '" + data.mp_otros_describir_text + "'";
    return sql = "update public.datos_laborales set " + valores + " where numero_servicio = " + data.numero_servicio;
};

exports.update_datos_apoderado = async (data) => {
    var valores = "num_documento = '" + data.num_documento + "', " +
        "id_tipo_documento = " + data.id_tipo_documento + ", " +
        "otro_documento = '" + data.otro_documento + "', " +
        "nombres = '" + data.nombres + "', " +
        "apellidos = '" + data.apellidos + "', " +
        "domicilio = '" + data.domicilio + "', " +
        "nacionalidad = '" + data.nacionalidad + "', " +
        "fecha_nacimiento = " + (this.formato_fecha(data.fecha_nacimiento) == null ? null : ("'" + this.formato_fecha(data.fecha_nacimiento) + "'")) + ", " +
        "id_estado_civil = " + data.id_estado_civil + ", " +
        "profesion = '" + data.profesion + "', " +
        "registro_poder = '" + data.registro_poder + "', " +
        "correo = '" + data.correo + "', " +
        "conyugue_nombres = '" + data.conyugue_nombres + "'";
    return sql = "update public.datos_apoderado set " + valores + " where numero_servicio = " + data.numero_servicio;
};

exports.update_datos_basicos = async (data) => {
    var valores = "num_documento = '" + data.num_documento + "', " +
        "id_tipo_documento = " + data.id_tipo_documento + ", " +
        "otro_documento = '" + data.otro_documento + "', " +
        "distrito = '" + data.distrito + "', " +
        "nombres = '" + data.nombres + "', " +
        "apellidos = '" + data.apellidos + "', " +
        "pais_origen = '" + data.pais_origen + "', " +
        "ciudad = '" + data.ciudad + "', " +
        "fecha_nacimiento = " + (this.formato_fecha(data.fecha_nacimiento) == null ? null : ("'" + this.formato_fecha(data.fecha_nacimiento) + "'")) + ", " +
        "id_pais_nacionalidad = " + data.id_pais_nacionalidad + ", " +
        "id_estado_civil = " + data.id_estado_civil + ", " +
        "separa_patrimonio = " + data.separa_patrimonio + ", " +
        "partida = '" + data.partida + "', " +
        "sede = '" + data.sede + "', " +
        "cuidad_origen = '" + data.cuidad_origen + "', " +
        "domicilio = '" + data.domicilio + "', " +
        "telefono_uno = '" + data.telefono_uno + "', " +
        "telefono_dos = '" + data.telefono_dos + "', " +
        "correo_electronico = '" + data.correo_electronico + "', " +
        "id_ubigeo = " + data.id_ubigeo + ", " +
        "extranjero = " + data.extranjero + ", " +
        "conyugue_fecha_nacimiento = " + (this.formato_fecha(data.conyugue_fecha_nacimiento) == null ? null : ("'" + this.formato_fecha(data.conyugue_fecha_nacimiento) + "'")) + ", " +
        "nombre_conyugue = '" + data.nombre_conyugue + "', " +
        "nombre_conyugue_documento = '" + data.nombre_conyugue_documento + "'";
    return sql = "update public.datos_basicos set " + valores + " where numero_servicio = " + data.numero_servicio;
};

exports.update_datos_bien = async (data) => {
    var valores = "tipo_bien = '" + data.tipo_bien + "', " +
        "tipo_transferencia = '" + data.tipo_transferencia + "', " +
        "num_placa = '" + data.num_placa + "', " +
        "moneda = '" + data.moneda + "', " +
        "moneda = '" + data.moneda + "', " +
        "valor = '" + data.valor + "', " +
        "valor2 = '" + data.valor + "', " +
        "targeta_propiedad = " + data.targeta_propiedad + ", " +
        "mp_compra_venta = " + (data.mp_compra_venta == true ? 0 : 1) + ", " +
        "mp_donacion = " + (data.mp_donacion == true ? 0 : 1) + ", " +
        "mp_permuta = " + (data.mp_permuta == true ? 0 : 1) + ", " +
        "mp_dacion_pago = " + (data.mp_dacion_pago == true ? 0 : 1) + ", " +
        "mp_otro = " + (data.mp_otro == true ? 0 : 1) + ", " +
        "mp_anticipo_legitima = " + (data.mp_anticipo_legitima == true ? 0 : 1) + ", " +
        "mp_otros_describir = '" + data.mp_otros_describir + "', " +
        "numero_tarjeta_propiedad = '" + data.numero_tarjeta_propiedad + "'";
    return sql = "update public.datos_bien set " + valores + " where numero_servicio = " + data.numero_servicio;
};

exports.update_datos_entidad_uif = async (data) => {
    var valores = "obigado_informar = " + data.obigado_informar + ", " +
        "designo_oficial_cumplimiento = " + data.designo_oficial_cumplimiento + ", " +
        "expuesta25 = " + data.expuesta25 + ", " +
        "nombres = '" + data.nombres + "', " +
        "cargo = '" + data.cargo + "', " +
        "id_pais = " + data.id_pais + ", " +
        "of_giro_negocio = " + (data.of_giro_negocio == true ? 0 : 1) + ", " +
        "of_prestamos_socios = " + (data.of_prestamos_socios == true ? 0 : 1) + ", " +
        "of_venta_bien_inmueble = " + (data.of_venta_bien_inmueble == true ? 0 : 1) + ", " +
        "of_intermediacion_financiera = " + (data.of_intermediacion_financiera == true ? 0 : 1) + ", " +
        "of_prestamo_bancario = " + (data.of_prestamo_bancario == true ? 0 : 1) + ", " +
        "of_prestamo_terceros = " + (data.of_prestamo_terceros == true ? 0 : 1) + ", " +
        "of_venta_activos = " + (data.of_venta_activos == true ? 0 : 1) + ", " +
        "of_otros_escribir_of = " + (data.of_otros_escribir_of == true ? 0 : 1) + ", " +
        "of_otros_escribir_of_text = '" + data.of_otros_escribir_of_text + "', " +
        "mp_efectivo = " + (data.mp_efectivo == true ? 0 : 1) + ", " +
        "mp_deposito_cuenta = " + (data.mp_deposito_cuenta == true ? 0 : 1) + ", " +
        "mp_bien_inmueble = " + (data.mp_bien_inmueble == true ? 0 : 1) + ", " +
        "mp_cheque = " + (data.mp_cheque == true ? 0 : 1) + ", " +
        "mp_transferencia_bancaria = " + (data.mp_transferencia_bancaria == true ? 0 : 1) + ", " +
        "mp_bien_mueble = " + (data.mp_bien_mueble == true ? 0 : 1) + ", " +
        "mp_otros_describir = " + (data.mp_otros_describir == true ? 0 : 1) + ", " +
        "mp_otros_describir_text = '" + data.mp_otros_describir_text + "'";
    return sql = "update public.datos_entidad_uif set " + valores + " where numero_servicio = " + data.numero_servicio;
};

exports.update_datos_entidad = async (data) => {
    var valores = "ruc = '" + data.ruc + "', " +
        "razonsocial = '" + data.razonsocial + "', " +
        "direccion = '" + data.direccion + "', " +
        "telefono = '" + data.telefono + "', " +
        "correo = '" + data.correo + "', " +
        "principal_contribuyente = " + (data.principal_contribuyente == true ? 0 : 1) + ", " +
        "declaracion_jurada = " + (data.declaracion_jurada == true ? 0 : 1) + ", " +
        "comercial = " + (data.comercial == true ? 0 : 1) + ", " +
        "industrial = " + (data.industrial == true ? 0 : 1) + ", " +
        "construccion = " + (data.construccion == true ? 0 : 1) + ", " +
        "transporte = " + (data.transporte == true ? 0 : 1) + ", " +
        "pesca = " + (data.pesca == true ? 0 : 1) + ", " +
        "intermediacion_financiera = " + (data.intermediacion_financiera == true ? 0 : 1) + ", " +
        "hoteles_restaurantes = " + (data.hoteles_restaurantes == true ? 0 : 1) + ", " +
        "agricultura = " + (data.agricultura == true ? 0 : 1) + ", " +
        "ensenanza = " + (data.ensenanza == true ? 0 : 1) + ", " +
        "suministro_electricidad_gas = " + (data.suministro_electricidad_gas == true ? 0 : 1) + ", " +
        "partida_registral = '" + data.partida_registral + "', " +
        "sede_registral =  '" + data.sede_registral + "', " +
        "otros_describir = '" + data.otros_describir + "', " +
        "otro_opcion = " + (data.otro_opcion == true ? 0 : 1) + "";
    return sql = "update public.datos_entidad set " + valores + " where numero_servicio = " + data.numero_servicio;
};

exports.update_contribuyentes = async (data) => {
    var valores = "id_tipo_documento = " + data.id_tipo_documento + ", " +
        "otro_documento = '" + data.otro_documento + "', " +
        "numero_documento = '" + data.numero_documento + "', " +
        "nombres = '" + data.nombres + "', " +
        "fecha_nacimiento = " + (this.formato_fecha(data.fecha_nacimiento) == null ? null : ("'" + this.formato_fecha(data.fecha_nacimiento) + "'")) + ", " +
        "id_pais_nacionalidad = " + data.id_pais_nacionalidad + ", " +
        "id_estado_civil = " + data.id_estado_civil + ", " +
        "domicilio = '" + data.domicilio + "', " +
        "profecion_ocupacion = '" + data.profecion_ocupacion + "', " +
        "telefono = '" + data.telefono + "', " +
        "inscripcion_registral = '" + data.inscripcion_registral + "'";
    return sql = "update public.contribuyentes set " + valores + " where id = " + data.id;
};

exports.post_ubigeo = async (id) => {
    var where = id == 0 ? "" : " where dis.id = " + id;
    return "select dis.id as id, concat(dep.nombre, ' - ', pro.nombre , ' - ', dis.nombre) from public.distrito dis " +
        "inner join public.provincia pro on dis.idprovincia  = pro.id " +
        "inner join public.departamento dep on pro.iddepartamento  = dep.id " +
        where;
};

exports.formato_fecha = (fecha) => {
    try {
        console.log(fecha);
        if (fecha != undefined && fecha != null && fecha != '') {
            var fechaArr = fecha.split("/")
            if (fechaArr.length === 3) {
                var newD = (fechaArr[1] + "/" + fechaArr[0] + "/" +fechaArr[2]);
                return newD
            } else {
                var fechaArr = fecha.split("-")
                if (fechaArr.length === 3) {
                    var newD = (fechaArr[1] + "/" + fechaArr[2] + "/" +fechaArr[0]);
                    return newD
                }
            }
            return null;
        } else {
            return null
        }
    } catch (error) {
        return null;
    }
};
